import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'
import { usersRouter } from './src/routes/user.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { body, statusCode } =
        await getTransactionsByUserIdController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { body, statusCode } =
        await createTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { body, statusCode } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { body, statusCode } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
