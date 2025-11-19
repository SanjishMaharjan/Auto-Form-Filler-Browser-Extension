# Form Filler Extension

A simple and lightweight Chrome extension that automatically fills web forms with predefined user data.  
Perfect for developers, testers, or anyone who fills the same forms repeatedly.

---

## 🚀 Features

- Automatically fills text inputs, email fields, phone fields, and more
- Editable user profile (name, email, phone, address, etc.)
- Works on most websites with standard form fields
- One-click “Fill Form” button
- No data stored online — everything stays in your browser
- Clean UI and easy to customize

---

## 📦 Installation (From GitHub)

1. **Download the extension**

   - Click the green **Code** button
   - Select **Download ZIP**
   - Extract the ZIP file to a folder

2. **Load the extension in Chrome**

   - Open Chrome and go to: `chrome://extensions/`
   - Enable **Developer mode** (top-right)
   - Click **Load unpacked**
   - Select the extracted extension folder

3. **Start using**
   - Click the extension icon in the Chrome toolbar
   - Enter your personal details
   - Visit any form and click **"Fill Form"**

---

## 🧩 How It Works

1. You configure your personal info inside the popup
2. When you click **Fill Form**, the script scans the webpage
3. It finds matching input fields and fills them automatically

Works best on:

- Login / signup pages
- Contact forms
- Survey forms
- Checkout pages

---

## 📁 Project Structure

form-filler-extension/
│── manifest.json
│── popup.html
│── popup.js
│── content.js
│── styles.css
│── icons/
│ └── icon.png

---

## 🔧 Developer Setup

```bash
# Clone the repository
git clone https://github.com/SanjishMaharjan/Auto-Form-Filler-Browser-Extension

# Navigate into folder
cd Auto-Form-Filler-Browser-Extension
```
