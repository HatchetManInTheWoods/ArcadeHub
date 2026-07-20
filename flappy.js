function startFlappy() {
    hideCabinets();
    document.getElementById('cabinet-flappy').style.display = 'flex';
    manageHighScore('flappy', 0);
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0;
    document.getElementById('flappy-score').innerText = score;
    let bird = { x: 50, y: canvas.height / 2, radius: 10, velocity: 0, gravity: 0.25, jump: -5.5 };
    let pipes = [];
    const pipeWidth = 40;
    const pipeGap = 110;
    const pipeSpeed = 2.5;
    let spawnTimer = 0;
    let flappyRunning = true;
    let countdownText = "";
    let isCountdownActive = true;
    window.onkeydown = function(e) {
        if (isCountdownActive || !flappyRunning) return; 
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault(); 
            bird.velocity = bird.jump;
        }
    };
    function spawnPipe() {
        let minHeight = 40;
        let maxHeight = canvas.height - pipeGap - minHeight;
        let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        let bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({
            x: canvas.width,
            topY: 0,
            topHeight: topHeight,
            bottomY: canvas.height - bottomHeight,
            bottomHeight: bottomHeight,
            passed: false
        });
    }
    function checkCollision(pipe) {
        let closestXTop = Math.max(pipe.x, Math.min(bird.x, pipe.x + pipeWidth));
        let closestYTop = Math.max(pipe.topY, Math.min(bird.y, pipe.topY + pipe.topHeight));
        let distanceXTop = bird.x - closestXTop;
        let distanceYTop = bird.y - closestYTop;
        let hitTop = (distanceXTop * distanceXTop + distanceYTop * distanceYTop) < (bird.radius * bird.radius);
        let closestXBottom = Math.max(pipe.x, Math.min(bird.x, pipe.x + pipeWidth));
        let closestYBottom = Math.max(pipe.bottomY, Math.min(bird.y, pipe.bottomY + pipe.bottomHeight));
        let distanceXBottom = bird.x - closestXBottom;
        let distanceYBottom = bird.y - closestYBottom;
        let hitBottom = (distanceXBottom * distanceXBottom + distanceYBottom * distanceYBottom) < (bird.radius * bird.radius);
        return hitTop || hitBottom;
    }
    function triggerCountdown() {
        isCountdownActive = true;
        countdownText = "READY";
        setTimeout(() => {
            if (!flappyRunning) return;
            countdownText = "SET";
            setTimeout(() => {
                if (!flappyRunning) return;
                countdownText = "GO!";
                isCountdownActive = false;
                setTimeout(() => {
                    if (countdownText === "GO!") countdownText = "";
                }, 600);
            }, 800);
        }, 800);
    }
    function updateFlappy() {
        if (!flappyRunning) return;
        if (!isCountdownActive) {
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;
            if (bird.y - bird.radius < 0 || bird.y + bird.radius > canvas.height) {
                return gameOver();
            }
            spawnTimer++;
            if (spawnTimer >= 100) {
                spawnPipe();
                spawnTimer = 0;
            }
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].x -= pipeSpeed;
                if (checkCollision(pipes[i])) {
                    return gameOver();
                }
                if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                    pipes[i].passed = true;
                    score++;
                    document.getElementById('flappy-score').innerText = score;
                }
                if (pipes[i].x + pipeWidth < 0) {
                    pipes.splice(i, 1);
                }
            }
        }
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, pipe.topY, pipeWidth, pipe.topHeight);
            ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, pipe.bottomHeight);
        });
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();
        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }
        activeAnimationId = requestAnimationFrame(updateFlappy);
    }
    function gameOver() {
        flappyRunning = false;
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
            manageHighScore('flappy', score);
        }, 150);
    }
    triggerCountdown();
    updateFlappy();
}
