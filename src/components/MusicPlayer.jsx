'use client';

import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(-6); // dB
  const loops = useRef({});
  const filter = useRef(null);
  const gainNode = useRef(null);

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.volume.value = volume;
    }
  }, [volume]);

  const handleToggle = async () => {
    if (!isPlaying) {
      await Tone.start();

      // 🎛 Gain & Filter chain
      gainNode.current = new Tone.Volume(volume).toDestination();
      filter.current = new Tone.Filter(800, 'lowpass').connect(gainNode.current);

      // 🎹 Arpeggio (PolySynth + Reverb)
      const synth = new Tone.PolySynth(Tone.Synth).connect(filter.current);
      const arpeggioNotes = ['C4', 'E4', 'G4', 'B4', 'D5'];
      let arpIndex = 0;
      loops.current.arp = new Tone.Loop((time) => {
        synth.triggerAttackRelease(arpeggioNotes[arpIndex % arpeggioNotes.length], '8n', time);
        arpIndex++;
      }, '8n');

      // 🥁 Kick + Snare
      const kick = new Tone.MembraneSynth().connect(filter.current);
      const snare = new Tone.NoiseSynth({ envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).connect(filter.current);

      loops.current.kick = new Tone.Loop((time) => {
        kick.triggerAttackRelease('C1', '8n', time);
      }, '2n');

      loops.current.snare = new Tone.Loop((time) => {
        snare.triggerAttackRelease('8n', time + Tone.Time('4n'));
      }, '2n');

      // 🎸 Bass
      const bass = new Tone.MonoSynth({ oscillator: { type: 'square' } }).connect(filter.current);
      const bassLine = ['C2', 'A1', 'F1', 'G1'];
      let bassIndex = 0;
      loops.current.bass = new Tone.Loop((time) => {
        bass.triggerAttackRelease(bassLine[bassIndex % bassLine.length], '8n', time);
        bassIndex++;
      }, '4n');

      // 🎚 Filter sweep modulation
      const lfo = new Tone.LFO('4m', 400, 1500);
      lfo.connect(filter.current.frequency);
      lfo.start();

      Tone.Transport.bpm.value = 100;
      Object.values(loops.current).forEach((lp) => lp.start());
      Tone.Transport.start();
      setIsPlaying(true);
    } else {
      Tone.Transport.stop();
      Object.values(loops.current).forEach((lp) => lp.stop());
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
     <button
  onClick={handleToggle}
  className={`px-5 py-3 rounded-full font-semibold shadow-xl bg-pink-600 text-white transition-all ${
    isPlaying ? 'animate-bounce ' : 'hover:bg-pink-700'
  }`}
>
  {isPlaying ? (
    <span className="inline-flex items-center gap-1">
  <span className="animate-pulse">🔊</span>
  <span>Stop Jam</span>
</span>

  ) : (
    <span className="animate-pulse inline-flex items-center gap-1">
      🎶 <span>Play Jam</span>
    </span>
  )}
</button>

      <input
        type="range"
        min="-24"
        max="0"
        step="1"
        value={volume}
        onChange={(e) => setVolume(+e.target.value)}
        className="w-32 accent-pink-600"
        title="Volume"
      />
    </div>
  );
}
