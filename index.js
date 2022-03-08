const { MongoClient } = require('mongodb');
const express = require('express')
const ObjectId = require('mongodb').ObjectId;
const app = express();

const port = 5000;

var cors = require('cors')
app.use(cors())
app.use(express.json())

//Setup Syestem

const uri = "mongodb+srv://my-first-curd:H5SZtqCOHE33S1qS@cluster0.vrvfx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run(){
    try{
        await client.connect();
        const database = client.db("second");
        const bookingCollection = database.collection("booking");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection('users');
        
        //Get API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
         //Get Single Book
         app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;

            const query = {_id: ObjectId(id)};
            const service = await productsCollection.findOne(query);
            res.json(service);
        })
        //POST API
        app.post('/products', async(req,res) => {
            const service = req.body;
            console.log('Submitted Api', service)

            const result= await productsCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
         //DELET API
         app.delete('/products/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('DELET A SINGLE Service');

            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })
        //Confirm Order
        app.post('/confirmOrder', async(req,res) => {
            const booking = req.body;
            console.log('Submitted Order', booking)

            const result= await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        });
        app.get("/myOrders/:email", async (req, res) => {
            const result = await bookingCollection.find({ email: req.params.email })
              .toArray();
            res.send(result);
          });
        // delete order
        app.delete('/booking/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('DELET A SINGLE Product');
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });
        
        
    }
    finally{
       //await client.close();
    }
}    
run ().catch(console.dir)


app.get('/', (req, res)=>{
    res.send("Connect The Server");
})

app.listen(port, ()=>{
    console.log("listening Port", port);
})