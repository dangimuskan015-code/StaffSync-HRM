# Publish StaffSync (real links)

## GitHub repository
1. Sign in to GitHub and create a repository named `staffsync-hrm`.
2. From this project folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial StaffSync HRM project"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/staffsync-hrm.git
   git push -u origin main
   ```
3. Your repository URL will be `https://github.com/YOUR_USERNAME/staffsync-hrm`.

## Demo deployment
1. Create a MongoDB Atlas database and copy its connection string.
2. Deploy `server` on Render (Root Directory: `server`; Build: `npm install`; Start: `npm start`). Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`.
3. Deploy `client` on Vercel (Root Directory: `client`; Build: `npm run build`; Output: `dist`). Set `VITE_API_URL` to your deployed API URL plus `/api`.
4. The Vercel URL becomes your live demo link. Confirm the app works before submitting.

Do not publish credentials or `.env` files. Replace `YOUR_USERNAME` with your actual GitHub username.
