import * as THREE from 'three';
import { AudioLoader, Camera } from 'three';

export class AudioControl {
  // Sound
  listener = new THREE.AudioListener();
  sound = new THREE.Audio(this.listener);
  audioLoader = new AudioLoader();

  initAudio(cam: Camera): void {
    cam.add(this.listener);
  }

  playAudio(): void {
    this.audioLoader.load('/assets/ourAnthem.ogg', (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
  }
}
