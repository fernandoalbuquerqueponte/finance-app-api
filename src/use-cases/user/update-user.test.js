import { UpdateUserUseCase } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

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
})
