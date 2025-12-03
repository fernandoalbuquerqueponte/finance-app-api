import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { body, statusCode } =
        await getTransactionsByUserIdController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.post('/', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { body, statusCode } =
        await createTransactionController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.patch('/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { body, statusCode } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { body, statusCode } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})
