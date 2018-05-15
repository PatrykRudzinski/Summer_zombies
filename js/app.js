document.addEventListener('DOMContentLoaded', function () {

    const board = document.querySelector('#board');
    const boom = document.querySelector('#boom');

    //Hide loader
    document.addEventListener('readystatechange', () => {
        boom.style.transform = 'scale(0)';
        document.querySelector('#loader').style.display = 'none';
    });

    let gameState = {
        level : 0,
        points : 0,
        life : 3
    };

    class Zombie {

        constructor(game) {
            this.game = game;
            this.zombie = document.createElement('div');
            this.zombie.classList.add('zombie');

            this.position = this.getPosition();
            this.zombie.style.bottom = this.position + 'px';
            this.zombie.style.zIndex = 150 - this.position + '';

            this.scale = this.setScale();
            this.zombie.style.transform = 'scale(' + this.scale + ')';

            this.speed = this.setSpeed(this.scale);
            this.zombie.style.animationDuration = '0.5s, ' + this.speed + 's';

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
            const speed = s * 30 - (this.game.level * 2);
            if (speed > 0) walkSpeed += speed;
            return walkSpeed;
        }

        makeHimAlive() {
            board.appendChild(this.zombie);
        }
        
    }

    const tester = new Zombie(gameState);
    tester.makeHimAlive()

    console.log(tester);

});