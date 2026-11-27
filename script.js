document.addEventListener("DOMContentLoaded", () => {
  const fanForm = document.querySelector(".fan-form-content");
  if (!fanForm) return;

  fanForm.setAttribute("novalidate", "");

  const namaInput = document.getElementById("nama");
  const emailInput = document.getElementById("email");
  const pembalapSelect = document.getElementById("pembalap");
  const mobilSelect = document.getElementById("mobil");
  const pesanTextarea = document.getElementById("pesan");
  const ratingInputs = Array.from(document.querySelectorAll('input[name="rating"]'));

  const errorMap = new Map();
  [namaInput, emailInput, pembalapSelect, mobilSelect, pesanTextarea].forEach((el) => {
    if (!el) return;
    const errEl = document.createElement("small");
    errEl.className = "error-msg";
    el.insertAdjacentElement("afterend", errEl);
    errorMap.set(el, errEl);
  });

  const ratingFieldset = document.querySelector(".rating-group");
  const ratingErrorEl = document.createElement("small");
  ratingErrorEl.className = "error-msg";
  ratingFieldset?.appendChild(ratingErrorEl);

  const statusBox = document.createElement("div");
  statusBox.className = "form-status";
  fanForm.appendChild(statusBox);

  function setFieldState(el, message, errEl) {
    if (errEl) errEl.textContent = message;
    if (!el) return;
    if (message) {
      el.classList.add("input-error");
      el.classList.remove("input-valid");
    } else {
      el.classList.remove("input-error");
      el.classList.add("input-valid");
    }
  }

  function validateUsername() {
    const val = namaInput.value.trim();
    if (!val) {
      setFieldState(namaInput, "Username wajib diisi.", errorMap.get(namaInput));
      return false;
    }
    if (val.length < 3) {
      setFieldState(namaInput, "Username minimal 3 karakter.", errorMap.get(namaInput));
      return false;
    }
    setFieldState(namaInput, "", errorMap.get(namaInput));
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setFieldState(emailInput, "Email wajib diisi.", errorMap.get(emailInput));
      return false;
    }
    if (!emailPattern.test(val)) {
      setFieldState(emailInput, "Format email belum valid (contoh: guest@email.com).", errorMap.get(emailInput));
      return false;
    }
    setFieldState(emailInput, "", errorMap.get(emailInput));
    return true;
  }

  function validateSelect(selectEl, labelText) {
    if (!selectEl.value) {
      setFieldState(selectEl, `Silakan pilih ${labelText} terlebih dahulu.`, errorMap.get(selectEl));
      return false;
    }
    setFieldState(selectEl, "", errorMap.get(selectEl));
    return true;
  }

  function validateRating() {
    const checked = ratingInputs.some((r) => r.checked);
    ratingErrorEl.textContent = checked ? "" : "Pilih salah satu rating game.";
    return checked;
  }

  function validatePesan() {
    const val = pesanTextarea.value.trim();
    if (val.length > 0 && val.length < 10) {
      setFieldState(pesanTextarea, "Jika diisi, opini/pengalaman minimal 10 karakter.", errorMap.get(pesanTextarea));
      return false;
    }
    setFieldState(pesanTextarea, "", errorMap.get(pesanTextarea));
    return true;
  }

  namaInput?.addEventListener("input", validateUsername);
  emailInput?.addEventListener("input", validateEmail);
  pembalapSelect?.addEventListener("change", () => validateSelect(pembalapSelect, "Favorite Blacklist"));
  mobilSelect?.addEventListener("change", () => validateSelect(mobilSelect, "Fav Blacklist Car"));
  ratingInputs.forEach((r) => r.addEventListener("change", validateRating));
  pesanTextarea?.addEventListener("input", validatePesan);

  fanForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = [
      validateUsername(),
      validateEmail(),
      validateSelect(pembalapSelect, "Favorite Blacklist"),
      validateSelect(mobilSelect, "Fav Blacklist Car"),
      validateRating(),
      validatePesan(),
    ];

    const allValid = results.every(Boolean);

    if (!allValid) {
      statusBox.className = "form-status error";
      statusBox.textContent = "Masih ada kolom yang belum sesuai. Cek kembali bagian bertanda merah.";
      const firstInvalid = fanForm.querySelector(".input-error") || ratingFieldset;
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    statusBox.className = "form-status success";
    statusBox.textContent = `Respon valid! Selamat bergabung di Rockport, ${namaInput.value.trim()}.`;
    fanForm.reset();
    fanForm.querySelectorAll(".input-valid").forEach((el) => el.classList.remove("input-valid"));
  });
});
