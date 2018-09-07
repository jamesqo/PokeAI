// @flow

type MaybeNumber = ?number;

export function inputLayer(size: number) {
    return new NNLayer(/* prev */ null, size);
}

export function hiddenLayer(prev: NNLayer, size: number) {
    return new NNLayer(prev, size);
}

export function outputLayer(prev: NNLayer, size: number) {
    return new NNLayer(prev, size);
}

function initWeights(inputSize: number, outputSize: number) {
    const stdDev = 2 / Math.sqrt(inputSize);
    const init = tf.truncatedNormal([inputSize, outputSize], 0, stdDev);
    return tf.variable(init, true, 'weights');
}

function initBiases(outputSize: number) {
    return tf.variable(tf.zeros([outputSize]), true, 'biases');
}

export class NNLayer {
    _prev: ?NNLayer;
    _inputSize: ?number;
    _outputSize: number;
    _weights: ?Tensor;
    _biases: ?Tensor;

    constructor(prev: ?NNLayer, size: number) {
        this._prev = prev;
        this._inputSize = (prev ? prev._outputSize : null);
        this._outputSize = size;

        if (prev && (this._inputSize !== null)) { // Forced extra check because of Flow
            this._weights = initWeights(this._inputSize, this._outputSize);
            this._biases = initBiases(this._outputSize);
        }
    }
    
    get params(): ?NNLayerParams {
        const weights = this._weights, biases = this._biases;
        return (weights && biases) ? {weights, biases} : null;
    }

    _setParams(params: NNLayerParams) {
        if (!this._prev) {
            throw new Error("_setParams called on input layer");
        }

        const {weights, biases} = params;
        this._weights = weights;
        this._biases = biases;
    }

    get shape(): MaybeNumber[] {
        return [this._inputSize, this._outputSize];
    }

    getAllParams(): NNLayerParams[] {
        if (!this._prev) {
            throw new Error("getAllParams called on input layer");
        }

        const result = [];

        let current = this._prev;
        do {
            if (current.params) { // Forced extra check because of Flow
                result.push(current.params);
            }
            current = current._prev;
        } while (current);

        return result;
    }

    setAllParams(params: NNLayerParams[]) {
        let current: NNLayer = this;
        while (params.length > 0) {
            const layerParams = params.pop();
            current._setParams(layerParams);
            // $FlowFixMe
            current = current._prev;
        }
    }
}

export type NNLayerParams = {
    weights: Tensor,
    biases: Tensor
};
