import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateUserParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateFields.push(updateUserParams[key])
        })

        updateFields.push(userId)

        const updatedQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = $${updateValues.length}
        RETURNING *
        `

        const updatedUser = await PostgresHelper.query(
            updatedQuery,
            updateValues,
        )

        return updatedUser[0]
    }
}
