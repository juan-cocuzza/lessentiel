import { NextResponse } from "next/server";

const SESSION_COOKIE = "lessentiel_admin_session";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      "admin123";

    if (typeof password !== "string" || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "true",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar el acceso." },
      { status: 400 }
    );
  }
}
