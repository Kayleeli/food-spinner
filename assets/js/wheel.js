const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
let currentAngle = 0;
let choices = [];
let isSpinning = false;

function drawWheel(items) {
    if (!items || items.length === 0) return drawEmptyWheel();
    
    choices = items;
    const arc = (2 * Math.PI) / items.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = ['#CCD5AE', '#FAEDCD', '#F9F7F1', '#D4A373'];

    items.forEach((text, i) => {
        const angle = currentAngle + i * arc;
        
        ctx.beginPath();
        let colorIndex = i % colors.length;
        if (i === items.length - 1 && colorIndex === 0 && items.length > 1) {
            colorIndex = 1;
        }
        ctx.fillStyle = colors[colorIndex];
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(210, 210);
        ctx.arc(210, 210, 200, angle, angle + arc);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(210, 210);
        ctx.rotate(angle + arc / 2);
        
        ctx.textAlign = "right";
        ctx.fillStyle = "#606C38";
        
        // --- dynamic font scaling
        let fontSize = items.length > 10 ? 12 : 16;
        
        if (text.length > 12) fontSize -= 2;
        if (text.length > 16) fontSize -= 2;
        if (text.length > 20) fontSize -= 2;
        
        fontSize = Math.max(8, fontSize);
        
        ctx.font = `700 ${fontSize}px 'Quicksand'`;
        
        ctx.fillText(text, 185, fontSize / 3);
        ctx.restore();
    });
}

function animateSpin(totalRotation, onComplete) {
    if (isSpinning) return;
    isSpinning = true;

    const startTime = performance.now();
    const duration = 4000;
    const initialAngle = currentAngle;

    function frame(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easing = 1 - Math.pow(1 - progress, 4);

        currentAngle = initialAngle + (totalRotation * easing);
        drawWheel(choices);

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            currentAngle %= (Math.PI * 2);
            isSpinning = false;
            onComplete();
        }
    }
    requestAnimationFrame(frame);
}

function drawEmptyWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(210, 210, 200, 0, 2 * Math.PI);
    ctx.fillStyle = '#F9F7F1';
    ctx.fill();

    ctx.strokeStyle = '#CCD5AE';
    ctx.setLineDash([15, 10]); 
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]); 

    ctx.beginPath();
    ctx.arc(210, 210, 180, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(204, 213, 174, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#606C38";
    
    ctx.font = "700 18px 'Quicksand'";
    ctx.fillText("What are we eating?", 210, 200);
    
    ctx.font = "500 14px 'Quicksand'";
    ctx.fillStyle = "rgba(96, 108, 56, 0.6)";
    ctx.fillText("Add choices or hit give me random choices.", 210, 225);
}

// Call it once to initialize
drawEmptyWheel();