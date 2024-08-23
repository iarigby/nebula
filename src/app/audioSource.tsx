import {useEffect, useMemo} from "react";
import * as Tone from "tone";
import * as toWav from "audiobuffer-to-wav"

type Fn = () => void

export class PlayerControls {
    play: Fn = () => {}
    pause: Fn = () => {}
}

export function AudioSource({playerControl, setPlaying}: {
    playerControl: PlayerControls,
    setPlaying: (b: boolean) => void
}) {
    const audio = useMemo(() => new Audio(), [])
    useEffect(() => {
        audio.addEventListener('play', () => setPlaying(true))
        audio.addEventListener('pause', () => setPlaying(false))
    }, [audio, setPlaying])
    useEffect(() => {
        createSource().then((source) => audio.src = source)
    }, [audio])

    playerControl.play = () => audio.play();
    playerControl.pause = () => audio.pause();

    return <></>
}


async function createSource(): Promise<string> {
    const synth = createSynth()
    return Tone.Offline(() => {
        synth.triggerAttack()
    }, 5)
        .then((buffer) => {
                const blobData = toWav(buffer)
                const blob = new Blob([blobData], {type: 'audio/wav'})
                return window.URL.createObjectURL(blob)
            }
        )
}


function createSynth() {
    const startingFilterHeight = 10;
    const filter = new Tone.Filter(startingFilterHeight, 'lowpass').toDestination();
    const synth = new Tone.NoiseSynth({envelope: {sustain: 1}}).toDestination();
    synth.connect(filter);
    return synth
}
