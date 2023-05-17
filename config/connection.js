const mongoose = require("mongoose");
mongoose.set("strictQuery",false)
mongoose.connect(process.env.MONGO_CONNECTION).then(()=>{
    console.log("connecteddb")
}).catch((err)=>{
    console.log(err.message)
})
