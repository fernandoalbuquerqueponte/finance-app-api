import { LoginUserUseCase } from './login-user'
import { user } from '../../tests/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                acessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()

        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        )
        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute',
        ).mockResolvedValueOnce(null)

        const promise = sut.execute('any_email', 'any_password')

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()
        jest.spyOn(passwordComparatorAdapterStub, 'execute').mockReturnValue(
            false,
        )

        const promise = sut.execute('any_email', 'any_password')

        expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('any_email', 'any_password')

        expect(result.tokens.acessToken).toBeDefined()
        expect(result.tokens.refreshToken).toBeDefined()
    })
})
