# How to Automate Google Sheets for Event Registration

This guide will show you how to securely link your website application form to a Google Sheet so that all submissions (and payment screenshots) are saved securely in your Google Drive and Sheets!

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new Blank spreadsheet.
2. Name it **"Women's Day Event Registrations"**.
3. Create the Headers in Row 1: `Timestamp`, `Participant Name`, `Age`, `Phone Number`, `Address`, `Group 1`, `Group 2`, `Group 3`, `Payment Amount`, and `Screenshot URL`. Be sure to make the headers bold to look nice!

### Step 2: Open Google Apps Script
1. On your Google Sheet menu, click **Extensions > Apps Script**.
2. A new tab will open with a code editor (`Code.gs`).
3. Delete any code inside that editor and completely **Copy & Paste** the code found in the `Code.gs` file in your VS Code workspace.
4. Click the **Save** icon (💾) or press `Ctrl + S`.

### Step 3: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button and select **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Fill out the deployment configuration exactly like this:
   - **Description**: Form Submission Server
   - **Execute as**: Me (`your.email@gmail.com`)  *(CRITICAL)*
   - **Who has access**: Anyone *(CRITICAL - This allows anyone who presses submit to send data)*
4. Click **Deploy**.

### Step 4: Authorize Google Drive Access
1. Google will say "Authorization required". Click **Authorize access**.
2. Select your Google account.
3. Google will give a warning screen ("Google hasn't verified this app"). Don't worry, it's your own code!
4. Click the **Advanced** link at the bottom, then click **Go to Untitled project (unsafe)**.
5. Click **Allow** (this lets the script save the payment screenshot image to your Google Drive and write to your Google Sheets).

### Step 5: Copy the Web App URL
Once the deployment finishes, it will give you a **Web app URL** that looks something like `https://script.google.com/macros/s/AKfycb.../exec`.
**Copy this URL completely.**

### Step 6: Update Home.jsx
1. Open VS Code and open `src/pages/Home.jsx`.
2. Find line 6 near the top of the file:
   ```javascript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";
   ```
3. Replace the text `"YOUR_GOOGLE_SCRIPT_URL_HERE"` with the URL you just copied. Keep the quotes around it!
4. Save `Home.jsx`.

### Step 7: Test it!
1. Start your React dev server (`npm run dev`) if it's not already running.
2. Start your WhatsApp server by following `whatsapp_server_startup.md`.
3. Submit a test registration on your website's form, uploading a dummy image for the payment.
4. **Result:** The image will go to your Google Drive, the data will pop up instantly on your Google Sheet, and the WhatsApp Node Server will text you!
