import {Dispatch, ReactNode, SetStateAction, useCallback, useState} from "react";
import * as Tone from "tone";
import {useSynth} from "@/hooks/useSynth";
import {addPlayBack, defaultOptions, SynthOptions} from "@/synthesizer/synthesizer";


export default function Synth({duration, setSynthOptions}: {duration: number, setSynthOptions:  Dispatch<SetStateAction<SynthOptions>>}) {
    const [context, ] = useState<Tone.Context>(() => new Tone.Context())

    const [startingFrequency, setStartingFrequency] = useState<number>(defaultOptions.filter!.frequency)
    const [endingFrequency, setEndingFrequency] = useState<number>(defaultOptions.filter!.frequency)
    const synthOptions: SynthOptions = {filter: {frequency: startingFrequency}}
    const [synth, filter, ready] = useSynth(context)
    const doPlayback = () => {
        if (synth && filter) {
            Tone.setContext(context)
            context.resume().then(() => {
                addPlayBack(synth, filter, duration, 'seconds')
            })
        }
    }
    if (!synth || !filter ) return <>loading</>;

    return <div>
        <FilterSetting filterFrequency={startingFrequency} setFilterFrequency={setStartingFrequency}>
            Enter Starting Frequency
        </FilterSetting>
        <FilterSetting filterFrequency={endingFrequency} setFilterFrequency={setEndingFrequency}>
            Enter Ending Frequency
        </FilterSetting>
        <button onClick={() => doPlayback()}>check out the playback (sped up)</button>
        <button onClick={() => setSynthOptions(synthOptions)}>save these settings for audio</button>
    </div>
}


function FilterSetting(props: {children: ReactNode, filterFrequency: number, setFilterFrequency: (frequency: number) => void}) {
    return <div>
        <div>
            {props.children}
        </div>
        <div>
            <input type='number'
                   min={0} max={22000} step={50}
                   onChange={(e) => props.setFilterFrequency(Number(e.target.value))}
                   value={props.filterFrequency}/>

        </div>
    </div>
}