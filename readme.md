# Arcade Game System

A minimalist, high-performance arcade suite featuring five retro-inspired games. Built entirely from scratch using vanilla HTML5 Canvas, CSS3, and modular JavaScript, this project runs directly inside any modern web browser with zero installation requirements.

## Active Cabinets

1. **Snake Game**: A vintage, comfortable grid navigation task running at a calibrated pace.
2. **Tetris System**: A clean, technical brick-stacking simulator utilizing sub-grid placement matrix math.
3. **Player vs AI Pong**: A responsive table tennis simulator featuring smooth, organic computer paddle tracking.
4. **AI vs AI Pong**: An un-capped, infinite-acceleration simulation mode where dual computer routines target trajectory lines with perfect predictive calculations up to a maximum velocity boundary of 64 pixels per frame.
5. **Flappy Pillars**: A gravity-based circle flight navigation avoidance matrix.
6. **Asteroids Combat**: A 360-degree directional rotational combat sandbox featuring sharp vector projection firing systems.

## Control Layouts

All active gameplay environments have been re-engineered over to a specialized unified layout schema to avoid browser window scrolling jumping:

*   Movement / Navigation: W (Up / Rotate), A (Left), S (Down / Drop), D (Right)
*   Weapon Fires / Mechanics: Spacebar (Used for firing in Asteroids and flapping in Flappy)

## Global Leaderboard Metrics

The system features a cloud-backed scoring network that monitors records across active sessions:
*   Every game initializes behind a synchronized READY-SET-GO countdown sequence to prevent instant execution lag.
*   High score validation checks trigger exclusively upon Game Over thresholds.
*   Breaking a standing historical record prompts a native interface query window allowing up to 8 characters for name persistence tracking.
*   Rankings use cross-origin open permission pathways mapped to local browser caching vectors to prevent layout memory wipe routines upon application updates or page reloads.