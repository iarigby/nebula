import * as Tone from "tone";
import {RecordingOptions} from "@/synthesizer/audio";
import {FilterOptions} from "tone";


export async function renderRecording(recordingOptions: RecordingOptions, synthOptions: SynthOptions): Promise<Tone.ToneAudioBuffer> {
    const context = new Tone.OfflineContext(2, recordingOptions.duration, 41000)
    Tone.setContext(context)
    const [synth, ] = createSynth({context}, synthOptions)
    context.transport.start()
    synth.triggerAttack()
    return context.render()
        .then((buffer) => {
                context.dispose()
                return buffer
            }
        )
}

export interface SynthOptions {
    filter?: Partial<FilterOptions>
}


// I have it wrapped in the interface so it is easier to pass with ...contextOptions
export interface ContextOptions {
    context?: Tone.Context
}

export const defaultOptions = {
    filter: {
        frequency: 50
    }
}

export function createSynth(contextOptions?: ContextOptions, synthOptions?: SynthOptions): [Tone.NoiseSynth, Tone.Filter] {
    const filter = new Tone.Filter({...contextOptions, ...(synthOptions || defaultOptions).filter, type: 'lowpass'}).toDestination();
    const synth = new Tone.NoiseSynth({...contextOptions, envelope: {sustain: 1}}).toDestination();
    synth.connect(filter);
    return [synth, filter]
}