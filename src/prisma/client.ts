import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ rejectOnNotFound: false })

export default prisma
