# Hostella Super Admin - API Integration Documentation

## Table of Contents
1. [Base URL & Authentication](#base-url--authentication)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Admin Management Endpoints](#admin-management-endpoints)
4. [Hostel Management Endpoints](#hostel-management-endpoints)
5. [Booking Management Endpoints](#booking-management-endpoints)
6. [Broadcast/Messaging Endpoints](#broadcastmessaging-endpoints)
7. [Analytics Endpoints](#analytics-endpoints)
8. [User Profile Endpoints](#user-profile-endpoints)
9. [Error Handling](#error-handling)
10. [Rate Limiting & Performance](#rate-limiting--performance)

---

## Base URL & Authentication

### Base URL
```
https://www.example.railway
```

### Authentication
All endpoints except auth/login require Bearer token authentication.

**Header Format:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. User Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate admin user and receive authentication token.

**Request Body:**
```json
{
  "email": "admin@hostella.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "admin_001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "admin@hostella.com",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 2. Get Current User Profile
**Endpoint:** `GET /auth/me`

**Description:** Retrieve authenticated user's profile information.

**Response (200 OK):**
```json
{
  "id": "admin_001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@hostella.com",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## Admin Management Endpoints

### 1. List All Admins (with Pagination & Filtering)
**Endpoint:** `GET /admins`

**Query Parameters:**
```
page=1                  # Page number (default: 1)
pageSize=10             # Items per page (default: 10)
search=John             # Search by name, email, or phone (optional)
role=hostel-admin       # Filter by role: super-admin | hostel-admin (optional)
status=active           # Filter by status: active | inactive | suspended (optional)
```

**Example URL:**
```
GET /admins?page=1&pageSize=10&search=John&role=hostel-admin&status=active
```

**Response (200 OK):**
```json
{
  "admins": [
    {
      "id": "admin_001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@hostella.com",
      "phone": "+1234567890",
      "role": "hostel-admin",
      "status": "active",
      "assignedHostelId": "hostel_001",
      "assignedHostelName": "Sunrise Hostel",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-10T15:30:00Z",
      "lastLogin": "2025-01-11T08:45:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 10
}
```

---

### 2. Create New Admin
**Endpoint:** `POST /admins`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@hostella.com",
  "phone": "+1234567890",
  "role": "hostel-admin",
  "assignedHostelId": "hostel_001"
}
```

**Response (201 Created):**
```json
{
  "id": "admin_001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@hostella.com",
  "phone": "+1234567890",
  "role": "hostel-admin",
  "status": "active",
  "assignedHostelId": "hostel_001",
  "assignedHostelName": "Sunrise Hostel",
  "createdAt": "2025-01-11T10:00:00Z",
  "updatedAt": "2025-01-11T10:00:00Z",
  "lastLogin": null
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already exists or validation failed"
}
```

---

### 3. Update Admin
**Endpoint:** `PUT /admins/:adminId`

**Request Body (all fields optional):**
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "email": "jonathan.smith@hostella.com",
  "phone": "+1987654321",
  "role": "super-admin",
  "assignedHostelId": "hostel_002",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "id": "admin_001",
  "firstName": "Jonathan",
  "lastName": "Smith",
  "email": "jonathan.smith@hostella.com",
  "phone": "+1987654321",
  "role": "super-admin",
  "status": "active",
  "assignedHostelId": "hostel_002",
  "assignedHostelName": "Moonlight Hostel",
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-11T14:30:00Z",
  "lastLogin": "2025-01-11T08:45:00Z"
}
```

---

### 4. Delete Admin
**Endpoint:** `DELETE /admins/:adminId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Admin not found"
}
```

---

## Hostel Management Endpoints

### 1. Get All Hostels
**Endpoint:** `GET /hostels`

**Description:** Retrieve list of all hostels with admin assignment status.

**Response (200 OK):**
```json
[
  {
    "id": "hostel_001",
    "name": "Sunrise Hostel",
    "location": "North Campus",
    "capacity": 200,
    "hasAdmin": true
  },
  {
    "id": "hostel_002",
    "name": "Moonlight Hostel",
    "location": "South Campus",
    "capacity": 150,
    "hasAdmin": false
  }
]
```

---

## Booking Management Endpoints

### 1. List All Bookings (with Pagination & Filtering)
**Endpoint:** `GET /bookings`

**Query Parameters:**
```
page=1              # Page number (default: 1)
pageSize=10         # Items per page (default: 10)
search=jane         # Search by name, email, or student ID (optional)
status=approved     # Filter by status: pending payment | pending approval | approved (optional)
```

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "id": "booking_001",
      "bookingId": "BK-1001",
      "email": "jane.doe@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "gender": "female",
      "level": "200",
      "school": "KNUST",
      "studentId": "KNUST12345",
      "phone": "0244123456",
      "admissionLetterName": "admission-jane.pdf",
      "hostelName": "Sunrise Hostel",
      "roomTitle": "One-in-one",
      "price": "400",
      "emergencyContactName": "John Doe",
      "emergencyContactNumber": "0201234567",
      "relation": "Father",
      "hasMedicalCondition": false,
      "medicalCondition": null,
      "status": "approved",
      "allocatedRoomNumber": 5,
      "date": "2025-01-01T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 10
}
```

---

### 2. Update Booking Status
**Endpoint:** `PUT /bookings/:bookingId`

**Request Body:**
```json
{
  "status": "approved",
  "allocatedRoomNumber": 12
}
```

**Response (200 OK):**
```json
{
  "id": "booking_001",
  "bookingId": "BK-1001",
  "email": "jane.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "gender": "female",
  "level": "200",
  "school": "KNUST",
  "studentId": "KNUST12345",
  "phone": "0244123456",
  "admissionLetterName": "admission-jane.pdf",
  "hostelName": "Sunrise Hostel",
  "roomTitle": "One-in-one",
  "price": "400",
  "emergencyContactName": "John Doe",
  "emergencyContactNumber": "0201234567",
  "relation": "Father",
  "hasMedicalCondition": false,
  "status": "approved",
  "allocatedRoomNumber": 12,
  "date": "2025-01-01T10:00:00Z"
}
```

---

### 3. Delete Booking
**Endpoint:** `DELETE /bookings/:bookingId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

---

## Broadcast/Messaging Endpoints

### 1. List All Broadcast Messages
**Endpoint:** `GET /broadcasts`

**Query Parameters:**
```
page=1                    # Page number (default: 1)
pageSize=10               # Items per page (default: 10)
search=maintenance        # Search by title or content (optional)
status=sent               # Filter: draft | sent | scheduled | failed (optional)
priority=high             # Filter: low | medium | high | urgent (optional)
```

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "msg_001",
      "title": "Maintenance Schedule Update",
      "content": "Water supply maintenance will be conducted on December 10th from 2 AM to 6 AM.",
      "recipientType": "all-residents",
      "recipients": [],
      "recipientCount": 150,
      "priority": "high",
      "status": "sent",
      "createdAt": "2025-01-09T10:00:00Z",
      "updatedAt": "2025-01-09T10:00:00Z",
      "sentAt": "2025-01-09T10:00:00Z",
      "scheduledFor": null,
      "attachments": [],
      "tags": ["maintenance"],
      "readCount": 132,
      "failedCount": 0
    }
  ],
  "total": 20,
  "page": 1,
  "pageSize": 10
}
```

---

### 2. Send Broadcast Message Immediately
**Endpoint:** `POST /broadcasts`

**Request Body:**
```json
{
  "title": "Important Announcement",
  "content": "Please attend the mandatory hostel meeting tonight at 7 PM.",
  "recipientType": "all-residents",
  "selectedRecipients": [],
  "priority": "high"
}
```

**Response (201 Created):**
```json
{
  "id": "msg_002",
  "title": "Important Announcement",
  "content": "Please attend the mandatory hostel meeting tonight at 7 PM.",
  "recipientType": "all-residents",
  "recipientCount": 150,
  "priority": "high",
  "status": "sent",
  "createdAt": "2025-01-11T10:00:00Z",
  "updatedAt": "2025-01-11T10:00:00Z",
  "sentAt": "2025-01-11T10:00:00Z",
  "readCount": 0,
  "failedCount": 0
}
```

---

### 3. Schedule Broadcast Message
**Endpoint:** `POST /broadcasts/schedule`

**Request Body:**
```json
{
  "title": "Welcome Message",
  "content": "Welcome to our hostel! Here are the house rules...",
  "recipientType": "all-residents",
  "selectedRecipients": [],
  "priority": "medium",
  "scheduledFor": "2025-01-15T08:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": "msg_003",
  "title": "Welcome Message",
  "content": "Welcome to our hostel! Here are the house rules...",
  "recipientType": "all-residents",
  "recipientCount": 150,
  "priority": "medium",
  "status": "scheduled",
  "createdAt": "2025-01-11T10:00:00Z",
  "updatedAt": "2025-01-11T10:00:00Z",
  "scheduledFor": "2025-01-15T08:00:00Z",
  "readCount": 0,
  "failedCount": 0
}
```

---

### 4. Update Broadcast Message
**Endpoint:** `PUT /broadcasts/:messageId`

**Request Body (all fields optional):**
```json
{
  "title": "Updated Announcement",
  "content": "Updated message content",
  "priority": "urgent"
}
```

**Response (200 OK):**
```json
{
  "id": "msg_001",
  "title": "Updated Announcement",
  "content": "Updated message content",
  "recipientType": "all-residents",
  "recipientCount": 150,
  "priority": "urgent",
  "status": "draft",
  "createdAt": "2025-01-09T10:00:00Z",
  "updatedAt": "2025-01-11T11:30:00Z",
  "readCount": 132,
  "failedCount": 0
}
```

---

### 5. Delete Broadcast Message
**Endpoint:** `DELETE /broadcasts/:messageId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Analytics Endpoints

### 1. Get Dashboard Analytics
**Endpoint:** `GET /analytics/dashboard`

**Query Parameters:**
```
startDate=2025-01-01    # ISO date format (optional, defaults to 30 days ago)
endDate=2025-01-11      # ISO date format (optional, defaults to today)
```

**Response (200 OK):**
```json
{
  "bookingStats": {
    "total": 45,
    "pendingPayment": 8,
    "pendingApproval": 5,
    "approved": 32,
    "totalRevenue": 13500,
    "averageBookingValue": 300
  },
  "genderDistribution": [
    {
      "gender": "Male",
      "count": 24,
      "percentage": 53.33
    },
    {
      "gender": "Female",
      "count": 21,
      "percentage": 46.67
    }
  ],
  "statusBreakdown": [
    {
      "status": "Approved",
      "count": 32,
      "percentage": 71.11
    },
    {
      "status": "Pending Payment",
      "count": 8,
      "percentage": 17.78
    },
    {
      "status": "Pending Approval",
      "count": 5,
      "percentage": 11.11
    }
  ],
  "revenueByHostel": [
    {
      "hostelName": "Sunrise Hostel",
      "revenue": 6000,
      "bookings": 20,
      "occupancyRate": 20
    },
    {
      "hostelName": "Moonlight Hostel",
      "revenue": 4500,
      "bookings": 15,
      "occupancyRate": 15
    }
  ],
  "monthlyRevenue": [
    {
      "month": "Nov 2024",
      "revenue": 3000,
      "bookings": 10
    },
    {
      "month": "Dec 2024",
      "revenue": 7500,
      "bookings": 25
    },
    {
      "month": "Jan 2025",
      "revenue": 3000,
      "bookings": 10
    }
  ],
  "paymentStatus": {
    "paid": 32,
    "pending": 13,
    "totalExpected": 13500,
    "collectionRate": 74.07
  },
  "lastUpdated": "2025-01-11T10:30:00Z"
}
```

---

## User Profile Endpoints

### 1. Update User Profile
**Endpoint:** `PUT /user/updateProfile`

**Request Body (FormData with file upload):**
```
- firstName: string (optional)
- lastName: string (optional)
- email: string (optional)
- phone: string (optional)
- avatar: File (optional)
```

**Response (200 OK):**
```json
{
  "id": "admin_001",
  "firstName": "Jonathan",
  "lastName": "Smith",
  "email": "jonathan.smith@hostella.com",
  "phone": "+1987654321",
  "avatar": "https://example.com/avatars/admin_001.jpg"
}
```

---

### 2. Update Password
**Endpoint:** `POST /user/updatePassword`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Error Handling

### Standard Error Response Format
All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2025-01-11T10:30:00Z"
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for this action |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate email or hostel already assigned |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting & Performance

### Rate Limits
- **Authenticated Requests:** 1000 requests per hour
- **Login Attempts:** 5 attempts per 15 minutes per IP
- **File Uploads:** Max 10MB per file

### Response Headers
All responses include rate limit information:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1641902400
```

### Pagination Guidelines
- **Default Page Size:** 10 items
- **Max Page Size:** 100 items
- **Recommended Page Size:** 10-25 items for optimal performance

### Caching Recommendations
- Cache admin lists for 5 minutes
- Cache hostel lists for 30 minutes
- Cache analytics data for 1 hour
- Always allow manual refresh

---

## Implementation Notes for Frontend

### Token Management
1. Token received from login endpoint should be:
   - Stored in localStorage with key `auth-storage`
   - Automatically added to all subsequent requests in `Authorization` header
   - Cleared on logout
   - Refreshed on session restoration

### Error Handling Strategy
1. Display user-friendly error messages via toast notifications
2. Log detailed errors to console for debugging
3. Redirect to login on 401 Unauthorized
4. Show retry button on network errors

### Data Synchronization
1. Use Zustand stores to manage state
2. Fetch data on component mount
3. Implement refresh buttons for manual updates
4. Show loading skeletons during data fetching

### Pagination
1. Always include `page` and `pageSize` query parameters
2. Calculate total pages as: `Math.ceil(total / pageSize)`
3. Disable "next" button when on last page
4. Reset to page 1 when filters change

---

## Contact & Support

For questions about API integration, please contact the backend development team at `backend@hostella.com`.
