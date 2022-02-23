# -*- coding: utf-8 -*-
"""
Created on Tue Dec 21 16:17:33 2021

@author: Kevin Changoluisa
         Bryan Imbaquingo
"""


import UTMtolt_lng as UTM


def geoJson(MatP00):
    
    vPixel=500                  #valor de cada pixel en metros
    origenRadarE=780811         #Punto de origen del radar en UTM
    origenRadarN=9974061.5      #Punto de origen del radar en UTM
    vradioMetros=60000          #Valor del radio de la onda del radar
    limite=10000000             #Limite zona sur 0-limite norte 
    hemNorte=True               
    zona=17                     #Zona Utm donde opera el radar
    
    PxOrigen=origenRadarE-(vradioMetros+vPixel)
    PyOrigen=origenRadarN+(vradioMetros+vPixel)-limite
    
    Lt_Lg_Valor={"data":[]}

    
    for i in range(MatP00.shape[0]):
        PxNewOrigen=PxOrigen
       
        if PyOrigen>0:
            PyOrigen=PyOrigen-vPixel
        elif PyOrigen<=0:
            hemNorte=False
            PyOrigen=limite
                  
        for j in range(MatP00.shape[1]): 
            if PxNewOrigen<833979:
                zona=17
            else:
                zona=18
            if MatP00[i][j] >0:
                lat,lng=UTM.utmToLatLng(zona, PxNewOrigen, PyOrigen,hemNorte)
                reflec=int(MatP00[i][j])
                Lt_Lg_Valor["data"].append(
                   {"mag":reflec,
                    "coordinates": [lat,lng]})
            PxNewOrigen=PxNewOrigen+vPixel
    return Lt_Lg_Valor
            
            
               
        
if __name__=="geoJson":
    geoJson()


