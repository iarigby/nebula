import React, {useEffect, useState} from "react";
import * as Tone from "tone";
import {createSynth} from "@/synthesizer/synthesizer";

export function useSynth(context: Tone.Context): [Tone.NoiseSynth | undefined, boolean] {
    const [synth, setSynth] = useState<Tone.NoiseSynth>()
    const [ready, setReady] = React.useState(false)
    useEffect(() => {
        if (context) {
            const synth = createSynth({context: context})
            setSynth(synth)
            Tone.start().then(() => setReady(true))
        }
    }, [context])
    return [synth, ready]
}