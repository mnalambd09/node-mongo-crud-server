const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello from server')
})

// app.get('/users', (req, res) => {
//     const user = [
//         {name: 'noor', email:'mnalambd09@gmail.com'},
//         {name: 'nooralam', email:'mnalad09@gmail.com'},
//         {name: 'noor anas', email:'mnalad09@gmail.com'},
//     ]
//     res.send(user)
// })




const uri = "mongodb+srv://mongodb2:wwOxU3nU30mfnWLt@cluster0.llpo4b5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('crudUser').collection('users');
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
            console.log(result)
        })

        // for update a user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result)

        })
    }
    finally {

    }
}
run().catch(err => console.log(err))

// app.post('/users', (req, res) => {
//     const user = req.body;
//     console.log(user)
//     res.send(user)
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})