import { UserNotFoundError } from '../../errors/user.js'
import {
    userNotFoundResponse,
    serverError,
    ok,
    badRequest,
} from '../helpers/index.js'
import { getUserBalanceSchema } from '../../schemas/index.js'
import { ZodError } from 'zod/v3'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getUserBalanceSchema.parseAsync({ user_id: userId, from, to })

            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }

            console.error(error)
            return serverError()
        }
    }
}
