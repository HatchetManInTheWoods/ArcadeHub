function startAsteroids() {
    hideCabinets();
    document.getElementById('cabinet-asteroids').style.display = 'flex';
    manageHighScore('asteroids', 0);
    const canvas = document.getElementById('asteroidsCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0;
    document.getElementById('asteroids-score').innerText = score;
    let ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: -Math.PI / 2,
        rotationSpeed: 0.08,
        size: 14
    };
    let keys = { a: false, d: false };
    let bullets = [];
    let asteroids = [];
    let asteroidSpawnTimer = 0;
    let asteroidsRunning = true;
    let countdownText = "";
    let isCountdownActive = true;
    window.onkeydown = function(e) {
        if (isCountdownActive || !asteroidsRunning) return; 
        const key = e.key.toLowerCase();
        if (key === 'a') keys.a = true;
        if (key === 'd') keys.d = true;
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            fireBullet();
        }
    };
    window.onkeyup = function(e) {
        const key = e.key.toLowerCase();
        if (key === 'a') keys.a = false;
        if (key === 'd') keys.d = false;
    };
    function fireBullet() {
        let tipX = ship.x + Math.cos(ship.angle) * ship.size;
        let tipY = ship.y + Math.sin(ship.angle) * ship.size;
        bullets.push({
            x: tipX,
            y: tipY,
            vx: Math.cos(ship.angle) * 6,
            vy: Math.sin(ship.angle) * 6
        });
    }
    function spawnAsteroid() {
        let side = Math.floor(Math.random() * 4);
        let x, y;
        if (side === 0) { x = Math.random() * canvas.width; y = -20; }
        else if (side === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
        else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
        else { x = -20; y = Math.random() * canvas.height; }
        let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x) + (Math.random() * 0.4 - 0.2);
        let speed = Math.random() * 1.5 + 1;
        asteroids.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 8 + 12
        });
    }
    function triggerCountdown() {
        isCountdownActive = true;
        countdownText = "READY";
        setTimeout(() => {
            if (!asteroidsRunning) return;
            countdownText = "SET";
            setTimeout(() => {
                if (!asteroidsRunning) return;
                countdownText = "GO!";
                isCountdownActive = false;
                setTimeout(() => {
                    if (countdownText === "GO!") countdownText = "";
                }, 600);
            }, 800);
        }, 800);
    }
    function updateAsteroids() {
        if (!asteroidsRunning) return;
        if (!isCountdownActive) {
            if (keys.a) ship.angle -= ship.rotationSpeed;
            if (keys.d) ship.angle += ship.rotationSpeed;
            asteroidSpawnTimer++;
            if (asteroidSpawnTimer >= 50) {
                spawnAsteroid();
                asteroidSpawnTimer = 0;
            }
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].x += bullets[i].vx;
                bullets[i].y += bullets[i].vy;
                if (bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y < 0 || bullets[i].y > canvas.height) {
                    bullets.splice(i, 1);
                }
            }
            for (let i = asteroids.length - 1; i >= 0; i--) {
                asteroids[i].x += asteroids[i].vx;
                asteroids[i].y += asteroids[i].vy;
                let distToShipX = asteroids[i].x - ship.x;
                let distToShipY = asteroids[i].y - ship.y;
                let distanceToShip = Math.sqrt(distToShipX * distToShipX + distToShipY * distToShipY);
                if (distanceToShip < asteroids[i].radius + 6) {
                    return gameOver();
                }
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let distToBulletX = asteroids[i].x - bullets[j].x;
                    let distToBulletY = asteroids[i].y - bullets[j].y;
                    let distanceToBullet = Math.sqrt(distToBulletX * distToBulletX + distToBulletY * distToBulletY);
                    if (distanceToBullet < asteroids[i].radius) {
                        asteroids.splice(i, 1);
                        bullets.splice(j, 1);
                        score += 15;
                        document.getElementById('asteroids-score').innerText = score;
                        break;
                    }
                }
            }
        }
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.size, 0);
        ctx.lineTo(-ship.size / 2, ship.size / 1.5);
        ctx.lineTo(-ship.size / 2, -ship.size / 1.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#ffffff';
        bullets.forEach(b => {
            ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
        });
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        asteroids.forEach(a => {
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
        if (countdownText !== "") {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);
        }
        activeAnimationId = requestAnimationFrame(updateAsteroids);
    }
    function gameOver() {
        asteroidsRunning = false;
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        setTimeout(() => {
            manageHighScore('asteroids', score);
        }, 150);
    }
    triggerCountdown();
    updateAsteroids();
}
