console.log('app.js loading...');
console.log('emailjs available?', typeof emailjs !== 'undefined');
console.log('window.emailjs?', typeof window.emailjs);

// Wait for EmailJS library to load
let emailjsInitialized = false;
let checkCount = 0;

function initEmailJS() {
    checkCount++;
    console.log(`Check #${checkCount}: emailjs =`, typeof emailjs, typeof window.emailjs);
    
    if ((typeof emailjs !== 'undefined' || typeof window.emailjs !== 'undefined') && !emailjsInitialized) {
        const lib = emailjs || window.emailjs;
        lib.init("EpH9evOWcMPrxBr-u");
        console.log('✓ EmailJS initialized');
        emailjsInitialized = true;
    } else if (!emailjsInitialized && checkCount < 50) {
        setTimeout(initEmailJS, 100);
    } else if (!emailjsInitialized) {
        console.error('❌ EmailJS failed to load after 50 attempts');
    }
}

// Start initialization immediately
initEmailJS();

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

// Email Modal Functions
function openEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('emailForm').reset();
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

// Email Form Submission with Formspree
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emailForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Basic validation
        if (!email || !email.includes('@')) {
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.classList.remove('hidden');
            return;
        }
        
        errorMessage.classList.add('hidden');
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Email submitted successfully!');
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Something went wrong. Please try again.';
            errorMessage.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});

console.log('Resonant website loaded');