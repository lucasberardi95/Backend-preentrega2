import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import mongoose from "mongoose"

const cartRouter = Router()

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find()
        res.status(200).send({ result: 'OK', message: carts })
    } catch (error) {
        res.status(400).send({ error: `Error displaying carts:  ${error}` })

    }
})

cartRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartModel.findById(id)
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        res.status(400).send({ error: `Id cart not found:  ${error}` })

    }
})

cartRouter.post('/', async (req, res) => {
    const response = await cartModel.create(req.body)
    try {
        res.status(200).send({ result: 'OK', message: response })
    } catch (error) {
        res.status(400).send({ error: `Cart already exist: ${error}` })
    }

})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { pid, quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            res.status(404).send({ error: `Cart not found: ${error}` })
            return
        }
        const productId = new mongoose.Types.ObjectId(pid)
        let productFound = false
        cart.products.forEach((product) => {
            if (product.id_prod.equals(productId)) {
                product.quantity += quantity
                productFound = true
            }
        })
        if (!productFound) {
            cart.products.push({ id_prod: pid, quantity })
        }
        await cart.save()
        res.status(200).send({ result: 'OK', cart })
    } catch (error) {
        res.status(200).send({ error: `Error updating cart: ${error}` })
    }
})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            cart.products.push({ id_prod: pid, quantity: quantity })
            const response = await cartModel.findByIdAndUpdate(cid, cart)
            res.status(200).send({ result: 'OK', message: response })
        }
    } catch (error) {
        res.status(400).send({ error: `Error adding product: ${error}` })
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const productIndex = cart.products.findIndex(prod => prod.id_prod.equals(new mongoose.Types.ObjectId(pid)))
            let deletedProduct
            if (productIndex !== -1) {
                deletedProduct = cart.products[productIndex]
                cart.products.splice(productIndex, 1)
            } else {
                res.status(404).send({ result: 'Id Product Not Found', message: cart })
            }
            await cart.save()
            res.status(200).send({ result: 'OK', message: deletedProduct })
        } else {
            res.status(404).send({ result: 'Cart Not Found', message: cart })
        }
    } catch (error) {
        res.status(400).send({ error: `Error deleting product: ${error}` })
    }
})

cartRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    const response = await cartModel.deleteOne({ _id: id })
    if (response)
        res.status(200).send({ result: 'OK ', message: response })
    else
        res.status(404).send({ error: `Id cart not found: ${error}` })
})

export default cartRouter