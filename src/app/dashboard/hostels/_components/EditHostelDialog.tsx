"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useHostelApi } from "../_hooks/useHostelApi";
import { UpdateHostelFormData } from "../_validations/hostelSchema";
import { Hostel } from "@/types/admin";
import { toast } from "sonner";

interface EditHostelDialogProps {
  open: boolean;
  hostel: Hostel | null;
  onClose: () => void;
  onSuccess: () => void;
}

const campusOptions = [
  "Main Campus",
  "North Campus",
  "South Campus",
  "East Campus",
];
const facilityOptions = [
  "Wi-Fi",
  "Laundry",
  "Gym",
  "Study Room",
  "Common Room",
  "Cafeteria",
  "Security",
  "Parking",
];

export default function EditHostelDialog({
  open,
  hostel,
  onClose,
  onSuccess,
}: EditHostelDialogProps) {
  const { updateHostel, loading } = useHostelApi();
  const [formData, setFormData] = useState<UpdateHostelFormData>({
    name: "",
    location: "",
    campus: "",
    phone: "",
    floors: 1,
    facilities: [],
  });

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name,
        location: hostel.location,
        campus: hostel.campus,
        phone: hostel.phone,
        floors: hostel.floors,
        facilities: hostel.facilities,
      });
    }
  }, [hostel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel) return;

    try {
      await updateHostel(hostel.id, formData);
      toast.success("Hostel updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update hostel"
      );
    }
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hostel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <Label htmlFor="name">
                Hostel Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter hostel name"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
                required
              />
            </div>

            {/* Campus */}
            <div>
              <Label htmlFor="campus">
                Campus <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.campus}
                onValueChange={(value) =>
                  setFormData({ ...formData, campus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {campusOptions.map((campus) => (
                    <SelectItem key={campus} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1234567890"
                required
              />
            </div>

            {/* Floors */}
            <div>
              <Label htmlFor="floors">
                Floors <span className="text-red-500">*</span>
              </Label>
              <Input
                id="floors"
                type="number"
                min="1"
                value={formData.floors}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floors: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>

            {/* Room Breakdown (Read-only) */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <Label className="text-gray-700 mb-2 block">
                Room Breakdown (Cannot be changed after creation)
              </Label>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Rooms:</span>
                  <span className="ml-2 font-semibold">
                    {hostel.totalRooms}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Single Rooms:</span>
                  <span className="ml-2 font-semibold">
                    {hostel.singleRooms}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Double Rooms:</span>
                  <span className="ml-2 font-semibold">
                    {hostel.doubleRooms}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <Label>
              Facilities <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {facilityOptions.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.facilities.includes(facility)}
                    onCheckedChange={() => toggleFacility(facility)}
                  />
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Hostel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
