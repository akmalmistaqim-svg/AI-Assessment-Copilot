/**
 * AI Assessment Copilot - Login Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. If already logged in, redirect straight to user's dashboard
  redirectIfLoggedIn();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const alertBox = document.getElementById('loginAlert');
  const alertMessage = document.getElementById('alertMessage');
  const emailFeedback = document.getElementById('emailFeedback');
  const passwordFeedback = document.getElementById('passwordFeedback');

  // Password Show / Hide toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      togglePasswordBtn.innerHTML = isPassword 
        ? '<i data-lucide="eye-off" style="width: 18px; height: 18px;"></i>' 
        : '<i data-lucide="eye" style="width: 18px; height: 18px;"></i>';
      
      if (window.lucide) {
        window.lucide.createIcons({ root: togglePasswordBtn });
      }
    });
  }


  function clearErrors() {
    alertBox.classList.remove('show');
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    if (emailFeedback) emailFeedback.classList.remove('show');
    if (passwordFeedback) passwordFeedback.classList.remove('show');
  }

  function showAlert(msg) {
    alertMessage.textContent = msg;
    alertBox.classList.add('show');
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Form submission handler
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasValidationError = false;

    // Validate Email
    if (!email) {
      emailInput.classList.add('input-error');
      if (emailFeedback) {
        emailFeedback.textContent = 'Email wajib diisi.';
        emailFeedback.classList.add('show');
      }
      hasValidationError = true;
    } else if (!isValidEmail(email)) {
      emailInput.classList.add('input-error');
      if (emailFeedback) {
        emailFeedback.textContent = 'Format email tidak valid.';
        emailFeedback.classList.add('show');
      }
      hasValidationError = true;
    }

    // Validate Password
    if (!password) {
      passwordInput.classList.add('input-error');
      if (passwordFeedback) {
        passwordFeedback.textContent = 'Password wajib diisi.';
        passwordFeedback.classList.add('show');
      }
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    // Authenticate against stored users
    const users = getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!matchedUser) {
      showAlert('Email atau password salah.');
      return;
    }

    // Login successful
    setCurrentUser(matchedUser);

    // Redirect based on user role
    if (matchedUser.role === 'dosen') {
      window.location.href = 'dashboard/dosen.html';
    } else if (matchedUser.role === 'mahasiswa') {
      window.location.href = 'dashboard/mahasiswa.html';
    } else {
      showAlert('Role akun tidak dikenali.');
    }
  });

  // Clear errors on typing
  emailInput.addEventListener('input', clearErrors);
  passwordInput.addEventListener('input', clearErrors);
});
