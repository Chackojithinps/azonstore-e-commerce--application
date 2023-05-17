const banner=require('../model/banner')
const bannerManagement=async(req,res)=>{
    try {
        const bannerData=await banner.find().lean()
        console.log(bannerData)
        res.render('adminside/banner',{admin:true,admin1:true,bannerData})

    } catch (error) {
        console.log(error.message);
    }
}

const addBanner=async(req,res)=>{
    try {
        console.log(1)
        res.render('adminside/addBanner',{admin:true,admin1:true})

    } catch (error) {
        console.log(error.message);
    }
}

const postaddBanner=async(req,res)=>{
    try {
        const img =req.file.filename
        const bannerData = new banner({
            header: req.body.header,
            type: req.body.type,
            highlight:req.body.highlight,
            description:req.body.description,
            image: img,
        })
        const bannerDatas = await bannerData.save()
        console.log(bannerData)
        res.render('adminside/banner',{admin:true,admin1:true})

    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    bannerManagement,
    addBanner,
    postaddBanner
}