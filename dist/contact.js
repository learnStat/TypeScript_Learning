// ============================================
// TYPESCRIPT LEARNING: FORM VALIDATION
// ============================================
// This demonstrates type-safe form handling and validation
// CLASS for form validation
class ContactFormValidator {
    // STATIC METHOD: Can be called without creating an instance
    // ContactFormValidator.validateEmail(email)
    static validateEmail(email) {
        return this.EMAIL_REGEX.test(email);
    }
    static validatePhone(phone) {
        return phone.length === 0 || this.PHONE_REGEX.test(phone);
    }
    static validateName(name) {
        return name.trim().length >= 2;
    }
    static validateMessage(message) {
        return message.trim().length >= this.MIN_MESSAGE_LENGTH;
    }
    // COMPREHENSIVE VALIDATION
    // Returns an object with validation status and error messages
    static validateForm(data) {
        const errors = [];
        if (!this.validateName(data.name)) {
            errors.push('Name must be at least 2 characters long');
        }
        if (!this.validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        if (data.phone && !this.validatePhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        if (!this.validateMessage(data.message)) {
            errors.push(`Message must be at least ${this.MIN_MESSAGE_LENGTH} characters long`);
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}
// STATIC READONLY: Class-level constant
ContactFormValidator.EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
ContactFormValidator.PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;
ContactFormValidator.MIN_MESSAGE_LENGTH = 10;
// CLASS for managing contact form
class ContactForm {
    constructor(formId) {
        this.submissions = [];
        const form = document.getElementById(formId);
        if (!form) {
            throw new Error(`Form with id '${formId}' not found`);
        }
        this.formElement = form;
        this.setupEventListeners();
        this.loadSubmissions();
    }
    setupEventListeners() {
        // FORM SUBMIT EVENT
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        // REAL-TIME VALIDATION on input
        const inputs = this.formElement.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const target = e.target;
                this.validateField(target);
            });
            // Clear error on focus
            input.addEventListener('focus', (e) => {
                const target = e.target;
                this.clearFieldError(target);
            });
        });
    }
    // VALIDATE INDIVIDUAL FIELD
    validateField(field) {
        const value = field.value;
        let errorMessage = '';
        // SWITCH with TYPE CHECKING
        switch (field.id) {
            case 'contactName':
                if (!ContactFormValidator.validateName(value)) {
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'contactEmail':
                if (!ContactFormValidator.validateEmail(value)) {
                    errorMessage = 'Invalid email address';
                }
                break;
            case 'contactPhone':
                if (value && !ContactFormValidator.validatePhone(value)) {
                    errorMessage = 'Invalid phone number';
                }
                break;
            case 'contactMessage':
                if (!ContactFormValidator.validateMessage(value)) {
                    errorMessage = `Message must be at least ${ContactFormValidator['MIN_MESSAGE_LENGTH']} characters`;
                }
                break;
        }
        if (errorMessage) {
            this.showFieldError(field, errorMessage);
        }
        else {
            this.clearFieldError(field);
        }
    }
    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        // Remove existing error
        this.clearFieldError(field);
        // Add error message
        field.parentElement?.appendChild(errorDiv);
        field.classList.add('error');
    }
    clearFieldError(field) {
        const existingError = field.parentElement?.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }
    handleSubmit() {
        // GET FORM DATA with TYPE SAFETY
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            message: document.getElementById('contactMessage').value,
            phone: document.getElementById('contactPhone').value
        };
        // VALIDATE ENTIRE FORM
        const validation = ContactFormValidator.validateForm(formData);
        // Clear previous errors
        this.clearAllErrors();
        if (!validation.isValid) {
            this.showFormErrors(validation.errors);
            return;
        }
        // SUCCESS: Save submission
        this.saveSubmission(formData);
        this.showSuccess();
        this.formElement.reset();
    }
    showFormErrors(errors) {
        const errorContainer = document.getElementById('formErrors');
        if (errorContainer) {
            errorContainer.innerHTML = `
        <div class="error-box">
          <h4>Please fix the following errors:</h4>
          <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        </div>
      `;
        }
    }
    clearAllErrors() {
        const errorContainer = document.getElementById('formErrors');
        if (errorContainer) {
            errorContainer.innerHTML = '';
        }
        // Clear field errors
        const fieldErrors = this.formElement.querySelectorAll('.field-error');
        fieldErrors.forEach(error => error.remove());
        const errorFields = this.formElement.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
      <h4>✓ Message sent successfully!</h4>
      <p>We'll get back to you soon.</p>
    `;
        const formErrors = document.getElementById('formErrors');
        if (formErrors) {
            formErrors.appendChild(successDiv);
            // Auto-remove after 3 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 3000);
        }
    }
    // READONLY to prevent modification
    saveSubmission(data) {
        const readonlyData = Object.freeze({ ...data });
        this.submissions.push(readonlyData);
        // Save to localStorage
        localStorage.setItem('contactSubmissions', JSON.stringify(this.submissions));
        // Display submission count
        this.updateSubmissionCount();
    }
    loadSubmissions() {
        const stored = localStorage.getItem('contactSubmissions');
        if (stored) {
            try {
                this.submissions = JSON.parse(stored);
                this.updateSubmissionCount();
            }
            catch (error) {
                console.error('Error loading submissions:', error);
            }
        }
    }
    updateSubmissionCount() {
        const counter = document.getElementById('submissionCount');
        if (counter) {
            counter.textContent = `Total submissions: ${this.submissions.length}`;
        }
    }
}
// CHARACTER COUNTER utility function
// FUNCTION WITH TYPED PARAMETERS and RETURN TYPE
function setupCharacterCounter(textareaId, counterId, maxLength) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (textarea && counter) {
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            // Change color based on remaining characters
            if (remaining < 20) {
                counter.style.color = 'red';
            }
            else if (remaining < 50) {
                counter.style.color = 'orange';
            }
            else {
                counter.style.color = '#666';
            }
        };
        textarea.addEventListener('input', updateCounter);
        textarea.setAttribute('maxlength', maxLength.toString());
        updateCounter(); // Initial update
    }
}
// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create contact form instance
        new ContactForm('contactForm');
        // Setup character counter
        setupCharacterCounter('contactMessage', 'charCounter', 500);
        console.log('Contact form initialized successfully!');
    }
    catch (error) {
        console.error('Error initializing contact form:', error);
    }
});
export {};
//# sourceMappingURL=contact.js.map