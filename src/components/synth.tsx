import {useState} from "react";
import * as Tone from "tone";
import {useSynth} from "@/hooks/useSynth";
// import {defaultOptions, SynthOptions} from "@/synthesizer/synthesizer";


export default function Synth() {
    const [context, ] = useState<Tone.Context>(() => new Tone.Context())
    const [synth, ready] = useSynth(context)

    // const [synthOptions, setSynthOptions] = useState<SynthOptions>(defaultOptions)
    if (!synth || !ready) return <>loading</>;

    const triggerAttack = () => synth.triggerAttackRelease(1)

    return <div>
        <button onClick={triggerAttack}>make some noise!</button>
    </div>

}
