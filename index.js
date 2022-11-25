const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c3txqlb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    const categoriesCollection = client.db('XtockyCycle').collection('categories')
    const allProductsCollection = client.db('XtockyCycle').collection('AllProducts')

    try {
        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).limit(3).toArray()
            res.send(result)
        })

        app.get('/allcategories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/allcategories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) }
            const result = await categoriesCollection.findOne(query)
            res.send(result)
        })

        // products
        app.get('/allproducts', async (req, res) => {
            const query = {}
            const result = await allProductsCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/allproducts/category', async (req, res) => {
            let products = {};
            if (req.query.categoryId) {
                products = {
                    categoryId: req.query.categoryId
                }
            }
            const cursor = allProductsCollection.find(products).sort({ time: -1 });
            const result = await cursor.toArray()
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('Xtocky Cycle is running')
})

app.listen(port, () => {
    console.log(`app is running at ${port}`)
})
