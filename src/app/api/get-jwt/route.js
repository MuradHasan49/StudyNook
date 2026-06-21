import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/get-jwt
 *
 * A server-side Next.js route that:
 * 1. Reads the HttpOnly session cookie (inaccessible to client JS)
 * 2. Calls better-auth server-side to get the current session
 * 3. Generates a JWT token from that session via the better-auth JWT plugin
 * 4. Returns the JWT to the client for use in Authorization: Bearer <token> headers
 *
 * This bridges the gap between better-auth's cookie-based session management
 * and the Express backend's JWT-based auth middleware.
 */
export async function GET() {
  try {
    const headersList = await headers();

    // Ask better-auth for the current session using the incoming cookies
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use the JWT plugin endpoint to get a signed JWT for this session
    const tokenResponse = await auth.api.getToken({ headers: headersList });

    if (!tokenResponse || !tokenResponse.token) {
      return NextResponse.json(
        { error: "Failed to generate JWT" },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: tokenResponse.token });
  } catch (error) {
    console.error("[get-jwt] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
