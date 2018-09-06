// TODO: Add Flow/TypeScript

type Vector = $FlowFixMe;
type Matrix = $FlowFixMe;

interface INeuralNetwork {
    layers: ILayer[];

    addLayer(prev: ILayer, numNeurons: number): ILayer;
    eval(X: Matrix): Matrix;
    getWeights(): Matrix;
}

interface ILayer {
    prev: ILayer;
    W: Matrix;
    b: Vector;
}

class NeuralNetwork implements INeuralNetwork {
    constructor() {
        this.layers = [];
    }

    // TODO: Activation function
    addLayer(prev, numNeurons) {
        // In the case of the input layer, this corresponds to the number of features of input matrix X,
        // NOT the number of training instances we have.
        const numInputs = prev.shape[1];
        const stdDev = 2 / Math.sqrt(numInputs);
        const init = tf.truncatedNormal([numInputs, numNeurons], /* mean */ 0, stdDev);
        const W = tf.variable(init, /* trainable */ true, 'weights');
        const b = tf.variable(tf.zeros([numNeurons]), /* trainable */ true, 'biases');

        const layer = new Layer(prev, W, b);
        this.layers.push(layer);
        return layer;
    }

    eval(X) {
        let result = X;
        for (const layer of this.layers) {
            result = layer.eval(result);
        }
        return result;
    }
}

class Layer {
    constructor(prev, W, b) {
        this.prev = prev;
        this.W = W;
        this.b = b;
    }

    eval(X) {
        return tf.matMul(X, this.W) + this.b; // Adds b to each row
    }

    get shape() {
        return [null, this.b.length];
    }
}
