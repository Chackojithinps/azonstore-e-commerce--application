
const isadminLogin=async(req,res,next)=>{
    try{
       if(req.session.admin){
        
       }else{
         res.redirect('/admin')
       }
       next();
    }catch(error){
        console.log("middleware______"+error.message)
    }
}

const isadminLogout=async(req,res,next)=>{
    try{
         if(req.session.admin){
            res.redirect('/adminDashboard')
         }
         console.log("hello")
         next();
    }catch(error){
        console.log(error.message)
    }
}
module.exports={
    isadminLogin,
    isadminLogout
}