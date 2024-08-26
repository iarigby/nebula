declare module 'audiobuffer-to-wav' {
    function toWav (b: AudioBuffer | Tone.AudioBuffer): ArrayBuffer
    export = toWav
}