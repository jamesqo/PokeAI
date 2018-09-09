#!/usr/bin/env python3

import numpy as np
import tensorflow as tf

def init_weights(n_inputs, n_outputs, name):
    with tf.variable_scope('nn'):
        stddev = 2 / np.sqrt(n_inputs)
        init = tf.truncated_normal((n_inputs, n_outputs), stddev=stddev)
        return tf.get_variable(init, name=name)

def init_biases(n_outputs, name):
    with tf.variable_scope('nn'):
        return tf.get_variable(tf.zeros([n_outputs]), name=name)

def hidden_layer(input, n_outputs, name):
    n_inputs = input.shape[1]
    weights = init_weights(n_inputs, n_outputs, name=(name + '_weights'))
    biases = init_biases(n_outputs, name=(name + '_biases'))
    return tf.add(tf.matmul(input, weights), biases)

def op_Qhat(input):
    input = tf.placeholder(dtype=tf.float64,
                           name='input') # TODO: shape
    layer1 = hidden_layer(input, n_outputs=300, name='layer1')
    layer2 = hidden_layer(layer1, n_outputs=100, name='layer2')
    return hidden_layer(layer2, n_outputs=1, name='output')

def op_max_Qhat(inputs):
    Qhats = tf.map_fn(op_Qhat, inputs)
    return tf.reduce_max(Qhats)

def op_train(max_Qhat, prev_Qhat):
    with tf.variable_scope('nn'):
        pass # TODO

def main():
    Qhat_input = tf.placeholder(dtype=tf.float64,
                                name='Qhat_input') # TODO: Shape

    max_Qhat_inputs = tf.placeholder(dtype=tf.float64,
                                     name='max_Qhat_inputs') # TODO: Shape

    train_max_Qhat = tf.placeholder(dtype=tf.float64,
                                    name='train_max_Qhat') # TODO: Shape
    train_prev_Qhat = tf.placeholder(dtype=tf.float64,
                                     name='train_prev_Qhat') # TODO: Shape

    Qhat = op_Qhat(Qhat_input)
    max_Qhat = op_max_Qhat(max_Qhat_inputs)
    train = op_train(train_max_Qhat, train_prev_Qhat)

if __name__ == '__main__':
    main()
