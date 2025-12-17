# Backend Alignment - Quick Reference

## API Endpoint Changes

### Before ❌
```typescript
apiFetch('/auth/login')          // No version prefix
apiFetch('/admins')              // No version prefix
apiFetch('/analytics/dashboard') // No version prefix
```

### After ✅
```typescript
apiFetch('/auth/login')          // Automatically becomes /api/v1/auth/login
apiFetch('/admins')              // Automatically becomes /api/v1/admins
apiFetch('/analytics/dashboard') // Automatically becomes /api/v1/analytics/dashboard
```

---

## Response Format Changes

### Before ❌
```json
// Direct response
{
  "id": "123",
  "name": "John Doe"
}
```

### After ✅
```json
// Enveloped response (automatically unwrapped by frontend)
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe"
  }
}
```

**Frontend receives:** Just the `data` object - unwrapping is automatic!

---

## Authentication Response Changes

### Before ❌
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}
```

### After ✅
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';  // NEW!
  hostelId?: string | null;                     // NEW!
}
```

**Usage:**
```typescript
const { user } = useAuthStore();
console.log(user.role);      // 'SUPER_ADMIN'
console.log(user.hostelId);  // 'hostel_001' or null
```

---

## Analytics Changes

### Before ❌
```typescript
interface DashboardAnalytics {
  bookingStats: BookingStats;
  genderDistribution: GenderDistribution[];
  statusBreakdown: StatusBreakdown[];
  revenueByHostel: RevenueByHostel[];
  monthlyRevenue: MonthlyRevenue[];
  paymentStatus: PaymentStatus;
  lastUpdated: string;
}
```

### After ✅
```typescript
interface DashboardAnalytics {
  bookingStats: BookingStats;
  genderDistribution: GenderDistribution[];
  statusBreakdown: StatusBreakdown[];
  revenueByHostel: RevenueByHostel[];
  monthlyRevenue: MonthlyRevenue[];
  paymentStatus: PaymentStatus;
  recentBookings?: number;        // NEW! Last 7 days
  revenueTrend?: RevenueTrend;    // NEW! Period comparison
  lastUpdated: string;
}

interface RevenueTrend {
  currentPeriod: number;
  previousPeriod: number;
  percentageChange: number;
}
```

---

## Pagination Changes

### Before ❌
```typescript
interface PaginationResponse {
  admins: Admin[];
  total: number;
  page: number;
  pageSize: number;
}
```

### After ✅
```typescript
interface PaginationResponse {
  admins: Admin[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;  // NEW!
}
```

**Usage:**
```typescript
const totalPages = Math.ceil(response.total / response.pageSize);
// Or use response.totalPages if available
```

---

## No Code Changes Required! 🎉

All changes are handled automatically by the updated `apiFetch` utility. Your existing API calls continue to work without modification:

```typescript
// Your existing code works as-is!
const admins = await apiFetch('/admins');  // ✅ Works!
const user = await apiFetch('/auth/me');   // ✅ Works!
const analytics = await apiFetch('/analytics/dashboard'); // ✅ Works!
```

---

## Environment Setup

Make sure your `.env.local` has:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:3000
```

Or for production:

```bash
NEXT_PUBLIC_API_URL=https://hostella.com
```

**Note:** Don't include `/api/v1` in the URL - it's added automatically!

---

## Testing

```bash
npm test                    # Run all tests
npm test api.test          # Test API utility
npm run dev                # Start dev server
```

---

## What Changed Under the Hood

1. ✅ **API Versioning**: All endpoints now use `/api/v1` prefix
2. ✅ **Response Unwrapping**: Automatically extracts `data` from `{ success, data }` envelope
3. ✅ **Auth Enhancement**: User object now includes `role` and `hostelId`
4. ✅ **Analytics Expansion**: New fields for trends and recent activity
5. ✅ **Pagination**: Support for `totalPages` field
6. ✅ **Backward Compatible**: Works with old and new response formats

---

## Quick Verification Checklist

- [ ] Update `.env.local` with correct API URL
- [ ] Test login (should return role and hostelId)
- [ ] Check admins list page loads
- [ ] Check bookings list page loads
- [ ] Check broadcasts list page loads
- [ ] Verify analytics dashboard shows all data
- [ ] Confirm pagination works correctly

---

**Status:** ✅ Ready to use!
