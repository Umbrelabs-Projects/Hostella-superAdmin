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
    totalRooms: 0,
    singleRooms: 0,
    doubleRooms: 0,
    facilities: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name,
        location: hostel.location,
        campus: hostel.campus,
        totalRooms: hostel.totalRooms,
        singleRooms: hostel.singleRooms,
        doubleRooms: hostel.doubleRooms,
        facilities: hostel.facilities,
      });
    }
  }, [hostel]);

  // Real-time validation for room totals
  useEffect(() => {
    const sum = formData.singleRooms + formData.doubleRooms;
    if (formData.totalRooms > 0 && sum !== formData.totalRooms) {
      setErrors((prev) => ({
        ...prev,
        totalRooms: `Single (${formData.singleRooms}) + Double (${formData.doubleRooms}) must equal Total (${formData.totalRooms})`,
      }));
    } else {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { totalRooms, ...rest } = prev;
        return rest;
      });
    }
  }, [formData.singleRooms, formData.doubleRooms, formData.totalRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel) return;

    try {
      if (Object.keys(errors).length > 0) {
        toast.error("Please fix validation errors");
        return;
      }
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
              <Input
                id="campus"
                value={formData.campus}
                onChange={(e) =>
                  setFormData({ ...formData, campus: e.target.value })
                }
                placeholder="Enter campus name"
                required
              />
            </div>

            {/* Total Rooms */}
            <div>
              <Label htmlFor="totalRooms">
                Total Rooms <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalRooms"
                type="number"
                min="1"
                value={formData.totalRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalRooms: parseInt(e.target.value) || 0,
                  })
                }
                required
                className={errors.totalRooms ? "border-red-500" : ""}
              />
              {errors.totalRooms && (
                <p className="text-red-500 text-sm mt-1">{errors.totalRooms}</p>
              )}
            </div>

            {/* Single Rooms */}
            <div>
              <Label htmlFor="singleRooms">
                Single Rooms <span className="text-red-500">*</span>
              </Label>
              <Input
                id="singleRooms"
                type="number"
                min="0"
                value={formData.singleRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    singleRooms: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            {/* Double Rooms */}
            <div>
              <Label htmlFor="doubleRooms">
                Double Rooms <span className="text-red-500">*</span>
              </Label>
              <Input
                id="doubleRooms"
                type="number"
                min="0"
                value={formData.doubleRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doubleRooms: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
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
              disabled={loading || Object.keys(errors).length > 0}
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
