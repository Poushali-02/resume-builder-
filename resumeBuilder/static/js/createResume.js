let currentStep = 1;
const totalSteps = 7;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showStep(currentStep);
    updateProgress();
    
    // Image upload preview with enhanced error handling
    const imageUpload = document.getElementById('image-upload');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const uploadIcon = document.getElementById('upload-icon');
    
    if (imageUpload && previewContainer && previewImage && uploadIcon) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                    this.value = ''; // Clear the input
                    return;
                }
                
                // Validate file size (5MB limit)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('File size must be less than 5MB');
                    this.value = ''; // Clear the input
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        previewImage.src = event.target.result;
                        previewContainer.classList.remove('hidden');
                        uploadIcon.classList.add('hidden');
                    } catch (error) {
                        console.error('Error displaying image preview:', error);
                        alert('Error displaying image preview. Please try again.');
                    }
                }
                
                reader.onerror = function() {
                    console.error('Error reading file');
                    alert('Error reading the selected file. Please try again.');
                    imageUpload.value = ''; // Clear the input
                }
                
                reader.readAsDataURL(file);
            } else {
                // No file selected, show upload icon
                previewContainer.classList.add('hidden');
                uploadIcon.classList.remove('hidden');
            }
        });
        
        // Add click handler to preview image to allow re-selection
        previewContainer.addEventListener('click', function() {
            imageUpload.click();
        });
    }
    
    // Summary character counter
    const summaryTextarea = document.querySelector('textarea[name="summary"]');
    const summaryCounter = document.getElementById('summaryCounter');
    
    if (summaryTextarea) {
        summaryTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            summaryCounter.textContent = `${currentLength}/500`;
            
            if (currentLength > 450) {
                summaryCounter.classList.add('text-red-500');
                summaryCounter.classList.remove('text-gray-400');
            } else {
                summaryCounter.classList.add('text-gray-400');
                summaryCounter.classList.remove('text-red-500');
            }
        });
    }
});

// Navigation functions
function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepElement, index) => {
        if (index + 1 === step) {
            stepElement.classList.add('active');
            stepElement.style.display = 'block';
        } else {
            stepElement.classList.remove('active');
            stepElement.style.display = 'none';
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = step === 1 ? 'none' : 'flex';
    nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
    
    // Update step labels
    const stepLabels = document.querySelectorAll('.step-label');
    stepLabels.forEach((label, index) => {
        if (index + 1 <= step) {
            label.classList.add('text-blue-600', 'font-semibold');
            label.classList.remove('text-gray-500');
        } else {
            label.classList.add('text-gray-500');
            label.classList.remove('text-blue-600', 'font-semibold');
        }
    });
}

function updateProgress() {
    const progressIndicator = document.getElementById('progress-indicator');
    const stepNumber = document.getElementById('step-number');
    const progress = (currentStep / totalSteps) * 100;
    
    progressIndicator.style.width = `${progress}%`;
    stepNumber.textContent = currentStep;
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Event listeners for navigation buttons
document.getElementById('nextBtn').addEventListener('click', nextStep);
document.getElementById('prevBtn').addEventListener('click', prevStep);

// Dynamic form functions
document.getElementById('add-contact-btn').addEventListener('click', function() {
    const container = document.getElementById('contact-info-container');
    const contactEntry = document.createElement('div');
    contactEntry.className = 'contact-entry grid md:grid-cols-2 gap-4';
    contactEntry.innerHTML = `
        <div>
            <input type="text" name="contact_type[]" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   placeholder="Type (e.g., LinkedIn)">
        </div>
        <div class="flex gap-2">
            <input type="text" name="contact_value[]" 
                   class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   placeholder="Value/URL">
            <button type="button" class="remove-contact text-red-500 hover:text-red-700 px-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    container.appendChild(contactEntry);
    
    // Add remove functionality
    contactEntry.querySelector('.remove-contact').addEventListener('click', function() {
        contactEntry.remove();
    });
});

// Add experience functionality
document.getElementById('add-experience-btn').addEventListener('click', function() {
    const container = document.getElementById('experience-container');
    const experienceCount = container.children.length + 1;
    const experienceEntry = document.createElement('div');
    experienceEntry.className = 'experience-entry border border-gray-200 rounded-lg p-6 bg-gray-50';
    experienceEntry.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-gray-800">Experience #${experienceCount}</h3>
            <button type="button" class="remove-experience text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input type="text" name="job_title[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="Software Developer">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="ABC Technologies">
            </div>
        </div>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="month" name="job_start_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="month" name="job_end_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div class="flex items-end">
                <label class="flex items-center text-sm text-gray-700">
                    <input type="checkbox" name="current_job_${experienceCount-1}" class="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    Currently working here
                </label>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="job_location[]" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   placeholder="New York, NY">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="job_description[]" rows="4" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="Describe your responsibilities, achievements, and key accomplishments..."></textarea>
        </div>
    `;
    container.appendChild(experienceEntry);
    
    // Add remove functionality
    experienceEntry.querySelector('.remove-experience').addEventListener('click', function() {
        experienceEntry.remove();
        updateExperienceNumbers();
    });
    
    // Update visibility of remove buttons
    updateRemoveButtons('.experience-entry', '.remove-experience');
});

// Add education functionality
document.getElementById('add-education-btn').addEventListener('click', function() {
    const container = document.getElementById('education-container');
    const educationCount = container.children.length + 1;
    const educationEntry = document.createElement('div');
    educationEntry.className = 'education-entry border border-gray-200 rounded-lg p-6 bg-gray-50';
    educationEntry.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-gray-800">Education #${educationCount}</h3>
            <button type="button" class="remove-education text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Degree/Certificate</label>
                <input type="text" name="degree[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="Bachelor of Science">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input type="text" name="institution[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="University of Technology">
            </div>
        </div>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="month" name="edu_start_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="month" name="edu_end_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div class="flex items-end">
                <label class="flex items-center text-sm text-gray-700">
                    <input type="checkbox" name="current_edu_${educationCount-1}" class="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    Currently studying
                </label>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="edu_location[]" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   placeholder="Boston, MA">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="edu_description[]" rows="3" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="Describe your studies, achievements, relevant coursework..."></textarea>
        </div>
    `;
    container.appendChild(educationEntry);
    
    // Add remove functionality
    educationEntry.querySelector('.remove-education').addEventListener('click', function() {
        educationEntry.remove();
        updateEducationNumbers();
    });
    
    // Update visibility of remove buttons
    updateRemoveButtons('.education-entry', '.remove-education');
});

// Add project functionality
document.getElementById('add-project-btn').addEventListener('click', function() {
    const container = document.getElementById('projects-container');
    const projectCount = container.children.length + 1;
    const projectEntry = document.createElement('div');
    projectEntry.className = 'project-entry border border-gray-200 rounded-lg p-6 bg-gray-50';
    projectEntry.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-gray-800">Project #${projectCount}</h3>
            <button type="button" class="remove-project text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" name="project_name[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="E-commerce Website">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <input type="text" name="project_technologies[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="React, Node.js, MongoDB">
            </div>
        </div>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="month" name="project_start_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="month" name="project_end_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
            <div class="flex items-end">
                <label class="flex items-center text-sm text-gray-700">
                    <input type="checkbox" name="current_project_${projectCount-1}" class="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    Ongoing project
                </label>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Project URL (Optional)</label>
            <input type="url" name="project_url[]" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   placeholder="https://github.com/username/project or https://project-demo.com">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea name="project_description[]" rows="4" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="Describe your project, key features, challenges solved, and your role..."></textarea>
        </div>
    `;
    container.appendChild(projectEntry);
    
    // Add remove functionality
    projectEntry.querySelector('.remove-project').addEventListener('click', function() {
        projectEntry.remove();
        updateProjectNumbers();
    });
    
    // Update visibility of remove buttons
    updateRemoveButtons('.project-entry', '.remove-project');
});

// Add programming skill functionality
document.getElementById('add-programming-skill-btn').addEventListener('click', function() {
    const container = document.getElementById('programming-skills-container');
    const skillEntry = document.createElement('div');
    skillEntry.className = 'skill-entry flex gap-3';
    skillEntry.innerHTML = `
        <input type="text" name="programming_skill[]" 
               class="flex-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
               placeholder="e.g. Python">
        <select name="programming_level[]" 
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate" selected>Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
        </select>
        <button type="button" class="remove-skill text-red-500 hover:text-red-700 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        </button>
    `;
    container.appendChild(skillEntry);
    
    // Add remove functionality
    skillEntry.querySelector('.remove-skill').addEventListener('click', function() {
        skillEntry.remove();
    });
});


// Add language skill functionality
document.getElementById('add-language-skill-btn').addEventListener('click', function() {
    const container = document.getElementById('language-skills-container');
    const skillEntry = document.createElement('div');
    skillEntry.className = 'skill-entry flex gap-3';
    skillEntry.innerHTML = `
        <input type="text" name="language[]" 
               class="flex-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
               placeholder="e.g. Python">
        <select name="language_level[]" 
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate" selected>Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
        </select>
        <button type="button" class="remove-skill text-red-500 hover:text-red-700 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        </button>
    `;
    container.appendChild(skillEntry);
    
    // Add remove functionality
    skillEntry.querySelector('.remove-skill').addEventListener('click', function() {
        skillEntry.remove();
    });
});

// Add other skill functionality
document.getElementById('add-other-skill-btn').addEventListener('click', function() {
    const container = document.getElementById('other-skills-container');
    const skillEntry = document.createElement('div');
    skillEntry.className = 'skill-entry flex gap-3';
    skillEntry.innerHTML = `
        <input type="text" name="other_skill[]" 
               class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
               placeholder="e.g. Communication, Leadership">
        <button type="button" class="remove-skill text-red-500 hover:text-red-700 px-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        </button>
    `;
    container.appendChild(skillEntry);
    
    // Add remove functionality
    skillEntry.querySelector('.remove-skill').addEventListener('click', function() {
        skillEntry.remove();
    });
});

// Helper functions
function updateRemoveButtons(entrySelector, removeSelector) {
    const entries = document.querySelectorAll(entrySelector);
    entries.forEach((entry, index) => {
        const removeBtn = entry.querySelector(removeSelector);
        if (entries.length > 1) {
            removeBtn.classList.remove('hidden');
        } else {
            removeBtn.classList.add('hidden');
        }
    });
}

function updateExperienceNumbers() {
    const experiences = document.querySelectorAll('.experience-entry');
    experiences.forEach((exp, index) => {
        const title = exp.querySelector('h3');
        title.textContent = `Experience #${index + 1}`;
    });
}

function updateEducationNumbers() {
    const educations = document.querySelectorAll('.education-entry');
    educations.forEach((edu, index) => {
        const title = edu.querySelector('h3');
        title.textContent = `Education #${index + 1}`;
    });
}

function updateProjectNumbers() {
    const projects = document.querySelectorAll('.project-entry');
    projects.forEach((project, index) => {
        const title = project.querySelector('h3');
        title.textContent = `Project #${index + 1}`;
    });
}

// Form validation before submission
document.getElementById('resumeForm').addEventListener('submit', function(e) {
    const fullName = document.querySelector('input[name="full_name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    
    if (!fullName || !email || !phone) {
        e.preventDefault();
        alert('Please fill in all required fields: Full Name, Email, and Phone.');
        currentStep = 1;
        showStep(currentStep);
        updateProgress();
        return false;
    }
});

// Certificate functionality
document.getElementById('add-certificate-btn').addEventListener('click', function() {
    const container = document.getElementById('certificate-container');
    const count = container.children.length;
    
    const certificateEntry = document.createElement('div');
    certificateEntry.className = 'certificate-entry border border-gray-200 rounded-lg p-6 bg-gray-50';
    certificateEntry.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="font-semibold text-gray-800">Certificate #${count + 1}</h3>
            <button type="button" class="remove-certificate text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
                <input type="text" 
                       name="certificate_name[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="AWS Certified Developer">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Certificate Authority</label>
                <input type="text" 
                       name="certificate_authority[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                       placeholder="Amazon Web Services">
            </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dated at</label>
                <input type="date" 
                       name="certificate_date[]" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            </div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Certificate</label>
            <input type="file" 
                   name="certificate_file[]" 
                   class="certificate-file-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                   accept=".pdf,.png,.jpg,.jpeg">
            <div class="mt-2">
                <span class="certificate-file-name text-sm text-gray-600"></span>
                <button type="button" class="remove-certificate-file text-red-500 text-sm ml-2 hidden">Remove</button>
            </div>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Certified For</label>
            <textarea name="certificate_certified_for[]" 
                      rows="4" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                      placeholder="What was the certificate for?"></textarea>
        </div>
    `;
    
    container.appendChild(certificateEntry);
    
    // Add certificate file validation to the new entry
    setupCertificateFileValidation(certificateEntry);
    
    // Show remove button for all entries
    const removeButtons = container.querySelectorAll('.remove-certificate');
    removeButtons.forEach(btn => {
        btn.classList.remove('hidden');
        btn.addEventListener('click', function() {
            this.closest('.certificate-entry').remove();
            updateCertificateNumbers();
        });
    });
});

// Remove certificate functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-certificate')) {
        e.target.closest('.certificate-entry').remove();
        updateCertificateNumbers();
    }
});

// Certificate file validation and handling
function setupCertificateFileValidation(container) {
    const fileInput = container.querySelector('.certificate-file-input');
    const fileName = container.querySelector('.certificate-file-name');
    const removeBtn = container.querySelector('.remove-certificate-file');
    
    if (fileInput && fileName && removeBtn) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file type
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid file (PDF, JPEG, PNG)');
                    this.value = ''; // Clear the input
                    fileName.textContent = '';
                    removeBtn.classList.add('hidden');
                    return;
                }
                
                // Validate file size (10MB limit for certificates)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (file.size > maxSize) {
                    alert('File size must be less than 10MB');
                    this.value = ''; // Clear the input
                    fileName.textContent = '';
                    removeBtn.classList.add('hidden');
                    return;
                }
                
                // Show file name and remove button
                fileName.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                removeBtn.classList.remove('hidden');
            } else {
                fileName.textContent = '';
                removeBtn.classList.add('hidden');
            }
        });
        
        // Remove file handler
        removeBtn.addEventListener('click', function() {
            fileInput.value = '';
            fileName.textContent = '';
            removeBtn.classList.add('hidden');
        });
    }
}

// Initialize certificate file validation for existing entries on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up image upload validation (already handled above)
    
    // Set up certificate file validation for any existing certificate entries
    const existingCertificates = document.querySelectorAll('.certificate-entry');
    existingCertificates.forEach(cert => {
        setupCertificateFileValidation(cert);
    });
});

function updateCertificateNumbers() {
    const certificates = document.querySelectorAll('.certificate-entry');
    certificates.forEach((cert, index) => {
        const title = cert.querySelector('h3');
        title.textContent = `Certificate #${index + 1}`;
        
        // Show/hide remove buttons
        const removeBtn = cert.querySelector('.remove-certificate');
        if (certificates.length > 1) {
            removeBtn.classList.remove('hidden');
        } else {
            removeBtn.classList.add('hidden');
        }
    });
}

// Form submission validation
document.getElementById('resumeForm').addEventListener('submit', function(e) {
    // Validate image upload
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload && imageUpload.files[0]) {
        const imageFile = imageUpload.files[0];
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxImageSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedImageTypes.includes(imageFile.type)) {
            e.preventDefault();
            alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return false;
        }
        
        if (imageFile.size > maxImageSize) {
            e.preventDefault();
            alert('Profile image must be less than 5MB');
            return false;
        }
    }
    
    // Validate certificate files
    const certificateInputs = document.querySelectorAll('.certificate-file-input');
    for (let input of certificateInputs) {
        if (input.files[0]) {
            const file = input.files[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            if (!allowedTypes.includes(file.type)) {
                e.preventDefault();
                alert('Please select valid certificate files (PDF, JPEG, PNG only)');
                return false;
            }
            
            if (file.size > maxSize) {
                e.preventDefault();
                alert('Certificate files must be less than 10MB each');
                return false;
            }
        }
    }
    
    return true;
});

// CSS for form steps
const style = document.createElement('style');
style.textContent = `
    .form-step {
        display: none;
    }
    .form-step.active {
        display: block;
    }
    .step-label.active {
        color: #2563eb !important;
        font-weight: 600 !important;
    }
    .flex-2 {
        flex: 2;
    }
    .skill-entry .remove-skill {
        opacity: 0;
        transition: opacity 0.2s;
    }
    .skill-entry:hover .remove-skill {
        opacity: 1;
    }
`;
document.head.appendChild(style);
