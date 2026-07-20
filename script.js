let currentLoop = null;      
let tetrisRunning = false;   
let pongRunning = false;     
let activeAnimationId = null;
function hideCabinets() {
    if (currentLoop) { 
        clearInterval(currentLoop); 
        currentLoop = null; 
    }
    tetrisRunning = false;
    pongRunning = false;
    if (activeAnimationId) { 
        cancelAnimationFrame(activeAnimationId); 
        activeAnimationId = null; 
    }
    document.querySelectorAll('.game-cabinet').forEach(cab => cab.style.display = 'none');
    window.onkeydown = null; 
    window.onkeyup = null;
}
function manageHighScore(gameKey, currentScore) {}
window.onload = hideCabinets;
