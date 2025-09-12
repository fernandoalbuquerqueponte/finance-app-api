import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldsIsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByIdController {
    constructor(getTransactionsByIdUseCase) {
        this.getTransactionsByIdUseCase = getTransactionsByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            if (!userId) {
                return requiredFieldsIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions = await this.getTransactionsByIdUseCase.execute({
                userId,
            })

            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
