import {renderRecording, SynthOptions} from "@/synthesizer/synthesizer";
import * as Tone from "tone";
import toWav from "audiobuffer-to-wav";


export type RecordingOptions = {duration: number, context?: Tone.Context}

/**
 * creates a Tone.context, renders synthesizer notes, converts it to wav and returns a blob for src
 * @param recordingOptions
 * @param synthOptions
 * @param setAudioSrc
 */
export function renderAudio(recordingOptions: RecordingOptions,
                     synthOptions: SynthOptions,
                     setAudioSrc: (s: string) => void) {
    renderRecording(recordingOptions, synthOptions)
        .then(createAudioSrc)
        .then(setAudioSrc)
}


function createAudioSrc(buffer: Tone.ToneAudioBuffer) {
    const blobData = toWav(buffer)
    const blob = new Blob([blobData], {type: 'audio/wav'})
    return window.URL.createObjectURL(blob)
}
