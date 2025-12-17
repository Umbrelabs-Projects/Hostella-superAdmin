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
import { CreateHostelFormData } from "../_validations/hostelSchema";
import { toast } from "sonner";

interface CreateHostelDialogProps {
  open: boolean;
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

export default function CreateHostelDialog({
  open,
  onClose,
  onSuccess,
}: CreateHostelDialogProps) {
  const { createHostel, loading } = useHostelApi();
  const [formData, setFormData] = useState<CreateHostelFormData>({
    name: "",
    location: "",
    campus: "",
    phone: "",
    floors: 1,
    totalRooms: 0,
    singleRooms: 0,
    doubleRooms: 0,
    facilities: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      await createHostel(formData);
      toast.success("Hostel created successfully");
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create hostel"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      campus: "",
      phone: "",
      floors: 1,
      totalRooms: 0,
      singleRooms: 0,
      doubleRooms: 0,
      facilities: [],
    });
    setErrors({});
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Hostel</DialogTitle>
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
            {formData.facilities.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                Select at least one facility
              </p>
            )}
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
              {loading ? "Creating..." : "Create Hostel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
