import type { CreateHostelFormData } from "./CreateHostelDialog";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const facilityOptions: string[] = [
  "Wi-Fi",
  "Laundry",
  "Gym",
  "Study Room",
  "Common Room",
  "Cafeteria",
  "Security",
  "Parking",
];

interface FacilitiesFieldsProps {
  formData: CreateHostelFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateHostelFormData>>;
}

export default function FacilitiesFields({
  formData,
  setFormData,
}: FacilitiesFieldsProps) {
  const toggleFacility = (facility: string) => {
    const currentFacilities: string[] = formData.facilities || [];
    setFormData({
      ...formData,
      facilities: currentFacilities.includes(facility)
        ? currentFacilities.filter((f: string) => f !== facility)
        : [...currentFacilities, facility],
    });
  };

  return (
    <div className="col-span-2">
      <label className="block font-medium mb-2">Facilities</label>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {facilityOptions.map((facility: string) => (
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
  );
}
