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
import { Textarea } from "@/components/ui/textarea";
import { useHostelApi } from "../_hooks/useHostelApi";
import { CreateHostelFormData } from "../_validations/hostelSchema";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

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
  const { createHostel, uploadHostelImage, loading } = useHostelApi();
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
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      // Create hostel first
      const createdHostel = await createHostel(formData);

      // Upload image if provided
      if (imageFile && createdHostel.id) {
        try {
          await uploadHostelImage(createdHostel.id, imageFile);
        } catch (imageErr) {
          // Log error but don't fail the entire operation
          console.error("Failed to upload image:", imageErr);
          toast.warning("Hostel created but image upload failed");
        }
      }

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
      description: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed."
        );
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter hostel description..."
                rows={4}
                className="resize-none"
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

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Hostel Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                  />
                </label>
              )}
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
              {loading ? "Creating..." : "Create Hostel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
