import { PrismaClient } from '@prisma/client';

// Use a typed holder on globalThis to persist the Prisma instance across reloads
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};


const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
export { prisma };
