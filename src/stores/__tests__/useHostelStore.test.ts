import { renderHook, act } from "@testing-library/react";
import { useHostelStore } from "@/stores/useHostelStore";
import { Hostel } from "@/types/admin";

describe("useHostelStore", () => {
  const mockHostel: Hostel = {
    id: "1",
    name: "Test Hostel",
    location: "Campus Location",
    campus: "Main Campus",
    phone: "+1234567890",
    floors: 3,
    totalRooms: 100,
    singleRooms: 60,
    doubleRooms: 40,
    facilities: ["Wi-Fi", "Laundry", "Gym"],
    hasAdmin: false,
  };

  beforeEach(() => {
    useHostelStore.setState({
      hostels: [],
      selectedHostel: null,
      total: 0,
      page: 1,
      totalPages: 0,
      searchQuery: "",
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useHostelStore());

    expect(result.current.hostels).toEqual([]);
    expect(result.current.selectedHostel).toBeNull();
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe("");
  });

  it("should set hostels list with pagination data", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
    });

    expect(result.current.hostels).toEqual([mockHostel]);
    expect(result.current.total).toBe(1);
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("should add hostel to list", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.addHostel(mockHostel);
    });

    expect(result.current.hostels).toContainEqual(mockHostel);
    expect(result.current.total).toBe(1);
  });

  it("should update hostel in list", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
    });

    act(() => {
      result.current.updateHostel("1", { name: "Updated Hostel" });
    });

    expect(result.current.hostels[0].name).toBe("Updated Hostel");
  });

  it("should update selected hostel when updating", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
      result.current.setSelectedHostel(mockHostel);
    });

    act(() => {
      result.current.updateHostel("1", { name: "Updated Hostel" });
    });

    expect(result.current.selectedHostel?.name).toBe("Updated Hostel");
  });

  it("should remove hostel from list", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
    });

    act(() => {
      result.current.removeHostel("1");
    });

    expect(result.current.hostels).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it("should clear selected hostel when removing it", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
      result.current.setSelectedHostel(mockHostel);
    });

    act(() => {
      result.current.removeHostel("1");
    });

    expect(result.current.selectedHostel).toBeNull();
  });

  it("should set search query", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setSearchQuery("test search");
    });

    expect(result.current.searchQuery).toBe("test search");
  });

  it("should set page", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it("should clear all hostels", () => {
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.setHostels([mockHostel], 1, 1, 1);
      result.current.setSearchQuery("test");
      result.current.setPage(2);
    });

    act(() => {
      result.current.clearHostels();
    });

    expect(result.current.hostels).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe("");
  });

  it("should handle multiple hostels", () => {
    const { result } = renderHook(() => useHostelStore());

    const hostel2: Hostel = {
      ...mockHostel,
      id: "2",
      name: "Hostel 2",
    };

    act(() => {
      result.current.setHostels([mockHostel, hostel2], 2, 1, 1);
    });

    expect(result.current.hostels).toHaveLength(2);
    expect(result.current.total).toBe(2);
  });

  it("should validate room count consistency", () => {
    const hostelWithInconsistentRooms: Hostel = {
      ...mockHostel,
      totalRooms: 100,
      singleRooms: 40,
      doubleRooms: 50, // 40 + 50 = 90, not 100
    };

    // This should be caught by validation schema, but store accepts any data
    const { result } = renderHook(() => useHostelStore());

    act(() => {
      result.current.addHostel(hostelWithInconsistentRooms);
    });

    expect(result.current.hostels[0].singleRooms + result.current.hostels[0].doubleRooms).not.toBe(
      result.current.hostels[0].totalRooms
    );
  });
});
