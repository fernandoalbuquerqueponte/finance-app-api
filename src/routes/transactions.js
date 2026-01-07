import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', auth, async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { body, statusCode } =
        await getTransactionsByUserIdController.execute({
            ...request,
            query: {
                ...request.query,
                userId: request.userId,
            },
        })

    response.status(statusCode).send(body)
})

transactionsRouter.post('/', auth, async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { body, statusCode } = await createTransactionController.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.patch('/:transactionId', auth, async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { body, statusCode } = await updateTransactionController.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { body, statusCode } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})
