import { Unauthorized } from '../../errors/user.js'

export class RefreshTokenUseCase {
    constructor(tokensRegeneratorAdapter, tokenVerifierAdapter) {
        this.tokensRegeneratorAdapter = tokensRegeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    async execute(refreshToken) {
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )

            if (!decodedToken) {
                throw new Unauthorized()
            }

            return this.tokensRegeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            console.error(error)
            throw new Unauthorized()
        }
    }
}
