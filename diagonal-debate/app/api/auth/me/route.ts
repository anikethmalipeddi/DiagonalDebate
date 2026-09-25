import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const user = await getCurrentUser();
    if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  return NextResponse.json({ user: { ...user, isAdmin: isAdmin(user.email) } });
}
