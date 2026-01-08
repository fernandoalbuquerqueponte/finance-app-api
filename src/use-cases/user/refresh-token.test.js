import { Unauthorized } from '../../errors/user'
import { RefreshTokenUseCase } from './refresh-token'

describe('RefreshTokenUseCase', () => {
    class TokenRegeratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const tokenGeneratorAdapter = new TokenRegeratorAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokenGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokenGeneratorAdapter,
            tokenVerifierAdapter,
        }
    }

    it('should return new tokens', async () => {
        const { sut } = makeSut()
        const refreshToken = 'any_refresh_token'

        const result = await sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        })
    })

    it('should throw if TokenVerifierAdapter throws', async () => {
        const { sut, tokenVerifierAdapter } = makeSut()
        jest.spyOn(tokenVerifierAdapter, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        expect(() => sut.execute('any_refresh_token')).rejects.toThrow(
            new Unauthorized(),
        )
    })
})
