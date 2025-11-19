// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Load saved data when popup opens
document.addEventListener('DOMContentLoaded', () => {
  // Load default fields
  chrome.storage.sync.get(['formData'], (result) => {
    if (result.formData) {
      document.getElementById('firstName').value = result.formData.firstName || '';
      document.getElementById('lastName').value = result.formData.lastName || '';
      document.getElementById('email').value = result.formData.email || '';
      document.getElementById('phone').value = result.formData.phone || '';
      document.getElementById('experience').value = result.formData.experience || '';
    }
  });
  
  // Load custom fields
  loadCustomFields();
});

// Custom Fields Storage
let customFields = [];

function loadCustomFields() {
  chrome.storage.sync.get(['customFields'], (result) => {
    customFields = result.customFields || [];
    renderCustomFields();
  });
}

function saveCustomFieldsToStorage() {
  chrome.storage.sync.set({ customFields }, () => {
    showStatus('Custom fields saved successfully! ✓', 'success', 'customStatus');
  });
}

function renderCustomFields() {
  const container = document.getElementById('customFieldsList');
  
  if (customFields.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div>No custom fields yet.</div>
        <div>Add your first custom field above!</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = customFields.map((field, index) => `
    <div class="custom-field">
      <div class="custom-field-header">
        <div class="custom-field-title">${field.label}</div>
        <button class="delete-field" data-index="${index}">🗑️ Delete</button>
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="text" class="custom-field-value" data-index="${index}" value="${field.value}" placeholder="Enter value">
      </div>
      <div class="form-group">
        <label>Keywords</label>
        <input type="text" class="custom-field-keywords" data-index="${index}" value="${field.keywords.join(', ')}" placeholder="Keywords">
      </div>
    </div>
  `).join('');
  
  // Add delete handlers
  container.querySelectorAll('.delete-field').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (confirm(`Delete field "${customFields[index].label}"?`)) {
        customFields.splice(index, 1);
        saveCustomFieldsToStorage();
        renderCustomFields();
      }
    });
  });
  
  // Add value change handlers
  container.querySelectorAll('.custom-field-value').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      customFields[index].value = e.target.value;
    });
  });
  
  // Add keywords change handlers
  container.querySelectorAll('.custom-field-keywords').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      customFields[index].keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    });
  });
}

// Add new custom field
document.getElementById('addFieldBtn').addEventListener('click', () => {
  const label = document.getElementById('newFieldLabel').value.trim();
  const value = document.getElementById('newFieldValue').value.trim();
  const keywords = document.getElementById('newFieldKeywords').value.trim();
  
  if (!label) {
    showStatus('Please enter a field label', 'error', 'customStatus');
    return;
  }
  
  if (!keywords) {
    showStatus('Please enter at least one keyword', 'error', 'customStatus');
    return;
  }
  
  const keywordArray = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
  
  customFields.push({
    label: label,
    value: value,
    keywords: keywordArray
  });
  
  // Clear form
  document.getElementById('newFieldLabel').value = '';
  document.getElementById('newFieldValue').value = '';
  document.getElementById('newFieldKeywords').value = '';
  
  saveCustomFieldsToStorage();
  renderCustomFields();
  showStatus('Custom field added! ✓', 'success', 'customStatus');
});

// Save default fields button
document.getElementById('saveBtn').addEventListener('click', () => {
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    experience: document.getElementById('experience').value
  };
  
  chrome.storage.sync.set({ formData }, () => {
    showStatus('Data saved successfully! ✓', 'success', 'status');
  });
});

// Save custom fields button
document.getElementById('saveCustomBtn').addEventListener('click', () => {
  saveCustomFieldsToStorage();
});

// Fill default fields button
document.getElementById('fillBtn').addEventListener('click', async () => {
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    experience: document.getElementById('experience').value
  };
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: fillFormFields,
    args: [formData, []]
  }).then(() => {
    showStatus('Form filled successfully! ✓', 'success', 'status');
  }).catch((error) => {
    showStatus('Error filling form: ' + error.message, 'error', 'status');
  });
});

// Fill custom fields button
document.getElementById('fillCustomBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: fillFormFields,
    args: [{}, customFields]
  }).then(() => {
    showStatus('Form filled successfully! ✓', 'success', 'customStatus');
  }).catch((error) => {
    showStatus('Error filling form: ' + error.message, 'error', 'customStatus');
  });
});

// Function to show status messages
function showStatus(message, type, elementId) {
  const statusEl = document.getElementById(elementId);
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  
  setTimeout(() => {
    statusEl.className = 'status';
  }, 3000);
}

// This function will be injected into the page
function fillFormFields(defaultData, customFieldsData) {
  // Helper function to find and fill input fields
  function fillField(keywords, value) {
    if (!value) return false;
    
    const inputs = document.querySelectorAll('input, select, textarea');
    
    for (const input of inputs) {
      // Skip if already filled (unless empty)
      if (input.value && input.value.length > 0) continue;
      
      const name = (input.name || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      const placeholder = (input.placeholder || '').toLowerCase();
      const label = input.labels?.[0]?.textContent?.toLowerCase() || '';
      const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
      
      const searchText = `${name} ${id} ${placeholder} ${label} ${ariaLabel}`;
      
      if (keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
        if (input.tagName === 'SELECT') {
          // For select dropdowns, find matching option
          for (const option of input.options) {
            if (option.value.includes(value) || option.text.includes(value)) {
              input.value = option.value;
              input.dispatchEvent(new Event('change', { bubbles: true }));
              return true;
            }
          }
        } else {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('blur', { bubbles: true }));
          return true;
        }
      }
    }
    return false;
  }
  
  // Fill default fields
  fillField(['first', 'fname', 'firstname'], defaultData.firstName);
  fillField(['last', 'lname', 'lastname', 'surname'], defaultData.lastName);
  fillField(['email', 'mail'], defaultData.email);
  fillField(['phone', 'mobile', 'tel', 'contact'], defaultData.phone);
  fillField(['experience', 'years', 'exp'], defaultData.experience);
  
  // Fill custom fields
  customFieldsData.forEach(field => {
    if (field.value) {
      fillField(field.keywords, field.value);
    }
  });
}