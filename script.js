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

// Handle Option Selection in Quiz
function selectOption(step, value, emoji) {
  if (step === 1) quizData.recipient = value;
  if (step === 2) quizData.occasion = value;
  if (step === 4) quizData.genre = value;
  if (step === 5) quizData.voice = value;

  nextStep();
}

function nextStep() {
  if (currentStep === 3) {
    const sName = document.getElementById('senderName')?.value;
    const rName = document.getElementById('recipientName')?.value;
    if (!sName || !rName) {
      alert('Por favor, indica ambos nombres para continuar.');
      return;
    }
    quizData.senderName = sName;
    quizData.recipientName = rName;
  }

  if (currentStep === 6) {
    quizData.story = document.getElementById('userStory')?.value || '';
  }

  if (currentStep === 7) {
    quizData.phrase = document.getElementById('specialPhrase')?.value || '';
  }

  if (currentStep < totalSteps) {
    document.querySelector(`.step-pane[data-step="${currentStep}"]`)?.classList.remove('active');
    currentStep++;
    document.querySelector(`.step-pane[data-step="${currentStep}"]`)?.classList.add('active');

    // Update Progress Bar
    const progressPercent = Math.round((currentStep / totalSteps) * 100);
    const pBar = document.getElementById('progressBar');
    const sInd = document.getElementById('stepIndicator');

    if (pBar) pBar.style.width = `${progressPercent}%`;
    if (sInd) sInd.textContent = `Paso ${currentStep} de ${totalSteps}`;
  }
}

// Start AI Generation Simulation
function startGeneration() {
  const phone = document.getElementById('userPhone')?.value;
  if (!phone) {
    alert('Por favor, introduce tu número de WhatsApp para notificarle.');
    return;
  }
  quizData.phone = phone;

  nextStep(); // Move to Step 9

  const loader = document.getElementById('genLoader');
  const statusTxt = document.getElementById('genStatus');
  const subTxt = document.getElementById('genSub');
  const result = document.getElementById('previewResult');

  const steps = [
    { title: 'Generando la letra en español...', sub: 'Analizando vuestros recuerdos y nombres...' },
    { title: 'Componiendo melodía e instrumentos...', sub: `Creando arreglo musical en estilo ${quizData.genre || 'Pop Español'}...` },
    { title: 'Masterizando la voz y audio HD...', sub: 'Ajustando mezcla en calidad estúdio...' }
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    stepIdx++;
    if (stepIdx < steps.length) {
      if (statusTxt) statusTxt.textContent = steps[stepIdx].title;
      if (subTxt) subTxt.textContent = steps[stepIdx].sub;
    } else {
      clearInterval(interval);
      if (loader) loader.classList.add('hidden');
      if (result) result.classList.remove('hidden');

      // Populate preview details
      const titleEl = document.getElementById('songTitle');
      const authEl = document.getElementById('songAuthors');
      if (titleEl) titleEl.textContent = `"${quizData.recipientName || 'Un Amor Único'} - Canción Especial"`;
      if (authEl) authEl.textContent = `Para: ${quizData.recipientName || 'Ti'} | Creado por: ${quizData.senderName || 'Tu pareja'}`;

      // Save order details to localStorage for Checkout
      localStorage.setItem('cantaTuHistoriaOrder', JSON.stringify(quizData));
    }
  }, 2000);
}

// Toggle Audio Preview Player
let isPlaying = false;
let audioCtx = null;

function toggleAudio() {
  const playBtn = document.getElementById('playBtn');
  if (!isPlaying) {
    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸ Pausar Previa';
    playSyntheticTone();
  } else {
    isPlaying = false;
    if (playBtn) playBtn.textContent = '▶ Escuchar Previa Completa';
  }
}

function playSyntheticTone() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      isPlaying = false;
      const playBtn = document.getElementById('playBtn');
      if (playBtn) playBtn.textContent = '▶ Escuchar Previa Completa';
    }, 4000);
  } catch (e) {
    console.log('Audio Context Error', e);
  }
}

function playDemo(btnElement, genre) {
  alert(`▶ Reproduciendo ejemplo de canción en estilo ${genre.toUpperCase()} (Español).`);
}

// Clipboard Copy Helper for Revolut IBAN / Revtag
function copyToClipboard(elementId) {
  const inputEl = document.getElementById(elementId);
  if (inputEl) {
    inputEl.select();
    inputEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputEl.value).then(() => {
      alert('¡Copiado al portapapeles exitosamente!');
    }).catch(() => {
      alert('Copiado: ' + inputEl.value);
    });
  }
}

// Redirect to WhatsApp with Payment Proof
function sendWhatsAppProof() {
  const savedData = JSON.parse(localStorage.getItem('cantaTuHistoriaOrder') || '{}');
  const recipientName = savedData.recipientName || 'la persona especial';
  const senderName = savedData.senderName || 'Cliente';

  const message = `¡Hola! He realizado la transferencia de €14.90 a vuestra cuenta Revolut/IBAN para la canción de ${recipientName} (Creada por ${senderName}). Adjunto mi comprobante para liberar la canción en HD.`;
  const encodedMsg = encodeURIComponent(message);
  
  // Target WhatsApp number for receiving proofs
  const targetWhatsApp = '34612345678';
  window.open(`https://wa.me/${targetWhatsApp}?text=${encodedMsg}`, '_blank');
}

// On Checkout Load: Hydrate Order details
document.addEventListener('DOMContentLoaded', () => {
  const conceptInput = document.getElementById('orderConcept');
  if (conceptInput) {
    const savedData = JSON.parse(localStorage.getItem('cantaTuHistoriaOrder') || '{}');
    if (savedData.recipientName) {
      conceptInput.value = `Cancion - ${savedData.recipientName}`;
    }
  }
});
