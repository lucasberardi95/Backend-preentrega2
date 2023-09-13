import 'dotenv/config' //me permite usar variables de entorno
import express from "express"
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import mongoose from "mongoose"
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js"
import messageRouter from "./routes/messages.routes.js"
import { messagesSocketController } from "./controllers/sockets/messagesSocketController.js"
import { userModel } from "./models/users.models.js"
import cartModel from "./models/carts.models.js"
import { orderModel } from "./models/order.models.js"
import productModel from "./models/products.models.js"

const app = express()
const PORT = 4000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Conexion de Socket.io
io.on('connection', (socket) => {
    console.log('Socket.io connection')
    socket.on('message', (info) => messagesSocketController(io, info))
})

//MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('DB connected')
        /* const results = await productModel.paginate({ status: 'true' }, { page: 1, sort: {price:'desc'} })
        console.log(results) */
        //await cartModel.create({})
        /* const cart = await cartModel.findOne({_id: '650135653bba0ce0308d0bc2'})
        console.log(JSON.stringify(cart)) */
        /* await orderModel.create([
            {name:'Napotilana', size:'medium', price:'2000', quantity:'5'},
            {name:'4 quesos', size:'medium', price:'3000', quantity:'3'},
            {name:'Pepperoni', size:'large', price:'4000', quantity:'2'},
            {name:'Calabresa', size:'medium', price:'2500', quantity:'4'},
            {name:'Jamon y morron', size:'small', price:'1500', quantity:'6'},
            {name:'Especial', size:'medium', price:'4000', quantity:'2'},
            {name:'Napolitana', size:'large', price:'3000', quantity:'3'},
            {name:'4 quesos', size:'small', price:'2000', quantity:'4'},
            ]) */
        /* const results = await orderModel.aggregate([
        {
            $match: {size: 'medium'}
        },
        {
            $group: {_id: '$name', totalQuantity: {$sum: '$quantity'}, totalPrice: {$sum: '$price'}}
        },
        {
            $sort: {totalPrice: -1} //1 menor a mayor, -1 mayor a menor
        },
        {
            $group: {_id: 1, orders: {$push: "$$ROOT"}}//Estado actual de la agregacion
        },
        {
            $project: { //Genero nuevo proyecto con los datos previos
                '_id':0,
                orders: '$orders'
            }
        },
        {
            $merge: {
                into: 'reports' //Creo la nueva collection llamada 'reports', si ya existe guarda
            }
        }
    ])
    console.log(results) */
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)

app.get('/static', (req, res) => {
    res.render('chat', {
        rutaCSS: 'chat',
        rutaJS: 'chat',
    })
})

//HBS configuration
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))