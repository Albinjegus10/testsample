function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;
    
    // File upload handling
    var fileUrl = "No file uploaded";
    if (data.base64File && data.fileName && data.mimeType) {
      // Decode the base64 string
      var decodedData = Utilities.base64Decode(data.base64File);
      // Create a blob representing the file
      var blob = Utilities.newBlob(decodedData, data.mimeType, data.fileName);
      
      // Save it to the root of your Google Drive
      // Ensure you authorize DriveApp permissions when deploying!
      var folder = DriveApp.getRootFolder();
      var file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }
    
    // Append the data row to Google Sheets
    sheet.appendRow([
      new Date(),
      data.participantName || "",
      data.age || "",
      data.phoneNumber || "",
      data.address || "",
      data.group1 || "",
      data.group2 || "",
      data.group3 || "",
      data.paymentAmount || "200",
      fileUrl
    ]);
    
    // Return a success JSON object
    return ContentService.createTextOutput(JSON.stringify({"result":"Success", "fileUrl": fileUrl}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return an error JSON object
    return ContentService.createTextOutput(JSON.stringify({"result":"Error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
