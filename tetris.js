function startTetris() {
    hideCabinets();
    document.getElementById('cabinet-tetris').style.display = 'flex';
    manageHighScore('tetris', 0);
    tetrisRunning = true;
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(20, 20); 
    let score = 0;
    document.getElementById('tetris-score').innerText = score;
    const arena = Array.from({length: 20}, () => Array(12).fill(0));
    const pieces = 'ILJOTSZ';
    let countdownText = "";
    let isCountdownActive = true;
    function createPiece(type) {
        if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
        if (type === 'O') return [[2,2],[2,2]];
        if (type === 'L') return [[0,0,3],[3,3,3],[0,0,0]];
        if (type === 'J') return [[4,0,0],[4,4,4],[0,0,0]];
        if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
        if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
        if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
    }
    const colors = [null, '#ffffff', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];
    const player = { pos: {x: 4, y: 0}, matrix: null };
    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
            }
        }
        return false;
    }
    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
            });
        });
    }
    function playerDrop() {
        if (isCountdownActive || !tetrisRunning) return;
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
        }
        dropCounter = 0;
    }
    function playerMove(dir) {
        if (isCountdownActive || !tetrisRunning) return;
        player.pos.x += dir;
        if (collide(arena, player)) player.pos.x -= dir;
    }
    function playerReset() {
        player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
        player.pos.y = 0;
        player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
        if (collide(arena, player)) {
            gameOver();
        }
    }
    function rotate(matrix) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        matrix.forEach(row => row.reverse());
    }
    function playerRotate() {
        if (isCountdownActive || !tetrisRunning) return;
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix);
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix);
                player.pos.x = pos;
                return;
            }
        }
    }
    function arenaSweep() {
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) continue outer;
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;
            score += 100;
            document.getElementById('tetris-score').innerText = score;
        }
    }
    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = colors[value];
                    ctx.fillRect(x + offset.x, y + offset.y, 0.95, 0.95);
                }
            });
        });
    }
    function triggerCountdown() {
        isCountdownActive = true;
        countdownText = "READY";
        setTimeout(() => {
            if (!tetrisRunning) return;
            countdownText = "SET";
            setTimeout(() => {
                if (!tetrisRunning) return;
                countdownText = "GO!";
                isCountdownActive = false;
                setTimeout(() => {
                    if (countdownText === "GO!") countdownText = "";
                }, 600);
            }, 800);
        }, 800);
    }
    function draw() {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, {x: 0, y: 0});
        if (player.matrix) drawMatrix(player.matrix, player.pos);
        if (countdownText !== "") {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0); 
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }
    }
    let dropCounter = 0;
    let dropInterval = 1000; 
    let lastTime = 0;
    function update(time = 0) {
        if (!tetrisRunning) return;
        const deltaTime = time - lastTime;
        lastTime = time;
        if (!isCountdownActive) {
            dropCounter += deltaTime;
            if (dropCounter > dropInterval) playerDrop();
        }
        draw();
        activeAnimationId = requestAnimationFrame(update);
    }
    function gameOver() {
        tetrisRunning = false;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.restore();
        setTimeout(() => {
            manageHighScore('tetris', score);
        }, 150);
    }
    window.onkeydown = function(e) {
        if (isCountdownActive || !tetrisRunning) return;
        const key = e.key.toLowerCase();
        if (key === 'a') playerMove(-1);
        else if (key === 'd') playerMove(1);
        else if (key === 's') playerDrop();
        else if (key === 'w') playerRotate();
    };
    playerReset();
    triggerCountdown();
    update();
}
