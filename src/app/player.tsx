'use client';

import {useEffect, useState} from "react";
import {PlayerControls, AudioSource} from "@/app/audioSource";
import {PlayPauseIcon} from "@/components/icons";
import Wave from "@/components/wave";

export default function Player() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? <ClientPlayer/> : <div>Loading</div>
}


function ClientPlayer() {
    const playerControl = new PlayerControls();
    const [playing, setPlaying] = useState(false);
    const [synthOptions, setSynthOptions] = useState({duration: 1})
    const setDuration = (n: number) => setSynthOptions({duration: n})
    return <div className="h-96 w-96">
        <Wave/>
        <AudioSource recordingOptions={synthOptions} playerControl={playerControl} setPlaying={setPlaying}/>
        <PlayerController playerControl={playerControl} playing={playing}/>
        <button onClick={() => setDuration(synthOptions.duration+1)}>seta: {synthOptions.duration}</button>
    </div>
}


function PlayerController({playerControl, playing}: {playerControl: PlayerControls,  playing: boolean }) {
    return <div className='flex justify-center py-5'>
        <div className='w-52 flex place-content-evenly'>
            <button onClick={playing ? playerControl.pause : playerControl.play}>
                <PlayPauseIcon playing={playing}/>
            </button>
        </div>
    </div>
}