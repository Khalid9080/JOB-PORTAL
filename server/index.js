const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb') // ✅ Fixed!
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fqi16.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // new

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    
      const db=client.db('solo-db')
      const jobsCollection=db.collection('jobs')

      // data Add  database <- client  
      app.post('/add-job',async (req, res) => {
        const jobData=req.body
        const result= await jobsCollection.insertOne(jobData)
        res.send(result)
      })
      
      // get all (fetch) from database -> client 
      app.get('/jobs', async (req, res) => {
        const result = await jobsCollection.find().toArray()
        res.send(result)
      })

      // get single job (fetch) from database -> client
      app.get('/jobs/:email', async (req, res) => {
        const email= req.params.email 
        const query={
          'buyer.email': email
        }
        const result = await jobsCollection.find(query).toArray()
        res.send(result)
      })

      // delete job (delete) from database <- client
      app.delete('/job/:id', async (req, res) => {
        const id=req.params.id
        const query={
          _id:new ObjectId(id)
        }
        const result= await jobsCollection.deleteOne(query)
        res.send(result)
      })



      // id onujai single data form a get korte database -> client
      app.get('/job/:id', async (req, res) => {
        const id=req.params.id
        const query={
          _id:new ObjectId(id)
        }
        const result= await jobsCollection.findOne(query)
        res.send(result)
      })





    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))


//--------------

//New_JobPortal
//q9wY8p6JPw5xvyZ0

// const { MongoClient, ServerApiVersion } = require('mongodb');
// //const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fqi16.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
