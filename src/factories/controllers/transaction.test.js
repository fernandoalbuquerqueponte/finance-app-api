import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
} from './transaction.js'
import {
    CreateTransactionController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetTransactionsByIdController,
} from '../../controllers/index.js'

describe('Transaction Controller Factories', () => {
    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionsByUserIdController instance', () => {
        expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionsByIdController,
        )
    })
})
