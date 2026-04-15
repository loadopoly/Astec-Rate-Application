# Deploy IPS Freight Platform to the Internet (Free, ~5 minutes)

Anyone with the link can open the app — no install, no Docker, nothing to set up.

You only need **one free account**: [Render](https://render.com).  
That's it. No Vercel. No URL copying. No separate database setup. No configuration.

---

## Before you start

Make sure the **`Astec-Rate-Application`** GitHub repository is **public**.

> If it's private: GitHub → repo page → **Settings** tab → scroll all the way down to "Danger Zone" → **Change visibility → Make public**

---

## Step 1 — Click this button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/loadopoly/Astec-Rate-Application)

> ⚠️ **Not seeing the button?** Go to this URL directly:  
> **https://render.com/deploy?repo=https://github.com/loadopoly/Astec-Rate-Application**

This takes you directly to the Blueprint setup screen — you don't have to find anything in Render's menus.

> 💡 **Why Blueprint?** Blueprint means Render reads the config file already in this repo and sets everything up for you automatically. You don't fill in any settings.

> ⚠️ **If you see a "Choose service type" screen** (Static Sites, Web Services, etc.) — that's the wrong page. Hit **Back** in your browser and use the button above instead.

---

## Step 2 — Connect and apply

1. Render asks you to connect a Git repository.  
   Find **`Astec-Rate-Application`** in the list and click **Connect**.

2. You'll see a preview of two things Render will create:
   - `ips-freight-api` — the web app + API server
   - `ips-freight-db` — the database

3. Click **"Apply"**.

---

## Step 3 — Wait ~5 minutes

Watch the progress bar. When both items turn **green**, it's done.

> ⚠️ If the build turns red, click the service → **Logs** tab. Most common fix: make the repo public (see "Before you start" above).

---

## Step 4 — Open your app

1. Click on **`ips-freight-api`** in the list.
2. At the top of the page you'll see your URL — it looks like:
   ```
   https://ips-freight-api.onrender.com
   ```
3. Click it. The IPS Freight dashboard loads. ✅

**That URL is what you share with everyone.** Bookmark it.

---

## You're done!

The app is live. Share the URL. People just click it — no install required on their end.

---

## Keeping it updated

Every time someone pushes a change to the `main` branch, Render automatically rebuilds and redeploys (~5 minutes). You don't do anything.

---

## Free tier notes

| Thing | What it means for you |
|-------|----------------------|
| API sleeps after 15 min of no use | First visit after idle takes ~30 sec to wake up — this is normal |
| Free PostgreSQL has a retention limit | Render emails you before it expires. See [Render's free tier limits](https://render.com/docs/free#free-postgresql-databases). Upgrade to keep your data long-term. |

---

## Troubleshooting

### "I see a 'Choose service type' screen on Render" (Static Sites, Web Services, etc.)
That's the wrong page — you navigated into the individual service creator instead of Blueprint.  
**Fix:** Go directly to **https://render.com/deploy?repo=https://github.com/loadopoly/Astec-Rate-Application**

### Blank white page or "Failed to fetch"
The API is waking up from sleep (free tier). Wait 30 seconds and refresh.

### Build failed (red status on Render)
Click the service → **Logs** tab to see what went wrong.  
Most common cause: repo is private. Make it public in GitHub → Settings → Danger Zone.

### "Cannot GET /health" or similar
The server just started. Refresh in 10 seconds.

---

## Running it on your own computer instead

See [INSTALL.md](INSTALL.md) — just double-click a file. No commands needed.

