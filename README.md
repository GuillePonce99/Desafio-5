# Desafio-5

En la carpeta Routes, tengo los diferentes router ( productos, carrito y vistas)
Los endpoints son los siguiente: 
productos - /api/products/db
carts - /api/carts
views - /home (vista de productos sin socket.io) /realtimeproducts (vista de productos con socket.io) /chat (vista del chat)

Aclaracion : dentro de carts si bien tengo metodos post y get con req.params dinamico, estos params si no corresponden a ningun id saldra error. No pude solucionarlo

La configuracion del socket de parte del servidor se encuentra en socket.js que se encuentra importado en app.js

