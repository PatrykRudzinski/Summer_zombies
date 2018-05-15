document.addEventListener('DOMContentLoaded', function () {

    const board = document.querySelector('#board');
    const boom = document.querySelector('#boom');
    const hp = document.querySelector('#hp');
    const scoreDisplay = document.querySelector('#score>span');
    const startButtons = document.querySelectorAll('.startBtn');
    const endScreen = document.querySelector('#end');
    const pauseScreen = document.querySelector('#pause');
    const boardCovers = document.querySelectorAll('.board_cover');

    let gameState = {};
    let infinityWavesOfZombies; //interval

    //Hide loader
    document.addEventListener('readystatechange', () => {
        document.querySelector('#loader').style.display = 'none';
        boom.style.transform = 'scale(0)';
    });

    //Start game on click
    [...startButtons].forEach((el)=>{
        el.addEventListener('click', ()=>{

            gameState.level = 0;
            gameState.score = 0;
            gameState.life = 3;
            gameState.state = 'running';

            screen.updateScore();
            screen.generateHp();

            game.start();
        });
    });

    //Pause on mouse leave
    document.addEventListener('mouseleave', function () {
        if(gameState.state === 'running') {
            game.pause();
            gameState.state = 'paused';
        }
    });

    //Resume on mouse in
    document.addEventListener('mouseenter', function () {
        if(gameState.state === 'paused') {
            game.start();
            gameState.state = 'running';
        }
    });

    const screen = {

        shake() {
            board.classList.add('shake');
            setTimeout(function () {
                board.classList.remove('shake');
            }, 500);
        },

        boom(e) {
            boom.style.transform = 'translateY(' + (e.screenY - 140 - board.offsetTop) + 'px)';
            boom.style.transform += 'translateX(' + (e.screenX - 40 - board.offsetLeft) + 'px)';

            setTimeout(function () {
                boom.style.transform = 'scale(0)';
            }, 170);
        },

        generateHp() {
            while(hp.firstChild){
                hp.removeChild(hp.firstChild);
            }

            for ( let i = 0; i < gameState.life; i++ ) {
                const heart = document.createElement('span');
                hp.appendChild(heart)
            }
        },

        updateScore() {
            scoreDisplay.innerText = gameState.score
        },

        killZombie(zombie, e) {
            const zombiePosition = window.getComputedStyle(zombie).left;
            zombie.style.left = zombiePosition + 'px';
            zombie.style.animationPlayState = 'paused';
            zombie.style.transform += 'rotate(90deg)';

            setTimeout(function () {
                e.target.remove()
            }, 600);
        },

        removeZombies() {
            [...document.querySelectorAll('.zombie')].forEach(el => el.parentElement.removeChild(el))
        }

    };

    const game = {

        start() {
            [...boardCovers].forEach((el)=>el.style.display = 'none');
            [...document.querySelectorAll('.zombie')].forEach(el => el.style.animationPlayState = 'running');
            infinityWavesOfZombies = window.setInterval(function () {
                new Zombie().makeHimAlive();
            }, 1000);
        },

        pause() {
            window.clearInterval(infinityWavesOfZombies);
            pauseScreen.style.display = 'flex';
            [...document.querySelectorAll('.zombie')].forEach(el => el.style.animationPlayState = 'paused');
        },

        end() {
            endScreen.style.display = 'flex';
            endScreen.children[1].children[0].innerText = gameState.score;
            window.clearInterval(infinityWavesOfZombies);
        }

    };

    class Zombie {

        constructor() {
            this.zombie = document.createElement('div');
            this.zombie.classList.add('zombie');

            this.position = this.getPosition();
            this.zombie.style.bottom = this.position + 'px';
            this.zombie.style.zIndex = 150 - this.position + '';

            this.scale = this.setScale();
            this.zombie.style.transform = 'scale(' + this.scale + ')';

            this.speed = this.setSpeed(this.scale);
            this.zombie.style.animationDuration = '0.5s, ' + this.speed + 's';

            this.zombie.addEventListener('animationend', function (e) {
                if (e.animationName === 'zombieWalk') {
                    board.removeChild(this);
                    screen.shake();
                    gameState.life--;
                    screen.generateHp();

                    if (gameState.life <= 0) {
                        gameState.state = 'end';
                        game.end();
                        screen.removeZombies();
                    }
                }
            });

            this.zombie.addEventListener('click', function _func(e) {
                gameState.score++;
                screen.boom(e);
                screen.killZombie(this, e);
                screen.updateScore();
                if (gameState.score % 3 === 0) gameState.level++;
            })

        }

        getPosition() {
            return Math.floor(Math.random() * (150));
        }

        setScale() {
            const min = 0.2;
            const max = 1.1;
            return Math.random() * (max - min) + min;
        }

        setSpeed(s) {
            let walkSpeed = 5;
            const speed = s * 30 - (gameState.level * 2);
            if (speed > 0) walkSpeed += speed;
            return walkSpeed;
        }

        makeHimAlive() {
            board.appendChild(this.zombie);
        }


        
    }

});