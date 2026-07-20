function startSpaceInvaders() {
    hideCabinets();
    document.getElementById('cabinet-spaceinvaders').style.display = 'flex';

    const canvas = document.getElementById('spaceinvadersCanvas');
    const ctx = canvas.getContext('2d');

    let score = 0;
    document.getElementById('spaceinvaders-score').innerText = score;

    let player = { x: canvas.width / 2 - 20, y: canvas.height - 30, w: 40, h: 15, speed: 5 };
    let bullets = [];
    let enemies = [];
    let enemyDirection = 1;
    let enemySpeed = 1;
    let enemyMoveTimer = 0;

    const rows = 4;
    const cols = 8;
    const enemyW = 30;
    const enemyH = 20;
    const enemyPaddingX = 20;
    const enemyPaddingY = 15;
    const offsetLeft = 50;
    const offsetTop = 50;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            enemies.push({
                x: c * (enemyW + enemyPaddingX) + offsetLeft,
                y: r * (enemyH + enemyPaddingY) + offsetTop,
                w: enemyW,
                h: enemyH,
                active: true
            });
        }
    }

    let keys = { a: false, d: false };
    let running = true;
    let countdownText = "";
    let isCountdownActive = true;

    window.onkeydown = function(e) {
        if (isCountdownActive || !running) return;
        const key = e.key.toLowerCase();
        if (key === 'a' || e.key === 'ArrowLeft') keys.a = true;
        if (key === 'd' || e.key === 'ArrowRight') keys.d = true;
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, speed: 6 });
        }
    };

    window.onkeyup = function(e) {
        const key = e.key.toLowerCase();
        if (key === 'a' || e.key === 'ArrowLeft') keys.a = false;
        if (key === 'd' || e.key === 'ArrowRight') keys.d = false;
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

    function updateSpaceInvaders() {
        if (!running) {
            ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(score >= 320 ? "Victory!" : "Game Over", canvas.width / 2, canvas.height / 2);
            return;
        }

        if (!isCountdownActive) {
            if (keys.a) player.x -= player.speed;
            if (keys.d) player.x += player.speed;

            if (player.x < 0) player.x = 0;
            if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].y -= bullets[i].speed;
                if (bullets[i].y < 0) {
                    bullets.splice(i, 1);
                }
            }

            enemyMoveTimer++;
            if (enemyMoveTimer >= 30) {
                let shiftDown = false;
                enemies.forEach(e => {
                    if (e.active) {
                        e.x += 15 * enemyDirection;
                        if (e.x + e.w > canvas.width - 20 || e.x < 20) shiftDown = true;
                    }
                });

                if (shiftDown) {
                    enemyDirection *= -1;
                    enemies.forEach(e => {
                        if (e.active) {
                            e.y += 15;
                            if (e.y + e.h >= player.y) running = false;
                        }
                    });
                }
                enemyMoveTimer = 0;
            }

            bullets.forEach((b, bIdx) => {
                enemies.forEach(e => {
                    if (e.active) {
                        if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                            e.active = false;
                            bullets.splice(bIdx, 1);
                            score += 10;
                            document.getElementById('spaceinvaders-score').innerText = score;
                            if (score >= 320) running = false;
                        }
                    }
                });
            });
        }

        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x, player.y, player.w, player.h);

        ctx.fillStyle = '#ef4444';
        bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, b.w, b.h);
        });

        ctx.fillStyle = '#a1a1aa';
        enemies.forEach(e => {
            if (e.active) {
                ctx.fillRect(e.x, e.y, e.w, e.h);
            }
        });

        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }

        activeAnimationId = requestAnimationFrame(updateSpaceInvaders);
    }

    triggerCountdown();
    updateSpaceInvaders();
}
