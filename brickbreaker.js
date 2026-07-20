function startBrickBreaker() {
    hideCabinets();
    document.getElementById('cabinet-brickbreaker').style.display = 'flex';

    const canvas = document.getElementById('brickbreakerCanvas');
    const ctx = canvas.getContext('2d');

    let score = 0;
    document.getElementById('brickbreaker-score').innerText = score;

    let paddle = { x: canvas.width / 2 - 40, y: canvas.height - 30, w: 80, h: 12, speed: 7 };
    let ball = { x: canvas.width / 2, y: canvas.height - 50, vx: 3, vy: -3, radius: 6 };
    let keys = { left: false, right: false };
    
    let bricks = [];
    const rows = 5;
    const cols = 8;
    const brickW = 52;
    const brickH = 18;
    const brickPadding = 6;
    const offsetTop = 40;
    const offsetLeft = 14;

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7'];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            bricks.push({
                x: c * (brickW + brickPadding) + offsetLeft,
                y: r * (brickH + brickPadding) + offsetTop,
                w: brickW,
                h: brickH,
                color: colors[r],
                active: true
            });
        }
    }

    let running = true;
    let countdownText = "";
    let isCountdownActive = true;

    window.onkeydown = function(e) {
        if (isCountdownActive || !running) return;
        const key = e.key.toLowerCase();
        if (key === 'a' || e.key === 'ArrowLeft') keys.left = true;
        if (key === 'd' || e.key === 'ArrowRight') keys.right = true;
    };

    window.onkeyup = function(e) {
        const key = e.key.toLowerCase();
        if (key === 'a' || e.key === 'ArrowLeft') keys.left = false;
        if (key === 'd' || e.key === 'ArrowRight') keys.right = false;
    };

    function triggerCountdown() {
        isCountdownActive = true;
        countdownText = "READY";
        setTimeout(() => {
            countdownText = "SET";
            setTimeout(() => {
                countdownText = "GO!";
                isCountdownActive = false;
                setTimeout(() => {
                    if (countdownText === "GO!") countdownText = "";
                }, 600);
            }, 800);
        }, 800);
    }

    function updateBrickBreaker() {
        if (!running) {
            ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
            return;
        }

        if (!isCountdownActive) {
            if (keys.left) paddle.x -= paddle.speed;
            if (keys.right) paddle.x += paddle.speed;

            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx = -ball.vx;
            if (ball.y - ball.radius < 0) ball.vy = -ball.vy;

            if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
                let relativeImpact = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
                ball.vx = relativeImpact * 5;
                ball.vy = -Math.abs(ball.vy);
            }

            if (ball.y + ball.radius > canvas.height) {
                running = false;
            }

            bricks.forEach(b => {
                if (b.active) {
                    if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
                        ball.vy = -ball.vy;
                        b.active = false;
                        score += 10;
                        document.getElementById('brickbreaker-score').innerText = score;
                    }
                }
            });
        }

        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        bricks.forEach(b => {
            if (b.active) {
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });

        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }

        activeAnimationId = requestAnimationFrame(updateBrickBreaker);
    }

    triggerCountdown();
    updateBrickBreaker();
}
