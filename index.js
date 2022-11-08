const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//meadile wear

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.9yhpi6m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollaction = client.db('DeliveryService').collection('services')
const reviewCollaction = client.db('DeliveryService').collection('reviews')
const test = async (req, res) => {
    try {
        await client.connect()
        console.log('Database connect');



    } catch (error) {
        console.log(error.message)
    }

}
test()

//get all delivery data

app.get('/delivery', async (req, res) => {
    try {
        if (req?.headers?.pages == 3) {
            const result = await serviceCollaction.find({}).limit(3).toArray()

            res.send({
                success: true,
                message: 'successfuly Get Data',
                data: result
            })
        } else {
            const result = await serviceCollaction.find({}).toArray()

            res.send({
                success: true,
                message: 'successfuly Get Data',
                data: result
            })
        }

    } catch (error) {
        res.send({
            success: false,
            message: error.message,

        })
    }

})
app.get('/delivery/:id', async (req, res) => {
    const id =req.params.id
    try {
            const result = await serviceCollaction.findOne({_id : ObjectId(id)})

            res.send({
                success: true,
                message: 'successfuly Get Data',
                data: result
            })
    

    } catch (error) {
        res.send({
            success: false,
            message: error.message,

        })
    }

})




// input / add delivery service 

app.post('/delivery', async (req, res) => {
    const data = req.body


    try {
        const result = await serviceCollaction.insertOne(data)
        // console.log(result)

        if (result.insertedId) {
            res.send({
                success: true,
                message: 'Successfully Data Input'
            })
        }
        else {
            res.send({
                success: false,
                message: `Do not input Data`
            })
        }
        console.log(result);


    } catch (error) {
        res.send({
            success: false,
            message: error.message,

        })
    }
})



// Add customer reviews 

app.post('/reviews', async (req, res) => {
    const data = req.body
    // console.log(data)
    // const data = {email : 'sampodnath'}

    try {
        const result = await reviewCollaction.insertOne(data)

        if (result.insertedId) {
            res.send({
                success: true,
                message: 'Successfully Data Input'
            })
        }
        else {
            res.send({
                success: false,
                message: `Do not input Data`
            })
        }
        console.log(result);


    } catch (error) {
        res.send({
            success: false,
            message: error.message,

        })
    }
})

app.delete('/reviews/:id', async (req, res) => {
    const quaryid = req.params.id
    try {
        const result = await reviewCollaction.deleteOne({ _id: ObjectId(quaryid) })
        if (result.deletedCount === 1) {

            res.send({
                success: true,
                message: `Successfully delete ${quaryid}`
            })
        }
        else {
            res.send({
                success: false,
                message: `Do not delete this id ${quaryid}`
            })
        }

    } catch (error) {
        res.send({
            success: false,
            message: error.message,

        })
    }
})

app.get('/', (req, res) => {
    res.send('this is home service')
})

app.listen(port, () => {
    console.log('this server in run 5000');
})

