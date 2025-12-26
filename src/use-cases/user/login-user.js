import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparatorAdapter = passwordComparatorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(email, password) {
        // verificaremos se email é válido (se há usuário com esse email)
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError()
        }

        //verificar se a senha recebida é válida
        const isPasswordValid = this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        // depois, gerar os tokens (access token e refresh token)

        return {
            ...user,
            tokens: this.tokensGeneratorAdapter.execute(user.id),
        }
    }
}
