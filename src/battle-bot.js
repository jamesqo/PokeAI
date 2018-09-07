// @flow

import {NNLayer} from './nn';
import type {Matrix} from './types';

function buildNN(): NNLayer {
    const layer0 = NNLayer.input();
    const layer1 = NNLayer.hidden(layer0, 300);
    const layer2 = NNLayer.hidden(layer1, 100);
    const layer3 = NNLayer.output(layer2, 1);
    return layer3;
}

export class BattleBot {
    nn: NNLayer;
    policy: ExploreExploitPolicy;

    constructor(policy: ExploreExploitPolicy) {
        this.nn = buildNN();
        this.policy = policy;
    }

    act(battle: Battle) {
        const shouldExplore = this.policy.decide();
        if (shouldExplore) {

        } else {

        }
    }

    trainAgainst(p2: BattleBot) {
        const battle = new Battle(); // TODO: Connect us and p2
        while (!battle.ended) {
            const reward = this.act(battle);
            this.updateWeights(reward);
        }

        return weights;
    }

    update(weights: Matrix[]) {
        const numLayers = this.nn.layers.length;
        if (weights.length !== numLayers) {
            throw new Error(`'weights' contains the wrong number of layers. Was ${weights.length}, should be ${numLayers}`);
        }

        for (let i = 0; i < numLayers; i++) {
            const layer = this.nn.layers[i];
            layer.W = layerWeights; // TODO: What about biases?
        }
    }
}
