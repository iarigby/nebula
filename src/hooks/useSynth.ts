import React, {useEffect, useState} from "react";
import * as Tone from "tone";
import {createSynth, SynthOptions} from "@/synthesizer/synthesizer";
import {FilterOptions} from "tone";

export function useSynth(context: Tone.Context, options: SynthOptions): [Tone.NoiseSynth | undefined, Tone.Filter | undefined, boolean] {
    const [instruments, setInstruments] = useState<[Tone.NoiseSynth | undefined, Tone.Filter | undefined]>([undefined, undefined])
    const [ready, setReady] = React.useState(false)
    useEffect(() => {
        if (context) {
            if (instruments[0] === undefined) {
                const inst = createSynth({context: context}, options)
                setInstruments(inst)
                Tone.start().then(() => setReady(true))
            } else {
                updateFilterValues(instruments[1], options.filter)
            }
        }
    }, [context, options, instruments])
    return [...instruments, ready]
}


function updateFilterValues(filter?: Tone.Filter, options?: Partial<FilterOptions>) {
    if (!filter || !options) {
        return
    }
    Object.entries(options).forEach(([key, value]) => {
        const k = key as keyof FilterOptions
        if (filter.get()[k] !== value) {
            const newOptions: any = {}
            newOptions[k] = value
            filter.set(newOptions)
        }
    })
}