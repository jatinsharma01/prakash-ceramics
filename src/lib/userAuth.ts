import { cookies } from "next/headers";
import { findCustomerByEmail, findCustomerById, CustomerUserRecord } from "./userDb";

export const USER_COOKIE_NAME = "pc_user_session";

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  phone: string;
  tier: string;
  avatar?: string | null;
  authenticatedAt: number;
}

export function createToken(payload: UserSessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function parseToken(token: string): UserSessionPayload | null {
  try {
    const json = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    if (parsed && parsed.id && parsed.email) {
      return parsed as UserSessionPayload;
    }
  } catch {
    return null;
  }
  return null;
}

export async function getCurrentUser(): Promise<CustomerUserRecord | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(USER_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const payload = parseToken(sessionCookie.value);
  if (!payload) {
    return null;
  }

  // Look up fresh user details
  const user = await findCustomerById(payload.id);
  if (user) return user;

  const userByEmail = await findCustomerByEmail(payload.email);
  if (userByEmail) {
    const { password, ...safe } = userByEmail;
    return safe as CustomerUserRecord;
  }

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    tier: payload.tier || "Privilege Client",
    avatar: payload.avatar,
    createdAt: new Date(payload.authenticatedAt),
  };
}
