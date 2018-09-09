#!/usr/bin/env python3

import numpy as np
import tensorflow as tf

def init_weights(n_inputs, n_outputs, name):
    stddev = 2 / np.sqrt(n_inputs)
    init = tf.truncated_normal((n_inputs, n_outputs), stddev=stddev)
    return tf.get_variable(init, name=name)

def init_biases(n_outputs, name):
    return tf.get_variable(tf.zeros([n_outputs]), name=name)

def hidden_layer(input, n_outputs, name):
    n_inputs = input.shape[1]
    weights = init_weights(n_inputs, n_outputs, name=(name + '_weights'))
    biases = init_biases(n_outputs, name=(name + '_biases'))
    return tf.add(tf.matmul(input, weights), biases)

def main():
    with tf.variable_scope('Qhat'):
        input = tf.placeholder(dtype=tf.float64,
                               name='input') # TODO: shape
        layer1 = hidden_layer(input, n_outputs=300, name='layer1')
        layer2 = hidden_layer(layer1, n_outputs=100, name='layer2')
        Qhat = hidden_layer(layer2, n_outputs=1, name='output')

    with tf.variable_scope('max_Qhat'):
        inputs = tf.placeholder(dtype=tf.float64,
                                name='inputs') # TODO: Shape

if __name__ == '__main__':
    main()
