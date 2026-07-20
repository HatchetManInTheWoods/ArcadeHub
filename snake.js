function startSnake() {
    hideCabinets();
    document.getElementById('cabinet-snake').style.display = 'flex';
    manageHighScore('snake', 0); 
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let score = 0;
    document.getElementById('snake-score').innerText = score;
    let snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}];
    let dx = 0, dy = 0; 
    let food = {x: 0, y: 0};
    let countdownText = "";
    let isCountdownActive = true;
    let gameStarted = false;
    function generateFood() {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    }
    generateFood();
    window.onkeydown = function(e) {
        if (isCountdownActive) return; 
        const key = e.key.toLowerCase();
        if (!gameStarted && ['a', 'w', 'd', 's'].includes(key)) {
            if (key === 'a') return; 
            gameStarted = true;
        }
        if (key === 'a' && dx === 0) { dx = -grid; dy = 0; }
        else if (key === 'w' && dy === 0) { dx = 0; dy = -grid; }
        else if (key === 'd' && dx === 0) { dx = grid; dy = 0; }
        else if (key === 's' && dy === 0) { dx = 0; dy = grid; }
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
    function main() {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(food.x + 1, food.y + 1, grid - 2, grid - 2);
        ctx.fillStyle = '#a1a1aa';
        snake.forEach(part => ctx.fillRect(part.x + 1, part.y + 1, grid - 2, grid - Part - 2));
        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }
        if (isCountdownActive || !gameStarted) return; 
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return gameOver();
        for(let i = 0; i < snake.length; i++) {
            if(snake[i].x === head.x && snake[i].y === head.y) return gameOver();
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snake-score').innerText = score;
            generateFood();
        } else {
            snake.pop();
        }
    }
    function gameOver() {
        clearInterval(currentLoop);
        currentLoop = null;
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
            manageHighScore('snake', score);
        }, 150);
    }
    currentLoop = setInterval(main, 220);
    triggerCountdown();
}
