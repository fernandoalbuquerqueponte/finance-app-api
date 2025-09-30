import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }
    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Fernando',
                last_name: 'Albuquerque',
                email: 'example@example.com',
                password: '12345678910',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })
})
