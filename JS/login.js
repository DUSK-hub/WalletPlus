// Password Toggle Functionality
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// Form Submission
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset messages
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Simple validation (in real app, this would be server-side)
    if (username && password) {
        // Simulate successful login
        successMessage.classList.add('show');
        
        // Hide success message and redirect after 2 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            // Redirect to dashboard
            window.location.href = 'index.html';
        }, 2000);
    } 
    else {
        // Show error message
        errorMessage.classList.add('show');
        
        // Hide error message after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});
