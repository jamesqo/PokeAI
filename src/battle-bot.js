// @flow

import {NeuralNetwork} from './nn';
import type {Matrix} from './types';

function buildNeuralNetwork() {
    const nn = new NeuralNetwork();
    const layer0 = nn.addLayer(/* prev */ null, 300);
    const layer1 = nn.addLayer(layer0, 100);
    const layer2 = nn.addLayer(layer1, 1);
    return nn;
}

export class BattleBot {
    constructor() {
        this.nn = buildNeuralNetwork();
    }

    trainAgainst(p2: BattleBot) {
        // p2 is another BattleBot

        const weights = this.nn.getWeights();

        const battle = new Battle(); // TODO: Connect us and p2
        while (!battle.ended) {
            const reward = this.act(battle);
            // TODO: Update `weights` in response to the reward.
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
