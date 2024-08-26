'use client';

import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import Wave from "@/components/wave";
import {useAudio} from "@/hooks/useAudio";
import {RecordingOptions, renderAudio} from "@/synthesizer/audio";
import PlayerController from "@/components/playerController";
import Synth from "@/components/synth";
import {defaultOptions} from "@/synthesizer/synthesizer";


/**
 * important: requires audio context and cannot be rendered on the server
 * manages rendering and playing of audio, controls synth options
 */
export default function Player() {
    const [recordingOptions, setRecordingOptions] = useState({duration: 1})
    const [synthOptions, setSynthOptions] = useState(defaultOptions)
    const [playing, setPlaying] = useState(false);
    const playEventListener = useCallback(() => setPlaying(true), [setPlaying])
    const pauseEventListener = useCallback(() => setPlaying(false), [setPlaying])

    const [audio, setAudioSrc] = useAudio({playEventListener, pauseEventListener})

    useEffect(() => {
        renderAudio(recordingOptions, synthOptions, setAudioSrc)
    }, [recordingOptions, synthOptions, setAudioSrc]);

    return <div className="h-96 w-96">
        <Wave/>
        <PlayerController audio={audio} playing={playing}/>
        <Synth setSynthOptions={setSynthOptions}/>
        <RecordingOptionComponent options={recordingOptions} setOptions={setRecordingOptions}></RecordingOptionComponent>
    </div>
}


function RecordingOptionComponent(props: {options: RecordingOptions, setOptions: Dispatch<SetStateAction<RecordingOptions>>}) {
    const setDuration = (n: number) => props.setOptions({duration: n})
    const increaseDuration = () => setDuration(props.options.duration + 1)
    return <button onClick={increaseDuration}>increase duration: {props.options.duration}</button>
}
