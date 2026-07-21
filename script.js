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
    if (!modalCanvas) return;
    
    modalCtx = modalCanvas.getContext('2d');

    // Výpočet pozície kurzora/prsta
    function getPos(e) {
        const rect = modalCanvas.getBoundingClientRect();
        const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
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
        if (!isDrawing) return;
        isDrawing = false;
        modalCtx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault(); // Zabráni scrolovaniu obrazovky na mobiloch
        
        const pos = getPos(e);
        modalCtx.lineWidth = 3;
        modalCtx.lineCap = 'round';
        modalCtx.lineJoin = 'round';
        modalCtx.strokeStyle = '#000080'; // Tmavomodrý inkoust
        modalCtx.lineTo(pos.x, pos.y);
        modalCtx.stroke();
    }

    // Udalosti pre myš
    modalCanvas.addEventListener('mousedown', startDraw);
    modalCanvas.addEventListener('mouseup', stopDraw);
    modalCanvas.addEventListener('mouseleave', stopDraw);
    modalCanvas.addEventListener('mousemove', draw);

    // Udalosti pre dotyk (Mobil / Tablet)
    modalCanvas.addEventListener('touchstart', function(e) {
        startDraw(e);
    }, {passive: true});

    modalCanvas.addEventListener('touchend', stopDraw, {passive: true});
    modalCanvas.addEventListener('touchcancel', stopDraw, {passive: true});

    modalCanvas.addEventListener('touchmove', function(e) {
        draw(e);
    }, {passive: false});
});

// Otvorenie veľkého okna na podpis
function openSigModal(sigId) {
    currentSigId = sigId;
    const modal = document.getElementById('sigModal');
    if (!modal) return;
    
    modal.style.display = 'flex';

    // Prispôsobiť plátno veľkosti obalu (wrapperu) po zobrazení
    setTimeout(() => {
        const wrapper = document.getElementById('canvasWrapper') || modalCanvas.parentElement;
        if (wrapper && modalCanvas) {
            modalCanvas.width = wrapper.clientWidth;
            modalCanvas.height = wrapper.clientHeight;
            clearModalCanvas();
        }
    }, 100);
}

// Zatvorenie okna
function closeSigModal() {
    const modal = document.getElementById('sigModal');
    if (modal) {
        modal.style.display = 'none';
    }
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
    if (!currentSigId || !modalCanvas) return;

    // Prevedenie plátna na obrázok (Base64 data URL)
    const dataURL = modalCanvas.toDataURL('image/png');
    const imgElement = document.getElementById('img-' + currentSigId);
    
    if (imgElement) {
        imgElement.src = dataURL;
        imgElement.style.display = 'block';
        
        // Schováme text/placeholder "Podpísať tu"
        const parent = imgElement.parentElement;
        if (parent) {
            const placeholder = parent.querySelector('.sig-placeholder') || document.getElementById('ph-' + currentSigId);
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    closeSigModal();
}