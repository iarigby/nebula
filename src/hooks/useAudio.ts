import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";

export type AudioProps = {
    playEventListener: () => void,
    pauseEventListener: () => void
}

/**
 * handles HTMLAudioElement, assigns event listeners, returns a function to update source
 * when source is updated, if audio is playing, it stops the playback (and dispatches the pause event listener)
 * @param playEventListener
 * @param pauseEventListener
 */
export function useAudio({playEventListener, pauseEventListener}: AudioProps): [HTMLAudioElement, Dispatch<SetStateAction<string | undefined>>] {
    const audio = useMemo(() => new Audio(), [])
    useEffect(() => {
        audio.addEventListener('play', playEventListener)
        audio.addEventListener('pause', pauseEventListener)
    }, [audio, playEventListener, pauseEventListener])
    const [audioSrc, setAudioSrc] = useState<string>();
    useEffect(() => {
        if (audioSrc) {
            if (!audio.paused) {
                audio.pause()
                pauseEventListener()
            }
            audio.src = audioSrc
        }
    }, [audioSrc, audio, pauseEventListener])
    return [audio, setAudioSrc]
}