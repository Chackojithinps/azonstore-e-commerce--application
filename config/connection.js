const mongoose = require("mongoose");
mongoose.set("strictQuery",false)
mongoose.connect("mongodb+srv://jithinchacko:TJXZNtrAIZyD3sqj@cluster0.7uvuldf.mongodb.net/ecommerceProject").then(()=>{
    console.log("connecteddb")
}).catch((err)=>{
    console.log(err.message)
})
