document.addEventListener('DOMContentLoaded', function () {

    const board = document.querySelector('#board');
    const boom = document.querySelector('#boom');
    const hp = document.querySelector('#hp');
    const scoreDisplay = document.querySelector('#score>span');
    const startButton = document.querySelector('#start');
    const startScreen = document.querySelector('#start');
    const endScreen = document.querySelector('#end');
    const pauseScreen = document.querySelector('#pause');


    //Hide loader
    document.addEventListener('readystatechange', () => {
        boom.style.transform = 'scale(0)';
        document.querySelector('#loader').style.display = 'none';
    });

    let gameState = {
        level : 0,
        score : 0,
        life : 3,
        state : null
    };

    const screen = {

        shake() {
            board.classList.add('shake');
            setTimeout(function () {
                board.classList.remove('shake');
            }, 500);
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

        boom(e) {
            boom.style.transform = 'translateY(' + (e.screenY - 140 - board.offsetTop) + 'px)';
            boom.style.transform += 'translateX(' + (e.screenX - 40 - board.offsetLeft) + 'px)';

            setTimeout(function () {
                    boom.style.transform = 'scale(0)';
                }, 170);
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

        updateScore() {
            scoreDisplay.innerText = gameState.score
        },

        removeZombies() {
            [...document.querySelectorAll('.zombie')].forEach(el => el.parentElement.removeChild(el))
        },

        endGame() {
            endScreen.style.display = 'flex';
            endScreen.children[1].children[0].innerText = gameState.score;
            window.clearInterval(game);
        },

        pauseGame() {
            window.clearInterval(game);
            pauseScreen.style.display = 'flex';
            [...document.querySelectorAll('.zombie')].forEach(el => el.style.animationPlayState = 'paused');
        },

        startGame() {
            pauseScreen.style.display = 'none';
            endScreen.style.display = 'none';
            //startScreen.style.display = 'none';
            [...document.querySelectorAll('.zombie')].forEach(el => el.style.animationPlayState = 'running');
            game = window.setInterval(function () {
                new Zombie().makeHimAlive();
            }, 1000);
        }

    };

    screen.updateScore();
    screen.generateHp(); //todo

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
                        screen.endGame();
                        screen.removeZombies();
                    }
                }
            });

            this.zombie.addEventListener('click', function (e) {
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

    document.addEventListener('mouseleave', function () {
        screen.pauseGame();
    });

    document.addEventListener('mouseenter', function () {
        screen.startGame();
    });

    let game;

});