

## Plan: Remove OAuth Buttons and Fix Email Flow

### Problem
1. Google and Apple OAuth buttons need to be removed
2. Email confirmation via Mailjet is showing "failed to send email"

### Code Changes (Auth.tsx)

**Remove the following sections (lines 200-258):**
- The warning notice banner about email issues
- The Google OAuth button
- The Apple OAuth button
- The "Or continue with email" divider

**Remove unused import:**
- Remove `AlertTriangle` from lucide-react imports (line 7)
- Remove `supabase` import (line 13) if no longer used elsewhere in the file

### Email Delivery Fix

The "failed to send email" error is a **Supabase SMTP configuration issue**, not a code issue. The most common cause is that the **sender email address is not verified** in Mailjet. Here's what needs to be checked:

1. **Sender email verification** -- In the Mailjet dashboard, go to "Sender addresses" and make sure the email used as the "Sender email" in Supabase Auth settings is verified/authenticated in Mailjet
2. **SMTP credentials** -- In Supabase Auth settings (Email provider section), verify:
   - Host: `in-v3.mailjet.com`
   - Port: `587`
   - Username: Your Mailjet API Key
   - Password: Your Mailjet Secret Key
   - Sender email: A verified sender address from Mailjet
3. **Delete the existing unconfirmed user** -- If you previously tried signing up with the same email, delete that user from the Supabase Users dashboard and try a fresh signup

### Summary of File Changes
- `src/pages/Auth.tsx`: Remove OAuth buttons, notice banner, divider, and unused imports

