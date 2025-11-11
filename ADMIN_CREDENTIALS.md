# ArenaX Admin Credentials

## Default Admin Accounts

The following 10 admin accounts have been created for managing the ArenaX event:

| # | Email | Password | Name |
|---|-------|----------|------|
| 1 | admin1@arenax.com | Admin123! | Admin One |
| 2 | admin2@arenax.com | Admin123! | Admin Two |
| 3 | admin3@arenax.com | Admin123! | Admin Three |
| 4 | admin4@arenax.com | Admin123! | Admin Four |
| 5 | admin5@arenax.com | Admin123! | Admin Five |
| 6 | admin6@arenax.com | Admin123! | Admin Six |
| 7 | admin7@arenax.com | Admin123! | Admin Seven |
| 8 | admin8@arenax.com | Admin123! | Admin Eight |
| 9 | admin9@arenax.com | Admin123! | Admin Nine |
| 10 | admin10@arenax.com | Admin123! | Admin Ten |

## ⚠️ Security Notes

**IMPORTANT:**
- **Change passwords immediately** after first login
- These are default credentials for initial setup only
- Do not share these credentials publicly
- Each admin should have their own unique password
- Consider implementing password reset functionality for production

## How to Create Admins

### Option 1: Using the Script (Recommended)

Make sure the backend server is running, then:

```bash
npm run create-admins
```

### Option 2: Manual Creation via API

You can create admins manually using the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arenax.com",
    "password": "YourSecurePassword123!",
    "name": "Admin Name"
  }'
```

Or use Postman/Thunder Client:
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "email": "admin@arenax.com",
  "password": "YourSecurePassword123!",
  "name": "Admin Name"
}
```

## Login

1. Navigate to: http://localhost:3000/admin/login
2. Enter email and password from the table above
3. Click "Login"
4. You'll be redirected to the Admin Dashboard

## Admin Permissions

All admins have full access to:
- ✅ Add, edit, and delete players
- ✅ Assign players to games
- ✅ Mark game results (Win/Lose)
- ✅ View and manage leaderboard
- ✅ Reset leaderboard
- ✅ Initialize games
- ✅ View all player profiles and statistics

## Password Requirements

When changing passwords, ensure they meet security standards:
- Minimum 8 characters
- Mix of uppercase and lowercase letters
- At least one number
- At least one special character (recommended)

## Troubleshooting

### "Admin already exists" Error
- The admin account with that email already exists
- Use a different email or login with existing credentials

### "Backend server is not running" Error
- Start the backend server first: `cd backend && npm run dev`
- Check if the API URL is correct in the script

### Cannot Login
- Verify the email and password are correct
- Check if the backend server is running
- Ensure MongoDB is connected and running

## Next Steps

After creating admins:
1. ✅ Login with one of the admin accounts
2. ✅ Initialize games (Game Control tab → Initialize Games)
3. ✅ Start adding players
4. ✅ Begin managing the event!

---

**Remember:** Keep these credentials secure and change passwords regularly!

