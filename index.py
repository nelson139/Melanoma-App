# imports for the  flask server
from flask import Flask, jsonify, request
from flask_cors import CORS

# imports for the machine learning model
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import logging
logging.getLogger("tensorflow").setLevel(logging.ERROR)
tf.autograph.set_verbosity(0)

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['POST'])
def dataRecieved():
    # importing the data from the inputs on the client side
    data = request.get_json()
    data_array = np.fromstring(data["text"], dtype=np.int32, sep=',') # splits everything in the data string by comma and puts it in a numpy array.
    amount = data["amount"] # number of data entries
    empty = data["empty"] # shows which inputs were empty

    # declaring features and targets
    data = pd.read_csv("Cancer_Data.csv")
    features = ["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean"]
    
    # removes the features in the features list that correspond with any inputs that were left empty by the user
    if '1' in empty:
        features.remove("radius_mean")
    if '2' in empty:
        features.remove('texture_mean')
    if '3' in empty:
        features.remove("perimeter_mean")
    if '4' in empty:
        features.remove("area_mean")
    if '5' in empty:
        features.remove("smoothness_mean")
    
    X = data[features][0:70].to_numpy()
    y = data.diagnosis[0:70].to_numpy().reshape(-1, 1)

    # turning the M and B from the training set into 1 and 0 so the model could work
    for i in range(len(y)):
        if y[i] == "B":
                y[i] = 0
        else:
            y[i] = 1

    # normalizing the features so that they're centered around zero
    norm_l = tf.keras.layers.Normalization(axis=-1)
    norm_l.adapt(X)  # learns mean, variance
    Xn = norm_l(X)

    # duplicating the array of features so that there are more training examples
    Xt = np.tile(Xn, (1000, 1)) # tile() makes duplicates of the numpy array inputted. In this case, 1000 duplicates.
    yt = np.tile(y, (1000, 1)).astype('float32') # datatype must be float32 instead of object. Xt is already float32

    # Establishing neruon layout
    tf.random.set_seed(1234)  # applied to achieve consistent results
    model = Sequential(
        [
            tf.keras.Input(shape=(amount,)),
            Dense(3, activation='sigmoid', name='layer1'),
            Dense(1, activation='sigmoid', name='layer2')
        ]
    )

    # taking a look at the randomly generated weights and biases
    W1, b1 = model.get_layer("layer1").get_weights()
    W2, b2 = model.get_layer("layer2").get_weights()

    # converting arrays to tensors so the model could work
    tf.convert_to_tensor(Xt)
    tf.convert_to_tensor(yt)

    # training (fitting) the model
    model.compile( # loss function and compile optimizer
        loss = tf.keras.losses.BinaryCrossentropy(),
        optimizer = tf.keras.optimizers.Adam(learning_rate=0.01),
    )
    model.fit( # runs gradient descent and fits weights to the data
        Xt,yt,
        epochs=10,
    )

    # getting the weights and biases after the model has been trained
    W1, b1 = model.get_layer("layer1").get_weights()
    W2, b2 = model.get_layer("layer2").get_weights()

    # testing the model with an example
    X_test = np.array([data_array])
    X_testn = norm_l(X_test) # must normalize testing data since the features were normalized earlier
    prediction = model.predict(X_testn)

    # output
    yhat = (prediction >= 0.5).astype(int)
    if yhat == 1:
        final_pred = 'cancerous'
    else:
        final_pred = 'not cancerous'

    return jsonify(final_pred)    
        
if __name__ == '__main__':
    app.run(port=8080)