# Quick Reference Guide - Hostella Super Admin API Integration

## 🚀 For Backend Developers

### Start Here
1. Read: `API_INTEGRATION_DOCS.md` - Complete endpoint specifications
2. Implement: All endpoints exactly as specified
3. Test: Each endpoint with provided examples
4. Integrate: Test with frontend

### Key Requirements
- ✅ Base URL: `https://www.example.railway`
- ✅ Authentication: Bearer token in Authorization header
- ✅ Response Format: JSON (see examples in docs)
- ✅ Status Codes: 200 (success), 400 (error), 401 (auth), 404 (not found)
- ✅ Pagination: Include total count with results

### Quick Endpoint Checklist
```
Authentication:
  [ ] POST /auth/login → Returns user + token
  [ ] GET /auth/me → Returns current user

Admins:
  [ ] GET /admins → List with pagination/filtering
  [ ] POST /admins → Create admin
  [ ] PUT /admins/:id → Update admin
  [ ] DELETE /admins/:id → Delete admin
  [ ] GET /hostels → List hostels

Bookings:
  [ ] GET /bookings → List with pagination/filtering
  [ ] PUT /bookings/:id → Update status
  [ ] DELETE /bookings/:id → Delete booking

Broadcasts:
  [ ] GET /broadcasts → List messages
  [ ] POST /broadcasts → Send immediately
  [ ] POST /broadcasts/schedule → Schedule for later
  [ ] PUT /broadcasts/:id → Update message
  [ ] DELETE /broadcasts/:id → Delete message

Analytics:
  [ ] GET /analytics/dashboard → Dashboard stats

User Profile:
  [ ] PUT /user/updateProfile → Update profile
  [ ] POST /user/updatePassword → Change password
```

### Response Format Examples
```typescript
// Successful pagination response
{
  "admins": [...],
  "total": 45,
  "page": 1,
  "pageSize": 10
}

// Error response
{
  "success": false,
  "message": "Detailed error message",
  "statusCode": 400
}

// Single item response
{
  "id": "...",
  "firstName": "...",
  ...
}
```

---

## 🎨 For Frontend Developers

### Architecture Summary
```
Component (Page)
  ├─ useXxxStore() ← Zustand store
  │   └─ state: data, loading, error
  │   └─ actions: setData(), setLoading(), etc.
  │
  └─ useXxxApi() ← API hook
      ├─ fetchData()
      ├─ createItem()
      ├─ updateItem()
      └─ deleteItem()
          ↓
          apiFetch() ← Utility
              ├─ Adds Bearer token
              ├─ Handles errors
              └─ Types response
```

### How to Add a New Feature

1. **Create/Update Store**
   ```typescript
   // src/stores/useXxxStore.ts
   export const useXxxStore = create<XxxState>(set => ({
     items: [],
     loading: false,
     error: null,
     setItems: (items) => set({ items }),
   }));
   ```

2. **Create API Hook**
   ```typescript
   // src/app/xxx/_hooks/useXxxApi.ts
   export function useXxxApi() {
     const { setItems, setLoading, setError } = useXxxStore();
     
     const fetchItems = async () => {
       setLoading(true);
       try {
         const data = await apiFetch<Item[]>("/endpoint");
         setItems(data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     
     return { fetchItems };
   }
   ```

3. **Use in Component**
   ```typescript
   export default function Page() {
     const { items, loading, error } = useXxxStore();
     const { fetchItems } = useXxxApi();
     
     useEffect(() => {
       void fetchItems();
     }, [fetchItems]);
     
     if (loading) return <SkeletonLoader />;
     if (error) return <ErrorAlert message={error} />;
     return <ItemsList items={items} />;
   }
   ```

### Common Patterns

**Pagination:**
```typescript
const params = new URLSearchParams({
  page: page.toString(),
  pageSize: pageSize.toString(),
});
await apiFetch(`/endpoint?${params}`);
```

**Filtering:**
```typescript
if (search) params.append("search", search);
if (status !== "all") params.append("status", status);
```

**Error Handling:**
```typescript
try {
  // API call
} catch (error) {
  const message = error instanceof Error ? error.message : "Failed";
  setError(message);
  toast.error(message);
}
```

---

## 🔧 Common Tasks

### Change API Base URL
Edit `.env.local`:
```
API_URL=https://new-url.com
```

### Test API Endpoint
```typescript
// In browser console
const response = await fetch('https://api.url/endpoint', {
  headers: { 'Authorization': 'Bearer ' + token }
});
console.log(await response.json());
```

### Debug Store State
```typescript
// In browser console
useAdminStore.getState()
useAnalyticsStore.getState()
useAuthStore.getState()
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Click on request
5. Check URL, headers, response

---

## 📊 Data Flow Quick View

**Fetching Data:**
```
Component mounts
  ↓
useEffect calls fetchData()
  ↓
setLoading(true) → Shows skeleton
  ↓
apiFetch('/endpoint')
  ↓
Store updated with data
  ↓
setLoading(false) → Shows actual data
```

**Creating/Updating:**
```
User submits form
  ↓
createItem(data) from API hook
  ↓
setLoading(true)
  ↓
apiFetch('/endpoint', POST/PUT, data)
  ↓
addItem() or updateItem() in store
  ↓
toast.success() & setLoading(false)
  ↓
Dialog closes, list updates
```

**Error Handling:**
```
Any API call fails
  ↓
Error caught in try-catch
  ↓
setError(message) → Updates store
  ↓
Component shows error alert
  ↓
User clicks Retry
  ↓
API call retried
```

---

## 🎯 Testing Checklist

- [ ] Can login with credentials
- [ ] Can logout
- [ ] Session persists on refresh
- [ ] Dashboard loads with skeleton loaders
- [ ] Data appears after loading
- [ ] Pagination works
- [ ] Filters work
- [ ] Search works
- [ ] Can create item
- [ ] Can update item
- [ ] Can delete item
- [ ] Error handling works
- [ ] Skeleton loaders appear

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | API URL config |
| `src/lib/api.ts` | API utility (token, errors) |
| `src/middleware.ts` | Route protection |
| `src/stores/useXxxStore.ts` | State management |
| `src/app/xxx/_hooks/useXxxApi.ts` | API calls |
| `API_INTEGRATION_DOCS.md` | Full API specs |
| `FRONTEND_IMPLEMENTATION_GUIDE.md` | Architecture guide |

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | No token sent | Check localStorage has token, setAuthToken called |
| Cannot read property 'map' | Data is undefined | Use conditional: `{items && items.map(...)}` |
| Infinite loading | API not responding | Check backend running, network tab |
| Skeleton shows forever | Wrong response format | Check response matches spec |
| State not updating | Store setter not called | Verify API hook calls setter |

---

## 📞 Quick Links

- **API Docs:** `API_INTEGRATION_DOCS.md`
- **Implementation Guide:** `FRONTEND_IMPLEMENTATION_GUIDE.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Complete Guide:** `COMPLETE_README.md`

---

## ✅ Pre-Launch Checklist

### Backend Team
- [ ] All endpoints implemented
- [ ] Response format matches spec
- [ ] Error handling configured
- [ ] CORS headers set
- [ ] Token validation working
- [ ] Database ready
- [ ] Tested with frontend

### Frontend Team
- [ ] All pages integrated with API
- [ ] Skeleton loaders working
- [ ] Error handling tested
- [ ] Pagination working
- [ ] Filters working
- [ ] Mobile responsive
- [ ] No console errors

### QA Team
- [ ] Full workflow testing done
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Accessibility checked
- [ ] Mobile tested
- [ ] Network errors handled
- [ ] Load testing done

### DevOps Team
- [ ] Environment configured
- [ ] API URL set
- [ ] CORS configured
- [ ] HTTPS enabled
- [ ] Monitoring set up
- [ ] Logging configured
- [ ] Backups ready

---

## 🚀 Launch Steps

1. Backend: Deploy API to production URL
2. Frontend: Update API URL in environment
3. Frontend: Deploy to production
4. QA: Full end-to-end testing
5. Monitor: Check logs and metrics
6. Support: Ready for issues

---

## 📱 Quick Reference Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run start        # Start production server
```

### API Testing
```bash
# Test login
curl -X POST https://api.url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Test with token
curl https://api.url/endpoint \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 💡 Pro Tips

1. **Use DevTools Network Tab** - See all API calls and responses
2. **Console Logging** - Check store state: `useAdminStore.getState()`
3. **Throttle Network** - DevTools → Network tab → Slow 3G (test slow networks)
4. **Mobile Testing** - Use Chrome DevTools device emulation
5. **Postman** - Test API endpoints before frontend integration
6. **TypeScript Errors** - Run `npm run build` to catch type issues
7. **Error Messages** - Shown in toast notifications and console
8. **Skeleton Loaders** - Appearance means loading is working

---

## 📞 Support

**For questions about:**
- **API Specs** → See `API_INTEGRATION_DOCS.md`
- **Frontend Architecture** → See `FRONTEND_IMPLEMENTATION_GUIDE.md`
- **Implementation Status** → See `IMPLEMENTATION_SUMMARY.md`
- **General Overview** → See `COMPLETE_README.md`

---

**Last Updated:** December 11, 2025  
**Status:** ✅ Ready for Integration

