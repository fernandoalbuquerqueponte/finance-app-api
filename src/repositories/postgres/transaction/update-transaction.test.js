import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { user, transaction } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'

describe('PostgresUpdateTransactionRepository', () => {
    it('should update transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const params = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: Number(faker.finance.amount()),
        }

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
})
