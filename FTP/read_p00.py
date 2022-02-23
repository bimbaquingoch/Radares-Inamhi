# -*- coding: utf-8 -*-
"""
Created on Tue Dec 21 16:17:33 2021

@author: Kevin Changoluisa
         Bryan Imbaquingo
"""


import numpy as np
import cv2
from pathlib import Path




class GetDataFileP00:
    
    def __init__(self,path,filename):
        self.path=path
        self.filename=filename


    
    def getValuefromBinaries(self):
        
        # Numero de pixeles contenidos por fila
        bins = 240 
        data = Path(str(self.path)+'\\'+self.filename).read_bytes()
        dateFile=(data[17:29].decode("utf-8")).strip()
        dateFile=''+dateFile[6:8]+'/'+dateFile[4:6]+'/'+dateFile[0:4]+' '+dateFile[8:10]+':'+dateFile[10:14]
        vect_Data=np.zeros((1,(bins*bins)), dtype=np.uint8)
        
        for i in range(0,(bins*bins)):
            vect_Data[0][i]=data[i+99]


        ArrayP00=np.array(vect_Data).reshape(bins,bins)    
        arrayP00FilterMedian=cv2.medianBlur(ArrayP00,3)
        
        return arrayP00FilterMedian,dateFile



    
