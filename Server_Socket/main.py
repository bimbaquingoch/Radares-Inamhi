# -*- coding: utf-8 -*-
"""
Created on Thu Dec 16 11:56:07 2021

@author: kchangoluisa
"""

import os
from pathlib import Path
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET')


socketio = SocketIO(app, manage_session=False,cors_allowed_origins="*")


CORS(app)



users = []
archivosP00=[]


  
@socketio.on('connect')
def on_connect():
    print('Client connected')
    users.append(request.sid)
    print("Total de usarios conectados: ", len(users))

    
@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnect')
    users.remove(request.sid)
    print("Total de usarios conectados: ", len(users))



@socketio.on('allData')
def getAllDataP00():
    print("Send all Data")
    socketio.emit('getAllDataP00',archivosP00,room=request.sid)
    



"""
Comunicacion cliente P00 servidor
"""
@socketio.on('obtenerP00')
def setListP00(data):
    """
    Obtenemos los datos P00 procesados.
    """
    print("Recibiendo")
    """
    Almacenamos los datos en un array
    asi almacenamos la informacion de todo el dia
    """
    archivosP00.append(data)
    socketio.emit('getDataP00',data)
    return "OK"
    


if __name__ == '__main__':
    print("Iniciando")
    app.run(debug=True)