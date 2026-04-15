# Deploy IPS Freight Platform to the Internet (Free, ~5 minutes)

Anyone with the link can open the app — no install, no Docker, nothing to set up.

You only need **one free account**: [Render](https://render.com).  
That's it. No Vercel. No URL copying. No separate database setup. No CORS configuration.

---

## Before you start

1. Make sure the **`Astec-Rate-Application`** GitHub repository is **public**.
   > If it's private: GitHub → repo → **Settings** → scroll to "Danger Zone" → **Change visibility → Public**

2. Sign up at **[render.com](https://render.com)** using your GitHub account (so it can see your repo).

---

## Step 1 — Deploy on Render

1. Log into [render.com](https://render.com).

2. Click the blue **"New +"** button (top right of the dashboard).

3. Click **"Blueprint"** in the dropdown.
   > 💡 *Blueprint means Render reads the config file already in this repo — you don't type anything.*

4. Find **`Astec-Rate-Application`** in the list and click **Connect**.

5. You'll see a preview of two things Render will create:
   - `ips-freight-api` — the web app + API server combined
   - `ips-freight-db` — the database

6. Click **"Apply"**.

---

## Step 2 — Wait ~5 minutes

Watch the progress bar. When both items turn **green**, it's done.

> ⚠️ If the build turns red, click the service → **Logs** tab. The most common fix: make the repo public (see "Before you start" above).

---

## Step 3 — Open your app

1. Click on **`ips-freight-api`** in the list.
2. At the top of the page you'll see your URL — it looks like:
   ```
   https://ips-freight-api.onrender.com
   ```
3. Click it (or paste it in a browser). The IPS Freight dashboard loads. ✅

**That URL is what you share with everyone.** Save it.

---

## You're done!

The app is live. Share the URL. People just click it — no install required on their end.

---

## Keeping it updated

Every time you push a change to the `main` branch, Render automatically rebuilds and redeploys (~5 minutes). You don't do anything.

---

## Free tier notes

| Thing | What it means for you |
|-------|----------------------|
| API sleeps after 15 min of no use | First visit after idle takes ~30 sec to wake up — normal |
| Free PostgreSQL has a retention limit | Render emails you before it expires. See [Render's free tier limits](https://render.com/docs/free#free-postgresql-databases) for current policy. Upgrade to keep your data. |

---

## Troubleshooting

### Blank white page or "Failed to fetch"
The API is waking up from sleep. Wait 30 seconds and refresh.

### Build failed (red status on Render)
Click the service → **Logs** tab.  
Most common cause: repo is private. Make it public in GitHub → Settings → Danger Zone.

### "Cannot GET /health" or similar after waking up
This is fine — it means the server just started. Refresh in 10 seconds.

---

## Running it on your own computer instead

See [INSTALL.md](INSTALL.md) — just double-click a file.
