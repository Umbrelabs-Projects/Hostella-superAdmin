# Hostella Super Admin - Backend Integration Ready

This is a production-ready Next.js 15 frontend application that integrates with your backend API. The application is fully tested with Jest and ready for backend endpoint implementation.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run Jest tests
npm test

# Run tests in watch mode
npm test --watch

# Generate coverage report
npm test --coverage

# Build for production
npm build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   ├── dashboard/                # Main application
│   │   ├── home/                 # Home/Dashboard page
│   │   ├── super-admin/          # Admin management
│   │   ├── broadcast/            # Message broadcasting
│   │   ├── components/           # Booking management
│   │   └── settings/             # User settings
├── components/                   # Reusable components
│   ├── ui/                       # UI components (Radix UI)
│   └── _reusable_components/    # Custom reusable components
├── lib/                         # Utilities
│   ├── api.ts                   # API fetch wrapper
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
├── stores/                      # Zustand state management
│   ├── useAuthStore.ts          # Authentication
│   ├── useAdminStore.ts         # Admin management
│   ├── useAnalyticsStore.ts     # Dashboard analytics
│   ├── useBroadcastStore.ts     # Messaging
│   └── useBookingStore.ts       # Bookings
└── types/                       # TypeScript types
    ├── admin.ts                 # Admin types
    ├── analytics.ts             # Analytics types
    ├── booking.ts               # Booking types
    ├── broadcast.ts             # Broadcast types
    └── common.ts                # Common types
```

## API Integration

The application uses a custom `apiFetch` utility in `src/lib/api.ts` that:
- Automatically injects Bearer token authentication
- Sets correct Content-Type headers
- Handles errors gracefully
- Provides TypeScript typing for responses

### Base URL Configuration

Set the API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://www.example.railway
```

## State Management (Zustand)

The app uses Zustand for state management. Each feature area has its own store:

- **useAuthStore** - User authentication, profile, password management
- **useAdminStore** - Admin user management (CRUD + filtering)
- **useAnalyticsStore** - Dashboard metrics and analytics
- **useBroadcastStore** - Message composition and history
- **useBookingStore** - Student booking management

All stores follow a consistent pattern with:
- State data
- Loading/error states
- Action methods for updates
- localStorage persistence (auth store)

## API Endpoints Required

The frontend expects these backend endpoints. See `API_INTEGRATION_DOCS.md` for full specifications:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /user/updatePassword` - Update password
- `PUT /user/updateProfile` - Update profile

### Admin Management
- `GET /admins` - List admins (with pagination/filtering)
- `POST /admins` - Create admin
- `PUT /admins/:id` - Update admin
- `DELETE /admins/:id` - Delete admin
- `GET /hostels` - List hostels

### Analytics
- `GET /analytics/dashboard` - Get dashboard metrics

### Bookings
- `GET /bookings` - List bookings (with pagination/filtering)
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Delete booking

### Broadcasts
- `GET /broadcasts` - List messages
- `POST /broadcasts` - Send message
- `POST /broadcasts/schedule` - Schedule message
- `PUT /broadcasts/:id` - Update message
- `DELETE /broadcasts/:id` - Delete message

## Testing

The project includes comprehensive Jest test suites for:

### Stores (Unit Tests)
- `src/stores/__tests__/useAuthStore.test.ts` - Auth store operations
- `src/stores/__tests__/useAdminStore.test.ts` - Admin store operations
- `src/stores/__tests__/useAnalyticsStore.test.ts` - Analytics store operations
- `src/stores/__tests__/useBroadcastStore.test.ts` - Broadcast store operations
- `src/stores/__tests__/useBookingStore.test.ts` - Booking store operations

### Utilities (Unit Tests)
- `src/lib/__tests__/api.test.ts` - API fetch wrapper
- `src/lib/__tests__/utils.test.ts` - Utility functions

### API Hooks (Integration Tests)
- `src/app/dashboard/components/__tests__/useBookingApi.test.ts`
- `src/app/dashboard/home/__tests__/useAnalyticsApi.test.ts`
- `src/app/dashboard/super-admin/__tests__/useAdminApi.test.ts`

**Current Test Status:**
- ✅ 70+ tests passing
- ✅ All stores tested
- ✅ API utilities tested
- ✅ Integration hooks tested

## Environment Variables

Required environment variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://www.example.railway

# Next.js (optional)
NODE_ENV=development
```

## Key Features Implemented

✅ **Authentication**
- Login/logout flow
- Session persistence with localStorage
- Automatic token injection in API calls
- Protected routes via middleware
- Profile and password management

✅ **Admin Management**
- CRUD operations for admin users
- Pagination and filtering
- Role and status filtering
- Hostel assignment tracking
- Dialog-based forms

✅ **Analytics Dashboard**
- Booking statistics
- Revenue metrics
- Occupancy tracking
- Gender distribution
- Status breakdown
- Monthly trends
- Configurable date ranges

✅ **Booking Management**
- Pagination and search
- Status-based filtering
- Approval workflow
- Payment tracking

✅ **Message Broadcasting**
- Message composition
- Scheduling support
- Status tracking
- Priority levels
- Recipient management

✅ **UI/UX**
- Responsive design with Tailwind CSS
- Radix UI components for accessibility
- Skeleton loaders for loading states
- Error handling and user feedback
- Toast notifications (Sonner)
- Data tables with filtering/sorting

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Write tests**: Create `.test.ts` or `.spec.ts` files
4. **Run tests**: `npm test`
5. **Build**: `npm run build`

## Error Handling

The application includes:
- Try-catch error handling in all API calls
- Store-based error state management
- User-friendly error messages
- Retry mechanisms in components
- Graceful fallbacks for failed requests

## Next Steps for Backend Team

1. **Review API specifications** in `API_INTEGRATION_DOCS.md`
2. **Implement endpoints** following exact request/response formats
3. **Set up CORS** to allow requests from frontend origin
4. **Configure authentication** with Bearer tokens
5. **Test endpoints** with provided request examples
6. **Coordinate** with frontend team on any specification clarifications

## Technologies Used

- **Framework**: Next.js 15.5.2 with App Router
- **State**: Zustand 5.0.9
- **UI**: React 19.1.0 + Radix UI components
- **Styling**: Tailwind CSS 4.0
- **Forms**: React Hook Form 7.68.0 + Zod 4.1.13
- **Testing**: Jest + React Testing Library
- **Charts**: Recharts 3.5.1
- **Notifications**: Sonner 2.0.7
- **Type Safety**: TypeScript 5.0

## Support

For API specification details, see: `API_INTEGRATION_DOCS.md`

For questions about implementation, refer to test files which demonstrate expected behavior.
