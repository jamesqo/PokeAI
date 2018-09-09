// @flow

import {NNLayer, inputLayer, hiddenLayer, outputLayer, NNLayerParams} from './nn';
import {ExploreExploitPolicy} from './policy';

export type BattleBotConfig = {
    learningRate: number;
    discountRate: number;
    policy: ExploreExploitPolicy;
};

export class BattleBot {
    nn: NNLayer;
    config: BattleBotConfig;

    constructor(config: BattleBotConfig) {
        this.nn = buildNN();
        this.config = config;
    }

    _getRewardRef(): tf.Variable {
        const rewardTensor = this.nn.output;
        const [x, y] = rewardTensor.shape;
        if (x !== 1 || y !== 1) {
            throw new Error("Reward tensor has incorrect shape");
        }
        return rewardTensor[0][0];
    }

    act(battle: Battle): number {
        const shouldExplore = this.config.policy.decide();
        if (shouldExplore) {
            // Choose a random action. Measure the reward.
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

    _updateParams(reward: number) {
        for (const layerParams of this.nn.getAllParams()) {
            const {weights, biases} = layerParams;

            weights.addAssign(this._getDelta(weights, reward));
            biases.addAssign(this._getDelta(biases, reward));
        }
    }

    _getDelta(params: Tensor, reward: number, prevQhat: number): number {
        const rewardRef = this._getRewardRef();

        const alpha = this.config.learningRate;
        const beta = this.config.discountRate;
        const Qhat = this._Qhat;
        const maxQhat = ...; // TODO: Enumerate all possible actions, run Qhat on each.

        // TODO: Figure out how to get the fn to differentiate.
        // Form needed: f((...args: Tensor[]) => Tensor) for tf.grads(f)
        return alpha * ((reward + beta * maxQhat) - prevQhat) * tf.grads(...);
    }

    _Qhat(battle: Battle, action: Action): number {
        // Note: Qhat is an approximation of Q (using the NN).
        // Thus we don't use actual Q, which would involve cloning
        // the state of the battle and take forever.
        const battleFeats = getBattleFeats(battle);
        const actionFeats = getActionFeats(action);
        const input = battleFeats.concat(actionFeats);

        this.nn.setInput(input);
        return this._getRewardRef().eval();
    }
}
