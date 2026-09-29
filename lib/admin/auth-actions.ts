"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  AdminSession,
  SESSION_COOKIE_NAME,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  createAdminToken,
  verifyAdminToken,
} from "./auth-token";
import { createAdminClient } from "@/lib/supabase/server";

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: { email: string; name: string; role: string };
}

/**
 * Server action to authenticate admin with email and password
 */
export async function adminLoginAction(data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<LoginResult> {
  const { email, password, rememberMe } = data;

  const normalizedInputEmail = (email || "").trim().toLowerCase();
  const normalizedMasterEmail = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();

  let authenticated = false;
  let userEmail = normalizedInputEmail;
  let userName = "Administrator";
  let userRole = "Super Admin";

  // 1. Check against Master / Configured Admin Credentials
  if (
    normalizedInputEmail === normalizedMasterEmail &&
    password === DEFAULT_ADMIN_PASSWORD
  ) {
    authenticated = true;
    userName = "Corona Admin";
    userRole = "Super Admin";

    // Auto-provision or sync with Supabase Auth in background if needed
    try {
      const supabaseAdmin = createAdminClient();
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const existing = userList?.users?.find(
        (u) => u.email?.toLowerCase() === normalizedMasterEmail
      );
      if (!existing) {
        await supabaseAdmin.auth.admin.createUser({
          email: normalizedMasterEmail,
          password: DEFAULT_ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { name: userName, role: userRole },
        });
      }
    } catch {
      // Continue even if Supabase admin call fails
    }
  } else {
    // 2. Try Supabase Auth SignIn
    try {
      const supabaseAdmin = createAdminClient();
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.signInWithPassword({
          email: normalizedInputEmail,
          password: password,
        });

      if (!authError && authData.user) {
        authenticated = true;
        userEmail = authData.user.email || normalizedInputEmail;
        userName =
          authData.user.user_metadata?.name ||
          authData.user.user_metadata?.full_name ||
          "Staff Member";
        userRole = authData.user.user_metadata?.role || "Admin";
      }
    } catch {
      // Supabase auth attempt completed
    }
  }

  if (!authenticated) {
    return {
      success: false,
      error: "Invalid email or password. Please verify your credentials and try again.",
    };
  }

  // Session duration: 30 days if rememberMe, otherwise 2 days
  const durationDays = rememberMe ? 30 : 2;
  const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;

  const sessionPayload: AdminSession = {
    email: userEmail,
    role: userRole,
    name: userName,
    expiresAt,
  };

  const token = await createAdminToken(sessionPayload);

  // Set HTTP-only, secure session cookie
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  // Revalidate admin pages
  revalidatePath("/admin", "layout");

  return {
    success: true,
    user: { email: userEmail, name: userName, role: userRole },
  };
}

/**
 * Server action to log out admin
 */
export async function adminLogoutAction() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  revalidatePath("/admin", "layout");
  return { success: true };
}

/**
 * Get current admin session from cookie
 */
export async function getAdminSessionAction(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
