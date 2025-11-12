const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const featuresCollection = db.collection('features')


        app.get('/users', async(req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.patch('/users/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body
            console.log('to Update' , id, updatedUser)
            const query = {_id: new ObjectId(id)}
            const update = {
                $set :{
                    name: updatedUser.name,
                    photo: updatedUser.photo

                }
            }
            const result = await usersCollection.updateOne(query,update)
            res.send(result)

        })

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

       app.post('/allService', async(req , res) => {
            const data = req.body;
            console.log(data)
            const result = await servicesCollection.insertOne(data)
            res.send({
                success:true
            })
        }) 

        app.post('/users', async(req , res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser) 
            res.send(result)
        })

        app.delete('/allService/:id', async(req, res) => {
            const id = req.params.id;
            const query =  {_id: new ObjectId(id)}
            const result = await servicesCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/slide', async(req, res) => {
            const cursor = slideCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/service', async(req, res) =>{
            const cursor = servicesCollection.find().limit(6)
            const result = await  cursor.toArray()
            res.send(result)
        })

        app.get('/allService', async(req, res) => {
            const email = req.query.email
            const query = {}
            if(email) {
                query.email = email
            }

            const cursor = servicesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/allService', async(req, res) =>{
            const cursor = servicesCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/features', async(req, res) => {
            const cursor = featuresCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        
        app.get('/service/:id' , async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await servicesCollection.findOne(query)
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
