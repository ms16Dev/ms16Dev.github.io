# Error Pages Documentation

This application has comprehensive error handling with dedicated error pages.

## Error Pages

### 1. **404 Not Found** (`/pages/NotFound.jsx`)
**When it triggers:**
- User navigates to a route that doesn't exist (e.g., `/random-page`)
- Clicking on a broken link
- Manual URL entry with invalid path

**Features:**
- Beautiful gradient background
- Animated 404 text
- "Go Back" button (uses browser history)
- "Go Home" button (redirects to `/`)
- Decorative bouncing dots animation

**Testing:**
- Navigate to `http://localhost:5173/does-not-exist`
- Try any invalid URL path

---

### 2. **500 Server Error** (`/pages/ServerError.jsx`)
**When it triggers:**
- Available at `/error` route for manual navigation
- Can be triggered by uncommenting redirect in `api/client.js` (line 44) for automatic 500 error handling
- Backend returns 500+ status codes (currently logged, not redirected automatically)

**Features:**
- Red/orange gradient background (error theme)  
- Warning icon with glow effect
- "Refresh Page" button
- "Go Home" button
- Error code display

**Testing:**
- Navigate to `http://localhost:5173/error`
- Uncomment line 44 in `api/client.js` to enable automatic redirect on 500 errors

---

### 3. **Error Boundary** (`/components/ErrorBoundary.jsx`)
**When it triggers:**
- React component throws an uncaught error during rendering
- JavaScript error in component lifecycle
- Errors in event handlers (if propagated up)

**Features:**
- Catches all React errors in component tree
- Shows error message for debugging
- "Go Home" button to recover  
- Logs errors to console

**Testing:**
- Create a component that throws an error
- Example: Add `throw new Error('Test error')` to any component

---

## Error Handling Flow

```
User Action
    ↓
┌─────────────────────────────────────┐
│  1. Invalid Route?                  │ → NotFound page (404)
│  2. React Component Error?          │ → ErrorBoundary fallback
│  3. API Error (401)?                │ → Redirect to /login
│  4. API Error (500+)?               │ → Log (optional: redirect to /error)
│  5. Network Error?                  │ → Log + Toast (handled in components)
└─────────────────────────────────────┘
```

## Configuration

### Automatic 500 Error Redirect
To enable automatic redirection to `/error` page on server errors:

**File:** `frontend/src/api/client.js`
```javascript
// Line 44 - Uncomment this line:
window.location.href = '/error';
```

**Note:** By default, 500 errors are logged but not redirected, allowing components to handle them gracefully with toast messages.

### Custom Error Messages
Each error page can be customized in its respective component file:
- `NotFound.jsx` - Change messaging for 404
- `ServerError.jsx` - Customize 500 error display
- `ErrorBoundary.jsx` - Modify fallback UI

## Best Practices

1. **404 Errors**: Let the catch-all route handle them (already configured)
2. **500 Errors**: Use toast notifications in components for better UX
3. **React Errors**: ErrorBoundary will catch them automatically
4. **Network Errors**: Handle in individual components with try/catch and show inline errors

## Routes Summary
- `/login` - Login page
- `/error` - Server error page (500)
- `/*` (any invalid route) - Not found page (404)
- All other routes wrapped in ErrorBoundary for React errors
