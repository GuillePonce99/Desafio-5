import ProductModel from "./dao/models/products.model.js"
import MessagesModel from "./dao/models/messages.model.js"

export default (io) => {

    //inicializo conexion

    io.on("connection", async (socket) => {
        console.log("nueva conexion");

        // CHAT //

        const cargarMensajes = async () => {
            const mensajesDB = await MessagesModel.find()
            io.emit("message_logs", mensajesDB)
        }

        socket.on("new-user", (data) => {
            socket.user = data.user
            socket.id = data.id
            socket.nick = data.nick
            socket.emit("user-dom", { nick: socket.nick, user: socket.user })
            cargarMensajes()
        })

        socket.on("message", async (data) => {

            await MessagesModel.create(data)
            const messages = await MessagesModel.find()
            console.log(messages);
            io.emit("message_logs", messages)
        })

        socket.on("delete-historial", async () => {
            await MessagesModel.deleteMany()
            cargarMensajes()
        })


        // REAL TIME PRODUCTS IN DB

        const cargarProductos = async () => {
            const productosDB = await ProductModel.find()
            socket.emit("lista_productos_db", productosDB)
        }

        socket.on("agregar_producto_db", async (data) => {
            const { id, title, description, code, price, status, stock, category, thumbnails } = data;
            const statusProduct = { incomplete: false, repeated: false }

            if (!title || !description || !code || !price || !stock || !category) {
                statusProduct.incomplete = true
                socket.emit("action", statusProduct)
                return
            }

            if (!thumbnails) {
                data.thumbnail = "";
            }
            if (status === undefined) {
                data.status = true
            }

            const repetedCode = await ProductModel.findOne({ "code": data.code })

            if (repetedCode) {
                statusProduct.repeated = true
                socket.emit("action", statusProduct)
                return
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

                socket.emit("action", statusProduct)
                await ProductModel.create(product)
                cargarProductos()
            }
            catch (err) {
                console.log(err);
            }
        })

        socket.on("eliminar_producto_db", async (data) => {
            let notFound = false
            try {

                const exist = await ProductModel.findOne({ "code": data })

                if (exist === null) {
                    notFound = true
                    socket.emit("action_delete", { notFound })
                } else {
                    socket.emit("action_delete", { notFound })
                    await ProductModel.findOneAndDelete({ "code": data })
                    cargarProductos()
                }

            }
            catch (e) {
                console.log(e);
            }
        })
    })
}