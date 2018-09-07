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

    weights: ?Tensor;
    biases: ?Tensor;

    constructor(prev: ?NNLayer, size: number) {
        this._prev = prev;
        this._inputSize = (prev ? prev._outputSize : null);
        this._outputSize = size;

        if (prev && (this._inputSize !== null)) { // Forced extra check because of Flow
            this.weights = initWeights(this._inputSize, this._outputSize);
            this.biases = initBiases(this._outputSize);
        }
    }
    
    get params(): Tensor[] {
        return this._prev ? [this.weights, this.biases] : [];
    }

    get shape(): MaybeNumber[] {
        return [this._inputSize, this._outputSize];
    }

    getAllParams(): Tensor[] {
        if (!this._prev) {
            throw new Error("getAllParams called on input layer");
        }

        const result = [];

        const current = this._prev;
        do {
            result.push(...current.params);
        } while (current);

        return result;
    }
}
