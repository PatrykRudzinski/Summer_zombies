document.addEventListener('DOMContentLoaded', function () {

    const board = document.querySelector('.board');
    const boom = document.querySelector('#boom');

    let level = 0;
    let score = 0;
    let life = 3;

    document.addEventListener('mousemove', function(e){
        boom.style.transform = 'translateY('+(e.screenY-140)+'px)';
        boom.style.transform += 'translateX('+(e.screenX-40)+'px)';
    },false);

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

        zombie.addEventListener('click', function () {
            this.classList.add('die');
            //this.remove();
            boom.style.zIndex= '300';

            setTimeout(function () {
                boom.style.zIndex = '-1';
            }, 170)


        })

    }, 1000)

});