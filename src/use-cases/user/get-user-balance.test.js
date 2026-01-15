import { UserNotFoundError } from '../../errors/user'
import { GetUserBalaceUseCase } from './get-user-balance'
import { faker } from '@faker-js/faker'
import { userBalance, user } from '../../tests'

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const sut = new GetUserBalaceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    const from = '2024-01-01'
    const to = '2024-01-31'

    it('should get user balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid(), from, to)

        // assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

        const userId = faker.string.uuid()
        // act
        const promise = sut.execute(userId, from, to)

        // assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        const userId = faker.string.uuid()
        // act
        await sut.execute(userId, from, to)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

        const userId = faker.string.uuid()

        // act
        await sut.execute(userId, from, to)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(faker.string.uuid(), from, to)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(faker.string.uuid(), from, to)

        // assert
        await expect(promise).rejects.toThrow()
    })
})
