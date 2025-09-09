export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.isSoundOn = true;
        this.isSoundInitialized = false;

        this.noteCount = [0, 0];
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.ctx.resume();
        this.musicInternval = setInterval(() => this.playMusic(), 60000 / 480);
    }

    clickSound() {
        this.playSound("triangle", 174.6, 0.5, 0, 0.2);
    }

    moveSound() {
        this.playSound("triangle", 110, 0.8, 0, 0.1);
    }

    playerDeadSound() {
        this.playSound("square", 18.35, 0.1, 0, 0.1);
        this.playSound("square", 36.71, 0.1, 0.1, 0.2);
        this.playSound("square", 73.42, 0.1, 0.2, 0.2);
    }

    victorySound() {
        this.playSound("square", 932.3, 0.2, 0, 0.1);
        this.playSound("square", 1865, 0.2, 0.1, 0.2);
    }

    walkSound() {
        this.playSound("triangle", 110, 0.05, 0, 0.1);
    }

    playOverSound() {
        this.playSound("square", 32.70, 0.3, 0, 0.1);
        this.playSound("square", 36.71, 0.2, 0.1, 0.2);
        this.playSound("square", 16.35, 0.3, 0.2, 0.1);
    }

    jumpSound() {
        this.playSound("square", 293.7, 0.1, 0, 0.2);
    }

    fallSound() {
        this.playSound("triangle", 293.66, 0.07, 0, 0.1);
        this.playSound("triangle", 146.83, 0.07, 0.1, 0.2);
    }

    playSound(type, value, volume, start, end) {
        if (this.isSoundOn && this.isSoundInitialized) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();

            o.type = type;
            o.frequency.value = value;

            g.gain.setValueAtTime(volume, this.ctx.currentTime + start);
            g.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + start + end);

            o.connect(g);
            g.connect(this.ctx.destination);
            o.start(this.ctx.currentTime + start);
            o.stop(this.ctx.currentTime + start + end);
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized && this.ctx.state == "running") {
            this.playSound("sine", mB[this.noteCount[0]], 0.8, 0, 0.24);
            this.updateNoteCount(0, mB);

            this.playSound("square", mR[this.noteCount[1]], 0.03, 0, 0.8);
            this.updateNoteCount(1, mR);
        }
    }

    updateNoteCount(pos, melodyArray) {
        this.noteCount[pos]++;
        if (this.noteCount[pos] >= melodyArray.length) this.noteCount[pos] = 0;
    }
}

const mB = [
    69.3, null, 69.3, null, 82.41, null, 69.3, 82.41,
    null, 92.5, 98, null, 92.5, null, 82.41, null,
];

const mR = [
    138.59, null, 415.3, null, null, null, 138.59, null,
    415.3, null, null, null, 138.59, null, 369.99, null,
    138.59, null, 440, null, null, null, 138.59, null,
    440, null, null, null, 138.59, null, 440, null,
    138.59, null, 493.88, null, null, null, 138.59, null,
    493.88, null, null, null, 138.59, null, 440, null,
    138.59, null, 415.3, null, null, null, 138.59, null,
    415.3, null, null, null, 138.59, null, 415.3, null,
    138.59, null, 415.3, null, null, null, 138.59, null,
    415.3, null, null, null, 138.59, null, 369.99, null,
    138.59, null, 440, null, null, null, 138.59, null,
    440, null, null, null, 138.59, null, 440, null,
    138.59, null, 493.88, null, null, null, 138.59, null,
    493.88, null, null, null, 138.59, null, 440, null,
    138.59, null, 415.3, null, null, null, 138.59, null,
    415.3, null, null, null, 138.59, null, 415.3, null,
    277.18, null, null, null, 277.18, null, 415.3, null,
    null, null, 415.3, null, 392, null, null, null,
    392, null, 369.99, null, null, null, 369.99, null,
    329.63, null, null, null, 329.63, null, 277.18, null,
    329.63, null, null, null, 277.18, null, 246.94, null,
    246.94, null, 277.18, null, null, null, 207.65, null,
    185, null, 164.81, null, 185, null, 164.81, null,
    155.56, null, 123.47, null, 138.5, null, null, null,
    277.18, null, null, null, 277.18, null, 415.3, null,
    null, null, 415.3, null, 392, null, null, null,
    392, null, 369.99, null, null, null, 369.99, null,
    329.63, null, null, null, 329.63, null, 277.18, null,
    329.63, null, null, null, 277.18, null, 246.94, null,
    246.94, null, 277.18, null, null, null, 207.65, null,
    185, null, 164.81, null, 185, null, 164.81, null,
    155.56, null, 123.47, null, 138.5, null, null, null,
];