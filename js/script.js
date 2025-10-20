// Buzzworks VA Scripts - FIXED VERSION

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form Submission Handler
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toLocaleString()
            };

            // Submit to Google Sheets
            submitToGoogleSheets(formData);
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// Google Sheets Submission Function - FIXED VERSION
function submitToGoogleSheets(formData) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx7gUKdx3CrA63CQIB9iylh-QfB0eZefkAH6fT7ndr9nAQasdYOaEo1vYqkl5I8d7hi/exec';
    
    // Disable submit button to prevent double submission
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Convert formData to URLSearchParams (this is what Google Apps Script expects)
    const params = new URLSearchParams();
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('phone', formData.phone);
    params.append('company', formData.company);
    params.append('message', formData.message);
    params.append('timestamp', formData.timestamp);
    
    fetch(scriptURL, {
        method: 'POST',
        body: params
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showSuccessMessage();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting your form. Please try again or email us directly.');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    });
}

function showSuccessMessage() {
    const form = document.getElementById('consultationForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form
        form.reset();
        
        // Optional: Hide success message and show form again after 10 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        }, 10000);
    }
}
