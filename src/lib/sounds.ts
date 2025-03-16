export const playSound = (type: 'correct' | 'wrong' | 'levelUp' | 'click') => {
    const sounds = {
        correct: '/sounds/correct.mp3',
        wrong: '/sounds/wrong.mp3',
        levelUp: '/sounds/level-up.mp3',
        click: '/sounds/click.mp3'
    };

    const audio = new Audio(sounds[type]);
    audio.play().catch(err => console.log('Audio playback failed:', err));
}; 