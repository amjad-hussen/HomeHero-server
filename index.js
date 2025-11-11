const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://simpleDBUsers:TIKd5RWK37CIxWsK@cluster0.4wysv8m.mongodb.net/?appName=Cluster0";

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


        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query)

            if (existingUser) {
                res.send({message: 'This user is already exist'})
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result)
            }

        })

        app.get('/slide', async(req, res) => {
            const cursor = slideCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/service', async(req, res) =>{
            const cursor = servicesCollection.find().limit(6)
            const result = await (await cursor.toArray())
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
