import express from "express";
import * as dotenv from "dotenv"
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js";
import socket from "./socket.js";
import viewsRouter from "./routes/views.router.js"
import cartsRouter from "./routes/carts.router.js"

// DOTENV CONFIG

dotenv.config()

const app = express()
const port = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

// DB CONECTION

mongoose.connect(MONGO_URI).then(() => console.log(`DB IS CONNECTED`)).catch((err) => {
    if (err) {
        console.log(err);
        process.exit()
    }
})

//SERVER CONFIG

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use("/api/carts", cartsRouter)
app.use("/api/products", productsRouter)
app.use("/", viewsRouter)


// HANDLEBARS CONFIG

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


//SOCKET IO

const httpServer = app.listen(port, () => {
    console.log(`Servirdo corriendo en PUERTO: ${port}`);
})

const io = new Server(httpServer)
socket(io)
