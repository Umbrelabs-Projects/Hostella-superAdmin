import React from "react";
import type { CreateHostelFormData } from "./CreateHostelDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoomFieldsProps {
  formData: CreateHostelFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateHostelFormData>>;
}

export default function RoomFields({ formData, setFormData }: RoomFieldsProps) {
  return (
    <>
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
    </>
  );
}
