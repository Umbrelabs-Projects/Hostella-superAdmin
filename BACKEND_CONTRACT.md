# Backend Contract Implementation

## Overview
This document outlines the definitive backend contract that the frontend uses for admin-hostel assignment management.

## Data Model

### Admin (Source: GET /api/v1/admins)
```typescript
{
  id: string;                          // Unique identifier
  firstName: string;                   // Clean string
  lastName: string;                    // Clean string
  email: string;                       // Unique, lowercase
  phone: string;                       // E.164 format or standard format
  role: "super-admin" | "hostel-admin"; // Guaranteed case: all lowercase, hyphen-separated
  status: "active" | "inactive" | "suspended"; // Guaranteed case: lowercase
  assignedHostelId: string | null;     // null if unassigned, otherwise hostel ID
  assignedHostelName?: string;         // Display name, null if unassigned
  createdAt: string;                   // ISO 8601 timestamp
  updatedAt: string;                   // ISO 8601 timestamp
  lastLogin?: string;                  // ISO 8601 timestamp
}
```

### Hostel (Source: GET /api/v1/hostels)
```typescript
{
  id: string;
  name: string;
  location: string;
  campus: string;
  phone: string;
  floors: number;
  totalRooms: number;
  singleRooms: number;
  doubleRooms: number;
  facilities: string[];
  hasAdmin: boolean;                   // Source of truth for admin assignment status
  createdAt?: string;
  updatedAt?: string;
}
```

## API Endpoints

### 1. Fetch All Admins (Paginated)
```
GET /api/v1/admins?page=1&pageSize=10&search=&role=all&status=all
```

**Query Parameters:**
- `page` (number): Page number (1-indexed)
- `pageSize` (number): Results per page
- `search` (string): Search by firstName, lastName, or email
- `role` (string): Filter by role ("all", "hostel-admin", "super-admin")
- `status` (string): Filter by status ("all", "active", "inactive", "suspended")

**Response:**
```typescript
{
  admins: Admin[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}
```

### 2. Fetch Available Admins (NEW - Unassigned Hostel-Admins)
```
GET /api/v1/admins/available
```

**Purpose:** Returns only hostel-admins that are NOT assigned to any hostel.
**Response:**
```typescript
Admin[]  // Array of unassigned hostel-admins
```

**Note:** Backend filters:
- Role: only "hostel-admin" (super-admins never returned)
- Assignment: only those with `assignedHostelId === null`

### 3. Fetch All Hostels
```
GET /api/v1/hostels
```

**Response:**
```typescript
{
  hostels: Hostel[];
  total?: number;
  page?: number;
  pageSize?: number;
}
```

### 4. Assign Admin to Hostel
```
PATCH /api/v1/hostels/assign-admin
Content-Type: application/json

{
  hostelId: string;    // Hostel to assign to
  adminId: string;     // Hostel-admin to assign
}
```

**Validation:**
- ✅ Admin must have role === "hostel-admin"
- ✅ Admin must not already be assigned to another hostel
- ✅ Hostel must exist
- ✅ Error if super-admin attempted

**Side Effects:**
- Updates admin.assignedHostelId
- Updates admin.assignedHostelName
- Sets hostel.hasAdmin = true
- Returns updated Hostel object

### 5. Unassign Admin from Hostel
```
PATCH /api/v1/hostels/unassign-admin
Content-Type: application/json

{
  hostelId: string;    // Hostel to unassign from
  adminId: string;     // Admin to unassign
}
```

**Validation:**
- ✅ Admin.assignedHostelId must match hostelId
- ✅ Hostel must exist

**Side Effects:**
- Sets admin.assignedHostelId = null
- Sets admin.assignedHostelName = null
- Sets hostel.hasAdmin = false
- Returns updated Hostel object

## Frontend Implementation Details

### useAdminApi Hook
Location: `src/app/dashboard/super-admin/_hooks/useAdminApi.ts`

**Methods:**
1. `fetchAdmins(page, pageSize, search, role, status)` - Get paginated admins
2. `fetchAvailableAdmins()` - Get unassigned hostel-admins (calls GET /admins/available)
3. `fetchHostels()` - Get all hostels
4. `createAdmin(data)` - Create new admin
5. `updateAdmin(id, data)` - Update admin details
6. `deleteAdmin(id)` - Delete admin

**Data Normalization:**
- Backend guarantees clean data: role, status, and assignedHostelId are already normalized
- Frontend uses data as-is without additional transformation
- No need for string cleaning or null-like value handling

### AssignAdminDialog Component
Location: `src/app/dashboard/hostels/_components/AssignAdminDialog.tsx`

**Workflow:**
1. Dialog opens → Fetch available admins via `fetchAvailableAdmins()`
2. User searches/selects admin → Filter available admins by name/email
3. User clicks "Assign" → Call `assignAdmin()` → Refresh available list → Close dialog
4. User clicks "Unassign" → Call `unassignAdmin()` → Refresh available list → Close dialog

**Data Flow:**
- Display logic: Check `admin.assignedHostelId` to determine if assigned
- Assignment source: Admin's `assignedHostelName` field (not hostel data)
- Update: After mutation, fetch both available admins and full admin list for consistency

### Hostels Page Refresh Logic
Location: `src/app/dashboard/hostels/page.tsx`

**Refresh Triggers:**
1. Tab visibility change → Refresh hostels and admins
2. Dialog success (assign/unassign) → Refresh hostels and admins in parallel
3. CRUD operations on hostels → Refresh via handleSuccess()

**Implementation:**
- `handleSuccess()` calls both `fetchHostels()` and `fetchAdmins()`
- Visibility listener refreshes both lists when tab becomes visible
- No polling; event-driven updates only

## Data Consistency Rules

### Single Source of Truth
1. **Admin Assignment Status:** `admin.assignedHostelId` (from /admins endpoint)
2. **Hostel Assignment Status:** `hostel.hasAdmin` (from /hostels endpoint)
3. **Display Name:** `admin.assignedHostelName` (from /admins endpoint)

### Validation Rules
1. Only **"hostel-admin"** role can be assigned to hostels
2. **"super-admin"** cannot be assigned to any hostel
3. One admin per hostel (one-to-one mapping)
4. When assigned: `admin.assignedHostelId` is not null
5. When unassigned: `admin.assignedHostelId` is null

### UI Display Rules
1. AdminTable: Show `admin.assignedHostelName` in "Assigned Hostel" column
2. HostelList: Show "Yes" if `hostel.hasAdmin === true`, else "No"
3. AssignAdminDialog: Only show admins from `/admins/available` endpoint
4. AssignAdminDialog: Show current assignment status using `admin.assignedHostelId`

## Error Handling

### Common Errors

**400 Bad Request**
- Missing required fields (hostelId, adminId)
- Invalid admin role for assignment
- Admin already assigned to another hostel

**404 Not Found**
- Admin not found
- Hostel not found

**409 Conflict**
- Hostel already has admin assigned
- Admin assignment mismatch

**500 Server Error**
- Database transaction failure
- Unexpected server error

### Frontend Error Flow
1. Catch error in mutation handler
2. Display toast with error message
3. Do NOT close dialog on error
4. Allow user to retry
5. Log error for debugging

## Testing Scenarios

### Scenario 1: Create & Assign New Admin
1. Navigate to /dashboard/super-admin
2. Click "Create New Admin"
3. Fill form with hostel-admin role
4. Backend assigns hostel
5. Navigate to /dashboard/hostels
6. Verify new admin appears in Assign Admin dialog
7. Assign to different hostel
8. Verify `assignedHostelName` updates in AdminTable

### Scenario 2: Unassign Admin
1. Open Assign Admin dialog on hostel with assigned admin
2. Click "Unassign"
3. Confirm unassign
4. Verify dialog closes
5. Verify admin reappears in available list
6. Verify hostel.hasAdmin = false on hostels list

### Scenario 3: Change Hostel Assignment
1. Open Assign Admin dialog on hostel with assigned admin
2. Click "Unassign" (or assign different admin)
3. Select new admin
4. Click "Assign"
5. Verify old admin reassigned status updates
6. Verify new admin assigned status updates
7. Verify hostel.hasAdmin = true

### Scenario 4: Super-Admin Validation
1. Navigate to /dashboard/super-admin
2. Create admin with super-admin role
3. Navigate to /dashboard/hostels
4. Open Assign Admin dialog
5. Verify super-admin does NOT appear in available list
6. Verify validation prevents assignment

## Performance Considerations

### Caching Strategy
- Admins cached in `useAdminStore` (Zustand)
- Hostels cached in `useHostelStore` (Zustand)
- Cache invalidated on mutations
- Fresh data fetched on tab visibility (lazy sync)

### Pagination
- Default: page=1, pageSize=10
- AdminTable uses pagination controls
- Dialog fetches single page of available admins (typically small number)

### API Calls
- No polling; event-driven only
- Maximum 2 concurrent requests on success (fetchHostels + fetchAdmins)
- Each dialog open: 1 call to fetchAvailableAdmins()
- Each mutation: 2 calls (mutation + refresh)

## Future Enhancements

1. **Cross-tab Real-time Sync:** Use BroadcastChannel API
2. **Offline Support:** Queue mutations in IndexedDB
3. **Batch Operations:** Multi-select assign/unassign
4. **Hostel Transfer:** Allow admin to move between hostels directly
5. **Audit Logging:** Track all assignment changes
6. **Role-based UI:** Hide features based on user role
