import { prisma } from "./prisma";
import { cookies } from "next/headers";

// Default in-memory fallback admin credentials
let memoryAdmin = {
  id: "admin-default",
  email: "admin-parkash@gmail.com",
  password: "123456",
  name: "Prakash Executive Admin",
  role: "Super Admin",
};

export const ADMIN_COOKIE_NAME = "pc_admin_session";

export async function verifyAdminCredentials(emailInput: string, passwordInput: string) {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  try {
    const admin = await prisma.adminAccount.findUnique({
      where: { email },
    });

    if (admin) {
      if (admin.password === password) {
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      }
      return null;
    }
  } catch (err) {
    console.warn("DB offline during admin auth, using fallback store:", err);
  }

  // Fallback
  if (memoryAdmin.email.toLowerCase() === email && memoryAdmin.password === password) {
    return {
      id: memoryAdmin.id,
      email: memoryAdmin.email,
      name: memoryAdmin.name,
      role: memoryAdmin.role,
    };
  }

  return null;
}

export async function updateAdminPassword(emailInput: string, currentPasswordInput: string, newPasswordInput: string) {
  const email = emailInput.trim().toLowerCase();
  const currentPassword = currentPasswordInput.trim();
  const newPassword = newPasswordInput.trim();

  if (newPassword.length < 4) {
    return { success: false, message: "New password must be at least 4 characters long." };
  }

  try {
    const admin = await prisma.adminAccount.findUnique({
      where: { email },
    });

    if (admin) {
      if (admin.password !== currentPassword) {
        return { success: false, message: "Current password does not match." };
      }

      await prisma.adminAccount.update({
        where: { email },
        data: { password: newPassword },
      });

      memoryAdmin.password = newPassword;

      return {
        success: true,
        message: "Password updated successfully in PostgreSQL database!",
      };
    }
  } catch (err) {
    console.warn("DB offline during password change, using memory fallback:", err);
  }

  // Fallback
  if (memoryAdmin.email.toLowerCase() === email) {
    if (memoryAdmin.password !== currentPassword) {
      return { success: false, message: "Current password does not match." };
    }
    memoryAdmin.password = newPassword;
    return {
      success: true,
      message: "Password updated successfully!",
    };
  }

  return { success: false, message: "Admin account not found." };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"));
    if (parsed && parsed.email) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
