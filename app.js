/* Melotone PWA Frontend Logic */

/** Backend: same host, port 5050 (works for laptop + phone) */
const API_PORT = 5050;
const API_BASE = `https://phthisical-phantastical-emelina.ngrok-free.dev`;

function $(id) {
  return document.getElementById(id);
}

let state = {
  tone: "warm, friendly",
  lang: "en",        // translation target language
  uiLang: "en",      // UI language
  hasEmail: false,
  hasShortMsg: false,
  situation: "general",
  mode: "email"      // "email" or "chat"
};

/* Language labels for translation prompts */
const languageLabels = {
  en: "English",
  "pt-PT": "European Portuguese",
  es: "Spanish",
  pl: "Polish",
  ro: "Romanian"
};

/* UI translations */
const uiTexts = {
  en: {
    title: "Melotone",
    subtitle: "Email & chat assistant for immigrants and expats.",
    draft: "Draft",
    yourMessage: "Your message",
    tone: "Tone",
    lang: "Language",
    situation: "Who are you writing to?",
    situationHelp: "This helps Melotone choose the right style for your situation.",
    emailTo: "Email to",
    subject: "Subject",
    polishedEmail: "Polished email",
    shortMsg: "Short chat message",
    messageTo: "Send message to",
    footer:
      "Melotone helps you rewrite and translate messages for schools, NHS, landlords, employers and immigration. It doesn’t replace professional medical, legal or immigration advice. Always check the text before you send it.",
    navCompose: "Compose",
    navHistory: "History",
    navSettings: "Settings",
    mode: "Mode",
    modeEmail: "Email",
    modeChat: "Chat",
    fixBtn: "Fix my message ✨",
    rewriteBtn: "Rewrite ✉️",
    translateBtn: "Translate 🌍",
    shortMsgBtn: "Short message 💬",
    photoBtn: "Photo → Translate 📷",
    copyEmailBtn: "Copy email 📑",
    sendEmailBtn: "Send email 📤",
    copyShortBtn: "Copy message 📑",
    sendMsgBtn: "Send message 📲"
  },
  pt: {
    title: "Melotone",
    subtitle: "Assistente de email e mensagens para imigrantes e expatriados.",
    draft: "Rascunho",
    yourMessage: "A sua mensagem",
    tone: "Tom",
    lang: "Idioma",
    situation: "Para quem está a escrever?",
    situationHelp:
      "Isto ajuda a Melotone a escolher o estilo certo para a sua situação.",
    emailTo: "Email para",
    subject: "Assunto",
    polishedEmail: "Email melhorado",
    shortMsg: "Mensagem curta",
    messageTo: "Enviar mensagem para",
    footer:
      "A Melotone ajuda a reescrever e traduzir mensagens para escolas, SNS, senhorios, empregadores e imigração. Não substitui aconselhamento médico, jurídico ou de imigração. Verifique sempre o texto antes de enviar.",
    navCompose: "Escrever",
    navHistory: "Histórico",
    navSettings: "Definições",
    mode: "Modo",
    modeEmail: "Email",
    modeChat: "Chat",
    fixBtn: "Corrigir mensagem ✨",
    rewriteBtn: "Reescrever ✉️",
    translateBtn: "Traduzir 🌍",
    shortMsgBtn: "Mensagem curta 💬",
    photoBtn: "Foto → Traduzir 📷",
    copyEmailBtn: "Copiar email 📑",
    sendEmailBtn: "Enviar email 📤",
    copyShortBtn: "Copiar mensagem 📑",
    sendMsgBtn: "Enviar mensagem 📲"
  },
  es: {
    title: "Melotone",
    subtitle: "Asistente de correo y chat para inmigrantes y expatriados.",
    draft: "Borrador",
    yourMessage: "Tu mensaje",
    tone: "Tono",
    lang: "Idioma",
    situation: "¿A quién escribes?",
    situationHelp:
      "Esto ayuda a Melotone a elegir el estilo adecuado para tu situación.",
    emailTo: "Correo a",
    subject: "Asunto",
    polishedEmail: "Correo mejorado",
    shortMsg: "Mensaje corto",
    messageTo: "Enviar mensaje a",
    footer:
      "Melotone te ayuda a reescribir y traducir mensajes para colegios, sanidad, propietarios, empleadores e inmigración. No sustituye el asesoramiento médico, legal o de inmigración. Revisa siempre el texto antes de enviarlo.",
    navCompose: "Redactar",
    navHistory: "Historial",
    navSettings: "Ajustes",
    mode: "Modo",
    modeEmail: "Correo",
    modeChat: "Chat",
    fixBtn: "Arreglar mi mensaje ✨",
    rewriteBtn: "Reescribir ✉️",
    translateBtn: "Traducir 🌍",
    shortMsgBtn: "Mensaje corto 💬",
    photoBtn: "Foto → Traducir 📷",
    copyEmailBtn: "Copiar correo 📑",
    sendEmailBtn: "Enviar correo 📤",
    copyShortBtn: "Copiar mensaje 📑",
    sendMsgBtn: "Enviar mensaje 📲"
  },
  pl: {
    title: "Melotone",
    subtitle: "Asystent e-maili i wiadomości dla imigrantów i ekspatów.",
    draft: "Szkic",
    yourMessage: "Twoja wiadomość",
    tone: "Ton",
    lang: "Język",
    situation: "Do kogo piszesz?",
    situationHelp:
      "To pomaga Melotone dobrać odpowiedni styl do Twojej sytuacji.",
    emailTo: "E-mail do",
    subject: "Temat",
    polishedEmail: "Poprawiony e-mail",
    shortMsg: "Krótka wiadomość",
    messageTo: "Wyślij wiadomość do",
    footer:
      "Melotone pomaga przepisywać i tłumaczyć wiadomości do szkół, służby zdrowia, właścicieli mieszkań, pracodawców i urzędów imigracyjnych. Nie zastępuje porady medycznej, prawnej ani imigracyjnej. Zawsze sprawdź tekst przed wysłaniem.",
    navCompose: "Napisz",
    navHistory: "Historia",
    navSettings: "Ustawienia",
    mode: "Tryb",
    modeEmail: "E-mail",
    modeChat: "Czat",
    fixBtn: "Popraw wiadomość ✨",
    rewriteBtn: "Przepisz ✉️",
    translateBtn: "Przetłumacz 🌍",
    shortMsgBtn: "Krótka wiadomość 💬",
    photoBtn: "Zdjęcie → Tłumaczenie 📷",
    copyEmailBtn: "Kopiuj e-mail 📑",
    sendEmailBtn: "Wyślij e-mail 📤",
    copyShortBtn: "Kopiuj wiadomość 📑",
    sendMsgBtn: "Wyślij wiadomość 📲"
  },
  ro: {
    title: "Melotone",
    subtitle: "Asistent de email și mesaje pentru imigranți și expați.",
    draft: "Ciornă",
    yourMessage: "Mesajul tău",
    tone: "Ton",
    lang: "Limbă",
    situation: "Cui scrii?",
    situationHelp:
      "Acest lucru o ajută pe Melotone să aleagă stilul potrivit pentru situația ta.",
    emailTo: "Email către",
    subject: "Subiect",
    polishedEmail: "Email îmbunătățit",
    shortMsg: "Mesaj scurt",
    messageTo: "Trimite mesaj către",
    footer:
      "Melotone te ajută să rescrii și să traduci mesaje pentru școli, sistemul de sănătate, proprietari, angajatori și imigrație. Nu înlocuiește sfatul medical, juridic sau de imigrație. Verifică întotdeauna textul înainte de a-l trimite.",
    navCompose: "Compune",
    navHistory: "Istoric",
    navSettings: "Setări",
    mode: "Mod",
    modeEmail: "Email",
    modeChat: "Chat",
    fixBtn: "Corectează mesajul ✨",
    rewriteBtn: "Rescrie ✉️",
    translateBtn: "Tradu 🌍",
    shortMsgBtn: "Mesaj scurt 💬",
    photoBtn: "Poză → Traducere 📷",
    copyEmailBtn: "Copiază email 📑",
    sendEmailBtn: "Trimite email 📤",
    copyShortBtn: "Copiază mesaj 📑",
    sendMsgBtn: "Trimite mesaj 📲"
  }
};

/* ---------------- Helper: Call Backend ---------------- */

async function callApi(endpoint, payload) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Backend did not return JSON. Raw response:", text);
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `HTTP ${res.status} – ${text.slice(0, 120)}`);
  }

  return data || {};
}

/* ---------------- UI Helpers ---------------- */

function setBusy(val) {
  document.body.classList.toggle("busy", val);
}

function setStatus(msg) {
  const status = $("statusText");
  if (status) status.textContent = msg;
}

/* Apply UI language texts */

function applyUiLanguage() {
  const t = uiTexts[state.uiLang] || uiTexts.en;

  if ($("appTitle")) $("appTitle").textContent = t.title;
  if ($("appSubtitle")) $("appSubtitle").textContent = t.subtitle;
  if ($("draftLabel")) $("draftLabel").textContent = t.draft;
  if ($("yourMessageLabel")) $("yourMessageLabel").textContent = t.yourMessage;
  if ($("toneLabel")) $("toneLabel").textContent = t.tone;
  if ($("langLabel")) $("langLabel").textContent = t.lang;
  if ($("situationLabel")) $("situationLabel").textContent = t.situation;
  if ($("situationHelp")) $("situationHelp").textContent = t.situationHelp;
  if ($("emailToLabel")) $("emailToLabel").textContent = t.emailTo;
  if ($("subjectLabel")) $("subjectLabel").textContent = t.subject;
  if ($("polishedEmailLabel")) $("polishedEmailLabel").textContent = t.polishedEmail;
  if ($("shortMsgLabel")) $("shortMsgLabel").textContent = t.shortMsg;
  if ($("messageToLabel")) $("messageToLabel").textContent = t.messageTo;
  if ($("footerText")) $("footerText").textContent = t.footer;
  if ($("navCompose")) $("navCompose").textContent = t.navCompose;
  if ($("navHistory")) $("navHistory").textContent = t.navHistory;
  if ($("navSettings")) $("navSettings").textContent = t.navSettings;
  if ($("modeLabel")) $("modeLabel").textContent = t.mode;
  if ($("modeEmailLabel")) $("modeEmailLabel").textContent = t.modeEmail;
  if ($("modeChatLabel")) $("modeChatLabel").textContent = t.modeChat;

  // Buttons
  if ($("fixBtn")) $("fixBtn").textContent = t.fixBtn;
  if ($("rewriteBtn")) $("rewriteBtn").textContent = t.rewriteBtn;
  if ($("translateBtn")) $("translateBtn").textContent = t.translateBtn;
  if ($("shortMsgBtn")) $("shortMsgBtn").textContent = t.shortMsgBtn;
  if ($("photoTranslateBtn")) $("photoTranslateBtn").textContent = t.photoBtn;

  if ($("copyEmailBtn")) $("copyEmailBtn").textContent = t.copyEmailBtn;
  if ($("sendEmailBtn")) $("sendEmailBtn").textContent = t.sendEmailBtn;
  if ($("copyShortBtn")) $("copyShortBtn").textContent = t.copyShortBtn;
  if ($("sendMsgBtn")) $("sendMsgBtn").textContent = t.sendMsgBtn;
}

/* ---------------- Tone chips ---------------- */

const toneChipsContainer = $("toneChips");
if (toneChipsContainer) {
  const chips = toneChipsContainer.querySelectorAll(".chip");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      state.tone = chip.dataset.tone || state.tone;
    });
  });
}

/* ---------------- Language select (target language) ---------------- */

const languageSelect = $("languageSelect");
if (languageSelect) {
  state.lang = languageSelect.value;
  languageSelect.addEventListener("change", () => {
    state.lang = languageSelect.value;
  });
}

/* ---------------- Situation select ---------------- */

const situationSelect = $("situationSelect");
if (situationSelect) {
  state.situation = situationSelect.value;
  situationSelect.addEventListener("change", () => {
    state.situation = situationSelect.value;
  });
}

/* ---------------- Theme toggle ---------------- */

const themeToggle = $("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

(function initTheme() {
  if (!themeToggle) return;
  const saved = localStorage.getItem("melotone-theme") || "light";
  applyTheme(saved);

  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("melotone-theme", next);
    } catch (e) {
      // ignore
    }
  });
})();

/* ---------------- UI Language overlay ---------------- */

(function initUiLanguage() {
  const overlay = $("languageOverlay");
  if (!overlay) {
    applyUiLanguage();
    return;
  }

  const storedLang = localStorage.getItem("melotone-ui-lang");

  if (storedLang && uiTexts[storedLang]) {
    state.uiLang = storedLang;
    overlay.style.display = "none";
    applyUiLanguage();
    return;
  }

  overlay.style.display = "flex";
  const buttons = overlay.querySelectorAll(".lang-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang || "en";
      state.uiLang = lang;
      try {
        localStorage.setItem("melotone-ui-lang", lang);
      } catch (e) {}
      overlay.style.display = "none";
      applyUiLanguage();
    });
  });
})();

/* ---------------- Bottom nav / views ---------------- */

const navButtons = document.querySelectorAll(".bottom-nav-btn");
const views = document.querySelectorAll(".view");

if (navButtons.length && views.length) {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      views.forEach((v) => {
        v.classList.toggle("view--active", v.id === targetId);
      });

      navButtons.forEach((b) =>
        b.classList.toggle("bottom-nav-btn--active", b === btn)
      );
    });
  });
}

/* ---------------- Mode toggle (Email / Chat tabs) ---------------- */

const modeToggle = $("modeToggle");
if (modeToggle) {
  const options = modeToggle.querySelectorAll(".toggle-option");

  function updateModeUi() {
    const emailSection = $("emailOutputSection");
    const chatSection = $("chatOutputSection");

    options.forEach((opt) => {
      const isActive = opt.dataset.mode === state.mode;
      opt.classList.toggle("toggle-option--active", isActive);
    });

    if (state.mode === "email") {
      modeToggle.classList.remove("mode-chat");
      modeToggle.classList.add("mode-email");
      if (emailSection) emailSection.style.display = "block";
      if (chatSection) chatSection.style.display = "none";
    } else {
      modeToggle.classList.remove("mode-email");
      modeToggle.classList.add("mode-chat");
      if (emailSection) emailSection.style.display = "none";
      if (chatSection) chatSection.style.display = "block";
    }
  }

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      state.mode = opt.dataset.mode || "email";
      updateModeUi();
    });
  });

  updateModeUi();
}

/* ---------------- Fix My Message Handler ---------------- */

async function handleFix() {
  const inputEl = $("inputText");
  if (!inputEl) return;

  const input = inputEl.value.trim();
  if (!input) {
    alert("Write or paste a message first.");
    return;
  }

  setBusy(true);
  setStatus("Fixing your message…");

  try {
    const langCode = state.lang;
    const langLabel = languageLabels[langCode] || langCode;

    const result = await callApi("/api/fix", {
      text: input,
      style: state.tone,
      preferredLanguage: langLabel,
      platform: $("channelSelect")?.value || "email",
      situation: state.situation
    });

    $("subjectText").textContent = result.subject || "No subject";
    $("outputText").textContent = result.email || "";
    $("shortMsgText").textContent = result.shortMessage || "";

    state.hasEmail = !!result.email;
    state.hasShortMsg = !!result.shortMessage;

    setStatus(
      result.detectedLanguage
        ? `Fixed ✔ (detected: ${result.detectedLanguage})`
        : "Fixed ✔"
    );
  } catch (err) {
    console.error(err);
    setStatus("Fix My Message failed: " + err.message);
  } finally {
    setBusy(false);
  }
}

/* ---------------- Rewrite Handler ---------------- */

async function handleRewrite() {
  const inputEl = $("inputText");
  if (!inputEl) return;

  const input = inputEl.value.trim();
  if (!input) {
    alert("Write something first.");
    return;
  }

  setBusy(true);
  setStatus("Rewriting…");

  try {
    const result = await callApi("/api/rewrite", {
      text: input,
      style: state.tone,
      platform: $("channelSelect")?.value || "email",
      situation: state.situation
    });

    $("subjectText").textContent = result.subject || "No subject";
    $("outputText").textContent = result.rewritten || "";
    $("shortMsgText").textContent = result.shortMessage || "";

    state.hasEmail = !!result.rewritten;
    state.hasShortMsg = !!result.shortMessage;

    setStatus("Done ✔");
  } catch (err) {
    console.error(err);
    setStatus("Rewrite failed: " + err.message);
  } finally {
    setBusy(false);
  }
}

/* ---------------- Translate Handler ---------------- */

async function handleTranslate() {
  const inputEl = $("inputText");
  const outputEl = $("outputText");
  if (!inputEl || !outputEl) return;

  const originalInput = inputEl.value.trim();
  const currentEmail = outputEl.textContent.trim();

  if (!originalInput && !currentEmail) {
    alert("Write something first.");
    return;
  }

  const base = currentEmail || originalInput;

  setBusy(true);
  setStatus("Translating…");

  try {
    const langCode = state.lang;
    const langLabel = languageLabels[langCode] || langCode;

    const result = await callApi("/api/translate", {
      text: base,
      targetLanguage: langCode,
      targetLanguageLabel: langLabel,
      style: state.tone,
      platform: $("channelSelect")?.value || "email",
      situation: state.situation
    });

    $("subjectText").textContent = result.subject || "No subject";
    $("outputText").textContent = result.translated || "";
    $("shortMsgText").textContent = result.shortMessage || "";

    state.hasEmail = !!result.translated;
    state.hasShortMsg = !!result.shortMessage;

    setStatus("Translated ✔");
  } catch (err) {
    console.error(err);
    setStatus("Translation failed: " + err.message);
  } finally {
    setBusy(false);
  }
}

/* ---------------- Short Message Handler ---------------- */

async function handleShortMessage() {
  const outputBox = $("outputText");
  const inputBox = $("inputText");
  if (!outputBox || !inputBox) return;

  const base =
    state.hasEmail && outputBox.textContent.trim()
      ? outputBox.textContent
      : inputBox.value;

  if (!base.trim()) {
    alert("Write something first.");
    return;
  }

  setBusy(true);
  setStatus("Creating short message…");

  try {
    const result = await callApi("/api/short-message", {
      text: base,
      platform: $("channelSelect")?.value || "WhatsApp",
      style: state.tone,
      situation: state.situation
    });

    $("shortMsgText").textContent = result.message || "";
    state.hasShortMsg = !!result.message;

    setStatus("Short message ready ✔");
  } catch (err) {
    console.error(err);
    setStatus("Short message failed: " + err.message);
  } finally {
    setBusy(false);
  }
}

/* ---------------- Photo → Translate ---------------- */

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function handlePhotoTranslate(file) {
  if (!file) return;

  setBusy(true);
  setStatus("Reading photo…");

  try {
    const dataUrl = await fileToDataUrl(file);
    const langCode = state.lang;
    const langLabel = languageLabels[langCode] || langCode;

    const result = await callApi("/api/translate-image", {
      imageDataUrl: dataUrl,
      targetLanguage: langCode,
      targetLanguageLabel: langLabel,
      style: state.tone,
      platform: $("channelSelect")?.value || "email",
      situation: state.situation
    });

    $("subjectText").textContent = result.subject || "No subject";
    $("outputText").textContent = result.translated || "";
    $("shortMsgText").textContent = result.shortMessage || "";

    state.hasEmail = !!result.translated;
    state.hasShortMsg = !!result.shortMessage;

    setStatus("Photo translated ✔");
  } catch (err) {
    console.error(err);
    setStatus("Photo translation failed: " + err.message);
  } finally {
    setBusy(false);
  }
}

/* ---------------- Send Email & Message ---------------- */

function handleSendEmail() {
  const emailTo = $("emailTo")?.value.trim() || "";
  const subject = $("subjectText")?.textContent.trim() || "";
  const body = $("outputText")?.textContent.trim() || "";

  if (!body) {
    alert("Nothing to send yet. Generate an email first.");
    return;
  }

  const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  setStatus("Opening your email app…");
}

function handleSendMessage() {
  const channel = $("channelSelect")?.value || "WhatsApp";
  const to = $("messageTo")?.value.trim() || "";
  const text = $("shortMsgText")?.textContent.trim() || "";

  if (!text) {
    alert("Nothing to send yet. Generate a short message first.");
    return;
  }

  if (!to) {
    alert("Add who you want to send the message to first.");
    return;
  }

  let url = null;

  if (channel === "WhatsApp") {
    const digits = to.replace(/[^\d]/g, "");
    url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  } else if (channel === "SMS") {
    url = `sms:${encodeURIComponent(to)}?body=${encodeURIComponent(text)}`;
  } else if (channel === "Telegram") {
    navigator.clipboard
      .writeText(text)
      .then(() => setStatus("Message copied. Paste it into Telegram."), () =>
        setStatus("Could not copy message. Please select and copy manually.")
      );
    return;
  }

  if (url) {
    window.open(url, "_blank");
    setStatus(`Opening ${channel}…`);
  }
}

/* ---------------- Event Listeners ---------------- */

if ($("fixBtn")) $("fixBtn").addEventListener("click", handleFix);
if ($("rewriteBtn")) $("rewriteBtn").addEventListener("click", handleRewrite);
if ($("translateBtn")) $("translateBtn").addEventListener("click", handleTranslate);
if ($("shortMsgBtn")) $("shortMsgBtn").addEventListener("click", handleShortMessage);

if ($("copyEmailBtn")) {
  $("copyEmailBtn").addEventListener("click", () => {
    const text = $("outputText")?.textContent || "";
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(
      () => setStatus("Email copied to clipboard ✅"),
      () => setStatus("Could not copy email. Please select and copy manually.")
    );
  });
}

if ($("copyShortBtn")) {
  $("copyShortBtn").addEventListener("click", () => {
    const text = $("shortMsgText")?.textContent || "";
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(
      () => setStatus("Message copied to clipboard ✅"),
      () => setStatus("Could not copy message. Please select and copy manually.")
    );
  });
}

if ($("sendEmailBtn")) {
  $("sendEmailBtn").addEventListener("click", handleSendEmail);
}

if ($("sendMsgBtn")) {
  $("sendMsgBtn").addEventListener("click", handleSendMessage);
}

/* Photo translate button + input */
const photoInput = $("photoInput");
const photoBtn = $("photoTranslateBtn");

if (photoBtn && photoInput) {
  photoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (file) {
      handlePhotoTranslate(file);
    }
    photoInput.value = "";
  });
}

/* Initial UI text for default language */
applyUiLanguage();
