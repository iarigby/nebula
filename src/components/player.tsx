'use client';

import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import Wave from "@/components/wave";
import {useAudio} from "@/hooks/useAudio";
import {RecordingOptions, renderAudio} from "@/synthesizer/audio";
import PlayerController from "@/components/playerController";


/**
 * important: requires audio context and cannot be rendered on the server
 * manages rendering and playing of audio, controls synth options
 */
export default function Player() {
    const [recordingOptions, setRecordingOptions] = useState({duration: 1})

    const [playing, setPlaying] = useState(false);
    const playEventListener = useCallback(() => setPlaying(true), [setPlaying])
    const pauseEventListener = useCallback(() => setPlaying(false), [setPlaying])

    const [audio, setAudioSrc] = useAudio({playEventListener, pauseEventListener})

    useEffect(() => {
        renderAudio(recordingOptions, setAudioSrc)
    }, [recordingOptions, setAudioSrc]);

    return <div className="h-96 w-96">
        <Wave/>
        <PlayerController audio={audio} playing={playing}/>
        <SynthOptions recordingOptions={recordingOptions} setRecordingOptions={setRecordingOptions}></SynthOptions>
    </div>
}


function SynthOptions(props: {recordingOptions: RecordingOptions, setRecordingOptions: Dispatch<SetStateAction<RecordingOptions>>}) {
    const setDuration = (n: number) => props.setRecordingOptions({duration: n})
    const increaseDuration = () => setDuration(props.recordingOptions.duration + 1)
    return <button onClick={increaseDuration}>increase duration: {props.recordingOptions.duration}</button>
}
