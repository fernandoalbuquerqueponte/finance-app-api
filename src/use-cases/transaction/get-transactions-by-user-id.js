import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUsetByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUsetByIdRepository = getUsetByIdRepository
    }
    async execute(params) {
        const user = await this.getUsetByIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse()
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transactions
    }
}
