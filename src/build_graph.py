#!/usr/bin/env python3

import numpy as np
import os
import tensorflow as tf

script_dir = os.path.dirname(os.path.realpath(__file__))
graphs_dir = os.path.join(script_dir, '..', 'graphs')

def init_weights(n_inputs, n_outputs, name):
    stddev = 2 / np.sqrt(n_inputs)
    init = tf.truncated_normal((n_inputs, n_outputs), stddev=stddev)
    return tf.get_variable(name, initializer=init)

def init_biases(n_outputs, name):
    return tf.get_variable(name, initializer=tf.zeros([n_outputs]))

def hidden_layer(input_, n_outputs, name):
    with tf.variable_scope(name):
        n_inputs = int(input_.shape[1])
        weights = init_weights(n_inputs, n_outputs, name='weights')
        biases = init_biases(n_outputs, name='biases')
        output = tf.add(tf.matmul(input_, weights), biases, name='output')
        return output

def op_Qhat(input_):
    with tf.variable_scope('nn', reuse=tf.AUTO_REUSE):
        layer1 = hidden_layer(input_, n_outputs=300, name='layer1')
        layer2 = hidden_layer(layer1, n_outputs=100, name='layer2')
        output = hidden_layer(layer2, n_outputs=1, name='output')
        return output

def op_max_Qhat(inputs):
    Qhats = tf.map_fn(op_Qhat, inputs)
    return tf.reduce_max(Qhats)

def op_train(**kwargs):
    graph = tf.get_default_graph()
    tvars = tf.trainable_variables()
    # TODO: Use VarScope here?
    # TODO: Should the output index be 0 or some other number?
    reward_var = graph.get_tensor_by_name('nn/output/output:0')

    grads = tf.gradients(reward_var, tvars)
    assign_ops = [apply_delta(tvar, grad, **kwargs) for tvar, grad in zip(tvars, grads)]
    return tf.group(assign_ops)

def apply_delta(tvar, grad, reward, max_Qhat, prev_Qhat, learning_rate, discount_rate):
    TD_target = reward + (discount_rate * max_Qhat)
    delta = learning_rate * (TD_target - prev_Qhat) * grad
    return tf.assign_add(tvar, delta)

def main():
    with tf.Graph().as_default() as graph:
        Qhat_input = tf.placeholder(dtype=tf.float32,
                                    name='Qhat_input',
                                    shape=[1, 4000]) # TODO: Shape

        max_Qhat_inputs = tf.placeholder(dtype=tf.float32,
                                        name='max_Qhat_inputs',
                                        shape=[None, 1, 4000]) # TODO: Shape

        # NOTE: shape=[] means it's a scalar
        train_reward = tf.placeholder(dtype=tf.float32,
                                    name='train_reward',
                                    shape=[])
        train_max_Qhat = tf.placeholder(dtype=tf.float32,
                                        name='train_max_Qhat',
                                        shape=[])
        train_prev_Qhat = tf.placeholder(dtype=tf.float32,
                                        name='train_prev_Qhat',
                                        shape=[])
        train_learning_rate = tf.placeholder(dtype=tf.float32,
                                            name='train_learning_rate',
                                            shape=[])
        train_discount_rate = tf.placeholder(dtype=tf.float32,
                                            name='train_discount_rate',
                                            shape=[])

        Qhat = op_Qhat(Qhat_input)
        max_Qhat = op_max_Qhat(max_Qhat_inputs)
        train = op_train(reward=train_reward,
                        max_Qhat=train_max_Qhat,
                        prev_Qhat=train_prev_Qhat,
                        learning_rate=train_learning_rate,
                        discount_rate=train_discount_rate)

        os.makedirs(graphs_dir, exist_ok=True)
        tf.train.write_graph(graph, graphs_dir, 'graph.proto', as_text=False)

if __name__ == '__main__':
    main()
