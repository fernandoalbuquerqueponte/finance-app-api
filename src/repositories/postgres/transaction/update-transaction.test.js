import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { user, transaction } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('PostgresUpdateTransactionRepository', () => {
    const params = {
        id: faker.string.uuid(),
        user_id: user.id,
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: TransactionType.EXPENSE,
        amount: Number(faker.finance.amount()),
    }

    it('should update transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const result = await sut.execute(transaction.id, params)

        expect(result.id).toBe(params.id)

        expect(result.name).toBe(params.name)
        expect(result.type).toBe(params.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(params.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
    })

    it('should call prisma with correct params', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throw if prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if prisma does not find a record to update', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
