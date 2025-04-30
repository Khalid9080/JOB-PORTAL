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

    const db = client.db('solo-db')
    const jobsCollection = db.collection('jobs')
    const bidsCollection = db.collection('bids')



    // data Add  database <- client  
    app.post('/add-job', async (req, res) => {
      const jobData = req.body
      const result = await jobsCollection.insertOne(jobData)
      res.send(result)
    })

    // get all (fetch) from database -> client 
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray()
      res.send(result)
    })

    // get single job (fetch) from database -> client
    app.get('/jobs/:email', async (req, res) => {
      const email = req.params.email
      const query = {
        'buyer.email': email
      }
      const result = await jobsCollection.find(query).toArray()
      res.send(result)
    })

    // delete job (delete) from database <- client
    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await jobsCollection.deleteOne(query)
      res.send(result)
    })



    // id onujai single data form a get korte database -> client
    app.get('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await jobsCollection.findOne(query)
      res.send(result)

    })


    // Update Add  database <- client  
    app.put('/update-job/:id', async (req, res) => {
      const id = req.params.id
      const jobData = req.body

      const updated = { $set: jobData }
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }

      const result = await jobsCollection.updateOne(query, updated, options)
      res.send(result)
    })


    // Add bid data database <- client  
    app.post('/add-bid', async (req, res) => {

      // cheak if this user is already used
      const bidData = req.body;
      const query = { email: bidData.email, jobId: bidData.jobId }; // ✅ Now it's safe

      const alreadyExist = await bidsCollection.findOne( query )
      if (alreadyExist) {
        return res.status(400).send('You Have Already Bid This Job!')
      }
      console.log("Already Exist Value : ", alreadyExist);

      // database a bids gulo save korbo

      const result = await bidsCollection.insertOne(bidData)

      //Increase bid count in jobs collection
      const filter = { _id: new ObjectId(bidData.jobId) }
      const update = { $inc: { bid_count: 1 }, }
      const updateBidCount = await jobsCollection.updateOne(filter, update)
      console.log("Update Bid Count : ", updateBidCount);
      res.send(result)

    })


    // Get Bidsdata (fetch) from Database -> Client
    app.get('/my-bids/:email', async(req,res)=>{
      const email = req.params.email
      const query={email}
      const result = await bidsCollection.find(query).toArray()
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


