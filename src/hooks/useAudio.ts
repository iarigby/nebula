import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";

export type AudioProps = {
    playEventListener: () => void,
    pauseEventListener: () => void
}

export function useAudio({playEventListener, pauseEventListener}: AudioProps): [HTMLAudioElement, Dispatch<SetStateAction<string | undefined>>] {
    const audio = useMemo(() => new Audio(), [])
    useEffect(() => {
        audio.addEventListener('play', playEventListener)
        audio.addEventListener('pause', pauseEventListener)
    }, [audio, playEventListener, pauseEventListener])
    const [audioSrc, setAudioSrc] = useState<string>();
    useEffect(() => {
        if (audioSrc) {
            audio.src = audioSrc
        }
    }, [audioSrc, audio])
    return [audio, setAudioSrc]
}