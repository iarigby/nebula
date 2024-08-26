import React, {useEffect, useState} from "react";
import * as Tone from "tone";
import {createSynth, SynthOptions} from "@/synthesizer/synthesizer";

export function useSynth(context: Tone.Context, synthOptions: SynthOptions): [Tone.NoiseSynth | undefined, Tone.Filter | undefined, boolean] {
    const [instruments, setInstruments] = useState<[Tone.NoiseSynth | undefined, Tone.Filter | undefined]>([undefined, undefined])
    const [ready, setReady] = React.useState(false)
    useEffect(() => {
        if (context) {
            const instruments = createSynth({context: context}, synthOptions)
            setInstruments(instruments)
            Tone.start().then(() => setReady(true))
        }
        // synthOptions is not in the dependency array as the synth should not be recreated when options change
        // tonejs has a separate interface for that
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context])
    return [...instruments, ready]
}