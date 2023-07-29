import { Vector2 } from 'three';

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass'

// Compositor
// Tianyu Huang <tianyu@illumiart.net>
//
// Usage:
// Call constructor in the init loop;
// Call render() in the render loop;
// call setSize() in the resize callback.
class Compositor {
    constructor(renderer, scene, camera, width, height) {
        this.width = width;
        this.height = height;

        this.composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);
        // const ssaoPass = new SSAOPass(scene, camera);
        // this.composer.addPass(ssaoPass);
        const bloomPass = new UnrealBloomPass(new Vector2(this.width, this.height), 0.5, 0.5, 1);
        this.composer.addPass(bloomPass);
        // const aaPass = new SMAAPass(scene, camera);
        // this.composer.addPass(aaPass);
        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.composer.setSize(width, height);
    }

    render() {
        this.composer.render();
    }
}

export { Compositor };
