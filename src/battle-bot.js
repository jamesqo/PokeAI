// @flow

import {NNLayer, inputLayer, hiddenLayer, outputLayer, NNLayerParams} from './nn';
import {ExploreExploitPolicy} from './policy';

function buildNN(inputSize: number): NNLayer {
    const layer0 = inputLayer(inputSize);
    const layer1 = hiddenLayer(layer0, 300);
    const layer2 = hiddenLayer(layer1, 100);
    const layer3 = outputLayer(layer2, 1);
    return layer3;
}

export class BattleBot {
    nn: NNLayer;
    policy: ExploreExploitPolicy;

    constructor(policy: ExploreExploitPolicy) {
        this.nn = buildNN();
        this.policy = policy;
    }

    act(battle: Battle): number {
        const shouldExplore = this.policy.decide();
        if (shouldExplore) {

        } else {

        }
    }

    trainAgainst(p2: BattleBot) {
        const battle = new Battle(); // TODO: Connect us and p2
        while (!battle.ended) {
            const reward = this.act(battle);
            this._updateParams(reward);
        }

        return weights;
    }

    getParams(): NNLayerParams[] {
        return this.nn.getAllParams();
    }

    setParams(params: NNLayerParams[]) {
        this.nn.setAllParams(params);
    }

    _updateParams(weights: Matrix[]) {
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
