import {
  createHostelSchema,
  updateHostelSchema,
  assignAdminSchema,
} from "../hostelSchema";

describe("Hostel Validation Schemas", () => {
  describe("createHostelSchema", () => {
    it("should validate valid hostel data", () => {
      const validData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 3,
        totalRooms: 100,
        singleRooms: 60,
        doubleRooms: 40,
        facilities: ["Wi-Fi", "Laundry"],
      };

      const result = createHostelSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject when single + double rooms != total rooms", () => {
      const invalidData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 3,
        totalRooms: 100,
        singleRooms: 50,
        doubleRooms: 40, // 50 + 40 = 90, not 100
        facilities: ["Wi-Fi"],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("totalRooms");
      }
    });

    it("should reject hostel with short name", () => {
      const invalidData = {
        name: "H",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 3,
        totalRooms: 100,
        singleRooms: 60,
        doubleRooms: 40,
        facilities: ["Wi-Fi"],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject hostel with no facilities", () => {
      const invalidData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 3,
        totalRooms: 100,
        singleRooms: 60,
        doubleRooms: 40,
        facilities: [],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject negative room counts", () => {
      const invalidData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 3,
        totalRooms: 100,
        singleRooms: -10,
        doubleRooms: 40,
        facilities: ["Wi-Fi"],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid phone format", () => {
      const invalidData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "invalid",
        floors: 3,
        totalRooms: 100,
        singleRooms: 60,
        doubleRooms: 40,
        facilities: ["Wi-Fi"],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept various phone formats", () => {
      const phoneFormats = [
        "+1234567890",
        "+1 234 567 890",
        "+1-234-567-890",
        "(123) 456-7890",
        "1234567890",
      ];

      phoneFormats.forEach((phone) => {
        const data = {
          name: "Test Hostel",
          location: "Campus Location",
          campus: "Main Campus",
          phone,
          floors: 3,
          totalRooms: 100,
          singleRooms: 60,
          doubleRooms: 40,
          facilities: ["Wi-Fi"],
        };

        const result = createHostelSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should require at least 1 floor", () => {
      const invalidData = {
        name: "Test Hostel",
        location: "Campus Location",
        campus: "Main Campus",
        phone: "+1234567890",
        floors: 0,
        totalRooms: 100,
        singleRooms: 60,
        doubleRooms: 40,
        facilities: ["Wi-Fi"],
      };

      const result = createHostelSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("updateHostelSchema", () => {
    it("should validate valid update data", () => {
      const validData = {
        name: "Updated Hostel",
        location: "New Location",
        campus: "South Campus",
        totalRooms: 50,
        singleRooms: 20,
        doubleRooms: 30,
        facilities: ["Wi-Fi", "Gym", "Laundry"],
      };

      const result = updateHostelSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should allow room fields to be editable (not read-only)", () => {
      const dataWithRooms = {
        name: "Updated Hostel",
        location: "New Location",
        campus: "South Campus",
        totalRooms: 100,
        singleRooms: 40,
        doubleRooms: 60,
        facilities: ["Wi-Fi"],
      };

      const result = updateHostelSchema.safeParse(dataWithRooms);
      // Room fields are now editable in update schema
      expect(result.success).toBe(true);
    });
  });

  describe("assignAdminSchema", () => {
    it("should validate valid assignment data", () => {
      const validData = {
        hostelId: "hostel123",
        adminId: "admin456",
      };

      const result = assignAdminSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty hostelId", () => {
      const invalidData = {
        hostelId: "",
        adminId: "admin456",
      };

      const result = assignAdminSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty adminId", () => {
      const invalidData = {
        hostelId: "hostel123",
        adminId: "",
      };

      const result = assignAdminSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing fields", () => {
      const invalidData = {
        hostelId: "hostel123",
      };

      const result = assignAdminSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
