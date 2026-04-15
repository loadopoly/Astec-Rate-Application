# 📦 How to Install and Run IPS Freight Platform

**You only need to do these steps once.** After that, starting the app is just a double-click.

---

## ✅ What You Need

- A Windows or Mac computer
- An internet connection (for the first download only)
- About 15 minutes

---

## 🪟 Windows Instructions

### Step 1 — Install Docker Desktop

Docker is a free program that runs the IPS Freight Platform. You only install it once.

1. Open this link in your browser: **https://www.docker.com/products/docker-desktop/**
2. Click the big blue **"Download Docker Desktop"** button
3. Run the downloaded installer — click **Next → Next → Finish** (no changes needed)
4. After install, Docker Desktop will open. **Wait until you see a green "Running" status** in the Docker Desktop window (this takes about 1-2 minutes)

> 💡 Tip: Docker Desktop puts a small whale icon (🐳) in your taskbar when it's running.

---

### Step 2 — Get the Application Files

1. Go to the GitHub page for this project
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Find the downloaded ZIP in your Downloads folder
5. **Right-click** the ZIP file → **"Extract All"** → Click **"Extract"**
6. You'll have a new folder. **Open it.**

---

### Step 3 — Start the Application

1. Inside the folder, find the file called **`START.bat`**
2. **Double-click `START.bat`**
3. A black window will appear — this is normal. Wait for it to finish (3–5 minutes on first run)
4. When it's done, **your browser will open automatically** to the application

> 🌐 The app is at: **http://localhost:3000**

---

## 🍎 Mac Instructions

### Step 1 — Install Docker Desktop

1. Open this link: **https://www.docker.com/products/docker-desktop/**
2. Click **"Download Docker Desktop"** — choose **Mac with Apple chip** or **Mac with Intel chip** (if unsure, try Apple chip first)
3. Open the downloaded `.dmg` file and drag Docker to your Applications folder
4. Open Docker from Applications. **Wait for the whale icon 🐳 in your menu bar to stop animating** (it will turn solid)

---

### Step 2 — Get the Application Files

Same as Windows Step 2 above — download the ZIP from GitHub and extract it.

---

### Step 3 — Allow the Start Script (first time only)

The first time you run the app on Mac, you need to do this once:

1. Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)
2. Type this command and press Enter (adjust the folder name to match what you extracted):
   ```
   chmod +x ~/Downloads/Astec-Rate-Application-*/START.sh ~/Downloads/Astec-Rate-Application-*/START.command
   ```
   > If that doesn't work, open Finder, navigate to the folder, right-click `START.command` → **Open** → Click **Open** in the security dialog.

---

### Step 4 — Start the Application

1. Find the file called **`START.command`** inside the application folder
2. **Double-click `START.command`**
3. A terminal window will open — wait 3–5 minutes on first run
4. Your browser will open automatically when it's ready

> 🌐 The app is at: **http://localhost:3000**

---

## 🔴 Stopping the Application

When you're done using the platform, stop it to free up your computer's resources:

- **Windows:** Double-click **`STOP.bat`**
- **Mac:** Double-click **`STOP.command`** (or run `./STOP.sh` in Terminal)

Your data is automatically saved and will be there next time you start.

---

## ▶️ Starting Again Later

Every time you want to use the platform after the first setup:

1. Make sure Docker Desktop is open and running (whale icon in taskbar/menu bar)
2. Double-click **`START.bat`** (Windows) or **`START.command`** (Mac)
3. Wait about 30 seconds (much faster after first run)
4. Open **http://localhost:3000** in your browser

---

## ❓ Troubleshooting

### "Docker is not running" error
- Open Docker Desktop from your Applications (or Start Menu)
- Wait for it to fully start (the whale icon should stop animating)
- Try the start script again

### The browser doesn't open automatically
- Just open your browser manually and go to **http://localhost:3000**

### "Port already in use" error
- Another program may be using port 3000. Run `STOP.bat` or `STOP.sh` first, then try again.
- Or restart your computer and try again.

### Something else went wrong
- Run `STOP.bat` / `STOP.sh` to stop everything
- Wait 30 seconds
- Try `START.bat` / `START.command` again

---

## 📞 Support

For help, contact your IT department or the application administrator.

---

*IPS Freight Platform — Astec Industries / IPS Heavy Haul*
