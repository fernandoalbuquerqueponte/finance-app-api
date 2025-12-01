import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    type: 'EARNING',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    type: 'EXPENSE',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 4000,
                    type: 'INVESTMENT',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 4000,
                    type: 'INVESTMENT',
                    date: faker.date.recent(),
                    user_id: user.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('8000')
        expect(result.balance.toString()).toBe('0')
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id)

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
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

        const promise = sut.execute(fakeUser.id)

        await expect(promise).rejects.toThrow()
    })
})
