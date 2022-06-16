import re
from officialapi. models import quotation,quotation_customkattla_item,quotation_door_item,quotation_kattla_item,quotation_window_item,payments,other_products_item
from django.db.models import Sum

def validatecash(qoutationno):
    kattlaTotal = 0
    windowTotal = 0
    doorTotal   = 0
    customTotal = 0
    othersTotal = 0
    tax    = quotation.objects.get(id = qoutationno).tax
    kattla = quotation_kattla_item.objects.filter(quotation=qoutationno).aggregate(Sum('aggregate'))
    window = quotation_window_item.objects.filter(quotation=qoutationno).aggregate(Sum('aggregate')) 
    door   = quotation_door_item.objects.filter(quotation=qoutationno).aggregate(Sum('aggregate'))
    custom = quotation_customkattla_item.objects.filter(quotation=qoutationno).aggregate(Sum('aggregate'))
    others = other_products_item.objects.filter(quotation=qoutationno).aggregate(Sum('aggregate'))
    if kattla['aggregate__sum'] != None:
        kattlaTotal = kattla['aggregate__sum']
    
    if window['aggregate__sum'] != None:
        windowTotal = window['aggregate__sum']

    if door['aggregate__sum'] != None:
        doorTotal = door['aggregate__sum']

    if custom['aggregate__sum'] != None:
        customTotal = custom['aggregate__sum']
        
    if others['aggregate__sum'] != None:
        othersTotal = others['aggregate__sum']
    subtotal = kattlaTotal + windowTotal + doorTotal + customTotal + othersTotal
    taxAmt = 0
    total = 0
    if tax != None:
        taxAmt   = tax/100*subtotal
        total    = subtotal + taxAmt
    else:
        total    = subtotal
    return int(total)
    
def recievedCash(quotationno):
    recieved = 0
    recievedAmount = payments.objects.filter(quotation = quotationno).aggregate(Sum('amount'))
    if recievedAmount['amount__sum'] != None:
        recieved= recievedAmount['amount__sum']
    else:
        recieved = 0
    return int(recieved)
    

