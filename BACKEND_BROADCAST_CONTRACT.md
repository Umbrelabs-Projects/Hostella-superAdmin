# Broadcast Backend API Contract

## Overview
This document defines the backend API contract for the broadcast messaging feature. The super admin can send broadcast messages to either all members or all admins.

---

## Data Model

### BroadcastMessage
```typescript
{
  id: string;                          // Unique message identifier
  title: string;                       // Message title (5-100 chars)
  content: string;                     // Message body (10-5000 chars)
  recipientType: "all-members" | "all-admins"; // Target audience
  recipientCount: number;              // Total recipients
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "sent" | "scheduled" | "failed";
  createdAt: string;                   // ISO 8601 timestamp
  updatedAt: string;                   // ISO 8601 timestamp
  sentAt?: string;                     // ISO 8601 timestamp (when sent)
  scheduledFor?: string;               // ISO 8601 timestamp (for scheduled messages)
  readCount?: number;                  // Number of recipients who read the message
  failedCount?: number;                // Number of failed deliveries
}
```

---

## API Endpoints

### 1. Fetch Broadcast Messages (Paginated)
```
GET /api/v1/broadcasts?page=1&pageSize=10&search=&status=all&priority=all
```

**Query Parameters:**
- `page` (number): Page number (1-indexed)
- `pageSize` (number): Results per page
- `search` (string, optional): Search by title or content
- `status` (string, optional): Filter by status ("all", "draft", "sent", "scheduled", "failed")
- `priority` (string, optional): Filter by priority ("all", "low", "medium", "high", "urgent")

**Response:**
```typescript
{
  messages: BroadcastMessage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}
```

**Alternative Response Format (Also Supported):**
```typescript
BroadcastMessage[]  // Simple array format
```

**Status Codes:**
- `200 OK`: Success
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized (non-super-admin)
- `500 Internal Server Error`: Server error

---

### 2. Send Broadcast Message (Immediate)
```
POST /api/v1/broadcasts
```

**Request Body:**
```typescript
{
  title: string;                       // 5-100 characters
  content: string;                     // 10-5000 characters
  recipientType: "all-members" | "all-admins";
  priority: "low" | "medium" | "high" | "urgent";
  selectedRecipients?: string[];       // Optional, not used (for future extension)
}
```

**Response:**
```typescript
BroadcastMessage                       // The created and sent message
```

**Backend Processing:**
1. Validate the request payload
2. Create a broadcast message record with `status: "sent"`
3. Determine recipients based on `recipientType`:
   - `"all-members"`: Fetch all users with role "member" or "resident"
   - `"all-admins"`: Fetch all users with role "super-admin" or "hostel-admin"
4. Set `recipientCount` to the total number of recipients
5. Send notifications to all recipients (email, push, in-app)
6. Set `sentAt` to current timestamp
7. Return the created message

**Status Codes:**
- `201 Created`: Message sent successfully
- `400 Bad Request`: Invalid payload
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized (non-super-admin)
- `500 Internal Server Error`: Server error

**Validation Rules:**
- `title`: Required, 5-100 characters
- `content`: Required, 10-5000 characters
- `recipientType`: Required, must be "all-members" or "all-admins"
- `priority`: Required, must be "low", "medium", "high", or "urgent"

---

### 3. Schedule Broadcast Message
```
POST /api/v1/broadcasts/schedule
```

**Request Body:**
```typescript
{
  title: string;                       // 5-100 characters
  content: string;                     // 10-5000 characters
  recipientType: "all-members" | "all-admins";
  priority: "low" | "medium" | "high" | "urgent";
  scheduledFor: string;                // ISO 8601 timestamp (future date)
  selectedRecipients?: string[];       // Optional, not used
}
```

**Response:**
```typescript
BroadcastMessage                       // The created scheduled message
```

**Backend Processing:**
1. Validate the request payload
2. Validate that `scheduledFor` is in the future
3. Create a broadcast message record with `status: "scheduled"`
4. Store the message with `scheduledFor` timestamp
5. Set up a background job or cron to send at scheduled time
6. Return the created message

**Status Codes:**
- `201 Created`: Message scheduled successfully
- `400 Bad Request`: Invalid payload or scheduledFor in the past
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized (non-super-admin)
- `500 Internal Server Error`: Server error

**Additional Validation:**
- `scheduledFor`: Required, must be a valid ISO 8601 timestamp in the future

---

### 4. Update Broadcast Message
```
PUT /api/v1/broadcasts/:id
```

**URL Parameters:**
- `id` (string): Message ID

**Request Body:**
```typescript
Partial<{
  title: string;
  content: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "sent" | "scheduled" | "failed";
  scheduledFor?: string;
}>
```

**Response:**
```typescript
BroadcastMessage                       // The updated message
```

**Backend Notes:**
- Only allow updates to messages with `status: "draft"` or `status: "scheduled"`
- Cannot update already sent messages (`status: "sent"`)
- Update `updatedAt` timestamp

**Status Codes:**
- `200 OK`: Message updated successfully
- `400 Bad Request`: Invalid payload or cannot update sent message
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Message not found
- `500 Internal Server Error`: Server error

---

### 5. Delete Broadcast Message
```
DELETE /api/v1/broadcasts/:id
```

**URL Parameters:**
- `id` (string): Message ID

**Response:**
```typescript
{
  success: true,
  message: "Message deleted successfully"
}
```

**Backend Notes:**
- Soft delete recommended (set deleted flag instead of hard delete)
- May only allow deletion of draft or failed messages
- Cannot delete sent messages (optional business rule)

**Status Codes:**
- `200 OK`: Message deleted successfully
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Message not found
- `500 Internal Server Error`: Server error

---

## Recipient Resolution

### For `recipientType: "all-members"`
**Query:** Get all users where:
```sql
role IN ('member', 'resident', 'student') 
AND status = 'active'
```

**Recipients should include:**
- All hostel members/residents
- Active accounts only
- Exclude suspended or inactive accounts

**⚠️ IMPORTANT:** If no members exist in the database yet, the backend should return a clear error:
```json
{
  "success": false,
  "message": "No active members found. Please ensure member accounts exist before sending broadcasts.",
  "statusCode": 400
}
```

---

### For `recipientType: "all-admins"`
**Query:** Get all users where:
```sql
role IN ('super-admin', 'hostel-admin') 
AND status = 'active'
```

**Recipients should include:**
- Super admins
- Hostel admins (both assigned and unassigned)
- Active accounts only
- Exclude suspended or inactive accounts

**Note:** Based on the admin management system, admin roles are:
- `"super-admin"` (lowercase with hyphen)
- `"hostel-admin"` (lowercase with hyphen)

**⚠️ IMPORTANT:** There should ALWAYS be at least one super-admin (the current user sending the broadcast). If the query returns 0 results, check:
1. Role name format in database (must be `"super-admin"` or `"hostel-admin"`, not `"SuperAdmin"` or `"Super Admin"`)
2. Status of admin accounts (must be `"active"`)

---

## Backend Implementation Guidance

### Step 1: Recipient Resolution Function
```javascript
async function resolveRecipients(recipientType) {
  let roleFilter = [];
  
  if (recipientType === 'all-members') {
    roleFilter = ['member', 'resident', 'student'];
  } else if (recipientType === 'all-admins') {
    roleFilter = ['super-admin', 'hostel-admin'];
  }
  
  const recipients = await User.findAll({
    where: {
      role: { [Op.in]: roleFilter },
      status: 'active'
    }
  });
  
  if (recipients.length === 0) {
    if (recipientType === 'all-members') {
      throw AppError.badRequest(
        'No active members found. Please ensure member accounts exist before sending broadcasts to members.'
      );
    } else {
      throw AppError.badRequest(
        'No active admins found. This should not happen. Please check admin account statuses.'
      );
    }
  }
  
  return recipients;
}
```

### Step 2: Database Role Values
Ensure your database uses these exact role values:
- **For Admins:** `"super-admin"`, `"hostel-admin"` (lowercase, hyphenated)
- **For Members:** `"member"`, `"resident"`, or `"student"` (lowercase)

### Step 3: Debugging "No recipients found"
If you're getting "No recipients found", check:

1. **Check actual role values in database:**
```sql
SELECT DISTINCT role FROM users;
```

2. **Check admin count:**
```sql
SELECT COUNT(*) FROM users 
WHERE role IN ('super-admin', 'hostel-admin') 
AND status = 'active';
```

3. **Check member count:**
```sql
SELECT COUNT(*) FROM users 
WHERE role IN ('member', 'resident', 'student') 
AND status = 'active';
```

4. **If roles are different (e.g., "admin" instead of "super-admin"):**
   - Update the recipient resolution logic to match your actual role values
   - OR update your database to use the standard role values

---

## Background Job: Scheduled Message Processing

The backend should implement a cron job or background worker to:

1. **Check for scheduled messages:**
   ```sql
   SELECT * FROM broadcasts 
   WHERE status = 'scheduled' 
   AND scheduledFor <= NOW()
   ```

2. **Process each message:**
   - Determine recipients based on `recipientType`
   - Send notifications to all recipients
   - Update message:
     - `status` = "sent"
     - `sentAt` = current timestamp
     - `recipientCount` = actual number of recipients

3. **Handle failures:**
   - If sending fails, set `status` = "failed"
   - Store error details
   - Increment `failedCount`

---

## Notification Delivery

When a broadcast message is sent (immediately or scheduled):

1. **Email Notification** (if enabled):
   - Subject: `[Priority] {title}`
   - Body: Message content with formatting
   - Include sender: "Hostella Admin Team"

2. **Push Notification** (if enabled):
   - Title: Message title
   - Body: First 100 chars of content
   - Priority based on message priority

3. **In-App Notification**:
   - Create a notification record for each recipient
   - Mark as unread initially
   - Track read status for analytics

---

## Analytics and Tracking

### Message Read Tracking
```
POST /api/v1/broadcasts/:id/read
```

**Purpose:** Mark message as read by current user

**Request Body:** (None required)

**Response:**
```typescript
{
  success: true
}
```

---

## Error Handling

All endpoints should return consistent error responses:

```typescript
{
  success: false,
  message: string;              // SHORT, user-friendly error message (50-100 chars max)
  statusCode: number;           // HTTP status code
  timestamp: string;            // ISO 8601 timestamp
  errors?: {                    // Validation errors (optional)
    field: string;
    message: string;
  }[];
}
```

### ⚠️ CRITICAL: Error Message Guidelines

**DO NOT send to frontend:**
- ❌ Stack traces
- ❌ Database error details
- ❌ Long Prisma validation errors
- ❌ Internal file paths
- ❌ Sensitive system information

**DO send to frontend:**
- ✅ Short, actionable error messages
- ✅ What went wrong in plain language
- ✅ What the user should do to fix it

**Example Error Handling:**

```javascript
// ❌ BAD - Sending raw Prisma error to frontend
catch (error) {
  return res.status(500).json({
    success: false,
    message: error.message,  // Contains Prisma internals, stack trace, etc.
    statusCode: 500,
    stack: error.stack
  });
}

// ✅ GOOD - Clean error for frontend, details in console
catch (error) {
  // Log full error details to console for debugging
  console.error('Broadcast creation failed:', {
    error: error.message,
    stack: error.stack,
    data: sanitizedData  // Don't log sensitive data
  });
  
  // Return clean, user-friendly error to frontend
  return res.status(500).json({
    success: false,
    message: 'Failed to create broadcast message. Please try again.',
    statusCode: 500,
    timestamp: new Date().toISOString()
  });
}
```

### Common Error Messages

**Validation Errors (400):**
- `"Please provide a message title between 5-100 characters"`
- `"Message content must be between 10-5000 characters"`
- `"Please select recipients (All Members or All Admins)"`
- `"Scheduled time must be in the future"`

**No Recipients Found (400):**
- `"No active members found to send the message to"`
- `"No active admins found to send the message to"`

**Authentication/Authorization (401/403):**
- `"Please log in to send broadcast messages"`
- `"Only super admins can send broadcast messages"`

**Not Found (404):**
- `"Broadcast message not found"`

**Server Errors (500):**
- `"Failed to send broadcast message. Please try again."`
- `"Failed to schedule message. Please try again."`
- `"Failed to fetch broadcast messages. Please try again."`

---

## Security Considerations

1. **Authentication Required:** All broadcast endpoints require valid JWT token
2. **Super Admin Only:** Only users with `role: "super-admin"` can create/manage broadcasts
3. **Rate Limiting:** Implement rate limits to prevent spam (e.g., max 10 broadcasts per hour)
4. **Content Validation:** Sanitize HTML/scripts in message content
5. **Recipient Privacy:** Don't expose full recipient list in API responses

---

## Example Flows

### Example 1: Send Immediate Message to All Members
```typescript
// Frontend sends:
POST /api/v1/broadcasts
{
  "title": "Maintenance Notice",
  "content": "Water supply will be interrupted tomorrow from 9 AM to 12 PM.",
  "recipientType": "all-members",
  "priority": "high"
}

// Backend responds:
{
  "id": "msg_abc123",
  "title": "Maintenance Notice",
  "content": "Water supply will be interrupted tomorrow from 9 AM to 12 PM.",
  "recipientType": "all-members",
  "recipientCount": 245,
  "priority": "high",
  "status": "sent",
  "sentAt": "2025-12-17T10:30:00Z",
  "createdAt": "2025-12-17T10:30:00Z",
  "updatedAt": "2025-12-17T10:30:00Z",
  "readCount": 0,
  "failedCount": 0
}
```

### Example 2: Schedule Message to All Admins
```typescript
// Frontend sends:
POST /api/v1/broadcasts/schedule
{
  "title": "Staff Meeting Reminder",
  "content": "Monthly admin meeting scheduled for Friday at 3 PM.",
  "recipientType": "all-admins",
  "priority": "medium",
  "scheduledFor": "2025-12-20T14:00:00Z"
}

// Backend responds:
{
  "id": "msg_def456",
  "title": "Staff Meeting Reminder",
  "content": "Monthly admin meeting scheduled for Friday at 3 PM.",
  "recipientType": "all-admins",
  "recipientCount": 0,          // Not determined yet
  "priority": "medium",
  "status": "scheduled",
  "scheduledFor": "2025-12-20T14:00:00Z",
  "createdAt": "2025-12-17T10:35:00Z",
  "updatedAt": "2025-12-17T10:35:00Z"
}
```

---

## Database Schema Suggestion

```sql
CREATE TABLE broadcasts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  recipient_type ENUM('all-members', 'all-admins') NOT NULL,
  recipient_count INT DEFAULT 0,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL,
  status ENUM('draft', 'sent', 'scheduled', 'failed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sent_at TIMESTAMP NULL,
  scheduled_for TIMESTAMP NULL,
  read_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  created_by VARCHAR(36),
  deleted_at TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_scheduled (scheduled_for),
  INDEX idx_recipient_type (recipient_type)
);

CREATE TABLE broadcast_recipients (
  id VARCHAR(36) PRIMARY KEY,
  broadcast_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  read_at TIMESTAMP NULL,
  failed BOOLEAN DEFAULT FALSE,
  error_message TEXT NULL,
  FOREIGN KEY (broadcast_id) REFERENCES broadcasts(id) ON DELETE CASCADE,
  INDEX idx_broadcast (broadcast_id),
  INDEX idx_user (user_id)
);
```

---

## Summary

The backend should:
1. ✅ Accept `recipientType` as either "all-members" or "all-admins"
2. ✅ Automatically determine recipients based on recipientType
3. ✅ Support immediate sending and scheduling
4. ✅ Track delivery status and read counts
5. ✅ Return paginated message lists with filters
6. ✅ Implement proper authentication and authorization
7. ✅ Handle scheduled messages via background jobs
