# How to Start the WhatsApp Automation Server

This guide explains how to start your local Node.js server so that it can automatically send WhatsApp confirmation messages when someone submits the application form on your website.

### Step 1: Open a New Terminal
Open a new terminal window in VS Code (Terminal -> New Terminal) or your command prompt.

### Step 2: Navigate to the Server Folder
Run this command to go into the WhatsApp server folder:
```bash
cd whatsapp-server
```

### Step 3: Install Dependencies (First Time Only)
If you haven't installed the necessary packages yet, run:
```bash
npm install express cors whatsapp-web.js qrcode-terminal
```

### Step 4: Start the Server
Run this command to start the server:
```bash
node index.js
```

### Step 5: Scan the QR Code
1. Look at your terminal screen. A large QR code will appear.
2. Open **WhatsApp** on your phone (using your number **9487588713**).
3. Tap the three dots (⋮) in the top right corner and select **Linked Devices**.
4. Tap **"Link a Device"** and scan the QR code on your computer screen.

### Step 6: Keep it Running
Once you see the message **"✅ WhatsApp Server is Successfully Linked and Ready to Send!"** in the terminal, your automation is active. Keep this terminal open while you want the automation to work. When a user submits the form on `Home.jsx`, they will immediately receive a WhatsApp message from your number!
