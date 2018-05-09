document.addEventListener('DOMContentLoaded', function () {

    const board = document.querySelector('#board');
    const boom = document.querySelector('#boom');
    const pause = document.querySelector('#pause');

    let level = 0;
    let score = 0;
    let life = 3;

    document.addEventListener('mouseenter', function(){
        [...document.querySelectorAll('.zombie')].forEach(el=>el.style.animationPlayState = 'running')
        pause.style.display = 'none';

        const time = setInterval(function () {

            const zombie = document.createElement('div');
            zombie.classList.add('zombie');

            const bottomPos = Math.floor(Math.random()*(150));
            zombie.style.bottom = bottomPos + 'px';
            zombie.style.zIndex = 150 - bottomPos + '';

            let min = 0.2;
            let max = 1.1;
            const scale = Math.random()*(max - min) + min;
            zombie.style.transform = 'scale(' + scale + ')';


            const walkSpeed = scale * 30 + 5;
            const anim = '0.5s, '+ walkSpeed + 's';
            zombie.style.animationDuration = anim;

            board.appendChild(zombie);

            zombie.addEventListener('animationend', function (e) {
                if(e.animationName === 'zombieWalk') {
                    board.removeChild(this);
                }
            });

            zombie.addEventListener('click', function (e) {
                boom.style.transform = 'translateY('+(e.screenY-140)+'px)';
                boom.style.transform += 'translateX('+(e.screenX-40)+'px)';
                const zombiePosition = window.getComputedStyle(this).left;
                this.style.left = zombiePosition + 'px';
                this.style.animationPlayState = 'paused';
                this.style.transform += 'rotate(90deg)';

                setTimeout(function(){
                    e.target.remove()
                }, 600);

                boom.style.zIndex= '300';
                setTimeout(function () {
                    boom.style.zIndex = '-1';
                }, 170)



            })

        }, 1000);

        document.addEventListener('mouseleave', function(){
            window.clearInterval(time);
            pause.style.display = 'flex';
            [...document.querySelectorAll('.zombie')].forEach(el=>el.style.animationPlayState = 'paused')
        });
    });
});