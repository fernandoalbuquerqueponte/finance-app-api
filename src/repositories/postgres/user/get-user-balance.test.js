import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'

    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    date: new Date(to),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    date: new Date(from),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: new Date(to),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: new Date(from),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 4000,
                    type: 'INVESTMENT',
                    date: new Date(from),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 4000,
                    type: 'INVESTMENT',
                    date: new Date(to),
                    user_id: user.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id, from, to)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('8000')
        expect(result.balance.toString()).toBe('0')
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id, from, to)

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
    })
    it('should throw if prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(fakeUser.id, from, to)

        await expect(promise).rejects.toThrow()
    })
})
