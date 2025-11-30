import { prisma } from './prisma/prisma.js'

beforeEach(async () => {
    console.log('ferbabdo de kiubdiiii')
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})
