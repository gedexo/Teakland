from telnetlib import PRAGMA_HEARTBEAT
from this import d
import math

class kattlaunitprice:
    def __init__(self, **kwargs ):
        self.height = kwargs['height'] 
        self.width = kwargs['width']
        self.thicknes_x = kwargs['thicknes_x']
        self.thicknes_y = kwargs['thicknes_y']
        self.type = kwargs['type']
        self.rawmaterial = kwargs['raw_material']
        self.labourcharge = kwargs['labourcharge']
        self.kattlaprice = kwargs['kattlaprice']
        self.factoryprice = kwargs['factory_price']
        self.doortype = kwargs['doortype']
        self.noofboxes = kwargs['nofoboxes']

    def unitprice(self):
        height_in_ft =self.height/30
        height_int = int(height_in_ft)
        ronded_faction=height_in_ft-height_int
        if ronded_faction>0:
            if ronded_faction<0.25:
                height_int+=0.25
            elif ronded_faction<0.50:
                height_int+=0.50
            elif ronded_faction<0.75:
                height_int+=0.75
            else:
                height_int+=1
                
        width_in_ft =self.width/30
        width_int = int(width_in_ft)
        ronded_faction=width_in_ft-width_int
        if ronded_faction>0:
            if ronded_faction<0.25:
                width_int+=0.25
            elif ronded_faction<0.50:
                width_int+=0.50
            elif ronded_faction<0.75:
                width_int+=0.75
            else:
                width_int+=1
        a = (float(height_int) * (self.noofboxes+1))
        b = (float(width_int) * 2) 
        extra = 1
        if self.doortype == False:
            b = width_int
            extra = 0.5
        c = float(a) + float(b) + extra
        thk = float(self.thicknes_x) * float(self.thicknes_y)
        x = c * thk / 144
        frac= math.modf(round(x, 2))
        y = 0
        if frac[0] < 0.25 and frac[0] > 0.01:
            y = 0.25 - frac[0]
        if frac[0] < 0.50 and frac[0] > 0.25:
            y = 0.50 - frac[0]
        if frac[0] < 0.75 and frac[0] > 0.50:
            y = 0.75 - frac[0]
        if frac[0] < 0.99 and frac[0] > 0.75:
            y = (0.99 - frac[0]) +0.01
        qubic = x + y
        labourcharge = (self.noofboxes) * self.labourcharge 
        unitAmount = (round(qubic, 2) * float(self.kattlaprice)+int(labourcharge))
        factoryunitAmount = (round(qubic, 2) * float(self.factoryprice))
        return (round(qubic ,2),round(unitAmount, 1),round(factoryunitAmount, 1))
    
class windowunitprice:
    def __init__(self, **kwargs ):
        self.height = kwargs['height'] 
        self.width = kwargs['width']
        self.box = kwargs['box']
        self.rawmaterial = kwargs['raw_material']
        self.windowprice = kwargs['windowprice']
        self.factoryprice = kwargs['factory_price']
        self.shutter = kwargs['shutter']
        self.labourcharge = kwargs['labourcharge']

    def unitprice(self):
        a = (float(self.height) * float(self.width)) / 144
        b = round(a, 2) * float(self.windowprice)
        unitAmount = float(b)+ int(self.labourcharge)
        factoryunitAmount = round(a, 2) * float(self.factoryprice)
        return (round(a ,2),round(unitAmount, 1),round(factoryunitAmount, 1))
    
class doorunitprice:
    def __init__(self, **kwargs ):
        self.height = kwargs['height'] 
        self.width = kwargs['width']
        self.doortype = kwargs['doortype']
        self.rawmaterial = kwargs['raw_material']
        self.doorprice = kwargs['doorprice']
        self.labourcharge = kwargs['labourcharge']
        self.factoryprice = kwargs['factory_price']

    def unitprice(self):
        a = (float(self.height) * float(self.width)) / 144
        b = round(a, 2) * float(self.doorprice)
        unitAmount = float(b)+ int(self.labourcharge)
        factoryunitAmount = round(a, 2) * float(self.factoryprice)
        return (round(a ,2),round(unitAmount, 1),round(factoryunitAmount,1))
    
class customkattlarunitprice:
    def __init__(self, **kwargs ):
        self.length = kwargs['length']
        self.thicknes_x = kwargs['thicknes_x']
        self.thicknes_y = kwargs['thicknes_y']
        self.kattlaprice = kwargs['kattlaprice']
        self.factoryprice = kwargs['factory_price']
        self.labourcharge = kwargs['labourcharge']

    def unitprice(self):
        length_in_ft =self.length/30
        length_int = int(length_in_ft)
        ronded_faction=length_in_ft-length_int
        labourCharge = 0
        if self.labourcharge != None or self.labourcharge != 0:
            labourCharge = self.labourcharge
        if ronded_faction>0:
            if ronded_faction<0.25:
                length_int+=0.25
            elif ronded_faction<0.50:
                length_int+=0.50
            elif ronded_faction<0.75:
                length_int+=0.75
            else:
                length_int+=1
            
        a = (float(self.thicknes_x) * float(self.thicknes_y)) * self.length / 144
        frac= math.modf(round(a, 2))
        y = 0
        if frac[0] < 0.25 and frac[0] > 0.01:
            y = 0.25 - frac[0]
        if frac[0] < 0.50 and frac[0] > 0.25:
            y = 0.50 - frac[0]
        if frac[0] < 0.75 and frac[0] > 0.50:
            y = 0.75 - frac[0]
        if frac[0] < 0.99 and frac[0] > 0.75:
            y = (0.99 - frac[0]) +0.01
        qubic = a + y
        b = round(qubic, 2) * float(self.kattlaprice)
        unitAmount = float(b)+ int(labourCharge)
        factoryUnitAmount = round(qubic, 2) * float(self.factoryprice)
        return (round(qubic ,2),round(unitAmount, 1),round(factoryUnitAmount, 1))