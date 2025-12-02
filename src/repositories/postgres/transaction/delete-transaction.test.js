import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { transaction, user as fakeUser, user } from '../../../tests'
import dayjs from 'dayjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should call prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })

    it('should throw generic error if prisma throw generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow()
    })

    it('should throw generic error if prisma throw generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
