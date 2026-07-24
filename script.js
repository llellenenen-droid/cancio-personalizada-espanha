// ========================================
// CantaTuHistoria - Quiz & Flow Controller
// ========================================

// Quiz State
let currentStep = 1;
const totalSteps = 9;
let quizData = {
  recipient: '',
  occasion: '',
  senderName: '',
  recipientName: '',
  genre: '',
  voice: '',
  story: '',
  phrase: '',
  phone: ''
};

// YOUR WhatsApp number (Alexandre)
const OWNER_WHATSAPP = '5511953493969';

// ========================================
// QUIZ NAVIGATION
// ========================================

function selectOption(step, value, emoji) {
  if (step === 1) quizData.recipient = value;
  if (step === 2) quizData.occasion = value;
  if (step === 4) quizData.genre = value;
  if (step === 5) quizData.voice = value;

  // Highlight selected button
  const pane = document.querySelector(`.step-pane[data-step="${step}"]`);
  if (pane) {
    pane.querySelectorAll('.opt-btn').forEach(btn => {
      btn.style.borderColor = '#E5E0F0';
      btn.style.background = '#fff';
    });
    event.currentTarget.style.borderColor = '#7C3AED';
    event.currentTarget.style.background = '#FDF2F8';
  }

  // Auto-advance after short delay
  setTimeout(() => nextStep(), 300);
}

function nextStep() {
  // Validate current step
  if (currentStep === 3) {
    const sName = document.getElementById('senderName')?.value?.trim();
    const rName = document.getElementById('recipientName')?.value?.trim();
    if (!sName || !rName) {
      alert('Por favor, indica ambos nombres para continuar.');
      return;
    }
    quizData.senderName = sName;
    quizData.recipientName = rName;
  }

  if (currentStep === 6) {
    quizData.story = document.getElementById('userStory')?.value?.trim() || '';
  }

  if (currentStep === 7) {
    quizData.phrase = document.getElementById('specialPhrase')?.value?.trim() || '';
  }

  if (currentStep < totalSteps) {
    // Hide current step
    const currentPane = document.querySelector(`.step-pane[data-step="${currentStep}"]`);
    if (currentPane) currentPane.classList.remove('active');

    // Show next step
    currentStep++;
    const nextPane = document.querySelector(`.step-pane[data-step="${currentStep}"]`);
    if (nextPane) nextPane.classList.add('active');

    // Update progress bar
    const progressPercent = Math.round((currentStep / totalSteps) * 100);
    const pBar = document.getElementById('progressBar');
    const sInd = document.getElementById('stepIndicator');
    if (pBar) pBar.style.width = `${progressPercent}%`;
    if (sInd) sInd.textContent = `Paso ${currentStep} de ${totalSteps}`;
  }
}

// ========================================
// SONG REQUEST - Send quiz data to YOUR WhatsApp
// ========================================

function startGeneration() {
  const phone = document.getElementById('userPhone')?.value?.trim();
  if (!phone) {
    alert('Por favor, introduce tu número de WhatsApp.');
    return;
  }
  quizData.phone = phone;

  // Move to step 9 (waiting screen)
  nextStep();

  // Save order to localStorage
  localStorage.setItem('cantaTuHistoriaOrder', JSON.stringify(quizData));

  // Build WhatsApp message with all quiz data for YOU (Alexandre)
  const message = `🎵 *NUEVO PEDIDO - CantaTuHistoria*

📋 *Datos del Quiz:*
━━━━━━━━━━━━━━━━━━
👤 *¿Para quién?:* ${quizData.recipient}
🎉 *Ocasión:* ${quizData.occasion}
✍️ *Nombre del creador:* ${quizData.senderName}
💝 *Nombre del homenajeado:* ${quizData.recipientName}
🎸 *Estilo musical:* ${quizData.genre}
🎤 *Tipo de voz:* ${quizData.voice}

📖 *Historia / Recuerdos:*
${quizData.story || '(No proporcionó historia)'}

💬 *Frase especial:*
${quizData.phrase || '(Ninguna)'}

📱 *WhatsApp del cliente:* ${quizData.phone}
━━━━━━━━━━━━━━━━━━

⚡ *Acción:* Genera la canción en suno.ai y envía la previa al cliente.`;

  const encodedMsg = encodeURIComponent(message);

  // Open WhatsApp to send quiz data to Alexandre
  // Small delay so the waiting screen shows first
  setTimeout(() => {
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`, '_blank');
  }, 1500);
}

// ========================================
// AUDIO PLAYER (Preview & Demo)
// ========================================

let isPlaying = false;

function toggleAudio() {
  const playBtn = document.getElementById('playBtn');
  if (!isPlaying) {
    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸ Pausar Previa';
  } else {
    isPlaying = false;
    if (playBtn) playBtn.textContent = '▶ Escuchar Previa Completa';
  }
}

function playDemo(btnElement, genre) {
  const genreNames = {
    'pop': 'Pop Español',
    'balada': 'Balada Romántica',
    'flamenco': 'Flamenco Fusión'
  };
  alert(`▶ Próximamente: ejemplo de canción en estilo ${genreNames[genre] || genre}.\n\nLas muestras estarán disponibles muy pronto.`);
}

// ========================================
// CHECKOUT HELPERS
// ========================================

// Copy to clipboard (for IBAN, BIC, etc.)
function copyToClipboard(elementId) {
  const inputEl = document.getElementById(elementId);
  if (inputEl) {
    inputEl.select();
    inputEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputEl.value).then(() => {
      alert('¡Copiado al portapapeles!');
    }).catch(() => {
      alert('Copiado: ' + inputEl.value);
    });
  }
}

// Send payment proof via WhatsApp to Alexandre
function sendWhatsAppProof() {
  const savedData = JSON.parse(localStorage.getItem('cantaTuHistoriaOrder') || '{}');
  const recipientName = savedData.recipientName || 'la persona especial';
  const senderName = savedData.senderName || 'Cliente';
  const clientPhone = savedData.phone || '';

  const message = `💳 *COMPROBANTE DE PAGO - CantaTuHistoria*

👤 *Cliente:* ${senderName}
💝 *Canción para:* ${recipientName}
📱 *WhatsApp del cliente:* ${clientPhone}
💰 *Importe:* €29.90

✅ He realizado la transferencia al IBAN. Adjunto el comprobante a continuación.

⚡ Por favor, liberad mi canción en HD.`;

  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodedMsg}`, '_blank');
}

// ========================================
// ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Hydrate checkout concept with recipient name
  const conceptInput = document.getElementById('orderConcept');
  if (conceptInput) {
    const savedData = JSON.parse(localStorage.getItem('cantaTuHistoriaOrder') || '{}');
    if (savedData.recipientName) {
      conceptInput.value = `Cancion - ${savedData.recipientName}`;
    }
  }
});
