import React from "react";
import {PlayPauseIcon} from "@/components/icons";


type Fn = () => void
type Props = {audio: HTMLAudioElement, playing: boolean}

export default class PlayerController extends React.Component<Props> {
    play: Fn
    pause: Fn

    constructor(props: Props) {
        super(props)
        this.play = () => props.audio.play()
        this.pause = () => props.audio.pause()
    }

    render() {
        return <div className='flex justify-center py-5'>
            <div className='w-52 flex place-content-evenly'>
                <button onClick={this.props.playing ? this.pause : this.play}>
                    <PlayPauseIcon playing={this.props.playing}/>
                </button>
            </div>
        </div>
    }
}