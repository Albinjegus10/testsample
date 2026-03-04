# Google Apps Script Setup Instructions

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Women's Day Event Registrations"

## Step 2: Open Apps Script Editor
1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire content from `Code.gs` file
4. Paste it into the Apps Script editor
5. Click **Save** (disk icon)

## Step 3: Initialize Sheet Headers (Optional but Recommended)
1. In the Apps Script editor, select the `setupSheet` function from the dropdown
2. Click **Run** (play icon)
3. Authorize the script when prompted
4. This will create formatted headers in your sheet

## Step 4: Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Women's Day Event Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/...../exec`)

## Step 5: Update Your React App
1. Open `src/pages/Home.jsx`
2. Find line 8: `const GOOGLE_SCRIPT_URL = "..."`
3. Replace the URL with your copied Web app URL
4. Save the file

## How It Works
- Form data is sent to Google Apps Script
- Images are uploaded to Google Drive in a folder called "Women's Day Event - Payment Screenshots"
- Each image is renamed with participant name, phone number, and timestamp
- Image link is added to the Google Sheet along with all form data
- Sheet columns:
  1. Timestamp
  2. Participant Name
  3. Age
  4. Phone Number
  5. Address
  6. Group 1 Selection
  7. Group 2 Selection
  8. Group 3 Selection
  9. Payment Amount
  10. Payment Screenshot Link (clickable)

## Troubleshooting
- If deployment fails, ensure you've authorized the script
- If images don't upload, check Google Drive storage space
- Check Apps Script logs: **Executions** tab in Apps Script editor
- Make sure the Web app is set to "Anyone" access
