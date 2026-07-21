// Pomocná funkcia pre tlačidlá + a -
function changeVal(id, step) {
    var el = document.getElementById(id);
    if (!el) return;
    var val = parseInt(el.value) || 0;
    val += step;
    if (val < 0) val = 0;
    el.value = val;
}

// Inicializácia plátna na kreslenie podpisov
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.canvas-sig').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let drawing = false;

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        function start(e) { drawing = true; draw(e); }
        function stop() { drawing = false; ctx.beginPath(); }
        function draw(e) {
            if (!drawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000080';
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        // Eventy pre myš (PC)
        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mouseup', stop);
        canvas.addEventListener('mousemove', draw);

        // Eventy pre dotykové displeje (Mobil / Tablet)
        canvas.addEventListener('touchstart', start, {passive: false});
        canvas.addEventListener('touchend', stop);
        canvas.addEventListener('touchmove', draw, {passive: false});
    });
});

// Vymazanie podpisu
function clearSig(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}