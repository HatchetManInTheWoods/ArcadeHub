function startPacMan() {
    hideCabinets();
    document.getElementById('cabinet-pacman').style.display = 'flex';
    const canvas = document.getElementById('pacmanCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 40;
    let score = 0;
    document.getElementById('pacman-score').innerText = score;
    let pacman = { x: 1 * grid, y: 1 * grid, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };
    let ghost = { x: 9 * grid, y: 9 * grid, dx: -grid, dy: 0 };
    let running = true;
    let countdownText = "";
    let isCountdownActive = true;
    let moveTimer = 0;
    let map = [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1],
        [1,0,0,1,0,1,0,1,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
    ];
    let pellets = [];
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 0) {
                pellets.push({ x: c * grid + grid / 2, y: r * grid + grid / 2, active: true });
            }
        }
    }
    window.onkeydown = function(e) {
        if (isCountdownActive || !running) return;
        const key = e.key.toLowerCase();
        if (key === 'a' || e.key === 'ArrowLeft') { pacman.nextDx = -grid; pacman.nextDy = 0; }
        else if (key === 'd' || e.key === 'ArrowRight') { pacman.nextDx = grid; pacman.nextDy = 0; }
        else if (key === 'w' || e.key === 'ArrowUp') { pacman.nextDx = 0; pacman.nextDy = -grid; }
        else if (key === 's' || e.key === 'ArrowDown') { pacman.nextDx = 0; pacman.nextDy = grid; }
    };
    function isWall(x, y) {
        let r = Math.floor(y / grid);
        let c = Math.floor(x / grid);
        if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) return true;
        return map[r][c] === 1;
    }
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
    function updatePacMan() {
        if (!running) {
            ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let allEaten = !pellets.some(p => p.active);
            ctx.fillText(allEaten ? "Victory!" : "Game Over", canvas.width / 2, canvas.height / 2);
            return;
        }
        if (!isCountdownActive) {
            moveTimer++;
            if (moveTimer >= 12) {
                if (!isWall(pacman.x + pacman.nextDx, pacman.y + pacman.nextDy)) {
                    pacman.dx = pacman.nextDx;
                    pacman.dy = pacman.nextDy;
                }
                if (!isWall(pacman.x + pacman.dx, pacman.y + pacman.dy)) {
                    pacman.x += pacman.dx;
                    pacman.y += pacman.dy;
                }
                pellets.forEach(p => {
                    if (p.active && Math.abs(pacman.x + grid / 2 - p.x) < 5 && Math.abs(pacman.y + grid / 2 - p.y) < 5) {
                        p.active = false;
                        score += 10;
                        document.getElementById('pacman-score').innerText = score;
                    }
                });
                if (!pellets.some(p => p.active)) running = false;
                if (isWall(ghost.x + ghost.dx, ghost.y + ghost.dy) || Math.random() < 0.2) {
                    let dirs = [{ x: grid, y: 0 }, { x: -grid, y: 0 }, { x: 0, y: grid }, { x: 0, y: -grid }];
                    let validDirs = dirs.filter(d => !isWall(ghost.x + d.x, ghost.y + d.y));
                    if (validDirs.length > 0) {
                        let chosen = validDirs[Math.floor(Math.random() * validDirs.length)];
                        ghost.dx = chosen.x;
                        ghost.dy = chosen.y;
                    }
                }
                ghost.x += ghost.dx;
                ghost.y += ghost.dy;
                if (pacman.x === ghost.x && pacman.y === ghost.y) running = false;
                moveTimer = 0;
            }
        }
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
                if (map[r][c] === 1) {
                    ctx.fillStyle = '#3b82f6';
                    ctx.fillRect(c * grid + 2, r * grid + 2, grid - 4, grid - 4);
                }
            }
        }
        ctx.fillStyle = '#eab308';
        pellets.forEach(p => {
            if (p.active) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(pacman.x + grid / 2, pacman.y + grid / 2, grid / 2.5, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(pacman.x + grid / 2, pacman.y + grid / 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ghost.x + 6, ghost.y + 6, grid - 12, grid - 12);
        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }
        activeAnimationId = requestAnimationFrame(updatePacMan);
    }
    triggerCountdown();
    updatePacMan();
}
