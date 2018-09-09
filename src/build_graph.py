#!/usr/bin/env python3

import numpy as np
import tensorflow as tf

def init_weights(n_inputs, n_outputs, name):
    stddev = 2 / np.sqrt(n_inputs)
    init = tf.truncated_normal((n_inputs, n_outputs), stddev=stddev)
    return tf.get_variable(name, initializer=init)

def init_biases(n_outputs, name):
    return tf.get_variable(name, initializer=tf.zeros([n_outputs]))

def init_output(weights, biases, name):
    value = tf.add(tf.matmul(input, weights), biases)
    return tf.get_variable(name, initializer=value, trainable=False)

def hidden_layer(input_, n_outputs, name):
    with tf.variable_scope(name):
        n_inputs = input_.shape[1]
        weights = init_weights(n_inputs, n_outputs, name='weights')
        biases = init_biases(n_outputs, name='biases')
        output = init_output(weights, biases, name='output')
        return output

def op_Qhat(input_):
    with tf.variable_scope('nn'):
        layer1 = hidden_layer(input_, n_outputs=300, name='layer1')
        layer2 = hidden_layer(layer1, n_outputs=100, name='layer2')
        output = hidden_layer(layer2, n_outputs=1, name='output')
        return output

def op_max_Qhat(inputs):
    Qhats = tf.map_fn(op_Qhat, inputs)
    return tf.reduce_max(Qhats)

def op_train(**kwargs):
    tvars = tf.trainable_variables()
    return tf.group([apply_delta(tvar, **kwargs) for tvar in tvars])

def apply_delta(tvar, reward, max_Qhat, prev_Qhat, learning_rate, discount_rate):
    with tf.variable_scope('nn/output'):
        reward_var = tf.get_variable('output')

    actual = reward + discount_rate * max_Qhat
    expected = prev_Qhat
    grads == tf.gradients([reward_var], [tvar])
    delta = learning_rate * (actual - expected) * grads
    return tvar.add_assign(delta)

def main():
    Qhat_input = tf.placeholder(dtype=tf.float64,
                                name='Qhat_input') # TODO: Shape

    max_Qhat_inputs = tf.placeholder(dtype=tf.float64,
                                     name='max_Qhat_inputs') # TODO: Shape

    train_reward = tf.placeholder(dtype=tf.float64,
                                  name='train_reward') # TODO: Shape
    train_max_Qhat = tf.placeholder(dtype=tf.float64,
                                    name='train_max_Qhat') # TODO: Shape
    train_prev_Qhat = tf.placeholder(dtype=tf.float64,
                                     name='train_prev_Qhat') # TODO: Shape
    train_learning_rate = tf.placeholder(dtype=tf.float64,
                                         name='train_learning_rate') # TODO: Shape
    train_discount_rate = tf.placeholder(dtype=tf.float64,
                                         name='train_discount_rate') # TODO: Shape

    Qhat = op_Qhat(Qhat_input)
    max_Qhat = op_max_Qhat(max_Qhat_inputs)
    train = op_train(reward=train_reward,
                     max_Qhat=train_max_Qhat,
                     prev_Qhat=train_prev_Qhat,
                     learning_rate=train_learning_rate,
                     discount_rate=train_discount_rate)

if __name__ == '__main__':
    main()
