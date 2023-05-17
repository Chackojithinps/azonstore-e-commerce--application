const category = require('../model/category')
const product = require('../model/product')
const user = require('../model/userModel')
const cloudinary=require('../middleware/cloudinary')

const productLists = async (req, res) => {
    try {
        const productData = await product.find().populate('category').lean()
        res.render('adminside/products', { admin: true, admin1: true, products: productData })
    } catch (error) {
        console.log(error.message)
    }
}

const addProducts = async (req, res) => {
    try {
        const categoryData = await category.find().lean()
        res.render('adminside/addProduct', { admin: true, admin1: true, categoryData })
    } catch (error) {
        console.log(error.message)
    }
}


const postAddProduct = async (req, res) => {
    try {

        let img = []
        for(const file of req.files){
         const result = await cloudinary.uploader.upload(file.path)
           img.push(result.public_id)
           console.log(result)
          }
        console.log(img)
        // const img1 = req.files.map((file) => file.filename)
        const productData = new product({
            name: req.body.name,
            bname: req.body.brand,
            image: img,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.id
        })
        const productDatas = await productData.save()
        if (productDatas) {
            res.redirect('/products')
        } else {
            res.redirect('/products')

        }
    } catch (error) {
        console.log(error.message)
    }
}

const editProduct = async (req, res) => {
    try {
        const id = req.query.id
        const categoryData = await category.find().lean()
        const productData = await product.findOne({ _id: id }).populate('category').lean()
        res.render('adminside/editProduct', { admin: true, admin1: true, categoryData, productData })
    } catch (error) {
        console.log(error.message)
    }
}


const postEditProduct = async (req, res) => {
    try {
        const categoryData = await category.findOne({ name: req.body.category });

        let updatedFields = {
            name: req.body.name,
            bname: req.body.brand,
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            category: categoryData._id,
        };

        // check if new image(s) were uploaded
        if (req.files && req.files.length > 0) {
            const existingProduct = await product.findById(req.body.id);
            let images = existingProduct.image;

            // append the filename of the new image(s) to the images array
            req.files.forEach((file) => {
                images.push(file.filename);
            });

            updatedFields.image = images;
        }

        await product.updateOne({ _id: req.body.id }, { $set: updatedFields });
        res.redirect('/products');
    } catch (error) {
        console.log(error.message);
    }
};


const deleteProductImage = async (req, res) => {
    try {
        const id = req.query.id
        const imageId = req.query.imageId;

        const categoryData = await category.find().lean()

        const productData = await product.findOne({ _id: id }).populate('category').lean()

        await product.updateOne({ _id: id }, { $pull: { image: imageId } })
        // res.render('adminside/editProduct', { admin: true, admin1: true, categoryData, productData})
        res.redirect(`/editProduct?id=${id}`)
    } catch (error) {
        console.log(error.message)
    }

}


const softDeleteproduct = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await product.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/products')
    } catch (error) {
        console.log(error.message)
    }

}


const showProduct = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await product.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/products')
    } catch (error) {
        console.log(error.message)
    }

}

// const searchProduct = async (req, res) => {
//     try {
//         const categoryData = await category.find().lean()
//         const item = req.body.search;
//         const search = item.trim();
//         const isUser = await user.findOne({ _id: req.session.user }).lean();
//         if (req.body.search) {
//             if (req.session.filter) {
//                 if (search) {
//                     const productData = await product.find({ $and: [{ price: { $gte: minAmount, $lte: maxAmount } },
//                          { name: { $regex: `${search}`, $options: 'i' } }] }).lean();
//                     res.render("user/shop", { user: true, user1: true, productData, isUser, categoryData });
//                 } else {
//                     //    res.redirect('/admin/admin-home')
//                 }
//             } else if (req.session.value1) {
//                 if (search) {
//                     const productData = await product.find({ $and: [{ category: req.session.catergoryFilter },
//                          { price: { $gte: minAmount, $lte: maxAmount } },
//                           { name: { $regex: `${search}`, $options: 'i' } },] }).lean();
//                     res.render("user/shop", { user: true, user1: true, productData, isUser, categoryData });
//                 } else {
//                     //    res.redirect('/admin/admin-home')
//                 }
//             }
//             else if (req.session.catergoryFilter){
//                 if (search) {
//                     const productData = await product.find({ $and: [{ category: req.session.catergoryFilter }, 
//                         { name: { $regex: `${search}`, $options: 'i' } }] }).lean();
//                     res.render("user/shop", { user: true, user1: true, productData, isUser, categoryData });
//                 } else {
//                     //    res.redirect('/admin/admin-home')
//                 }

//             } else {
//                 if (search) {
//                     const productData = await product.find({ name: { $regex: `${search}`, $options: 'i' } }).lean();
//                     res.render("user/shop", { user: true, user1: true, productData, isUser, categoryData });
//                 } else {
//                     //    res.redirect('/admin/admin-home')
//                 }

//             }
//         } else {
//             res.redirect('/shop')
//         }
//     } catch (error) {
//         console.log(error.message)
//     }

// }

// const findProductsByCategory = async (req, res) => {
//     try {
//         const id = req.query.id
//         const productData = await product.find({ category: id }).lean()
//         const categoryData = await category.find().lean()
//         const isUser = await user.findOne({ _id: req.session.user }).lean();
//         req.session.filter = false
//         req.session.catergoryFilter = id
//         res.render("user/shop", {
//             user1: true,
//             user: true,
//             isUser,
//             productData, categoryData

//         })
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// };

// const filterShopProducts = async (req, res) => {
//     try {
//         const isUser = await user.findOne({ _id: req.session.user }).lean();
//         const categoryData = await category.find().lean()
//         if (req.session.catergoryFilter && req.query.minAmount) {
//             minAmount = req.query.minAmount
//             maxAmount = req.query.maxAmount
//             req.session.value1 = true;

//             var productData1 = await product.find({ $and: [{ category: req.session.catergoryFilter }, { price: { $gte: minAmount, $lte: maxAmount } }] }).lean()

//             res.render("user/shop", { user: true, user1: true, productData: productData1, isUser, categoryData });
//         } else {
//             minAmount = req.query.minAmount
//             maxAmount = req.query.maxAmount
//             var productData1 = await product.find({ price: { $gte: minAmount, $lte: maxAmount } }).lean()
//             req.session.filter = true;
//             res.render("user/shop", { user: true, user1: true, productData: productData1, isUser, categoryData });
//         }


//     }



//     catch (error) {
//         console.log(error.message);
//     }
// };

module.exports = {
    productLists,
    addProducts,
    postAddProduct,
    editProduct,
    postEditProduct,
    deleteProductImage,
    softDeleteproduct,
    showProduct, 
}