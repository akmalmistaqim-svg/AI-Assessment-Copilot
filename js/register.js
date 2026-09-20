/**
 * AI Assessment Copilot - Register Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect straight to user's dashboard
  redirectIfLoggedIn();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
  const alertBox = document.getElementById('registerAlert');
  const alertMessage = document.getElementById('alertMessage');

  // Password visibility toggles
  function setupToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      btn.innerHTML = isPassword 
        ? '<i data-lucide="eye-off" style="width: 18px; height: 18px;"></i>' 
        : '<i data-lucide="eye" style="width: 18px; height: 18px;"></i>';
      if (window.lucide) {
        window.lucide.createIcons({ root: btn });
      }
    });
  }

  setupToggle(togglePasswordBtn, passwordInput);
  setupToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  function clearErrors() {
    alertBox.classList.remove('show', 'auth-alert-error', 'auth-alert-success');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.input-wrap').forEach(el => el.classList.remove('has-error'));
    document.querySelectorAll('.input-feedback').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
  }

  function showAlert(msg, isSuccess = false) {
    alertMessage.textContent = msg;
    alertBox.classList.remove('auth-alert-error', 'auth-alert-success');
    alertBox.classList.add(isSuccess ? 'auth-alert-success' : 'auth-alert-error');
    alertBox.classList.add('show');
  }

  function setFieldError(inputId, feedbackId, message) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    if (input) {
      input.classList.add('input-error');
      input.closest('.input-wrap')?.classList.add('has-error');
    }
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('show');
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const selectedRoleEl = document.querySelector('input[name="role"]:checked');
    const role = selectedRoleEl ? selectedRoleEl.value : null;

    let hasError = false;

    // 1. Full name validation
    if (!fullName) {
      setFieldError('fullName', 'nameFeedback', 'Nama lengkap wajib diisi.');
      hasError = true;
    }

    // 2. Email validation
    if (!email) {
      setFieldError('email', 'emailFeedback', 'Email wajib diisi.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError('email', 'emailFeedback', 'Format email tidak valid.');
      hasError = true;
    }

    // 3. Password validation (min 8 chars)
    if (!password) {
      setFieldError('password', 'passwordFeedback', 'Password wajib diisi.');
      hasError = true;
    } else if (password.length < 8) {
      setFieldError('password', 'passwordFeedback', 'Password minimal 8 karakter.');
      hasError = true;
    }

    // 4. Confirm password validation
    if (!confirmPassword) {
      setFieldError('confirmPassword', 'confirmPasswordFeedback', 'Konfirmasi password wajib diisi.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setFieldError('confirmPassword', 'confirmPasswordFeedback', 'Konfirmasi password tidak cocok.');
      hasError = true;
    }

    // 5. Role selection
    if (!role) {
      showAlert('Silakan pilih role Anda (Dosen atau Mahasiswa).');
      hasError = true;
    }

    if (hasError) return;

    // 6. Check if email already registered
    const users = getUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setFieldError('email', 'emailFeedback', 'Email ini sudah terdaftar.');
      showAlert('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      return;
    }

    // 7. Save new user to localStorage
    const newUser = {
      id: Date.now(),
      name: fullName,
      email: email,
      password: password,
      role: role
    };

    users.push(newUser);
    saveUsers(users);

    // 8. Display success feedback & redirect to login
    showAlert('Akun berhasil dibuat! Mengalihkan ke halaman login...', true);
    
    // Disable submit button during redirect
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mendaftarkan...';
    }

    setTimeout(() => {
      window.location.href = 'login.html?registered=1';
    }, 1500);
  });

  // Clear errors when inputs change
  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(el => {
    if (el) el.addEventListener('input', clearErrors);
  });
});
