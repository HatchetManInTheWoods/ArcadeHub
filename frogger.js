function startFrogger() { 
    hideCabinets(); 
    document.getElementById('cabinet-frogger').style.display = 'flex'; 
    const canvas = document.getElementById('froggerCanvas'); 
    const ctx = canvas.getContext('2d'); 
    const grid = 40; 
    let score = 0; 
    let lives = 3; 
    let activeAnimationId;
    document.getElementById('frogger-lives').innerText = lives; 
    let frog = { x: 5 * grid, y: 10 * grid }; 
    let running = true; 
    let countdownText = ""; 
    let isCountdownActive = true; 
    
    let rows = [ 
        { type: 'safe', speed: 0, color: '#1f1f23', items: [] }, 
        { type: 'log', speed: 1.5, color: '#0ea5e9', itemColor: '#b45309', items: [{ x: 0, w: 100 }, { x: 200, w: 120 }] }, 
        { type: 'log', speed: -2.0, color: '#0ea5e9', itemColor: '#b45309', items: [{ x: 50, w: 90 }, { x: 240, w: 100 }] }, 
        { type: 'log', speed: 1.2, color: '#0ea5e9', itemColor: '#b45309', items: [{ x: 20, w: 110 }, { x: 280, w: 90 }] }, 
        { type: 'log', speed: -1.6, color: '#0ea5e9', itemColor: '#b45309', items: [{ x: 80, w: 130 }, { x: 300, w: 80 }] }, 
        { type: 'safe', speed: 0, color: '#27272a', items: [] }, 
        { type: 'car', speed: -2.5, color: '#18181b', itemColor: '#ef4444', items: [{ x: 40, w: 50 }, { x: 260, w: 50 }] }, 
        { type: 'car', speed: 1.8, color: '#18181b', itemColor: '#f59e0b', items: [{ x: 10, w: 45 }, { x: 200, w: 45 }] }, 
        { type: 'car', speed: -3.0, color: '#18181b', itemColor: '#10b981', items: [{ x: 100, w: 60 }, { x: 320, w: 60 }] }, 
        { type: 'car', speed: 2.2, color: '#18181b', itemColor: '#a855f7', items: [{ x: 60, w: 50 }, { x: 250, w: 50 }] }, 
        { type: 'safe', speed: 0, color: '#1f1f23', items: [] } 
    ]; 

    window.onkeydown = function(e) { 
        if (isCountdownActive || !running) return; 
        const key = e.key.toLowerCase(); 
        if (key === 'a' || e.key === 'ArrowLeft') frog.x -= grid; 
        else if (key === 'd' || e.key === 'ArrowRight') frog.x += grid; 
        else if (key === 'w' || e.key === 'ArrowUp') frog.y -= grid; 
        else if (key === 's' || e.key === 'ArrowDown') frog.y += grid; 
        
        if (frog.x < 0) frog.x = 0; 
        if (frog.x >= canvas.width) frog.x = canvas.width - grid; 
        if (frog.y < 0) frog.y = 0; 
        if (frog.y >= canvas.height) frog.y = canvas.height - grid; 
    }; 

    function resetFrog() { 
        frog.x = 5 * grid; 
        frog.y = 10 * grid; 
    } 

    function killFrog() { 
        lives--; 
        document.getElementById('frogger-lives').innerText = lives; 
        if (lives <= 0) { 
            running = false; 
        } else { 
            resetFrog(); 
        } 
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

    function updateFrogger() { 
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
            rows.forEach((row, rowIndex) => { 
                row.items.forEach(item => { 
                    item.x += row.speed; 
                    if (row.speed > 0 && item.x > canvas.width) item.x = -item.w; 
                    if (row.speed < 0 && item.x < -item.w) item.x = canvas.width; 
                }); 
            }); 

            let currentRowIndex = Math.floor(frog.y / grid); 
            let currentRow = rows[currentRowIndex]; 

            if (currentRowIndex === 0) { 
                score += 100; 
                let scoreElement = document.getElementById('frogger-score');
                if (scoreElement) scoreElement.innerText = score;
                resetFrog(); 
            } else if (currentRow.type === 'car') { 
                let hit = false; 
                currentRow.items.forEach(car => { 
                    if (frog.x < car.x + car.w && frog.x + grid > car.x) hit = true; 
                }); 
                if (hit) killFrog(); 
            } else if (currentRow.type === 'log') { 
                let onLog = false; 
                currentRow.items.forEach(log => { 
                    if (frog.x + grid / 2 >= log.x && frog.x + grid / 2 <= log.x + log.w) { 
                        onLog = true; 
                        frog.x += currentRow.speed; 
                    } 
                }); 
                if (!onLog || frog.x < 0 || frog.x >= canvas.width) killFrog(); 
            } 
        } 

        ctx.fillStyle = '#09090b'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 

        rows.forEach((row, index) => { 
            ctx.fillStyle = row.color; 
            ctx.fillRect(0, index * grid, canvas.width, grid); 
            ctx.fillStyle = row.itemColor; 
            row.items.forEach(item => { 
                ctx.fillRect(item.x, index * grid + 4, item.w, grid - 8); 
            }); 
        }); 

        ctx.fillStyle = '#22c55e'; 
        ctx.beginPath(); 
        ctx.arc(frog.x + grid / 2, frog.y + grid / 2, grid / 3, 0, Math.PI * 2); 
        ctx.fill(); 

        if (countdownText !== "") { 
            ctx.fillStyle = '#ffffff'; 
            ctx.font = 'bold 36px Arial'; 
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle'; 
            ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2); 
        } 

        activeAnimationId = requestAnimationFrame(updateFrogger); 
    } 

    triggerCountdown(); 
    updateFrogger(); 
}
