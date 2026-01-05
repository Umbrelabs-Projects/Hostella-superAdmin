"use client";

import React from "react";
import { Hostel } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HostelListProps {
  hostels: Hostel[];
  onEdit: (hostel: Hostel) => void;
  onDelete: (hostel: Hostel) => void;
  onAssignAdmin: (hostel: Hostel) => void;
}

export default function HostelList({
  hostels,
  onEdit,
  onDelete,
  onAssignAdmin,
}: HostelListProps) {
  const hostelList = Array.isArray(hostels) ? hostels : [];

  if (hostelList.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">No hostels found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Hostel Name</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Campus</TableHead>
              <TableHead className="font-semibold">Room Breakdown</TableHead>
              <TableHead className="font-semibold">Admin Status</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hostelList.map((hostel) => {
              // Debug logging
              if (process.env.NODE_ENV === "development") {
                console.log(`[HostelList] ${hostel.name}:`, {
                  singleRooms: hostel.singleRooms,
                  doubleRooms: hostel.doubleRooms,
                  tripleRooms: hostel.tripleRooms,
                  totalRooms: hostel.totalRooms,
                });
              }
              return (
              <TableRow key={hostel.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <button
                    onClick={() => onEdit(hostel)}
                    className="text-blue-600 hover:underline"
                  >
                    {hostel.name}
                  </button>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {hostel.location || "—"}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {hostel.campus || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {hostel.singleRooms > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {hostel.singleRooms} Single
                      </Badge>
                    )}
                    {hostel.doubleRooms > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {hostel.doubleRooms} Double
                      </Badge>
                    )}
                    {(hostel.tripleRooms ?? 0) > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {hostel.tripleRooms} Triple
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {hostel.hasAdmin ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(hostel)}
                      title="Edit hostel"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAssignAdmin(hostel)}
                      title={hostel.hasAdmin ? "Manage admin" : "Assign admin"}
                      className={
                        hostel.hasAdmin
                          ? "text-orange-600 hover:bg-orange-50"
                          : ""
                      }
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(hostel)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete hostel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
