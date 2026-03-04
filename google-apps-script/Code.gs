// Google Apps Script Code
// Deploy this as a Web App with "Anyone" access

// Simple request validation
function validateRequest(params) {
  const requiredFields = ['participantName', 'age', 'phoneNumber', 'address', 'group1', 'group2', 'group3'];
  for (let field of requiredFields) {
    if (!params[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return true;
}

function doPost(e) {
  try {
    const params = e.parameter;
    
    // Validate request
    validateRequest(params);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    const participantName = params.participantName || '';
    const age = params.age || '';
    const phoneNumber = params.phoneNumber || '';
    const address = params.address || '';
    const group1 = params.group1 || '';
    const group2 = params.group2 || '';
    const group3 = params.group3 || '';
    const paymentAmount = params.paymentAmount || '';
    
    // Handle image upload
    let imageUrl = 'No image uploaded';
    
    if (params.base64File && params.fileName && params.mimeType) {
      try {
        // Decode Base64 string
        const base64Data = params.base64File;
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64Data),
          params.mimeType,
          params.fileName
        );
        
        // Create folder if it doesn't exist
        const folderName = 'Women\'s Day Event - Payment Screenshots';
        let folder;
        const folders = DriveApp.getFoldersByName(folderName);
        
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }
        
        // Save file to Google Drive
        const file = folder.createFile(blob);
        file.setName(`${participantName}_${phoneNumber}_${new Date().getTime()}.${params.fileName.split('.').pop()}`);
        
        // Make file accessible
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        // Get shareable link
        imageUrl = file.getUrl();
        
      } catch (imageError) {
        Logger.log('Image upload error: ' + imageError);
        imageUrl = 'Error uploading image: ' + imageError.message;
      }
    }
    
    // Add data to sheet
    const timestamp = new Date();
    sheet.appendRow([
      timestamp,
      participantName,
      age,
      phoneNumber,
      address,
      group1,
      group2,
      group3,
      paymentAmount,
      imageUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Initialize sheet with headers
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow([
    'Timestamp',
    'Participant Name',
    'Age',
    'Phone Number',
    'Address',
    'Group 1 Selection',
    'Group 2 Selection',
    'Group 3 Selection',
    'Payment Amount',
    'Payment Screenshot Link'
  ]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 10);
}
