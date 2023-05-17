const isLogin=async(req,res,next)=>{
    try{
       if(req.session.user){
        
       }else{
         res.redirect('/')
       }
       next();
    }catch(error){
        console.log("middleware______"+error.message)
    }
}


const isLogout=async(req,res,next)=>{
    try{
         if(req.session.user){
            res.redirect('/')
         }
         console.log("hello")
         next();
    }catch(error){
        console.log(error.message)
    }
}
module.exports={
    isLogin,
    isLogout
}