function startMinesweeper() {
    hideCabinets();
    document.getElementById('cabinet-minesweeper').style.display = 'flex';

    const canvas = document.getElementById('minesweeperCanvas');
    const ctx = canvas.getContext('2d');
    
    const size = 10;
    const cell = 40;
    const mineCount = 10;

    let grid = [];
    let state = 'playing';
    let flagsLeft = mineCount;
    document.getElementById('minesweeper-count').innerText = flagsLeft;

    for (let r = 0; r < size; r++) {
        grid[r] = [];
        for (let c = 0; c < size; c++) {
            grid[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let r = Math.floor(Math.random() * size);
        let c = Math.floor(Math.random() * size);
        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            minesPlaced++;
        }
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c].mine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr;
                    let nc = c + dc;
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                        if (grid[nr][nc].mine) count++;
                    }
                }
            }
            grid[r][c].count = count;
        }
    }

    function drawGrid() {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let cellData = grid[r][c];
                let x = c * cell;
                let y = r * cell;

                if (cellData.revealed) {
                    ctx.fillStyle = '#27272a';
                    ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);

                    if (cellData.mine) {
                        ctx.fillStyle = '#ef4444';
                        ctx.beginPath();
                        ctx.arc(x + cell / 2, y + cell / 2, cell / 4, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (cellData.count > 0) {
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 16px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(cellData.count, x + cell / 2, y + cell / 2);
                    }
                } else {
                    ctx.fillStyle = '#1f1f23';
                    ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);

                    if (cellData.flagged) {
                        ctx.fillStyle = '#ef4444';
                        ctx.beginPath();
                        ctx.moveTo(x + cell / 3, y + cell / 4);
                        ctx.lineTo(x + (cell * 2) / 3, y + cell / 2);
                        ctx.lineTo(x + cell / 3, y + (cell * 3) / 4);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }

        if (state !== 'playing') {
            ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(state === 'won' ? 'Victory!' : 'Game Over', canvas.width / 2, canvas.height / 2);
        }
    }

    function reveal(r, c) {
        if (r < 0 || r >= size || c < 0 || c >= size) return;
        let cellData = grid[r][c];
        if (cellData.revealed || cellData.flagged) return;

        cellData.revealed = true;

        if (cellData.mine) {
            state = 'lost';
            revealAllMines();
            return;
        }

        if (cellData.count === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    reveal(r + dr, c + dc);
                }
            }
        }

        checkWin();
    }

    function revealAllMines() {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c].mine) grid[r][c].revealed = true;
            }
        }
    }

    function checkWin() {
        let win = true;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!grid[r][c].mine && !grid[r][c].revealed) win = false;
            }
        }
        if (win) state = 'won';
    }

    canvas.onmousedown = function(e) {
        if (state !== 'playing') return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const c = Math.floor(mouseX / cell);
        const r = Math.floor(mouseY / cell);

        if (e.button === 0) {
            reveal(r, c);
        } else if (e.button === 2) {
            e.preventDefault();
            let cellData = grid[r][c];
            if (!cellData.revealed) {
                cellData.flagged = !cellData.flagged;
                flagsLeft += cellData.flagged ? -1 : 1;
                document.getElementById('minesweeper-count').innerText = flagsLeft;
            }
        }
        drawGrid();
    };

    canvas.oncontextmenu = function(e) {
        e.preventDefault();
    };

    drawGrid();
}
