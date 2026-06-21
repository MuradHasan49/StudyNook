import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/get-session-token
 *
 * Returns the raw session token from the current better-auth session.
 * This token can be used as `Authorization: Bearer <token>` for the
 * Express backend, which verifies it via its MongoDB session lookup.
 *
 * This runs server-side so it can securely access HttpOnly cookies.
 */
export async function GET() {
  try {
    const headersList = await headers();

    // Verify there is an active session
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read the raw session token from the cookie
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token not found" },
        { status: 401 }
      );
    }

    // better-auth signs cookies: the format is "s:rawToken.signature"
    // Strip the signature — extract only the raw token portion
    let rawToken = sessionToken;
    if (sessionToken.startsWith("s:")) {
      // Express-style signed cookie: s:<token>.<signature>
      const withoutPrefix = sessionToken.slice(2);
      const lastDotIndex = withoutPrefix.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        rawToken = withoutPrefix.slice(0, lastDotIndex);
      } else {
        rawToken = withoutPrefix;
      }
    }

    return NextResponse.json({ token: rawToken });
  } catch (error) {
    console.error("[get-session-token] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
