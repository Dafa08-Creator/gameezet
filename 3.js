let move_speed = 3;
let gravity = 10;
let score = 0;
let highscore = 0;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let highscore_val = document.querySelector('.highscore_val');
let message = document.querySelector('.message');
let game_state = 'Start';
let jump_sound = new Audio('sounds/jump.wav'); // Update with the correct path
let hit_sound = new Audio('sounds/hit.wav');
let die_sound = new Audio('sounds/die.wav');

// Hide the bird initially
img.style.display = 'none';
message.classList.add('messageStyle');

// Load highscore from local storage
if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
    highscore_val.innerHTML = highscore;
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        resetGame();
    } else if (e.key === 'ArrowUp' && game_state === 'Play') {
        birdJump();
    }
});

// Event listener for touch/click on the jump button
document.getElementById('jump-button').addEventListener('click', () => {
    if (game_state === 'Play') {
        birdJump();
    } else if (game_state !== 'Play') {
        resetGame();
    }
});

function resetGame() {
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());

    img.style.display = 'block';
    bird.style.top = '40vh';
    bird_props = bird.getBoundingClientRect();

    score = 0;
    score_val.innerHTML = '0';

    game_state = 'Play';
    message.innerHTML = '';
    message.classList.remove('messageStyle');
    play();
}

function birdJump() {
    bird.style.transition = 'transform 0.1s, top 0.3s ease-out';
    bird.style.transform = 'rotate(-20deg)';
    setTimeout(() => bird.style.transform = 'rotate(0deg)', 100);
    jump_sound.play();
    bird.style.top = bird_props.top - 70 + 'px';
}

function play() {
    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (checkCollision(pipe_sprite_props, bird_props)) {
                    endGame();
                } else if (checkScore(pipe_sprite_props, bird_props, element)) {
                    updateScore(element);
                }
            }
            element.style.left = pipe_sprite_props.left - move_speed + 'px';
        });

        bird.style.top = bird_props.top + gravity + 'px';

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
        }

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);
    createPipe();
}

function checkCollision(pipe, bird) {
    return bird.left < pipe.left + pipe.width &&
           bird.left + bird.width > pipe.left &&
           bird.top < pipe.top + pipe.height &&
           bird.top + bird.height > pipe.top;
}

function checkScore(pipe, bird, element) {
    return pipe.right < bird.left && pipe.right + move_speed >= bird.left && element.increase_score === '1';
}

function updateScore(element) {
    score++;
    score_val.innerHTML = score;
    element.increase_score = '0';

    if (score > highscore) {
        highscore = score;
        highscore_val.innerHTML = highscore;
        localStorage.setItem('highscore', highscore);
    }
}

function endGame() {
    game_state = 'End';
    die_sound.play();
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter or Tap to Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
}

function createPipe() {
    if (game_state !== 'Play') return;

    let pipe_separation = 0;
    let pipe_gap = 35;

    function generatePipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.transform = 'rotate(180deg)';
            pipe_sprite_inv.increase_score = '1';

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite_inv);
            document.body.appendChild(pipe_sprite);
        }

        pipe_separation++;
        requestAnimationFrame(generatePipe);
    }

    requestAnimationFrame(generatePipe);
}
