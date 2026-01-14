import {
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'

import { ZodError } from 'zod/v3'

export class GetTransactionsByIdController {
    constructor(getTransactionsByIdUseCase) {
        this.getTransactionsByIdUseCase = getTransactionsByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            const from = httpRequest.query.from
            const to = httpRequest.query.to

            //usar zod para validar o from e to

            await getTransactionsByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions = await this.getTransactionsByIdUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }
            return serverError()
        }
    }
}
