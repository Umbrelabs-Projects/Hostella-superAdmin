import { NextResponse } from "next/server";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface NewAdmin {
  name: string;
  email: string;
  password: string;
}

// Same in-memory store
const admins: Admin[] = [
  { id: "1", name: "Alice", email: "alice@mail.com", role: "admin", isActive: true },
  { id: "2", name: "Bob", email: "bob@mail.com", role: "admin", isActive: true },
];


export async function GET() {
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NewAdmin;
    const { name, email, password } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const newAdmin: Admin = {
      id: Date.now().toString(),
      name,
      email,
      role: "admin",
      isActive: true,
    };

    admins.push(newAdmin);
    return NextResponse.json(newAdmin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
