import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient {
  if (
    globalForPrisma.prisma &&
    Boolean((globalForPrisma.prisma as any).blogPost)
  ) {
    return globalForPrisma.prisma;
  }

  try {
    const nodeReq = eval("require");
    const path = nodeReq("path");
    const clientPath = path.join(process.cwd(), "node_modules/@prisma/client/default.js");
    if (nodeReq.cache) {
      Object.keys(nodeReq.cache).forEach((key: string) => {
        if (key.toLowerCase().includes("prisma")) {
          delete nodeReq.cache[key];
        }
      });
    }
    const { PrismaClient: FreshClient } = nodeReq(clientPath);
    const client = new FreshClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    globalForPrisma.prisma = client;
    return client;
  } catch (err) {
    console.warn("[prisma] Direct file require fallback:", err);
  }

  const fallbackClient = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
  globalForPrisma.prisma = fallbackClient;
  return fallbackClient;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
  ownKeys(_target) {
    const client = getPrismaClient();
    return Reflect.ownKeys(client);
  },
  getOwnPropertyDescriptor(_target, prop) {
    const client = getPrismaClient();
    return Reflect.getOwnPropertyDescriptor(client, prop) || {
      enumerable: true,
      configurable: true,
      value: (client as any)[prop],
    };
  },
});

export default prisma;

