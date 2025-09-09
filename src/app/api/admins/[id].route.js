import { NextResponse } from "next/server";

// fake in-memory store (reset on server restart)
let admins = [
  { id: 1, name: "Alice", email: "alice@mail.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@mail.com", role: "admin" },
];

// PUT /api/admins/:id → update admin
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    admins = admins.map((admin) =>
      String(admin.id) === String(id) ? { ...admin, ...body } : admin
    );

    const updated = admins.find((a) => String(a.id) === String(id));

    if (!updated) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

// DELETE /api/admins/:id → remove admin
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const exists = admins.find((a) => String(a.id) === String(id));

    if (!exists) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    admins = admins.filter((a) => String(a.id) !== String(id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
