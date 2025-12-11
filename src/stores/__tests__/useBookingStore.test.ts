import { renderHook, act } from "@testing-library/react";
import { useBookingStore } from "@/stores/useBookingStore";
import { StudentBooking } from "@/types/booking";

describe("useBookingStore", () => {
  const mockBooking: StudentBooking = {
    id: "1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    gender: "male",
    level: "200",
    school: "Engineering",
    studentId: "STU001",
    phone: "1234567890",
    hostelName: "North Campus",
    roomTitle: "Two-in-two",
    price: "5000",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "0987654321",
    relation: "Mother",
    hasMedicalCondition: false,
    status: "approved",
    allocatedRoomNumber: 101,
    date: new Date().toISOString(),
  };

  beforeEach(() => {
    useBookingStore.setState({
      bookings: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalBookings: 0,
      statusFilter: "all",
      searchQuery: "",
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useBookingStore());

    expect(result.current.bookings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalBookings).toBe(0);
  });

  it("should set bookings", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setBookings([mockBooking]);
    });

    expect(result.current.bookings).toEqual([mockBooking]);
  });

  it("should add booking", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.addBooking(mockBooking);
    });

    expect(result.current.bookings).toContainEqual(mockBooking);
  });

  it("should update booking", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.addBooking(mockBooking);
    });

    const updatedBooking = {
      ...mockBooking,
      status: "pending approval" as const,
    };

    act(() => {
      result.current.updateBooking(updatedBooking);
    });

    const stored = result.current.bookings.find(
      (b: StudentBooking) => b.id === "1"
    );
    expect(stored?.status).toBe("pending approval");
  });

  it("should remove booking", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.addBooking(mockBooking);
    });

    expect(result.current.bookings).toHaveLength(1);

    act(() => {
      result.current.removeBooking("1");
    });

    expect(result.current.bookings).toHaveLength(0);
  });

  it("should manage pagination", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setCurrentPage(2);
      result.current.setPageSize(20);
      result.current.setTotalBookings(100);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalBookings).toBe(100);
  });

  it("should set status filter", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setStatusFilter("approved");
    });

    expect(result.current.statusFilter).toBe("approved");

    act(() => {
      result.current.setStatusFilter("all");
    });

    expect(result.current.statusFilter).toBe("all");
  });

  it("should set search query", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setSearchQuery("john");
    });

    expect(result.current.searchQuery).toBe("john");

    act(() => {
      result.current.setSearchQuery("");
    });

    expect(result.current.searchQuery).toBe("");
  });

  it("should set loading and error states", () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setError("Test error");
    });

    expect(result.current.error).toBe("Test error");

    act(() => {
      result.current.setLoading(false);
      result.current.setError(null);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
