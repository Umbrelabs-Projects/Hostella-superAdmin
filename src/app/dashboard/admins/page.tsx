"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useSuperAdmin } from "../contexts/SuperAdminContext";
import { Admin } from "@/types/common";
import { CreateAdminDialog } from "./_components/CreateAdminDialog";
import { AdminTable } from "./_components/AdminTable";
import { EditAdminDialog } from "./_components/EditAdminDialog";
import { DeleteAdminDialog } from "./_components/DeleteAdminDialog";


export default function AdminsPage() {
  const { admins, loading, error, createAdmin, updateAdmin, deleteAdmin } = useSuperAdmin();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [search, setSearch] = useState("");

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold">Manage Admins</CardTitle>
        <CreateAdminDialog
          open={openCreate}
          setOpen={setOpenCreate}
          onCreate={createAdmin}
          loading={loading}
        />
      </CardHeader>

      <CardContent>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <AdminTable
          admins={admins}
          loading={loading}
          search={search}
          setSearch={setSearch}
          onEdit={(a) => {
            setSelectedAdmin(a);
            setOpenEdit(true);
          }}
          onDelete={(a) => {
            setSelectedAdmin(a);
            setOpenDelete(true);
          }}
        />
      </CardContent>

      <EditAdminDialog
        open={openEdit}
        setOpen={setOpenEdit}
        admin={selectedAdmin}
        loading={loading}
        onSave={(form) => updateAdmin(selectedAdmin!.id, form)}
      />

      <DeleteAdminDialog
        open={openDelete}
        setOpen={setOpenDelete}
        loading={loading}
        onConfirm={() => deleteAdmin(selectedAdmin!.id)}
      />
    </Card>
  );
}
