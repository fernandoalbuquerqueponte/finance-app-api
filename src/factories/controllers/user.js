import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
} from '../../controllers/index.js'

import {
    PostgresGetUserByIdRepository,
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresDeleteUserRepository,
    PostgresUpdateUserRepository,
    PostgresGetUserBalanceRepository,
} from '../../repositories/postgres/index.js'

import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    GetUserBalaceUseCase,
} from '../../use-cases/index.js'

import { PasswordHasherAdapter } from '../../adapters/index.js'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const createUserRepository = new PostgresCreateUserRepository()

    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makeUpdateUserController = () => {
    const updateUserRepository = new PostgresUpdateUserRepository()

    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmailRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    return deleteUserController
}

export const makeGetUserBalanceController = () => {
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserBalanceUseCase = new GetUserBalaceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    )
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )

    return getUserBalanceController
}
