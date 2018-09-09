#!/usr/bin/env python3

import numpy as np
import tensorflow as tf

def init_weights(n_inputs, n_outputs, name):
    stddev = 2 / np.sqrt(n_inputs)
    init = tf.truncated_normal((n_inputs, n_outputs), stddev=stddev)
    return tf.get_variable(init, name=name)

def init_biases(n_outputs, name):
    return tf.get_variable(tf.zeros([n_outputs]), name=name)

class NNLayer(object):
    def __init__(self, prev, n_outputs, name):
        self._prev = prev

        n_inputs = prev.shape[1]
        self.shape = [n_inputs, n_outputs]

        self.input = prev.output if isinstance(prev, NNLayer) else prev
        self.weights = init_weights(n_inputs, n_outputs, name=(name + '_weights'))
        self.biases = init_biases(n_outputs, name=(name + '_biases'))
        self.output = tf.matmul(self.input, self.weights) + self.biases

def build_nn():
    input = tf.placeholder(dtype=tf.float64,
                           name='input') # TODO: shape
    layer1 = NNLayer(input, n_outputs=300, name='layer1')
    layer2 = NNLayer(layer1, n_outputs=100, name='layer2')
    output = NNLayer(layer2, n_outputs=1, name='output')
    return output

def main():
    nn = build_nn()
    nn.output[0][0].eval()

if __name__ == '__main__':
    main()
