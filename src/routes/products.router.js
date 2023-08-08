import { Router } from "express";
import ProductModel from "../dao/models/products.model.js"

const router = Router()

router.get("/db", async (req, res) => {
    try {
        const result = await ProductModel.find();
        res.send({ message: result.length ? "Lista de usuario" : "No hay usuario", data: result })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }
})

router.get("/db/:pid", async (req, res) => {
    const { pid } = req.params

    try {
        const exist = await ProductModel.findOne({ "code": pid })
        if (exist === null) {
            return res.status(404).json({ message: "Not Found" });
        }
        const result = await ProductModel.findOne({ "code": pid });
        res.json({ message: "success", data: result })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }

})

router.post("/db/", async (req, res) => {
    const { id, title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(401).json({ message: "Faltan datos" });
    }
    if (!thumbnails) {
        req.body.thumbnail = "";
    }
    if (status === undefined) {
        req.body.status = true
    }
    if (id) {
        return res.status(401).json({ message: "No incluir ID" });
    }

    const repetedCode = await ProductModel.findOne({ "code": req.body.code })

    if (repetedCode) {
        return res.status(404).json({ message: `Ya existe el producto con el CODE: ${req.body.code}` });
    }

    try {

        const product = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
        const result = await ProductModel.create(product)
        res.json({ message: "OK", data: result })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }
})

router.delete("/db/:pid", async (req, res) => {
    const { pid } = req.params

    try {
        const exist = await ProductModel.findOne({ "code": pid })
        console.log(exist);

        if (exist === null) {
            return res.status(404).json({ message: "Not Found" });
        }
        const result = await ProductModel.findOneAndDelete({ "code": pid })
        res.json({ message: "success", data: result })
    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }
})

router.put("/db/:pid", async (req, res) => {
    const { pid } = req.params

    if (req.body.code) {
        req.body.code = req.body.code.toString()
    }
    try {
        const exist = await ProductModel.findOne({ "code": pid })
        if (!exist) {
            return res.status(404).json({ message: "Not Found" });
        }

        const repetedCode = await ProductModel.findOne({ "code": req.body.code })

        if (repetedCode) {
            return res.status(404).json({ message: `Ya existe el producto con el CODE: ${req.body.code}` });
        }

        await ProductModel.findOneAndUpdate({ "code": pid }, req.body)
        res.json({ status: 200, mensaje: "PRODUCTO ACTUALIZADO CORRECTAMENTE", data: req.body })


    }
    catch (error) {
        res.status(500).json({
            message: "error",
            error: error
        })
    }
})

export default router