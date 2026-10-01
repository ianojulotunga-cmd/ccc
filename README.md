# Wide City Plug
E-store for electronics in Kenya with M-Pesa (Daraja STK Push).

## Structure
- `index.html`, `style.css`, `app.js`, `images/` – frontend (host on GitHub Pages)
- `server/` – Node backend that talks to Daraja (host on Render/Railway)

## Run locally
1. `cd server && npm install`
2. Copy `.env.example` to `.env`, fill in keys from developer.safaricom.co.ke (sandbox shortcode 174379)
3. `npm start`, then open `index.html` (use Live Server) – the site calls http://localhost:3000
4. For callbacks locally, expose port 3000 with ngrok and put the URL in `CALLBACK_URL`

## Deploy
- Frontend: push to GitHub, Settings > Pages > deploy from `main` root.
- Backend: deploy `server/` to Render (add the .env values as environment variables), then set `API` in `app.js` to its URL.
- Never commit `.env` or your keys. Sandbox test phone: 254708374149.
