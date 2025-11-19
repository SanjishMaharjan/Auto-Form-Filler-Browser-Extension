// This content script runs on all pages
// It can be used for additional functionality like detecting forms

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillFormWithData(request.data);
    sendResponse({ success: true });
  }
});

// Alternative function to fill forms (can be called by content script)
function fillFormWithData(data) {
  const fieldMappings = [
    { keywords: ['first', 'fname', 'firstname'], value: data.firstName },
    { keywords: ['last', 'lname', 'lastname', 'surname'], value: data.lastName },
    { keywords: ['email', 'mail'], value: data.email },
    { keywords: ['phone', 'mobile', 'tel', 'contact'], value: data.phone },
    { keywords: ['experience', 'years', 'exp'], value: data.experience }
  ];
  
  fieldMappings.forEach(mapping => {
    if (mapping.value) {
      fillField(mapping.keywords, mapping.value);
    }
  });
}

function fillField(keywords, value) {
  const inputs = document.querySelectorAll('input, select, textarea');
  
  for (const input of inputs) {
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const label = input.labels?.[0]?.textContent?.toLowerCase() || '';
    
    const searchText = `${name} ${id} ${placeholder} ${label}`;
    
    if (keywords.some(keyword => searchText.includes(keyword))) {
      if (input.tagName === 'SELECT') {
        for (const option of input.options) {
          if (option.value.includes(value) || option.text.includes(value)) {
            input.value = option.value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      } else {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      break;
    }
  }
}