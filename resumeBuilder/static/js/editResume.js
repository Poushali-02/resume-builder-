
  document.getElementById('imageInput').addEventListener('change', function(e){
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (ev) => document.getElementById('imagePreview').src = ev.target.result;
      reader.readAsDataURL(file);
    }
  });

  function addContact(){
    document.getElementById('contactFields').insertAdjacentHTML('beforeend',
      `<div class="flex gap-2">
        <input type="text" name="contact_type[]" placeholder="Type" class="border rounded p-2 w-1/2">
        <input type="text" name="contact_value[]" placeholder="Value" class="border rounded p-2 w-1/2">
      </div>`);
  }

  function addExperience(){
    document.getElementById('experienceFields').insertAdjacentHTML('beforeend',
      `<div class="border p-4 rounded space-y-2">
        <input type="text" name="job_title[]" placeholder="Job Title" class="border rounded p-2 w-full">
        <input type="text" name="company[]" placeholder="Company" class="border rounded p-2 w-full">
        <input type="text" name="job_location[]" placeholder="Location" class="border rounded p-2 w-full">
        <div class="flex gap-2">
          <input type="month" name="job_start_date[]" class="border rounded p-2 w-1/2">
          <input type="month" name="job_end_date[]" class="border rounded p-2 w-1/2">
        </div>
        <label><input type="checkbox" name="current_job_NEW"> Currently Working</label>
        <textarea name="job_description[]" rows="3" class="border rounded p-2 w-full" placeholder="Job Description"></textarea>
      </div>`);
  }

  function addEducation(){
    document.getElementById('educationFields').insertAdjacentHTML('beforeend',
      `<div class="border p-4 rounded space-y-2">
        <input type="text" name="degree[]" placeholder="Degree" class="border rounded p-2 w-full">
        <input type="text" name="institution[]" placeholder="Institution" class="border rounded p-2 w-full">
        <input type="text" name="edu_location[]" placeholder="Location" class="border rounded p-2 w-full">
        <div class="flex gap-2">
          <input type="month" name="edu_start_date[]" class="border rounded p-2 w-1/2">
          <input type="month" name="edu_end_date[]" class="border rounded p-2 w-1/2">
        </div>
        <label><input type="checkbox" name="current_edu_NEW"> Currently Studying</label>
        <textarea name="edu_description[]" rows="3" placeholder="Description" class="border rounded p-2 w-full"></textarea>
      </div>`);
  }

  function addProgSkill(){
    document.getElementById('progSkillFields').insertAdjacentHTML('beforeend',
      `<div class="flex gap-2">
        <input type="text" name="programming_skill[]" placeholder="Skill" class="border rounded p-2 w-1/2">
        <select name="programming_level[]" class="border rounded p-2 w-1/2">
                {% for code, label in programming_level_choices %}
                <option value="{{ code }}" {% if ps.level == code %}selected{% endif %}>{{ label }}</option>
                {% endfor %}
            </select>
      </div>`);
  }

  function addLanguage(){
    document.getElementById('langFields').insertAdjacentHTML('beforeend',
      `<div class="flex gap-2">
        <input type="text" name="language[]" placeholder="Language" class="border rounded p-2 w-1/2">
        <select name="language_level[]" class="border rounded p-2 w-1/2">
                {% for code, label in language_level_choices %}
                <option value="{{ code }}" {% if lang.level == code %}selected{% endif %}>{{ label }}</option>
                {% endfor %}
            </select>
      </div>`);
  }

  function addOtherSkill(){
    document.getElementById('otherSkillFields').insertAdjacentHTML('beforeend',
      `<input type="text" name="other_skill[]" placeholder="Skill" class="border rounded p-2 w-full">`);
  }

  function addProject(){
    const projectCount = document.querySelectorAll('.project-entry').length;
    document.getElementById('projectFields').insertAdjacentHTML('beforeend',
      `<div class="project-entry border border-gray-200 p-6 rounded-lg bg-gray-50 space-y-4">
        <div class="flex justify-between items-start mb-4">
          <h4 class="font-semibold text-gray-800">Project #${projectCount + 1}</h4>
          <button type="button" onclick="removeProject(this)" class="text-red-500 hover:text-red-700 px-2 py-1 text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Remove
          </button>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-gray-700 font-medium">Project Name</label>
            <input type="text" name="project_name[]" placeholder="E-commerce Website" class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
          <div>
            <label class="block mb-1 text-gray-700 font-medium">Technologies Used</label>
            <input type="text" name="project_technologies[]" placeholder="React, Node.js, MongoDB" class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block mb-1 text-gray-700 font-medium">Start Date</label>
            <input type="month" name="project_start_date[]" class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
          <div>
            <label class="block mb-1 text-gray-700 font-medium">End Date</label>
            <input type="month" name="project_end_date[]" class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
          <div class="flex items-end">
            <label class="flex items-center text-sm text-gray-700">
              <input type="checkbox" name="current_project_${projectCount}" class="mr-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
              Ongoing project
            </label>
          </div>
        </div>
        
        <div>
          <label class="block mb-1 text-gray-700 font-medium">Project URL (Optional)</label>
          <input type="url" name="project_url[]" placeholder="https://github.com/username/project or https://project-demo.com" class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>
        
        <div>
          <label class="block mb-1 text-gray-700 font-medium">Project Description</label>
          <textarea name="project_description[]" rows="4" placeholder="Describe your project, key features, challenges solved, and your role..." class="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"></textarea>
        </div>
      </div>`);
  }

  function removeProject(button){
    // Only remove if there's more than one project entry
    const projectEntries = document.querySelectorAll('.project-entry');
    if (projectEntries.length > 1) {
      button.closest('.project-entry').remove();
    }
  }

  // Certificate Management Functions
  function addCertificate(){
    const certificateFields = document.getElementById('certificateFields');
    const certificateEntries = certificateFields.querySelectorAll('.certificate-entry');
    const newIndex = certificateEntries.length + 1;
    
    certificateFields.insertAdjacentHTML('beforeend', `
      <div class="certificate-entry border border-gray-200 p-6 rounded-lg bg-gray-50 space-y-4">
        <div class="flex justify-between items-start mb-4">
          <h4 class="font-semibold text-gray-800">Certificate #${newIndex}</h4>
          <button type="button" onclick="removeCertificate(this)" class="text-red-500 hover:text-red-700 px-2 py-1 text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Remove
          </button>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
            <input type="text" name="certificate_name[]" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" placeholder="AWS Certified Developer">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Authority</label>
            <input type="text" name="certificate_authority[]" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" placeholder="Amazon Web Services">
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dated at</label>
            <input type="date" name="certificate_date_display[]" class="certificate-date-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
            <input type="hidden" name="certificate_date[]" class="certificate-date-hidden">
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Certificate File</label>
          <input type="file" name="certificate_file[]" class="certificate-file-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" accept=".pdf,.png,.jpg,.jpeg">
          <div class="mt-2">
            <span class="certificate-file-name text-sm text-gray-600"></span>
            <button type="button" class="remove-certificate-file text-red-500 text-sm ml-2 hidden">Remove</button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Certified For</label>
          <textarea name="certificate_certified_for[]" rows="3" placeholder="What was the certificate for?" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"></textarea>
        </div>
      </div>`);
      
    // Apply file validation to the new certificate file input
    const newFileInput = certificateFields.querySelector('.certificate-entry:last-child .certificate-file-input');
    setupCertificateFileValidation(newFileInput);
    
    // Set up date conversion for the new certificate
    const newCertificateEntry = certificateFields.querySelector('.certificate-entry:last-child');
    setupNewCertificateDate(newCertificateEntry);
  }

  function removeCertificate(button){
    // Only remove if there's more than one certificate entry
    const certificateEntries = document.querySelectorAll('.certificate-entry');
    if (certificateEntries.length > 1) {
      button.closest('.certificate-entry').remove();
    }
  }

  // Certificate File Validation Setup
  function setupCertificateFileValidation(fileInput) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      const fileNameSpan = fileInput.parentElement.querySelector('.certificate-file-name');
      const removeButton = fileInput.parentElement.querySelector('.remove-certificate-file');
      
      if (file) {
        // Validate file size
        if (file.size > maxSize) {
          alert('Certificate file size must be less than 10MB');
          fileInput.value = '';
          fileNameSpan.textContent = '';
          removeButton.classList.add('hidden');
          return;
        }
        
        // Validate file type
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
          alert('Please upload a valid certificate file (PDF, JPEG, PNG)');
          fileInput.value = '';
          fileNameSpan.textContent = '';
          removeButton.classList.add('hidden');
          return;
        }
        
        // File is valid
        fileNameSpan.textContent = file.name;
        removeButton.classList.remove('hidden');
        
        // Set up remove functionality
        removeButton.onclick = function() {
          fileInput.value = '';
          fileNameSpan.textContent = '';
          removeButton.classList.add('hidden');
        };
      } else {
        fileNameSpan.textContent = '';
        removeButton.classList.add('hidden');
      }
    });
  }

  // Initialize certificate file validation for existing inputs
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.certificate-file-input').forEach(setupCertificateFileValidation);
    
    // Set up existing certificate file remove buttons
    document.querySelectorAll('.certificate-entry').forEach(function(entry) {
      const currentFileLink = entry.querySelector('a[href*="certificate"]');
      const removeButton = entry.querySelector('.remove-certificate-file');
      
      if (currentFileLink && removeButton) {
        // Show remove button for existing files
        removeButton.classList.remove('hidden');
        
        // Set up remove functionality for existing files
        removeButton.onclick = function() {
          const fileInput = entry.querySelector('.certificate-file-input');
          const fileNameSpan = entry.querySelector('.certificate-file-name');
          
          // Clear the file input
          fileInput.value = '';
          fileNameSpan.textContent = '';
          removeButton.classList.add('hidden');
          
          // Hide the current file display
          const currentFileDiv = entry.querySelector('div.mt-2.text-sm.text-gray-600');
          if (currentFileDiv) {
            currentFileDiv.style.display = 'none';
          }
        };
      }
    });
    
    // Initialize date conversion for all certificate date inputs
    setupCertificateDateConversion();
  });

  // Date conversion functions
  function convertDateToBackendFormat(dateString) {
    if (!dateString) return '';
    
    // Input format: YYYY-MM-DD (from HTML date input)
    // Output format: DD-MM-YYYY (for backend)
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

  function convertDateToDisplayFormat(dateString) {
    if (!dateString) return '';
    
    // Input format: DD-MM-YYYY (from backend)
    // Output format: YYYY-MM-DD (for HTML date input)
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  function setupCertificateDateConversion() {
    // Set up conversion for existing certificate date inputs
    document.querySelectorAll('.certificate-date-input').forEach(dateInput => {
      const hiddenInput = dateInput.parentElement.querySelector('.certificate-date-hidden');
      
      // Initialize hidden input with converted value if date input has value
      if (dateInput.value) {
        hiddenInput.value = convertDateToBackendFormat(dateInput.value);
      }
      
      // Set up event listener for date changes
      dateInput.addEventListener('change', function() {
        hiddenInput.value = convertDateToBackendFormat(this.value);
      });
    });
  }

  // Add date conversion setup to the addCertificate function
  function setupNewCertificateDate(certificateEntry) {
    const dateInput = certificateEntry.querySelector('.certificate-date-input');
    const hiddenInput = certificateEntry.querySelector('.certificate-date-hidden');
    
    if (dateInput && hiddenInput) {
      dateInput.addEventListener('change', function() {
        hiddenInput.value = convertDateToBackendFormat(this.value);
      });
    }
  }