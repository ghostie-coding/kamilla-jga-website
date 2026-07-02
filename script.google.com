  // Ordner-ID aus dem bestehenden Galerie-Link in index.html
  const FOLDER_ID = '1EXJQVB8DQxyMMtgeQhpsc0RQLAQJVyMmVNJq01WD4T1BuedGWiwmj0_L2IzZ2lJflfOSJ0kb';

  // Muss exakt mit UPLOAD_KEY in js/upload.js übereinstimmen.
  const KEY = 'kamilla-jga';

  function doGet(e) {
    if (!e || !e.parameter || e.parameter.key !== KEY) {
      return ContentService.createTextOutput('forbidden').setMimeType(ContentService.MimeType.TEXT);
    }

    const payload = {
      accessToken: ScriptApp.getOAuthToken(),
      folderId: FOLDER_ID,
    };

    const encoded = Utilities.base64Encode(JSON.stringify(payload));
    return ContentService.createTextOutput(encoded).setMimeType(ContentService.MimeType.TEXT);
  }