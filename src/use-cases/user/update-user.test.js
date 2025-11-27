import { EmailAlreadyInUseError } from '../../errors/user'
import { UpdateUserUseCase } from './update-user'
import { faker } from '@faker-js/faker'
import { user } from '../../tests'
describe('UpdateUserUseCase', () => {
    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const updateUserRepository = new UpdateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        }
    }

    it('should should update user successfully (without email and password)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        // assert
        expect(response).toBe(user)
    })

    it('should update user successfuly (with email)', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const email = faker.internet.email()

        // act
        const response = await sut.execute(faker.string.uuid(), {
            email: email,
        })

        // assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(response).toBe(user)
    })

    it('should update user successfuly (with password)', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )

        const password = faker.internet.password()

        // act
        const response = await sut.execute(faker.string.uuid(), {
            password: password,
        })

        // assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(response).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email already in use', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

        // act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        // arrange
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UpdateUserRepository with correct params', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            'execute',
        )

        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        // act
        await sut.execute(user.id, updateUserParams)

        // assert
        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        //act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValue(
            new Error(),
        )

        //act
        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        })

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if UpdateUserRepository throws', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut()
        jest.spyOn(updateUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        //act
        const promise = sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })

        // assert
        await expect(promise).rejects.toThrow()
    })
})
