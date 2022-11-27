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
    const usersCollection = client.db('XtockyCycle').collection('users')
    const bookingsCollection = client.db('XtockyCycle').collection('bookings')

    try {

        // categories
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

        app.post('/allproducts', async (req, res) => {
            const product = req.body;
            const result = await allProductsCollection.insertOne(product)
            res.send(result)
        })

        app.get('/myproduct', async (req, res) => {
            let quary = {};
            if (req.query.email) {
                quary = {
                    email: req.query.email
                }
            }
            const result = await allProductsCollection.find(quary).toArray();
            res.send(result);
        })

        app.delete('/myproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await allProductsCollection.deleteOne(query);
            res.send(result)
        })


        // users
        app.post('/users', async (req, res) => {
            const query = req.body;
            const result = await usersCollection.insertOne(query)
            res.send(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.get('/allsellers', async (req, res) => {
            let quary = {};
            if (req.query.role === 'Seller') {
                quary = {
                    role: req.query.role
                }
            }
            const result = await usersCollection.find(quary).toArray();
            res.send(result);
        })



        app.delete('/allsellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })


        app.get('/allbuyers', async (req, res) => {
            let quary = {};
            if (req.query.role === 'Buyer') {
                quary = {
                    role: req.query.role
                }
            }
            const result = await usersCollection.find(quary).toArray();
            res.send(result);
        })

        app.delete('/allbuyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })


        app.put('/verifyuser/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectID(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    isVerifyed: status
                }
            }
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result)

        })

        // booking

        app.post('/bookings', async (req, res) => {
            const query = req.body;
            const result = await bookingsCollection.insertOne(query);
            res.send(result);
        })


        app.get('/mybookings', async (req, res) => {
            let quary = {};
            if (req.query.email) {
                quary = {
                    email: req.query.email
                }
            }
            const result = await bookingsCollection.find(quary).toArray();
            res.send(result);
        })

        app.delete('/mybookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result)
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
