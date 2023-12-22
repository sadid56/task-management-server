const express = require("express");
const cors = require("cors")
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//QNnXjISDBjP8ns6n
//task-management
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzbhwpo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db("task-management").collection('task')

    //task related
    app.post('/task', async(req, res)=>{
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })

    app.get('/task', async(req, res)=>{
      let query = {}
      if(req.query?.email){
        query = {email: req.query?.email}
      }
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/task/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await taskCollection.findOne(filter)
      res.send(result)
    })

    app.delete('/task/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

 app.patch('/task/:id', async(req, res)=>{
  const id = req.params.id;
  const task = req.body;
  const query = {_id: new ObjectId(id)}
  const updateTask = {
    $set: {
      title: task.title,
      description: task.description,
      deadlines: task.deadlines,
      priority: task.priority,
      status: task.status
    }
  }
  const result = await taskCollection.updateOne(query, updateTask)
  res.send(result)
 })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("task management server running");
});

app.listen(port, () => {
  console.log(`task management server running ${port}`);
});
