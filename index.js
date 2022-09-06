const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const stripeRoute = require("./routes/stripe");
let PORT = process.env.PORT || 3000;
require("dotenv").config();

// DataBase Connection; 
const url = "mongodb://localhost:27017/eCommerse";
mongoose.connect(url).then( ()=> console.log("connection successfull....")).catch((err) => console.log(err));


app.use(express.json());
app.use("/api/user" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/products" , productRoute);
app.use("/api/cart" ,cartRoute);
app.use("/api/order" , orderRoute);
app.use("/api/checkout", stripeRoute);


app.listen( PORT , () =>{
    console.log(`listening on port ${PORT}`);
});