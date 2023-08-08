import { Router } from "express";
import CartsModel from "../dao/models/carts.model.js"
import ProductModel from "../dao/models/products.model.js";

const router = Router()

router.post("/", async (req, res) => {

    try {
        const cart = new CartsModel()
        cart.save()

        res.json({ status: 200, mensaje: `CARRITO CREADO ID: ${cart._id}`, data: cart })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }
})

router.get("/", async (req, res) => {
    try {
        let carrito = await CartsModel.find()

        res.json({ status: 200, mensaje: `TODOS LOS CARRITOS`, data: carrito })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }

})

router.get("/:cid", async (req, res) => {
    const { cid } = req.params

    try {
        const carrito = await CartsModel.findById(cid)

        res.json({ status: 200, mensaje: `CARRITO N° ${cid}`, data: carrito.products })
    }

    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }

})

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params

    try {
        let carrito = await CartsModel.findById(cid)
        let producto = await ProductModel.findById(pid)

        if (carrito === null) {
            res.json({ status: 404, mensaje: "Not Found" })
            process.exit()
        }
        if (producto === null) {
            res.json({ status: 404, mensaje: `No existe el producto con el ID: ${pid}` })
            process.exit()
        }

        const verificarCantidad = carrito.products.some(e => e._id.equals(producto._id))
        const productIndex = carrito.products.findIndex(e => e._id.equals(producto._id))

        if (verificarCantidad) {

            const newQuantity = carrito.products[productIndex].quantity + 1
            const total = producto.price * newQuantity

            await CartsModel.findById(cid).updateOne({ "products._id": producto._id }, {
                "$set": { "products.$.quantity": newQuantity, "products.$.total": total }
            })

            const actualizado = await CartsModel.findById(cid)

            res.json({ status: 200, mensaje: `Carrito actualizado`, data: actualizado })

        } else {

            await CartsModel.updateOne({ _id: cid }, {
                "$push": {
                    products: { _id: producto._id, "name": producto.title, "quantity": 1, "total": producto.price }
                }
            })

            const actualizado = await CartsModel.findById(cid)

            res.json({ status: 200, mensaje: `Producto ID: ${pid} agregado al carrito n° ${cid}`, data: actualizado })

        }


    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })

    }
})

export default router