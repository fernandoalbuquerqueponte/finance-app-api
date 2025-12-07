import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                const code = error.code

                // p2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
                if (code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }
            throw error
        }
    }
}
