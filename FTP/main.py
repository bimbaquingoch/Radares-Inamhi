# -*- coding: utf-8 -*-
"""
Created on Tue Dec 21 16:17:33 2021

@author: Kevin Changoluisa
         Bryan Imbaquingo
"""

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
from read_p00 import GetDataFileP00
from ObtenerLatLngRefl import geoJson
import socketio


conexion = True
sio = socketio.Client(reconnection=True)


class MyEventHandler(FileSystemEventHandler):
    # Funcion que retorna el nombre y la direccion de un archivo con extension .p00 si es creado
    def on_created(self, event):
        if event.event_type == "created":
            ext = Path(event.src_path).suffix
            if ext == '.p00':
                filename = Path(event.src_path).name
                path = Path(event.src_path).parent.resolve()
                P00, date = GetDataFileP00(
                    path, filename).getValuefromBinaries()
                features = geoJson(P00)['data']
                dato = {'time': date, 'features': features}
                enviarP00(dato)


@sio.event
def disconnect():
    print("Desconexion por parte del servidor")
    print("Volviendo a conectar")
    while True:
        try:
            print("Queirnedo")
            sio.connect('wss://server-socketio-kevin.herokuapp.com/',
                        transports='websocket')
            print("Conectad")
        except Exception as e:
            print(e)
        else:
            sio.wait()


@sio.event
def enviarP00(data):
    print("===> Enviando información al servidor Web Socket")
    # Enviamos la información procesado al servidor
    sio.emit('obtenerP00', data)


def main():
    sio.connect('wss://server-socketio-kevin.herokuapp.com/')
    observer = Observer()
    """
    Al método schedule() le asignamos un manejador (MyEventHandler) para que responda a los eventos que ocurran
    en la carpeta actual ("."), considerando las subcarpetas (recursive=True).
    """
    observer.schedule(MyEventHandler(), ".", recursive=True)
    observer.start()
    try:
        print("\t===| Observando la creación de nuevos archivos P00 |===")
        # observer.is_alive() Retorna Verdadero si el observador se esta ejecutando
        while observer.is_alive():
            observer.join(1)
    except:
        print("\t===| Se detuvo la observacion |===")
        observer.stop()


if __name__ == '__main__':
    main()
