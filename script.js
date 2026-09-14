"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const themeBtn = document.querySelector(".theme-btn");
  const navToggle = document.getElementById("navToggle");
  const navbar = document.getElementById("navbar");
  const orderForm = document.getElementById("orderForm");
  const topBtn = document.getElementById("topBtn");

  /* ---------------- Dark mode ---------------- */
  if (themeBtn) {
    const savedTheme = localStorage.getItem("site-theme");
    if (savedTheme === "dark") body.classList.add("dark-mode");
    updateThemeButton();

    themeBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem("site-theme", body.classList.contains("dark-mode") ? "dark" : "light");
      updateThemeButton();
    });
  }

  function updateThemeButton() {
    if (!themeBtn) return;
    const dark = body.classList.contains("dark-mode");
    themeBtn.textContent = dark ? "☀️" : "☾";
    themeBtn.setAttribute("title", dark ? "حالت روشن" : "حالت شب");
  }

  /* ---------------- Mobile nav ---------------- */
  if (navToggle && navbar) {
    navToggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navbar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Smooth scroll ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------------- Back to top ---------------- */
  function checkTopButton() {
    if (!topBtn) return;
    const show = window.scrollY > 500;
    topBtn.style.display = show ? "flex" : "none";
    topBtn.classList.toggle("show", show);
  }
  window.addEventListener("scroll", checkTopButton, { passive: true });
  checkTopButton();

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Section reveal ---------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("active"));
  }

  /* ---------------- Order form ---------------- */
  if (!orderForm) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const serviceInput = document.getElementById("service");
  const budgetInput = document.getElementById("budget");
  const descriptionInput = document.getElementById("description");
  const submitButton = orderForm.querySelector('button[type="submit"]');

  function createErrorBox(field, message) {
    clearFieldError(field);
    field.classList.add("input-error");
    const error = document.createElement("small");
    error.className = "js-field-error";
    error.textContent = message;
    field.parentElement.appendChild(error);
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove("input-error");
    const oldError = field.parentElement.querySelector(".js-field-error");
    if (oldError) oldError.remove();
  }

  function clearAllErrors() {
    orderForm.querySelectorAll(".input-error").forEach(field => field.classList.remove("input-error"));
    orderForm.querySelectorAll(".js-field-error").forEach(error => error.remove());
    const oldFormMessage = document.getElementById("jsFormMessage");
    if (oldFormMessage) oldFormMessage.remove();
  }

  function showFormMessage(message, type) {
    const old = document.getElementById("jsFormMessage");
    if (old) old.remove();

    const box = document.createElement("div");
    box.id = "jsFormMessage";
    box.className = "form-message " + (type === "success" ? "success" : "error");
    box.textContent = message;

    orderForm.appendChild(box);
  }

  /* ---- validators ---- */
  function validateName() {
    if (!nameInput) return true;
    const value = nameInput.value.trim();

    if (!value) return createErrorBox(nameInput, "نام و نام خانوادگی را وارد نکرده‌اید."), false;
    if (value.length < 5) return createErrorBox(nameInput, "نام و نام خانوادگی خیلی کوتاه است."), false;
    if (value.length > 60) return createErrorBox(nameInput, "نام و نام خانوادگی بیش از حد طولانی است."), false;

    const namePattern = /^[A-Za-z\u0600-\u06FF\u200C]+(?:[\s\u200C-]+[A-Za-z\u0600-\u06FF\u200C]+)+$/;
    if (!namePattern.test(value)) {
      return createErrorBox(nameInput, "نام نامعتبر است؛ فقط حروف و فاصله مجاز است."), false;
    }

    const parts = value.split(/[\s\u200C-]+/).filter(Boolean);
    if (parts.length < 2) return createErrorBox(nameInput, "لطفاً نام و نام خانوادگی را کامل وارد کنید."), false;

    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const value = emailInput.value.trim();

    if (!value) return createErrorBox(emailInput, "ایمیل را وارد نکرده‌اید."), false;
    if (value.length > 254) return createErrorBox(emailInput, "ایمیل وارد شده بیش از حد طولانی است."), false;

    const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
    if (!emailPattern.test(value)) {
      return createErrorBox(emailInput, "فرمت ایمیل صحیح نیست؛ مثلاً example@gmail.com"), false;
    }

    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    let value = phoneInput.value.trim().replace(/\s|-/g, "");

    if (!value) return createErrorBox(phoneInput, "شماره تماس را وارد نکرده‌اید."), false;

    const iranPhone = /^09\d{9}$/;
    const internationalPhone = /^\+989\d{9}$/;
    if (!iranPhone.test(value) && !internationalPhone.test(value)) {
      return createErrorBox(phoneInput, "شماره تماس معتبر نیست؛ مثال صحیح: 09123456789"), false;
    }

    clearFieldError(phoneInput);
    return true;
  }

  function validateSelect(field, message) {
    if (!field) return true;
    if (!field.value || field.value.trim() === "") return createErrorBox(field, message), false;
    clearFieldError(field);
    return true;
  }

  function validateDescription() {
    if (!descriptionInput) return true;
    const value = descriptionInput.value.trim();

    if (!value) return createErrorBox(descriptionInput, "توضیحات پروژه را وارد نکرده‌اید."), false;
    if (value.length < 15) return createErrorBox(descriptionInput, "توضیحات پروژه خیلی کوتاه است؛ حداقل ۱۵ کاراکتر توضیح دهید."), false;
    if (value.length > 3000) return createErrorBox(descriptionInput, "توضیحات پروژه بیش از حد طولانی است."), false;

    clearFieldError(descriptionInput);
    return true;
  }

  function validateForm() {
    clearAllErrors();

    const results = [
      { valid: validateName(), field: nameInput },
      { valid: validateEmail(), field: emailInput },
      { valid: validatePhone(), field: phoneInput },
      { valid: validateSelect(serviceInput, "نوع خدمات را انتخاب نکرده‌اید."), field: serviceInput },
      { valid: validateSelect(budgetInput, "بودجه تقریبی پروژه را انتخاب نکرده‌اید."), field: budgetInput },
      { valid: validateDescription(), field: descriptionInput }
    ];

    const invalid = results.find(item => !item.valid);
    if (invalid) {
      if (invalid.field) invalid.field.focus();
      showFormMessage("درخواست ارسال نشد؛ لطفاً خطاهای مشخص‌شده زیر فیلدها را برطرف کنید.", "error");
      return false;
    }

    return true;
  }

  /* ---- submission ---- */
  orderForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!validateForm()) return;

    if (!orderForm.action || !orderForm.action.includes("formspree.io/f/")) {
      showFormMessage("ارسال انجام نشد؛ آدرس Formspree فرم تنظیم نشده است.", "error");
      return;
    }

    const originalText = submitButton ? submitButton.innerHTML : "ارسال درخواست";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "⏳ در حال ارسال درخواست...";
      submitButton.style.opacity = "0.7";
    }

    try {
      const formData = new FormData(orderForm);
      const response = await fetch(orderForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        let errorMessage = "Formspree درخواست را قبول نکرد.";
        try {
          const data = await response.json();
          if (data && data.errors && data.errors.length) {
            errorMessage = data.errors.map(error => error.message).join(" ");
          }
        } catch (_) { /* پاسخ JSON نبود */ }
        throw new Error(errorMessage);
      }

      showFormMessage("✓ درخواست شما با موفقیت ارسال شد. در حال انتقال به صفحه تأیید...", "success");

      if (submitButton) {
        submitButton.innerHTML = "✓ درخواست ارسال شد";
        submitButton.style.opacity = "1";
      }

      setTimeout(() => { window.location.href = "success.html"; }, 900);

    } catch (error) {
      console.error("Formspree Error:", error);
      showFormMessage(
        "ارسال درخواست انجام نشد. " + (error.message || "لطفاً اتصال اینترنت و اطلاعات فرم را بررسی کنید."),
        "error"
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        submitButton.style.opacity = "1";
      }
    }
  });

  /* ---- live validation ---- */
  if (nameInput) {
    nameInput.addEventListener("blur", validateName);
    nameInput.addEventListener("input", () => clearFieldError(nameInput));
  }
  if (emailInput) {
    emailInput.addEventListener("blur", validateEmail);
    emailInput.addEventListener("input", () => clearFieldError(emailInput));
  }
  if (phoneInput) {
    phoneInput.addEventListener("blur", validatePhone);
    phoneInput.addEventListener("input", () => clearFieldError(phoneInput));
  }
  if (serviceInput) serviceInput.addEventListener("change", () => clearFieldError(serviceInput));
  if (budgetInput) budgetInput.addEventListener("change", () => clearFieldError(budgetInput));
  if (descriptionInput) {
    descriptionInput.addEventListener("blur", validateDescription);
    descriptionInput.addEventListener("input", () => clearFieldError(descriptionInput));
  }
});
