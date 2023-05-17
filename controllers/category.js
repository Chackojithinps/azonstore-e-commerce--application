const category=require('../model/category')

//category

const getCategory=async(req,res)=>{
    try {
        const categoryData=await category.find().lean()
        res.render('adminside/category',{admin:true,admin1:true,categoryData})
    }catch (error) {
       console.log(error.message) 
    }
}

//add new category
const insertCategory=async(req,res)=>{
    try {
        console.log(req.body.name+"__________")
       const isExistingCategory=await category.findOne({name:req.body.name})
       if(isExistingCategory){
          const categoryData=await category.find().lean()
        //console.log(categoryData+"____________")
          res.render('adminside/category',{msg:"category already exists",admin:true,admin1:true,categoryData})
       }else{
          const categories=new category({
            name:req.body.name
            
          })
          await categories.save()
          const categoryData=await category.find().lean()
          res.render('adminside/category',{msg:"category added",admin:true,admin1:true,categoryData})
       }
    } catch (error) { 
        console.log(error.message)
    }
}


//list category
const listCategory=async(req,res)=>{
    try {
        const id=req.query.id;
        const categoryData=await category.updateOne({_id:id},{$set:{status:false}})
        res.redirect('/category')
    } catch (error) {
        console.log(error.message)
    }
}


//unlist category
const unlistCategory=async(req,res)=>{
    try {
        const id=req.query.id;
        const categoryData=await category.updateOne({_id:id},{$set:{status:true}})
        res.redirect('/category')
    } catch (error) {
        console.log(error.message)
    }
}

const editCategory=async(req,res)=>{
    try {
       const id=req.query.id;
       req.session.categoryId=id;
       const categoryData=await category.findOne({_id:id}).lean()
       res.render('adminside/editCategory',{admin:true,admin1:true,categoryData})
    } catch (error) {
        console.log(error.message)
    }
}
const posteditCategory=async(req,res)=>{
    try {
        const isExistingCategory=await category.findOne({name:req.body.name})
        if(isExistingCategory){
           const categoryData=await category.find().lean()
        
           res.render('adminside/category',{msg:"category already exists",admin:true,admin1:true,categoryData})
        }else{
            const name=req.body.name
            const categoryData=await category.updateOne({_id:req.session.categoryId},{$set:{name:name}})
            
            res.redirect('/category')
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports={getCategory,
    insertCategory,
    listCategory,
    unlistCategory,
    editCategory,
    posteditCategory
}