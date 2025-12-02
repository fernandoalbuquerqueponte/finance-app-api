import { IdGeneratorAdapter } from './index.js'
import validator from 'validator'

describe('IdGeneratorAdapter', () => {
    it('should return a randon id', async () => {
        const sut = new IdGeneratorAdapter()

        const result = await sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(validator.isUUID(result)).toBeTruthy()
    })
})
