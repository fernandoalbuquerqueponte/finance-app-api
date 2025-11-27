import { UserNotFoundError } from '../../errors/user'
import { transaction, user } from '../../tests'
import { CreateTransactionUseCase } from './create-transaction'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'random_id'
        }
    }
    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(createTransactionParams)

        // assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should call GetUserByEmailRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call idGeneratorAdapter', async () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionSpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )
        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(createTransactionSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

        // act
        const promise = sut.execute(createTransactionParams)

        // assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(createTransactionParams)

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockRejectedValue(new Error())

        // act
        const promise = sut.execute(createTransactionParams)

        // assert
        return expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', () => {
        // arrange
        const { sut, createTransactionRepository } = makeSut()
        jest.spyOn(createTransactionRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        // act
        const promise = sut.execute(createTransactionParams)

        // assert
        return expect(promise).rejects.toThrow()
    })
})
