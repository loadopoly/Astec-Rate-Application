# How to Put IPS Freight on the Internet (Free)

Anyone with the link will be able to open the app — no install, no Docker, no IT help.  
The whole thing takes about **10 minutes** on two free websites: Render and Vercel.

---

## What you'll end up with

| Service | What it hosts | Cost | URL example |
|---------|--------------|------|-------------|
| **Render** | The API server + database | Free | `https://ips-freight-api.onrender.com` |
| **Vercel** | The web app everyone opens | Free | `https://ips-freight.vercel.app` |

---

## Before you start

You need:
- A **GitHub account** (the one that owns this repo). If you don't have one: [github.com/signup](https://github.com/signup)
- A **Render account** (free): [render.com](https://render.com) — sign up with GitHub so it can see your repo
- A **Vercel account** (free): [vercel.com](https://vercel.com) — sign up with GitHub so it can see your repo

---

## Step 1 of 4 — Deploy the API and database on Render

**What this step does:** Render reads the `render.yaml` file already in this repo and automatically creates the API server and the database for you. You don't type any commands.

1. Go to **[render.com](https://render.com)** and sign in.

2. On the Render dashboard, click the blue **"New +"** button (top-right).

3. In the dropdown that appears, click **"Blueprint"**.
   > 💡 *"Blueprint" means Render reads a config file from your repo instead of asking you lots of questions.*

4. Render asks you to connect a Git repository. Find **`Astec-Rate-Application`** in the list and click **Connect**.

5. You'll see a preview screen showing two things Render will create:
   - `ips-freight-api` — the API server
   - `ips-freight-db` — the PostgreSQL database

6. Click **"Apply"**.

7. ⏳ Wait **3–5 minutes**. You'll see a progress bar. When it turns **green** it's done.
   > If it stays orange or turns red, scroll down — Render shows the error in the build log. The most common issue is the repo not being public. Make the repo public in GitHub → Settings → Danger Zone → Change visibility.

8. Click on **`ips-freight-api`** in the list of services.

9. At the top of that page you'll see a URL that looks like:
   ```
   https://ips-freight-api.onrender.com
   ```
   **Copy this URL.** You'll need it in the next step.

10. Quick check: open `https://ips-freight-api.onrender.com/health` in a new browser tab. You should see:
    ```json
    {"status":"OK","timestamp":"...","uptime":...}
    ```
    If you see that, the API is working. ✅

> **⏱ Note:** On the free plan, the API goes to sleep after 15 minutes of no traffic. The first visit after it sleeps takes about 30 seconds to wake up — this is normal. For an internal tool that's totally fine.

> **📅 Note:** Free PostgreSQL databases have a limited retention period. Render will email you before it expires. Check [Render's free tier limits](https://render.com/docs/free#free-postgresql-databases) for the current policy. When you receive the warning, upgrade to a paid database tier or export your data first.

---

## Step 2 of 4 — Deploy the web app on Vercel

**What this step does:** Vercel builds the React frontend and hosts it at a public URL.

1. Go to **[vercel.com](https://vercel.com)** and sign in.

2. Click **"Add New…"** → **"Project"**.

3. Find **`Astec-Rate-Application`** in the list and click **"Import"**.

4. On the "Configure Project" screen, you need to change **one setting** and add **one environment variable**:

   **Change: Root Directory**
   - Click **"Edit"** next to Root Directory
   - Type `apps/web`
   - Click **"Continue"**

   **Add: Environment Variable**
   - Scroll down to the "Environment Variables" section
   - In the **Name** box type: `VITE_API_URL`
   - In the **Value** box paste your Render URL from Step 1, with `/api/v1` at the end:
     ```
     https://ips-freight-api.onrender.com/api/v1
     ```
     *(Replace the hostname with your actual Render URL)*
   - Click **"Add"**

5. Click the big **"Deploy"** button.

6. ⏳ Wait **1–2 minutes**. When the confetti appears, it's done. 🎉

7. Vercel shows your URL at the top — it looks like:
   ```
   https://ips-freight.vercel.app
   ```
   **Copy this URL.** You'll need it in the next step. **This is also the link you share with people.**

---

## Step 3 of 4 — Let the web app talk to the API (CORS)

**What this step does:** Tell the API server "it's okay to accept requests from the Vercel URL." Without this, your browser will block the connection.

1. Go back to **[render.com](https://render.com)** and open the **`ips-freight-api`** service.

2. Click **"Environment"** in the left sidebar.

3. Find the row for **`CORS_ORIGINS`**. It currently says `(not set)`.

4. Click the pencil ✏️ icon next to it and paste your Vercel URL (from Step 2):
   ```
   https://ips-freight.vercel.app
   ```
   *(Use your actual Vercel URL, not this example)*

5. Click **"Save Changes"**.

6. Render automatically redeploys the API (~1 minute). Wait for the status to go green again.

---

## Step 4 of 4 — Verify everything works

1. Open your **Vercel URL** in a browser.
2. The IPS Freight dashboard should load — you should see the sidebar with Dashboard, Quotes, Lanes, Carriers, etc.
3. ✅ **You're done!**

---

## Share the app

Send this URL to anyone who needs it:
```
https://ips-freight.vercel.app
```
*(Replace with your actual Vercel URL)*

No install. No setup. Just click and go.

---

## Updating the app in the future

Every time someone pushes changes to the `main` branch on GitHub:
- **Vercel** automatically rebuilds and redeploys the frontend (takes ~1 minute)
- **Render** automatically rebuilds and redeploys the API (takes ~3 minutes)

You don't have to do anything — it just updates itself.

---

## Troubleshooting

### "I see a blank white page" or "Failed to fetch" errors

The API hasn't woken up yet (free tier sleep). Wait 30 seconds and refresh.

### "CORS error" in the browser console (press F12 → Console tab)

You forgot Step 3 or used the wrong URL. Go back to Render → `ips-freight-api` → Environment → set `CORS_ORIGINS` to your exact Vercel URL.

### The Render build failed (red status)

Click on the service → click "Logs" tab to see what went wrong.  
Most common causes:
- The repo is private and Render doesn't have access — make it public (GitHub → repo → Settings → Danger Zone)
- Out of build minutes on the free plan — wait until the next month or upgrade

### The Vercel build failed

Click on the failed deployment → "View Build Logs".  
Most common cause: **Root Directory** wasn't set to `apps/web`.

---

## All the environment variables explained

You don't need to change any of these — they're handled automatically. This is just reference.

### Render (API server)

| Variable | What it is | Set by |
|----------|-----------|--------|
| `DATABASE_URL` | Connection string to the database | Render (automatic) |
| `JWT_SECRET` | Random key for login tokens | Render (auto-generated) |
| `CORS_ORIGINS` | Your Vercel URL | **You set this in Step 3** |
| `NODE_ENV` | `production` | render.yaml |
| `API_PORT` | `10000` (Render's internal port) | render.yaml |

### Vercel (frontend)

| Variable | What it is | Set by |
|----------|-----------|--------|
| `VITE_API_URL` | Your Render API URL + `/api/v1` | **You set this in Step 2** |

---

## Running it locally instead

See [INSTALL.md](INSTALL.md). You just double-click a file — no commands needed.
