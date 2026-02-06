# Google OAuth Frontend Integration Guide

## Setup Overview

The Google OAuth flow works through a popup window that:
1. Opens the Google authentication dialog
2. Returns a JWT token to the parent window
3. Closes automatically after authentication

## Frontend Components Added

### 1. **Login.jsx** (Updated)
- Added "Sign in with Google" button
- Opens OAuth popup window
- Listens for token message from popup
- Stores JWT token in localStorage
- Redirects to home on success

### 2. **GoogleAuthCallback.jsx** (New)
- Handles the OAuth callback from backend
- Receives token from URL parameters
- Posts token back to parent window
- Closes popup automatically

## How It Works

```
User clicks "Sign in with Google"
         ↓
Frontend opens popup to /api/auth/google
         ↓
Google displays consent screen
         ↓
User authorizes
         ↓
Backend receives callback
         ↓
Backend creates/finds user in DB
         ↓
Backend generates JWT token
         ↓
Backend redirects to frontend with token in URL
         ↓
Frontend receives token in popup
         ↓
Popup posts token to parent window (Login page)
         ↓
Login page receives token
         ↓
Token stored in localStorage
         ↓
Popup closes
         ↓
Redirect to /home
```

## Key Features

### Secure Token Handling
- JWT token generated server-side
- Token passed via redirect (secure in popup)
- Token stored in localStorage (can be moved to sessionStorage)
- Token sent in Authorization header for API calls

### Error Handling
- Popup blocked detection
- Network error handling
- OAuth failure handling
- Graceful error messages

### Loading States
- Google login button shows loading state
- Other buttons disabled during OAuth flow
- User sees clear feedback

## Testing

### Manual Testing Steps

1. **Start both servers**
   ```bash
   # Terminal 1: Backend
   cd NOTY-Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd gnfront
   npm run dev
   ```

2. **Navigate to Login**
   - Open browser to `http://localhost:5173/login`

3. **Click "Sign in with Google"**
   - Popup should open
   - Google consent screen appears
   - Sign in with test Google account

4. **After authorization**
   - Token should appear in localStorage
   - You should be redirected to home page
   - You should see the app loaded

5. **Verify token**
   - Open browser DevTools → Console
   - Run: `localStorage.getItem('authToken')`
   - Should see JWT token

### Testing with cURL

```bash
# Step 1: Get authorization code (this requires manual browser interaction)
# Visit: http://localhost:5000/api/auth/google

# Step 2: Check if token is working
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Troubleshooting

### Issue: "Please enable popups to use Google login"
**Cause**: Browser blocked the popup
**Solution**: 
- Check browser popup blocker settings
- Add `localhost:5173` to allowed list
- Try a different browser

### Issue: Blank popup appears then closes
**Cause**: Google OAuth credentials not configured
**Solution**:
- Check `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Verify credentials are correct in Google Cloud Console
- Restart backend server

### Issue: "Invalid OAuth redirect URI"
**Cause**: Redirect URI doesn't match Google Console settings
**Solution**:
- Go to Google Cloud Console → Credentials
- Edit OAuth 2.0 Client ID
- Add: `http://localhost:5000/api/auth/google/callback`
- Save and try again

### Issue: Cannot read property 'emails'
**Cause**: Google profile doesn't have email scope
**Solution**:
- In `/src/config/passport.js`, ensure `scope: ['profile', 'email']`
- Delete app authorization from Google account settings
- Try login again

### Issue: "Unexpected end of JSON input" error
**Cause**: Backend returning HTML instead of JSON
**Solution**:
- Check backend console for errors
- Verify Prisma migrations ran
- Restart backend server

## Browser Developer Tools Debugging

### Check Token
```javascript
// In browser console
localStorage.getItem('authToken')
// or
sessionStorage.getItem('authToken')
```

### Decode Token
```javascript
// In browser console (requires jwt-decode library or manual parsing)
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log(payload);
```

### Check Network Requests
1. Open DevTools → Network tab
2. Click "Sign in with Google"
3. Look for requests to `localhost:5000/api/auth/google`
4. Inspect response headers and body

### Monitor PopUp Communication
```javascript
// In browser console on Login page
window.addEventListener('message', (event) => {
  console.log('Message from popup:', event.data);
});
```

## Advanced Configuration

### Change Token Expiration
Edit `src/routes/auth.js` line in Google callback:
```javascript
const token = jwt.sign(
  { userId: req.user.id },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }  // Change from '7d' to your preference
);
```

### Change Popup Size
Edit `src/pages/Login.jsx`:
```javascript
const width = 600;  // Change width
const height = 700; // Change height
```

### Store Token in SessionStorage Instead
Edit `src/pages/Login.jsx`:
```javascript
// Instead of localStorage
sessionStorage.setItem('authToken', event.data.token);
```

### Add Refresh Token Functionality
1. Generate refresh token on backend (similar to JWT)
2. Store in database associated with user
3. Implement token refresh endpoint
4. Refresh token before it expires

## Production Checklist

- [ ] Update Google OAuth credentials to production URLs
- [ ] Change `CLIENT_URL` to production domain
- [ ] Use HTTPS for all URLs (including redirect URI)
- [ ] Set strong `JWT_SECRET`
- [ ] Enable CORS for production domain only
- [ ] Test complete flow in staging
- [ ] Monitor token expiration and refresh
- [ ] Set up error logging/monitoring
- [ ] Test with real Google account (not test account)

## API Integration

### Using JWT Token in API Calls

```javascript
// In API utility
export const authAPI = {
  login: async (email, password) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/notes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
```

## File Structure Reference

```
gnfront/
├── src/
│   ├── pages/
│   │   ├── Login.jsx (Updated with Google OAuth)
│   │   ├── GoogleAuthCallback.jsx (New - handles callback)
│   │   └── ...
│   ├── utils/
│   │   ├── api.js (Update to include token in headers)
│   │   └── ...
│   └── ...
└── ...

NOTY-Backend/
├── src/
│   ├── routes/
│   │   ├── auth.js (Updated with Google OAuth endpoints)
│   │   └── ...
│   ├── config/
│   │   ├── passport.js (Google strategy configuration)
│   │   └── ...
│   └── ...
├── .env (Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
└── ...
```

## Summary

You now have a complete Google OAuth 2.0 implementation that:
✅ Allows users to login with Google
✅ Generates secure JWT tokens
✅ Stores tokens in frontend storage
✅ Handles errors gracefully
✅ Works with existing email/password login
✅ Integrates with your Prisma database
