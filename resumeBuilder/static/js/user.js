// Password validation and confirmation
    document.addEventListener('DOMContentLoaded', function() {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirm_password');
        const passwordStrengthDiv = document.getElementById('password-strength');
        const passwordMatchDiv = document.getElementById('password-match');
        const termsCheckbox = document.getElementById('terms_checkbox');
        const termsValidationDiv = document.getElementById('terms-validation');
        const usernameField = document.getElementById('username');
        const usernameValidationDiv = document.getElementById('username-validation');
        const signupForm = document.querySelector('#signup-tab form');
        
        let usernameCheckTimeout;
        let isUsernameValid = false;

        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            let feedback = [];

            if (password.length >= 8) strength++;
            else feedback.push('At least 8 characters');

            if (/[a-z]/.test(password)) strength++;
            else feedback.push('Lowercase letter');

            if (/[A-Z]/.test(password)) strength++;
            else feedback.push('Uppercase letter');

            if (/[0-9]/.test(password)) strength++;
            else feedback.push('Number');

            if (/[^A-Za-z0-9]/.test(password)) strength++;
            else feedback.push('Special character');

            return { strength, feedback };
        }

        // Username validation function
        function checkUsernameAvailability() {
            const username = usernameField.value.trim();
            
            // Clear previous timeout
            if (usernameCheckTimeout) {
                clearTimeout(usernameCheckTimeout);
            }
            
            // Reset validation state
            isUsernameValid = false;
            
            if (username === '') {
                usernameValidationDiv.textContent = '';
                usernameField.classList.remove('border-red-500', 'border-green-500');
                usernameField.classList.add('border-gray-300');
                return;
            }
            
            // Show checking indicator
            usernameValidationDiv.innerHTML = '<span class="text-blue-500">🔄 Checking availability...</span>';
            usernameField.classList.remove('border-red-500', 'border-green-500');
            usernameField.classList.add('border-blue-500');
            
            // Debounce the AJAX call
            usernameCheckTimeout = setTimeout(() => {
                fetch(`/check-username/?username=${encodeURIComponent(username)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.available) {
                            usernameValidationDiv.innerHTML = `<span class="text-green-500">✓ ${data.message}</span>`;
                            usernameField.classList.remove('border-red-500', 'border-blue-500');
                            usernameField.classList.add('border-green-500');
                            isUsernameValid = true;
                        } else {
                            usernameValidationDiv.innerHTML = `<span class="text-red-500">✗ ${data.message}</span>`;
                            usernameField.classList.remove('border-green-500', 'border-blue-500');
                            usernameField.classList.add('border-red-500');
                            isUsernameValid = false;
                        }
                    })
                    .catch(error => {
                        console.error('Error checking username:', error);
                        usernameValidationDiv.innerHTML = '<span class="text-red-500">✗ Error checking username</span>';
                        usernameField.classList.remove('border-green-500', 'border-blue-500');
                        usernameField.classList.add('border-red-500');
                        isUsernameValid = false;
                    });
            }, 500); // 500ms delay for debouncing
        }

        // Update password strength indicator
        function updatePasswordStrength() {
            const password = passwordField.value;
            if (password === '') {
                passwordStrengthDiv.textContent = '';
                return;
            }

            const { strength, feedback } = checkPasswordStrength(password);
            
            let strengthText = '';
            let strengthClass = '';

            if (strength < 2) {
                strengthText = 'Weak';
                strengthClass = 'text-red-500';
            } else if (strength < 4) {
                strengthText = 'Medium';
                strengthClass = 'text-yellow-500';
            } else {
                strengthText = 'Strong';
                strengthClass = 'text-green-500';
            }

            if (feedback.length > 0) {
                passwordStrengthDiv.innerHTML = `
                    <span class="${strengthClass}">Strength: ${strengthText}</span>
                    <span class="text-gray-500 ml-2">Missing: ${feedback.join(', ')}</span>
                `;
            } else {
                passwordStrengthDiv.innerHTML = `<span class="${strengthClass}">Strength: ${strengthText}</span>`;
            }
        }

        // Check password match
        function checkPasswordMatch() {
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;

            if (confirmPassword === '') {
                passwordMatchDiv.textContent = '';
                confirmPasswordField.classList.remove('border-red-500', 'border-green-500');
                confirmPasswordField.classList.add('border-gray-300');
                return true;
            }

            if (password === confirmPassword) {
                passwordMatchDiv.innerHTML = '<span class="text-green-500">✓ Passwords match</span>';
                confirmPasswordField.classList.remove('border-red-500', 'border-gray-300');
                confirmPasswordField.classList.add('border-green-500');
                return true;
            } else {
                passwordMatchDiv.innerHTML = '<span class="text-red-500">✗ Passwords do not match</span>';
                confirmPasswordField.classList.remove('border-green-500', 'border-gray-300');
                confirmPasswordField.classList.add('border-red-500');
                return false;
            }
        }

        // Check terms and privacy policy agreement
        function checkTermsAgreement() {
            if (termsCheckbox.checked) {
                termsValidationDiv.innerHTML = '<span class="text-green-500">✓ Terms and Privacy Policy accepted</span>';
                termsCheckbox.classList.remove('border-red-500');
                termsCheckbox.classList.add('border-green-500');
                return true;
            } else {
                termsValidationDiv.innerHTML = '<span class="text-red-500">✗ You must agree to the Terms of Service and Privacy Policy</span>';
                termsCheckbox.classList.remove('border-green-500');
                termsCheckbox.classList.add('border-red-500');
                return false;
            }
        }

        // Event listeners
        usernameField.addEventListener('input', checkUsernameAvailability);
        
        passwordField.addEventListener('input', function() {
            updatePasswordStrength();
            if (confirmPasswordField.value !== '') {
                checkPasswordMatch();
            }
        });

        confirmPasswordField.addEventListener('input', checkPasswordMatch);

        termsCheckbox.addEventListener('change', checkTermsAgreement);

        // Form submission validation
        signupForm.addEventListener('submit', function(e) {
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            const username = usernameField.value.trim();
            let isValid = true;

            // Check username validation
            if (!isUsernameValid || username === '') {
                e.preventDefault();
                if (username === '') {
                    alert('Please enter a username.');
                } else {
                    alert('Please choose a valid and available username.');
                }
                usernameField.focus();
                return false;
            }

            // Check minimum password requirements
            const { strength } = checkPasswordStrength(password);
            if (strength < 2) {
                e.preventDefault();
                alert('Please choose a stronger password. Your password should contain at least 8 characters with a mix of letters, numbers, and special characters.');
                passwordField.focus();
                return false;
            }

            // Check password match
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match. Please ensure both password fields are identical.');
                confirmPasswordField.focus();
                return false;
            }

            // Check terms and privacy policy agreement
            if (!termsCheckbox.checked) {
                e.preventDefault();
                checkTermsAgreement(); // Show validation message
                alert('You must agree to the Terms of Service and Privacy Policy to create an account.');
                termsCheckbox.focus();
                return false;
            }

            return true;
        });
    });