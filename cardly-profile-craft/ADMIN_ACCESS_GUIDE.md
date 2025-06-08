# Admin Access Guide

## 🔐 Admin Credentials Setup

### Your Admin Email
**Email:** `sarvaxgupta@gmail.com`
**Status:** ✅ Added to admin list

### How to Access Admin Features

1. **Sign Up/Sign In:**
   - Go to your business card platform
   - Click "Sign Up" if you haven't created an account yet
   - Use email: `sarvaxgupta@gmail.com`
   - Create any password you prefer
   - OR use Google/Microsoft sign-in if available

2. **Admin Features Access:**
   - Once logged in with `sarvaxgupta@gmail.com`, you'll automatically have admin privileges
   - You'll see an "Admin" badge next to the title
   - Additional admin-only tabs will be visible:
     - AI Test (admin only)
     - Share Test (admin only)

### Current Admin Emails in System:
- `admin@cardly.com`
- `dev@cardly.com` 
- `test@cardly.com`
- `sarvaxgupta@gmail.com` ⭐ **YOUR EMAIL**

## 🚀 Quick Start Steps

### Step 1: Create Account
```
1. Open your business card platform
2. Click "Sign Up" 
3. Enter: sarvaxgupta@gmail.com
4. Create a secure password
5. Verify email if required
```

### Step 2: Verify Admin Access
```
1. After login, check for "Admin" badge in header
2. Look for additional tabs (AI Test, Share Test)
3. These features are restricted to admin users only
```

### Step 3: Admin Features Available
- **AI Test Tab:** Test AI generation features
- **Share Test Tab:** Test sharing functionality
- **Full Access:** All regular features plus admin tools

## 🔧 Development Mode (Alternative)

If Supabase is not available, the system has a development mode:

### Mock Admin User (Dev Mode Only)
- **Email:** `dev@example.com`
- **ID:** `dev-user-[timestamp]`
- **Status:** Automatically created in development mode
- **Admin:** Yes (all dev users are admins)

## 🛡️ Security Notes

1. **Email-Based Admin:** Admin status is determined by email address
2. **Secure Storage:** Admin emails are stored in code, not database
3. **Role Metadata:** System also checks for role metadata in user profile
4. **Development Safety:** Mock users only work in development mode

## 📞 Support

If you have issues accessing admin features:

1. **Check Email:** Ensure you're using exactly `sarvaxgupta@gmail.com`
2. **Clear Cache:** Try clearing browser cache and cookies
3. **Refresh:** Reload the page after login
4. **Console Check:** Open browser dev tools to check for any errors

## 🎯 Admin Capabilities

Once you have admin access, you can:

- ✅ Access AI Test features
- ✅ Access Share Test functionality  
- ✅ See admin badge in interface
- ✅ Test all premium features
- ✅ Full platform access
- ✅ Debug and development tools

## 🔄 Adding More Admins

To add more admin users, edit the file:
`src/lib/adminUtils.ts`

Add emails to the `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = [
  'admin@cardly.com',
  'dev@cardly.com',
  'test@cardly.com',
  'sarvaxgupta@gmail.com',
  'new-admin@example.com', // Add new admin emails here
];
```

---

**Your admin access is now configured! 🎉**

Use email `sarvaxgupta@gmail.com` to sign up/sign in and you'll have full admin privileges on your VIP business card platform.
