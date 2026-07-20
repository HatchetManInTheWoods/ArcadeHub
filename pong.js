let pongAiVsAi = false;
function startPlayerPong() {
    pongAiVsAi = false;
    initPong();
    document.querySelector('#cabinet-pong .controls-hint').innerText = "Controls: W/S (Move Right Paddle) | Left Paddle is Automated AI";
}
function startAiPong() {
    pongAiVsAi = true;
    initPong();
    document.querySelector('#cabinet-pong .controls-hint').innerText = "Simulation Status: Active AI vs AI Matchmaking Loop running.";
}
function initPong() {
    hideCabinets();
    document.getElementById('cabinet-pong').style.display = 'flex';
    manageHighScore('pong', 0);
    pongRunning = true;
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    let playerScore = 0; 
    let aiScore = 0;     
    let matchScoreDisplay = 0;
    document.getElementById('pong-score').innerText = matchScoreDisplay;
    const paddleWidth = 10;
    const paddleHeight = 80;
    let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleDir = 0;
    let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, radius: 6 };
    let leftTargetY = canvas.height / 2;
    let rightTargetY = canvas.height / 2;
    let leftAiStrategyOffset = 0;
    let rightAiStrategyOffset = 0;
    const maxBallSpeed = 64; 
    let countdownText = "";
    let isCountdownActive = false;
    window.onkeydown = function(e) {
        const key = e.key.toLowerCase();
        if (!pongAiVsAi && !isCountdownActive && pongRunning) {
            if (key === 'w') rightPaddleDir = -7;
            else if (key === 's') rightPaddleDir = 7;
        }
    };
    window.onkeyup = function(e) {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 's') rightPaddleDir = 0;
    };
    function predictIntersection(targetX) {
        if (ball.vx === 0) return canvas.height / 2; 
        let tempX = ball.x;
        let tempY = ball.y;
        let tempVx = ball.vx;
        let tempVy = ball.vy;
        let loops = 0;
        while (loops < 1000) {
            tempX += tempVx;
            tempY += tempVy;
            if (tempY - ball.radius < 0 || tempY + ball.radius > canvas.height) {
                tempVy = -tempVy;
            }
            if ((tempVx < 0 && tempX <= targetX) || (tempVx > 0 && tempX >= targetX)) {
                return tempY;
            }
            loops++;
        }
        return canvas.height / 2;
    }
    function calculateNewStrategyOffset() {
        return (Math.random() * 40) - 20; 
    }
    function triggerRoundStart(serveDirection) {
        isCountdownActive = true;
        rightPaddleDir = 0; 
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.vx = 0;
        ball.vy = 0;
        leftPaddleY = canvas.height / 2 - paddleHeight / 2;
        rightPaddleY = canvas.height / 2 - paddleHeight / 2;
        leftTargetY = canvas.height / 2;
        rightTargetY = canvas.height / 2;
        leftAiStrategyOffset = calculateNewStrategyOffset();
        rightAiStrategyOffset = calculateNewStrategyOffset();
        countdownText = "READY";
        setTimeout(() => {
            if (!pongRunning) return;
            countdownText = "SET";
            setTimeout(() => {
                if (!pongRunning) return;
                countdownText = "GO!";
                isCountdownActive = false;
                ball.vx = serveDirection * 5;
                ball.vy = (Math.random() * 4) - 2;
                leftTargetY = predictIntersection(30 + paddleWidth);
                rightTargetY = predictIntersection(canvas.width - 30 - paddleWidth);
                setTimeout(() => {
                    if (countdownText === "GO!") countdownText = "";
                }, 600);
            }, 800);
        }, 800);
    }
    function updatePong() {
        if (!pongRunning) return;
        let oldX = ball.x;
        if (isCountdownActive) {
            leftPaddleY += (canvas.height / 2 - paddleHeight / 2 - leftPaddleY) * 0.15;
            rightPaddleY += (canvas.height / 2 - paddleHeight / 2 - rightPaddleY) * 0.15;
        } else {
            if (pongAiVsAi) {
                if (ball.vx < 0) {
                    leftTargetY = predictIntersection(30 + paddleWidth) - leftAiStrategyOffset;
                } else {
                    rightTargetY = predictIntersection(canvas.width - 30 - paddleWidth) - rightAiStrategyOffset;
                }
                leftPaddleY = leftTargetY - paddleHeight / 2;
                rightPaddleY = rightTargetY - paddleHeight / 2;
            } else {
                if (ball.vx < 0 && ball.x < canvas.width * 0.65) {
                    leftTargetY = predictIntersection(30 + paddleWidth);
                } else if (ball.vx > 0) {
                    leftTargetY = canvas.height / 2; 
                }
                leftPaddleY += ((leftTargetY - paddleHeight / 2) - leftPaddleY) * 0.06;
                rightPaddleY += rightPaddleDir;
            }
        }
        if (leftPaddleY < 0) leftPaddleY = 0;
        if (leftPaddleY > canvas.height - paddleHeight) leftPaddleY = canvas.height - paddleHeight;
        if (rightPaddleY < 0) rightPaddleY = 0;
        if (rightPaddleY > canvas.height - paddleHeight) rightPaddleY = canvas.height - paddleHeight;
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy = -ball.vy;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy = -ball.vy;
        }
        let leftFace = 30 + paddleWidth;
        if (ball.vx < 0 && oldX >= leftFace && ball.x - ball.radius <= leftFace) {
            if (ball.y >= leftPaddleY && ball.y <= leftPaddleY + paddleHeight) {
                let relativeImpact = ball.y - (leftPaddleY + paddleHeight / 2);
                ball.vx = -ball.vx * 1.08; 
                ball.vy = (relativeImpact * 0.14) + (Math.random() * 0.4 - 0.2); 
                if (Math.abs(ball.vx) > maxBallSpeed) ball.vx = Math.sign(ball.vx) * maxBallSpeed;
                ball.x = leftFace + ball.radius; 
                leftAiStrategyOffset = calculateNewStrategyOffset();
                rightAiStrategyOffset = calculateNewStrategyOffset();
            }
        }
        let rightFace = canvas.width - 30 - paddleWidth;
        if (ball.vx > 0 && oldX <= rightFace && ball.x + ball.radius >= rightFace) {
            if (ball.y >= rightPaddleY && ball.y <= rightPaddleY + paddleHeight) {
                let relativeImpact = ball.y - (rightPaddleY + paddleHeight / 2);
                ball.vx = -ball.vx * 1.08; 
                ball.vy = (relativeImpact * 0.14) + (Math.random() * 0.4 - 0.2); 
                if (Math.abs(ball.vx) > maxBallSpeed) ball.vx = Math.sign(ball.vx) * maxBallSpeed;
                ball.x = rightFace - ball.radius; 
                leftAiStrategyOffset = calculateNewStrategyOffset();
                rightAiStrategyOffset = calculateNewStrategyOffset();
                if (!pongAiVsAi) {
                    matchScoreDisplay++;
                    document.getElementById('pong-score').innerText = matchScoreDisplay;
                }
            }
        }
        if (ball.x < 0) {
            if (pongAiVsAi) {
                playerScore++;
                document.getElementById('pong-score').innerText = aiScore + " - " + playerScore;
                triggerRoundStart(-1);
            } else {
                triggerRoundStart(-1);
            }
            return;
        } else if (ball.x > canvas.width) {
            aiScore++;
            if (pongAiVsAi) {
                document.getElementById('pong-score').innerText = aiScore + " - " + playerScore;
                triggerRoundStart(1);
            } else {
                gameOver(matchScoreDisplay); 
            }
            return;
        }
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, leftPaddleY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - 30 - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2 - 40);
        }
        activeAnimationId = requestAnimationFrame(updatePong);
    }
    function gameOver(finalScore) {
        pongRunning = false;
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
            manageHighScore('pong', finalScore);
        }, 150);
    }
    triggerRoundStart(Math.random() > 0.5 ? 1 : -1);
    updatePong();
}
