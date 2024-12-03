const express = require("express");
const cors = require("cors");
require('./db/config');
const mongoose = require('mongoose');
const Jwt = require('jsonwebtoken');

const User = require('./db/User');
const Product = require('./db/Product');

const jwtKey = 'e-commerce';
const app = express();
app.use(express.json());
app.use(cors());

//routes
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send(("something went wrong"));
        }
        res.send({ result, auth: token });
    })
});

app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send("something went wrong");
                }
                res.send({ user, auth: token });
            })
        } else {
            res.send({ result: 'No User Found' });
        }
    } else {
        res.send({ result: "No User Found" });
    }
});

app.post('/add-product', verifyToken, async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});

app.get('/products', verifyToken, async (req, res) => {
    const products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: 'No Products Found' });
    }
});

app.delete('/product/:id', verifyToken, async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
});

app.get("/product/:id",verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validate the ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid Product ID format" });
        }

        // Query the product by ID
        let result = await Product.findOne({ _id: id });
        
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ result: "No record found" });
        }
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).send({ error: "An error occurred while retrieving the product" });
    }
});

app.put('/product/:id', verifyToken, async (req, res) => {
    let result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
});

app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key, $options: "i" } },
            { company: { $regex: req.params.key, $options: "i" } },
            { category: { $regex: req.params.key, $options: "i" } }
        ]
    });
    res.send(result);
});

function verifyToken(req, res, next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(" ")[1];
        console.warn("Extracted token:", token);
        Jwt.verify(token, jwtKey, (err, token)=>{
            if(err){
                res.status(401).send("Please provide a valid token")
            }else{
                next();
            }
        })
    }else{
        res.status(403).send({result: "Please provide a token"})
    }
}


const port = 5000;
app.listen(port,()=>{
    console.log(`port is running at ${port}`)
});

