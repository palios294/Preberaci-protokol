// Pomocná funkcia pre tlačidlá + a -
function changeVal(id, step) {
    var el = document.getElementById(id);
    if (!el) return;
    var val = parseInt(el.value) || 0;
    val += step;
    if (val < 0) val = 0;
    el.value = val;
}

// GLOBÁLNE PREMENNÉ PRE MODÁLNE OKNO PODPISU
let currentSigId = null;
let modalCanvas = null;
let modalCtx = null;
let isDrawing = false;

document.addEventListener("DOMContentLoaded", function() {
    modalCanvas = document.getElementById('modalCanvas');
    modalCtx = modalCanvas.getContext('2d');

    // Inicializácia udalostí pre kreslenie
    function getPos(e) {
        const rect = modalCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDraw(e) {
        isDrawing = true;
        const pos = getPos(e);
        modalCtx.beginPath();
        modalCtx.moveTo(pos.x, pos.y);
    }

    function stopDraw() {
        isDrawing = false;
        modalCtx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault(); // Zabráni scrolovaniu obrazovky pri kreslení
        const pos = getPos(e);
        modalCtx.lineWidth = 3; // Hrubšia čiara pre prehľadnosť
        modalCtx.lineCap = 'round';
        modalCtx.strokeStyle = '#000080'; // Tmavomodrý kalamár
        modalCtx.lineTo(pos.x, pos.y);
        modalCtx.stroke();
    }

    // Myš
    modalCanvas.addEventListener('mousedown', startDraw);
    modalCanvas.addEventListener('mouseup', stopDraw);
    modalCanvas.addEventListener('mousemove', draw);

    // Dotyk (Mobil / Tablet)
    modalCanvas.addEventListener('touchstart', startDraw, {passive: false});
    modalCanvas.addEventListener('touchend', stopDraw);
    modalCanvas.addEventListener('touchmove', draw, {passive: false});
});

// Otvorenie veľkého okna na podpis
function openSigModal(sigId) {
    currentSigId = sigId;
    const modal = document.getElementById('sigModal');
    modal.style.display = 'flex';

    // Prispôsobiť plátno veľkosti okna
    setTimeout(() => {
        const wrapper = modalCanvas.parentElement;
        modalCanvas.width = wrapper.clientWidth;
        modalCanvas.height = wrapper.clientHeight;
        clearModalCanvas();
    }, 50);
}

// Zatvorenie okna
function closeSigModal() {
    document.getElementById('sigModal').style.display = 'none';
    currentSigId = null;
}

// Vyčistenie plátna
function clearModalCanvas() {
    if (modalCtx && modalCanvas) {
        modalCtx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    }
}

// Uloženie podpisu a vloženie obrázka do protokolu
function saveSignature() {
    if (!currentSigId) return;

    // Prevedenie plátna na obrázok (Base64 data URL)
    const dataURL = modalCanvas.toDataURL('image/png');
    const imgElement = document.getElementById('img-' + currentSigId);
    
    if (imgElement) {
        imgElement.src = dataURL;
        imgElement.style.display = 'block';
        
        // Schováme text "Podpísať tu"
        const placeholder = imgElement.parentElement.querySelector('.sig-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }

    closeSigModal();
}