/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient({
  log: ['query'], // permite ver o que cada chamada resulta no db
})
