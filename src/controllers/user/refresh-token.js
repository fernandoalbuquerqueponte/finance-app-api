import { badRequest, ok, serverError, unauthorized } from '../helpers/index.js'
import { Unauthorized } from '../../errors/user.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { ZodError } from 'zod/v3'

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await refreshTokenSchema.parseAsync(params)

            const response = await this.refreshTokenUseCase.execute(
                params.refreshToken,
            )

            return ok(response)
        } catch (error) {
            if (error instanceof Unauthorized) {
                return unauthorized()
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
