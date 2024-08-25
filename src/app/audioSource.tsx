import {useEffect} from "react";
import * as Tone from "tone";
// @ts-ignore
import * as toWav from "audiobuffer-to-wav"
import {AudioProps, useAudio} from "@/hooks/useAudio";


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
    const audioProps: AudioProps = {
        playEventListener: () => setPlaying(true),
        pauseEventListener: () => setPlaying(false)
    }
    const [audio, setAudioSrc] = useAudio(audioProps)
    useEffect(() => {
        createAudio(recordingOptions)
            .then((s) => setAudioSrc(s))
    }, [recordingOptions, setAudioSrc])

    playerControl.play = () => audio.play();
    playerControl.pause = () => audio.pause();

    return <></>
}


async function createAudio(recordingOptions: RecordingOptions): Promise<string> {
    const context = new Tone.OfflineContext(2, recordingOptions.duration, 41000)
    Tone.setContext(context)
    const synth = createSynth()
    context.transport.start()
    synth.triggerAttack()
    return context.render()
        .then((buffer) => {
            context.dispose()
            const blobData = toWav(buffer)
            const blob = new Blob([blobData], {type: 'audio/wav'})
            return window.URL.createObjectURL(blob)
        }
    )
}


function createSynth() {
    const filter = new Tone.Filter(10, 'lowpass').toDestination();
    const synth = new Tone.NoiseSynth({envelope: {sustain: 1}}).toDestination();
    synth.connect(filter);
    return synth
}
