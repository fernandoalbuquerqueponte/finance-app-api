import {
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
} from './user.js'
import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
} from '../../controllers/index.js'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })
})
