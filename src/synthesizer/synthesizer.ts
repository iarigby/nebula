import * as Tone from "tone";
import {RecordingOptions} from "@/synthesizer/audio";
import {FilterOptions} from "tone";


export async function renderRecording(recordingOptions: RecordingOptions, synthOptions: SynthOptions): Promise<Tone.ToneAudioBuffer> {
    const context = new Tone.OfflineContext(2, recordingOptions.duration, 41000)
    Tone.setContext(context)
    const [synth, filter] = createSynth({context}, synthOptions)
    context.transport.start()
    addPlayBack(synth, filter, recordingOptions.duration, 'minutes')
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
    const filter = new Tone.Filter({...contextOptions, ...(synthOptions || defaultOptions).filter, type: 'lowpass', rolloff: -12}).toDestination();
    const synth = new Tone.NoiseSynth({...contextOptions, noise: { type: 'brown' }, envelope: {sustain: 1}}).toDestination();
    // synth.connect(filter);
    Tone.connect(synth, filter)
    return [synth, filter]
}

const durationUnits = {
    'seconds': 1,
    'minutes': 60
}

export function addPlayBack(synth: Tone.NoiseSynth, filter: Tone.Filter, duration: number, durationUnit?: 'seconds' | 'minutes') {
    const scalar = durationUnits[durationUnit || 'seconds']
    const start = 0
    const fadeOutStart = duration * 0.7
    const fadeOutStep = (duration - fadeOutStart)/10

    const freqStep = duration/50

    let frequency = 20000
    filter.set({frequency})

    let volume = -10
    synth.volume.value = volume
    const transport = Tone.getTransport()
    transport.stop()
    transport.cancel(0)

    transport.schedule(() => synth.triggerAttack(), start)

    // will refactor to array keys map

    // filter
    const setFilterFrequency = (f: number) => {
        return () => {
            filter.set({frequency: f})
        }
    }

    for (let i = 0; i < duration; i+=freqStep) {
        transport.schedule(setFilterFrequency(frequency), start + scalar*i)
        frequency -= 10000/50
    }
    // fadeout
    const setVolume = (n: number) => {
        return () => {
            synth.volume.value = n
        }
    }

    for (let i = fadeOutStart; i < duration; i+=fadeOutStep) {
        transport.schedule(setVolume(volume), fadeOutStart + scalar*i)
        volume -= 2
    }

    transport.schedule(() => synth.triggerRelease(), start + scalar*duration)

    transport.start()
}