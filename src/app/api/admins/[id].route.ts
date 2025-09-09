import { NextResponse } from "next/server";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

// In-memory store (resets on server restart)
let admins: Admin[] = [
  { id: "1", name: "Alice", email: "alice@mail.com", role: "admin", isActive: true },
  { id: "2", name: "Bob", email: "bob@mail.com", role: "admin", isActive: true },
];

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json() as Partial<Pick<Admin, "name" | "email" | "role" | "isActive">>;

    let found = false;
    admins = admins.map((admin) => {
      if (admin.id === id) {
        found = true;
        return { ...admin, ...body };
      }
      return admin;
    });

    if (!found) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const updated = admins.find((a) => a.id === id);
    return NextResponse.json(updated!, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const exists = admins.find((a) => a.id === id);
    if (!exists) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    admins = admins.filter((a) => a.id !== id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
