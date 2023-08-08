
//chat
const socket = io()
const chatBox = document.getElementById("chat-box");
const userTitle = document.getElementById("user-title")
const btnAvatar = document.getElementById("btn-avatar")
const inputImage = document.getElementById("input-image")
const btnSend = document.getElementById("btn-send")
const btnHistorial = document.getElementById("btn-historial")
const chat = document.getElementById("chat")

//ALERT PARA REGISTRAR USUARIO -- NICKNAME OPCIONAL
Swal.fire({
    title: 'Bienvenido',
    input: 'email',
    text: "Ingrese un correo",
    confirmButtonText: 'OK',
    allowOutsideClick: false,

}).then((result) => {

    user = result.value;

    if (result.isConfirmed) {
        Swal.fire({
            title: 'Ingrese un NickName',
            input: 'text',
            confirmButtonText: 'OK',
        }).then((result) => {
            nick = result.value
            socket.emit("new-user", { user, id: socket.id, nick })
        })
    }

})

//EVENTO PARA REGISTRAR EL MENSAJE (AL DARLE ENTER ) Y EL USUARIO QUE LO ENVIO

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user,
                nick,
                message: chatBox.value,
            })
            chatBox.value = ""
        }
    }

})

//EVENTO PARA ENVIAR EL MENSAJE MEDIANTE EL BOTON

btnSend.addEventListener("click", () => {
    socket.emit("message", {
        user: user,
        message: chatBox.value,
    })
    chatBox.value = ""
})

//REGISTRAR NOMBRE DE USUARIO PARA EL TITULO

socket.on("user-dom", (data) => {
    userTitle.innerHTML = `${data.user}`
})

//REGISTRAR MENSAJES ALMACENADOS EN LA DB

socket.on("message_logs", (data) => {
    let message = ""
    let name = ""
    let classChat = ""
    let classAvatar = ""

    data.forEach((e) => {
        let hora = new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        if (e.nick === "") {
            name = e.user
        } else {
            name = e.nick
        }

        if (e.user === user) {
            classChat = "user-message"
            classAvatar = "user-avatar"
        } else {
            classChat = "contact-message"
            classAvatar = "contact-avatar"
        }
        message = message +
            `
            <div class="message ${classChat}">
                <div class="${classAvatar}"></div>
                <div class="message-content">
                    <div class="message-user">${name} </div>
                    <p class="message-text">${e.message}</p>
                    <div class="message-time">${hora}</div>
                </div>
            </div>
            `;

    })
    chat.innerHTML = message
    scrollToBottom();
})

//EVENTO PARA ELIMINAR EL HISTORIAL DE LOS MENSAJES EN LA DB

btnHistorial.addEventListener("click", () => {
    socket.emit("delete-historial")
    chat.innerHTML = ""
})

function scrollToBottom() {
    const chatContainer = document.getElementById('chat');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

