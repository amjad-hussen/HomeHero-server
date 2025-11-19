const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;
console.log(process.env)

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wysv8m.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.get('/', (req, res) => {
    res.send('Hello World! this is server')
})


async function run() {
    try {
        await client.connect();

        const db = client.db('homehero_db');
        const servicesCollection = db.collection('services')
        const usersCollection = db.collection('users');
        const slideCollection = db.collection('slides')
        const featuresCollection = db.collection('features')
        const booksCollection = db.collection('book')



        // app.post('/allService', async (req, res) => {
        //     const data = req.body;
        //     console.log(data)
        //     const result = await servicesCollection.insertOne(data)
        //     res.send({
        //         success: true
        //     })
        // })

        app.patch('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updated = {
                $set: {
                    serviceName: updatedData.serviceName,
                    category: updatedData.category,
                    price: updatedData.price,
                    description: updatedData.description,
                }
            };

            const result = await servicesCollection.updateOne(filter, updated);
            res.send(result);
        });



        app.post('/book', async (req, res) => {
            const newBook = req.body;
            const query = {
                serviceId: newBook.serviceId,
                email: newBook.email
            }
            const exists = await booksCollection.findOne(query)
            if (exists) {
                return res.send({ exists: true });
            }
            const result = await booksCollection.insertOne(newBook)
            res.send(result)
        })

        app.delete('/allService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/slide', async (req, res) => {
            const cursor = slideCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find().limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })

        // app.get('/allService', async (req, res) => {
        //     const email = req.query.email
        //     const query = {}
        //     if (email) {
        //         query.email = email
        //     }

        //     const cursor = servicesCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })

        app.get('/book', async (req, res) => {
            const email = req.query.email
            const query = {}
            if (email) {
                query.email = email
            }

            const cursor = booksCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await booksCollection.deleteOne(query)
            res.send(result)
        })


        // app.get('/allService', async (req, res) => {
        //     const cursor = servicesCollection.find();
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })

        // app.get('/allService', async (req, res) => {
        //     const { minPrice, maxPrice } = req.query;

        //     let query = {};

        //     if (minPrice && maxPrice) {
        //         query.price = {
        //             $gte: parseInt(minPrice),
        //             $lte: parseInt(maxPrice)
        //         };
        //     }

        //     const result = await serviceCollection.find(query).toArray();
        //     res.send(result);
        // });

        app.get('/allService', async (req, res) => {
            const { email, minPrice, maxPrice } = req.query;

            let query = {};

            // Filter by email
            if (email) {
                query.email = email;
            }

            // Filter by price range
            if (minPrice && maxPrice) {
                query.price = {
                    $gte: parseInt(minPrice),
                    $lte: parseInt(maxPrice)
                };
            }

            const result = await servicesCollection.find(query).toArray();
            res.send(result);
        });


        app.get('/features', async (req, res) => {
            const cursor = featuresCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })

        app.patch('/services/:id/review', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $push: {
                    reviews: review
                }
            }
            const result = await servicesCollection.updateOne(query, update)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`HomeHero is listening on port ${port}`)
})
