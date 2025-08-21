import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { ok, serverError, badRequest } from './helpers.js'

import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    errorMessage: 'Invalid user ID format',
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
