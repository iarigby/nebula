import {useCallback, useEffect} from "react";
import * as Tone from "tone";
// @ts-ignore
import * as toWav from "audiobuffer-to-wav"
import {useAudio} from "@/hooks/useAudio";
import {renderRecording} from "@/synthesizer/synthesizer";


export class PlayerControls {
    play: Fn = () => {}
    pause: Fn = () => {}
}

export type RecordingOptions = {duration: number, context?: Tone.Context}
type Fn = () => void


export function AudioSource({playerControl, setPlaying, recordingOptions}: {
    playerControl: PlayerControls,
    setPlaying: (b: boolean) => void,
    recordingOptions: RecordingOptions
}) {
    const playEventListener = useCallback(() => setPlaying(true), [setPlaying])
    const pauseEventListener = useCallback(() => setPlaying(false), [setPlaying])
    const [audio, setAudioSrc] = useAudio({playEventListener, pauseEventListener})

    useEffect(() => {
        renderRecording(recordingOptions)
            .then(createAudioSrc)
            .then(setAudioSrc)
    }, [recordingOptions, setAudioSrc])

    playerControl.play = () => audio.play();
    playerControl.pause = () => audio.pause();

    return <></>
}

function createAudioSrc(buffer: Tone.ToneAudioBuffer) {
    const blobData = toWav(buffer)
    const blob = new Blob([blobData], {type: 'audio/wav'})
    return window.URL.createObjectURL(blob)
}


