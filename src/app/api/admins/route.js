import { NextResponse } from "next/server";

// In-memory store
let admins = [
  { id: "1", name: "Alice", email: "alice@mail.com", role: "admin", isActive: true },
  { id: "2", name: "Bob", email: "bob@mail.com", role: "admin", isActive: true },
];

// GET /api/admins
export async function GET() {
  return NextResponse.json(admins);
}

// POST /api/admins
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const newAdmin = {
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

// PUT /api/admins/:id
export async function PUT(req, context) {
  try {
    const { id } = context.params;
    const body = await req.json();

    let found = false;
    admins = admins.map((admin) => {
      if (admin.id === id) {
        found = true;
        return { ...admin, ...body };
      }
      return admin;
    });

    if (!found) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const updated = admins.find((a) => a.id === id);
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}

// DELETE /api/admins/:id
export async function DELETE(req, context) {
  try {
    const { id } = context.params;
    const exists = admins.find((a) => a.id === id);

    if (!exists) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    admins = admins.filter((a) => a.id !== id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
