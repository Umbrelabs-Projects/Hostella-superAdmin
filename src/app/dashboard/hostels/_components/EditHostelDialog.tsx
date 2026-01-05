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
import { UpdateHostelFormData } from "../_validations/hostelSchema";
import { Hostel } from "@/types/admin";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

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
  const { updateHostel, uploadHostelImage, fetchHostelById, loading } =
    useHostelApi();
  const [formData, setFormData] = useState<UpdateHostelFormData>({
    name: "",
    location: null,
    campus: null,
    phoneNumber: null,
    noOfFloors: null,
    totalRooms: 0,
    singleRooms: 0,
    doubleRooms: 0,
    tripleRooms: 0,
    facilities: undefined,
    description: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    const loadHostelDetails = async () => {
      if (hostel && open) {
        setFetchingDetails(true);
        try {
          // Initial population from props (fast)
          setFormData({
            name: hostel.name,
            location: hostel.location ?? null,
            campus: hostel.campus ?? null,
            phoneNumber: hostel.phoneNumber ?? hostel.phone ?? null,
            noOfFloors:
              hostel.noOfFloors ??
              (hostel.floors ? String(hostel.floors) : null),
            totalRooms: hostel.totalRooms,
            singleRooms: hostel.singleRooms,
            doubleRooms: hostel.doubleRooms,
            tripleRooms: hostel.tripleRooms ?? 0,
            facilities: hostel.facilities,
            description: hostel.description ?? null,
          });

          // Fetch full details to ensure we have everything
          const fullHostel = await fetchHostelById(hostel.id);

          setFormData({
            name: fullHostel.name,
            location: fullHostel.location ?? null,
            campus: fullHostel.campus ?? null,
            phoneNumber: fullHostel.phoneNumber ?? fullHostel.phone ?? null,
            noOfFloors:
              fullHostel.noOfFloors ??
              (fullHostel.floors ? String(fullHostel.floors) : null),
            totalRooms: fullHostel.totalRooms,
            singleRooms: fullHostel.singleRooms,
            doubleRooms: fullHostel.doubleRooms,
            tripleRooms: fullHostel.tripleRooms ?? 0,
            facilities: fullHostel.facilities,
            description: fullHostel.description ?? null,
          });

          // Set image preview if hostel has images
          if (fullHostel.images && fullHostel.images.length > 0) {
            setImagePreview(fullHostel.images[0].url);
          } else {
            // Fallback to prop images
            if (hostel.images && hostel.images.length > 0) {
              setImagePreview(hostel.images[0].url);
            } else {
              setImagePreview(null);
            }
          }
        } catch (error) {
          console.error("Failed to fetch hostel details:", error);
          // Fallback is already set from props
        } finally {
          setFetchingDetails(false);
          setImageFile(null); // Reset file selection when dialog opens
        }
      }
    };

    loadHostelDetails();
  }, [hostel, open, fetchHostelById]);

  // Real-time validation for room totals
  useEffect(() => {
    const single = formData.singleRooms || 0;
    const double = formData.doubleRooms || 0;
    const triple = formData.tripleRooms || 0;
    const total = formData.totalRooms;
    const sum = single + double + triple;

    if (total !== undefined && total > 0 && sum !== total) {
      setErrors((prev) => ({
        ...prev,
        totalRooms: `Single (${single}) + Double (${double}) + Triple (${triple}) must equal Total (${total})`,
      }));
    } else {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { totalRooms, ...rest } = prev;
        return rest;
      });
    }
  }, [
    formData.singleRooms,
    formData.doubleRooms,
    formData.tripleRooms,
    formData.totalRooms,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel) return;

    try {
      if (Object.keys(errors).length > 0) {
        toast.error("Please fix validation errors");
        return;
      }

      // Update hostel first
      await updateHostel(hostel.id, formData);

      // Upload image if a new one was selected
      if (imageFile) {
        try {
          await uploadHostelImage(hostel.id, imageFile);
        } catch (imageErr) {
          // Log error but don't fail the entire operation
          console.error("Failed to upload image:", imageErr);
          toast.warning("Hostel updated successfully, but image upload failed. You can update it later.");
        }
      }

      toast.success("Hostel updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update hostel. Please try again."
      );
    }}
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => {
      const currentFacilities = prev.facilities || [];
      return {
        ...prev,
        facilities: currentFacilities.includes(facility)
          ? currentFacilities.filter((f) => f !== facility)
          : [...currentFacilities, facility],
      };
    });
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
    // If there was an existing image, keep the preview, otherwise clear it
    if (hostel?.images && hostel.images.length > 0 && !imageFile) {
      setImagePreview(hostel.images[0].url);
    } else {
      setImagePreview(null);
    }
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
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter hostel name"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>

            {/* Campus */}
            <div>
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                value={formData.campus || ""}
                onChange={(e) =>
                  setFormData({ ...formData, campus: e.target.value })
                }
                placeholder="Enter campus name"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phoneNumber">Phone</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="+1234567890"
              />
            </div>

            {/* Floors */}
            <div>
              <Label htmlFor="noOfFloors">Number of Floors</Label>
              <Input
                id="noOfFloors"
                type="text"
                value={formData.noOfFloors || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    noOfFloors: e.target.value,
                  })
                }
                placeholder="e.g. 4"
              />
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
                value={formData.singleRooms ?? 0}
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
                value={formData.doubleRooms ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doubleRooms: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            {/* Triple Rooms */}
            <div>
              <Label htmlFor="tripleRooms">Triple Rooms</Label>
              <Input
                id="tripleRooms"
                type="number"
                min="0"
                value={formData.tripleRooms ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tripleRooms: parseInt(e.target.value) || 0,
                  })
                }
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
                value={formData.totalRooms ?? 0}
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

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value || null,
                  })
                }
                placeholder="Enter hostel description..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <Label>Facilities</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {facilityOptions.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    checked={(formData.facilities || []).includes(facility)}
                    onCheckedChange={() => toggleFacility(facility)}
                  />
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
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
                  htmlFor="image-upload-edit"
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
                    id="image-upload-edit"
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
              {loading ? "Updating..." : "Update Hostel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
