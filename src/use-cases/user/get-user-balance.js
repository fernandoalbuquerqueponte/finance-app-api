import { UserNotFoundError } from '../../errors/user'

export class GetUserBalaceUseCase {
    constructor(getUserBalanceRepository, getUserByIdRepository) {
        this.getUserBalanceRepository = getUserBalanceRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const balance = await this.getUserBalanceRepository.execute(
            params.userId,
        )

        return balance
    }
}
