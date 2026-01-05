import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import RoomFields from "./RoomFields";
import FacilitiesFields from "./FacilitiesFields";
import { useHostelApi } from "../_hooks/useHostelApi";

type CreateHostelDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export type CreateHostelFormData = {
  name: string;
  location: string | null;
  campus: string | null;
  phoneNumber: string | null;
  noOfFloors: string | null;
  totalRooms: number;
  singleRooms: number;
  doubleRooms: number;
  tripleRooms: number;
  facilities: string[];
  description: string | null;
};

export default function CreateHostelDialog({
  open,
  onClose,
  onSuccess,
}: CreateHostelDialogProps) {
  const { createHostel, uploadHostelImage, loading } = useHostelApi();
  const [formData, setFormData] = useState<CreateHostelFormData>({
    name: "",
    location: null,
    campus: null,
    phoneNumber: null,
    noOfFloors: null,
    totalRooms: 0,
    singleRooms: 0,
    doubleRooms: 0,
    tripleRooms: 0,
    facilities: [],
    description: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const single = formData.singleRooms ?? 0;
    const double = formData.doubleRooms ?? 0;
    const triple = formData.tripleRooms ?? 0;
    const sum = single + double + triple;
    if (formData.totalRooms > 0 && sum !== formData.totalRooms) {
      setErrors((prev) => ({
        ...prev,
        totalRooms: `Single (${single}) + Double (${double}) + Triple (${triple}) must equal Total (${formData.totalRooms})`,
      }));
    } else {
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest.totalRooms;
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
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors");
      return;
    }
    try {
      const createdHostel = await createHostel(formData);
      if (imageFile && createdHostel.id) {
        try {
          await uploadHostelImage(createdHostel.id, imageFile);
        } catch (imageErr) {
          console.error("Failed to upload image:", imageErr);
          toast.warning("Hostel created but image upload failed");
        }
      }
      toast.success(
        "Hostel created successfully. Triple room data included if provided."
      );
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
      location: null,
      campus: null,
      phoneNumber: null,
      noOfFloors: null,
      totalRooms: 0,
      singleRooms: 0,
      doubleRooms: 0,
      tripleRooms: 0,
      facilities: [],
      description: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      const maxSize = 5 * 1024 * 1024;
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Hostel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="noOfFloors">Number of Floors</Label>
              <Input
                id="noOfFloors"
                type="text"
                value={formData.noOfFloors || ""}
                onChange={(e) =>
                  setFormData({ ...formData, noOfFloors: e.target.value })
                }
                placeholder="e.g. 4"
              />
            </div>
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
            <RoomFields formData={formData} setFormData={setFormData} />
            <FacilitiesFields formData={formData} setFormData={setFormData} />
          </div>
          <div>
            <Label htmlFor="image">Hostel Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={128}
                    height={128}
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
                <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
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
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                  />
                </div>
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
