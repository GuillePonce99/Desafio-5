import { Router } from "express";
import ProductModel from "../dao/models/products.model.js";


const router = Router()

router.get("/home", async (req, res) => {
    const productos = await ProductModel.find().lean()
    res.render("home", { productos, style: "styles.css", title: "PRODUCTOS" })
})

router.get("/realtimeproducts", async (req, res) => {
    const productos = await ProductModel.find().lean()
    res.render("realTimeProducts", { productos, style: "styles.css", title: "PRODUCTOS-REAL-TIME-DB" })
})

router.get("/chat", async (req, res) => {
    res.render("chat", { style: "chat.css", title: "CHAT" })
})

export default router