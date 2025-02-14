document.addEventListener('DOMContentLoaded', function () {
    const fountainContainer = document.querySelector('.fountain-container');
    const fountain = document.querySelector('.fountain');
    const audio = document.getElementById('fountain-sound');

    function generateGrass() {
        const grassCount = Math.max(window.innerWidth / 7, 150);
        fountainContainer.querySelectorAll('.grass').forEach(grass => grass.remove());
        for (let i = 0; i < grassCount; i++) {
            const grass = document.createElement('div');
            grass.classList.add('grass');
            grass.style.left = Math.random() * 100 + '%';
            grass.style.bottom = Math.random() * 100 + 'vh';

            const referenceSize = Math.min(window.innerWidth, window.innerHeight);
            const maxGrassHeight = Math.max(referenceSize * 0.03, 10);
            const grassHeight = Math.random() * maxGrassHeight + 5;
            grass.style.height = `${grassHeight}px`;

            grass.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            fountainContainer.appendChild(grass);
        }
    }

    generateGrass();

    function calculateStartPositions() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        return [
            { x: viewportWidth * 0.3, y: viewportHeight * 0.4 }, // Vogel 1
            { x: viewportWidth * 0.5, y: viewportHeight * 0.25 }, // Fliege
            { x: viewportWidth * 0.65, y: viewportHeight * 0.6 }, // Vogel 3
        ];
    }

    let startPositions = calculateStartPositions();

    function initiateFlyMovement(fly, baseAmplitude, period, startPosition, reverse = false) {
        const startTime = Date.now();
        let lastX = startPosition.x;
        let lastY = startPosition.y;

        function moveFly() {
            const elapsed = Date.now() - startTime;

            const amplitudeX = Math.min(baseAmplitude, window.innerWidth * 0.2);
            const amplitudeY = Math.min(baseAmplitude, window.innerHeight * 0.15);

            const x = startPosition.x + amplitudeX * Math.sin(elapsed / period) * (reverse ? -1 : 1);
            const y = startPosition.y + amplitudeY * Math.cos(elapsed / period);

            fly.style.left = `${Math.min(Math.max(x, 0), window.innerWidth - fly.offsetWidth)}px`;
            fly.style.top = `${Math.min(Math.max(y, 0), window.innerHeight - fly.offsetHeight)}px`;

            const dx = x - lastX;
            const dy = y - lastY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            fly.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;

            lastX = x;
            lastY = y;

            requestAnimationFrame(moveFly);
        }
        moveFly();
    }

    function initializeFlies() {
        const flies = document.querySelectorAll('.fly');
        flies.forEach((fly, index) => {
            const baseAmplitude = 150;
            const period = Math.random() * 2000 + 2000;
            const startPosition = startPositions[index];

            initiateFlyMovement(fly, baseAmplitude, period, startPosition, index % 2 === 0);

            fly.addEventListener('click', () => {
                if (index === 0) window.open("https://www.instagram.com/elifxplore/", "_blank");
                if (index === 1) {
                    const encodedEmail = "ZWxpZnhwbG9yZUBnbWFpbC5jb20="; // Base64-encoded
                    const decodedEmail = atob(encodedEmail);
                    window.location.href = `mailto:${decodedEmail}`;
                }
                if (index === 2) window.open("https://www.youtube.com/@elifxplore", "_blank");
            });
        });
    }

    fountain.addEventListener('click', (event) => {
        const emoji = document.createElement('div');
        emoji.style.position = 'absolute';
        emoji.style.top = `${event.clientY}px`;
        emoji.style.left = `${event.clientX}px`;

        // Adjust font size based on viewport size
        const viewportSize = Math.min(window.innerWidth, window.innerHeight);
        const emojiSize = Math.max(viewportSize * 0.05, 11); // Minimum size of 16px
        emoji.style.fontSize = `${emojiSize}px`;

        emoji.style.pointerEvents = 'none';
        emoji.style.zIndex = '1000'; // Ensure it's above other elements
        emoji.innerText = audio.paused ? '🎧' : '🚫';

        document.body.appendChild(emoji);

        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }

        setTimeout(() => emoji.remove(), 650);
    });

    window.addEventListener('resize', () => {
        generateGrass();
        startPositions = calculateStartPositions();
        initializeFlies();
    });

    initializeFlies();
});
