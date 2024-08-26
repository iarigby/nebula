import {useState} from "react";
import * as Tone from "tone";
import {useSynth} from "@/hooks/useSynth";
import {defaultOptions, SynthOptions} from "@/synthesizer/synthesizer";


export default function Synth() {
    const [context, ] = useState<Tone.Context>(() => new Tone.Context())

    const [filterFrequency, setFilterFrequency] = useState<number>(defaultOptions.filter.frequency)

    const synthOptions: SynthOptions = {filter: {frequency: filterFrequency}}
    const [synth, filter, ready] = useSynth(context, synthOptions)


    if (!synth || !filter || !ready) return <>loading</>;

    const triggerAttack = () => synth.triggerAttackRelease(1)
    const updateFilterFrequency = (f: number) => {
        setFilterFrequency(f)
        filter.set({frequency: f})
    }
    const increaseFilterFrequency = () => updateFilterFrequency( Math.min(filterFrequency + 50, 24000))
    const decreaseFilterFrequency = () => updateFilterFrequency(Math.max(filterFrequency - 50, 0))

    return <div>
        <div>
            filter frequency: {filterFrequency}
            <button onClick={increaseFilterFrequency}>increase</button>
            <button onClick={decreaseFilterFrequency}>decrease</button>
        </div>
        <button onClick={triggerAttack}>make some noise!</button>
    </div>
}
