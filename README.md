Smart Form Filler - Chrome Extension
A browser extension that automatically fills web forms with your saved data.
📁 File Structure
Your extension needs these files:
form-filler-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── icon16.png
├── icon48.png
└── icon128.png
🚀 Installation Steps
1. Create the Extension Folder
Create a new folder called form-filler-extension and add all the files above.
2. Create Icon Images
You need three icon sizes. You can:

Create simple icons using any image editor
Use online icon generators
Download free icons from sites like flaticon.com
Or create a simple colored square as a placeholder

Save them as icon16.png, icon48.png, and icon128.png
3. Load Extension in Chrome

Open Chrome and go to chrome://extensions/
Enable "Developer mode" (toggle in top-right corner)
Click "Load unpacked"
Select your form-filler-extension folder
The extension icon will appear in your toolbar!

💡 How to Use
Saving Your Data

Click the extension icon in your toolbar
Fill in your information (First Name, Last Name, Email, Phone, Experience)
Click "💾 Save Data"
Your data is now saved and will persist across browser sessions

Filling Forms

Navigate to any webpage with a form
Click the extension icon
Click "✨ Fill Form"
The extension will automatically detect and fill matching fields!

🔧 How It Works
The extension uses smart field detection:

Searches for fields by name, id, placeholder, and label
Matches keywords like "first", "fname", "email", "phone", etc.
Automatically triggers input events so websites recognize the filled data
Works with regular inputs, textareas, and select dropdowns

✨ Customization
Adding More Fields
Edit popup.html to add new input fields, then update:

popup.js - Add the field to formData object
popup.js - Add keywords in fillFormFields function
content.js - Add to fieldMappings array

Example: Adding Address Field
javascript// In popup.js fillFormFields function:
fillField(['address', 'street', 'addr'], data.address);

// In content.js fieldMappings:
{ keywords: ['address', 'street', 'addr'], value: data.address }
🔒 Privacy

All data is stored locally in Chrome's sync storage
No data is sent to external servers
Works entirely on your device

🐛 Troubleshooting
Extension not appearing?

Make sure Developer Mode is enabled
Check all files are in the folder
Reload the extension from chrome://extensions/

Form not filling?

Some websites use non-standard field names
Try adding custom keywords for specific sites
Check browser console for errors

Data not saving?

Verify Chrome sync storage is enabled
Check extension permissions in manifest.json

📝 Browser Compatibility
Built for Chrome but also works with:

Microsoft Edge
Brave
Any Chromium-based browser

For Firefox, you'll need to modify the manifest to version 2.
🎯 Future Enhancements
Ideas to expand functionality:

Multiple profiles (Work, Personal, etc.)
Auto-fill on page load option
Custom field mapping per website
Import/Export data feature
Password manager integration
File upload automation

Enjoy your automated form filling! 🎉****