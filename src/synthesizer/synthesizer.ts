import * as Tone from "tone";
import {RecordingOptions} from "@/synthesizer/audio";


export async function renderRecording(recordingOptions: RecordingOptions): Promise<Tone.ToneAudioBuffer> {
    const context = new Tone.OfflineContext(2, recordingOptions.duration, 41000)
    Tone.setContext(context)
    const synth = createSynth()
    context.transport.start()
    synth.triggerAttack()
    return context.render()
        .then((buffer) => {
                context.dispose()
                return buffer
            }
        )
}

function createSynth() {
    const filter = new Tone.Filter(10, 'lowpass').toDestination();
    const synth = new Tone.NoiseSynth({envelope: {sustain: 1}}).toDestination();
    synth.connect(filter);
    return synth
}