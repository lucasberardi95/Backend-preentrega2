import { Router } from "express"
import productModel from "../models/products.models.js"

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    let { limit, page, category, status, sort } = req.query

    limit = limit ? parseInt(limit) : 10
    page = page ? parseInt(page) : 1
    let sortOption
    sort === 'asc' && (sortOption = 'price')
    sort === 'desc' && (sortOption = '-price')
    try {
        const options = {
            limit: limit,
            page: page,
            sort: sortOption || null
        }
        const query = {
            ...(category ? { category } : {}),
            ...(status ? { status } : {}),
        }
        const prods = await productModel.paginate(query, options)
        res.status(200).send({ result: 'OK', message: prods })
    } catch (error) {
        res.status(400).send({ error: `Error displaying products:  ${error}` })
    }
})

productRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const prod = await productModel.findById(id)
        if (prod) {
            res.status(200).send({ result: 'OK', message: prod })
        } else {
            res.status(404).send({ result: 'Product id not found', message: prod })
        }
    } catch (error) {
        res.status(400).send({ error: `Error displaying product:  ${error}` })
    }
})

productRouter.post('/', async (req, res) => {
    const { title, description, stock, price, code, category } = req.body
    try {
        const response = await productModel.create({
            title, description, stock, price, code, category
        })
        res.status(200).send({ result: 'OK', message: response })
    } catch (error) {
        res.status(400).send({ error: `Error creating product:  ${error}` })
    }
})

productRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, stock, price, code, category, status } = req.body
    try {
        const response = await productModel.findByIdAndUpdate(id, { title, description, stock, price, code, category, status })
        if (response) {
            res.status(200).send({ result: 'OK', message: response })
        } else {
            res.status(404).send({ result: 'Product id not found', message: response })
        }
    } catch (error) {
        res.status(400).send({ error: `Error updating product:  ${error}` })
    }
})

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await productModel.deleteOne({ _id: id })
        if (response) {
            res.status(200).send({ result: 'OK', message: response })
        } else {
            res.status(404).send({ result: 'Product id not found', message: response })
        }
    } catch (error) {
        res.status(400).send({ error: `Error deleting product:  ${error}` })
    }
})

export default productRouter