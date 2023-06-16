const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

require("dotenv").config() //env file requiring

const user = require("../model/userModel");
const product = require("../model/product");
const cart = require("../model/cart");
const category = require("../model/category")
const banner=require('../model/banner');
// const category = require("../model/category");

// <!--================================ //bcrypt code ===================================-->

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log("firstrrrrrrr" + error.message);
  }
};

// <!--================================ Otp generate ===================================-->

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// <!--===================== // Function to send OTP to user's email ====================-->

const sendOTP = async (email, otp) => {
  // Create transporter object to send email
  const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for email verification is ${otp}`,
  };

  try {
    // Send email with OTP
    await transporter.sendMail(mailOptions);

    // Return success response
    console.log("OTP sent successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};


// <!--================================ //Home page ===================================-->

const getHomepage = async (req, res) => {
  try {
    const productData = await product.find().lean();
    const categoryData = await category.find().lean()
    const Largerbanner=await banner.find({type:"Larger"}).lean()
    const smallerbanner=await banner.find({type:"Smaller"}).lean()
    const cartData=await cart.findOne({user:req.session.user}).lean()
    // console.log("cartData:",cartData)
    if(cartData){
        var productCount = cartData.product.length
        console.log("Product count1:", productCount);
        req.session.productCount=productCount
     }else{
      var productCount=0;
      req.session.productCount=productCount;

     }
    // productCount=prou
    // req.session.cartCount=productCount
      const isUser = await user.findOne({ _id: req.session.user }).lean();
      req.session.isUser=isUser
      if(!isUser){
        var isNotuser=true
        req.session.isNotuser=true;
      }
      res.render("user/home", {
        user1: true,
        user: true,
        productData,
        isUser,isNotuser,
        productData, categoryData,Largerbanner,smallerbanner,productCount
      });
    
      
  } catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ User Signup ===================================-->

  const userSignup = (req, res) => {
    res.render("user/signup", { login: true, user1: true });
  };

  const postUserSignup = async (req, res) => {
    try {
      const password = req.body.password
      const confirmPassword = req.body.confirmPassword
      // const spassword= await securePassword(req.body.password);
      if (password !== confirmPassword) {
        res.render('user/signup', { login: true, user1: true, error: 'Passwords do not match' });
      } else {
        const OTP = generateOTP();
        req.session.user1 = req.body;
        req.session.email = req.body.email
        // console.log(req.session.user);
        req.session.otp = OTP;
        sendOTP(req.body.email, OTP);
        res.redirect("/userOtp");
      }

    } catch (error) {
      console.log("44444444444444" + error.message);
    }
  };

  // <!--================================ Resend Otp ===================================-->

  const resendOtp = async (req, res) => {
    try {
      const OTP = generateOTP();
      // req.session.user1 = req.body;
      // console.log(req.session.user);
      req.session.otp = OTP;
      sendOTP(req.session.email, OTP);
      res.redirect('userOtp')
    } catch (error) {
      console.log(error.message)
    }
  }

  // <!--================================ // singleProduct ===================================-->

  const singleProduct = async (req, res) => {
    try {
      const id = req.query.id;
      const singleProduct = await product.findOne({ _id: id }).lean();
      var categoryId=singleProduct.category;
      const isUser = await user.findOne({ _id: req.session.user }).lean();
      const categoryData=await category.findOne({_id:categoryId}).lean()
      console.log("categoryData",categoryData)
      var productCount=req.session.productCount
      res.render("user/singleProduct", {
        user: true,
        user1: true,
        isUser,
        singleProduct,productCount,categoryData
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // <!--================================ // userLogin ===================================-->

  const userLogin = (req, res) => {
    res.render("user/login", { login: true, user1: true });
  };
  const postUserSignin = async (req, res) => {
    try {
      const userData = await user.findOne({ email: req.body.email });
      // console.log(userData)
      // console.log(userData)
      if (userData) {
        if (userData.status) {
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            userData.password
          );
          if (passwordMatch) {
            req.session.user = userData._id;
            // console.log()
            res.redirect("/");
          } else {
            res.render("user/login", {
              err: "invalid credentials",
              login: true,
              user1: true,
            });
          }
        } else {
          res.render("user/login", {
            err: "invalid credentials",
            login: true,
            user1: true,
          });
        }
      } else {
        res.render("user/login", {
          err: "invalid credentials",
          login: true,
          user1: true,
        });
      }
    } catch (error) {
      console.log("888888888888" + error.message);
    }
  };

  // <!--================================ //shop page===================================-->

  const shop = async (req, res) => {
    try {
      const page=req.query.page
      const perPage=6
      // req.session.catergoryFilter=false;
      // req.session.filter=false;
      req.session.value1=false
     const isUser = await user.findOne({ _id: req.session.user }).lean()
     if(!isUser){
       var isNotuser=true;
     }   
    // Get the total number of documents and calculate the number of pages
    const totalDocuments = await product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / perPage); 
    // Generate an array of page numbers to use for the pagination links
    const cartData=await cart.findOne({user:req.session.user})
    if(cartData){
      var productCount=cartData.product.length;
      req.session.productCount=productCount;
    }else{
      var productCount=0;
      req.session.productCount=productCount;
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    var search = req.query.search || ''; // Get the search value from req.query or set to empty string if not present
    var categoryId = req.query.categoryId; // Get the categoryId value from req.query
    var minPrice = req.query.minPrice || 0; // Get the minPrice value from req.query or set to 0 if not present
    var maxPrice = req.query.maxPrice || Number.MAX_VALUE // Get the maxPrice value from req.query or set to a high value if not present
    var sortValue= req.query.sortValue||1
      
        var minPrice = 0; // Minimum price
        var maxPrice = Number.MAX_VALUE; // Maximum price
        if (req.query.minAmount) {
          minPrice = req.query.minAmount;
        }
        if (req.query.maxAmount) {
          maxPrice = req.query.maxAmount;
        }
        var sortValue=1;
        if (req.query.sortValue) {
          sortValue = req.query.sortValue;
        }
      
        const query = {
          $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
          ],
          price: { $gte: minPrice, $lte: maxPrice }
        };
        
        if (categoryId) {
          query.category = categoryId;
        }

        const productsData = await product.find(query).lean()
        .skip((page - 1) * perPage).limit(perPage)
        .sort({ price: sortValue })
        .exec();
     console.log(productsData)
      const categories = await category.find().lean();
  
      res.render("user/shop", {
        user: true,
        user1: true,
        productData: productsData,
        isUser,isNotuser,
        minPrice:minPrice,
        maxPrice,
        categoryData: categories,
        categoryId:categoryId,
        currentPage: page,
        totalPages,
        pageNumbers,
        sortValue,
        totalDocuments,
        search:search,productCount
      });
      
    } catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //getOtp page ===================================-->

  const getOtp = (req, res) => {
    const email = req.session.email
    res.render("user/otp", { otp: true, user1: true, email });
  };

  const postOtpVerification = async (req, res) => {
    try {
      const { first, second, third, fourth, fifth, sixth } = req.body;
      const userOtp = Number(first + second + third + fourth + fifth + sixth);
      console.log(req.session.user);
      const { name, email, phone, password } = req.session.user1;
      const spassword = await securePassword(password);

      if (userOtp == req.session.otp) {
        const data = new user({
          name: name,
          email: email,
          phone: phone,
          password: spassword,
        });

        const signupData = await data.save();
        if (signupData) {
          const userData = await user.findOne({ email: req.session.email })
          req.session.user = userData._id
          res.redirect("/");
        } else {
          res.send("sighnup data is not saved");
        }
      } else {
        res.render("user/otp", { otp: true, user1: true, err: "incorrect otp" });
      }
    } catch (error) {
      console.log("OTP verification error: " + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // <!--================================ //editProfile ===================================-->

  const geteditProfile = async (req, res) => {
    try {
      const isUser = await user.findOne({ _id: req.session.user }).lean()

      const userData = await user.findOne({ _id: req.session.user }).lean();
      res.render("user/editProfile", { user: true, user1: true, userData, isUser });
    } catch (error) {
      console.log(error.message);
    }
  };

  const posteditProfile = async (req, res) => {
    try {
      const editProfile = await user.updateOne(
        { _id: req.session.user },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
          },
        }
      );
      res.redirect("/userProfile");
    } catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //User Profile ===================================-->

  const getUserProfile = async (req, res) => {
    try {
      if (req.session.user) {
        const isUser = await user.findOne({ _id: req.session.user }).lean()
        productCount=req.session.productCount;
        const userData = await user.findOne({ _id: req.session.user }).lean();
        if(userData.wallet==null){
          var wallet=0;
        }else{
          wallet=userData.wallet
        }
        res.render("user/profile", { user: true, user1: true, userData , isUser , productCount , wallet });
      } else {
        res.redirect("/userLogin");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // <!--================================ //user signout ===================================-->


  const userSignout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  // <!--================================ //user forgot Password ===================================-->

  const forgotPassword = async (req, res) => {
    try {
      res.render('user/forgotPassword', { user1: true })
    } catch (error) {
      console.log(error.message);
    }
  };


  // <!--================================ //mail submits for forgot Password otp ===================================-->

  const getotpPage2 = async (req, res) => {
    try {
      const email = req.session.email
      res.render("user/otp2", { otp: true, user1: true, email })
    } catch (error) {
      console.log(error.message);
    }
  };

  const forgotPassemail = async (req, res) => {
    try {
      const email = req.body.email

      const isuserExists = await user.findOne({ email: email })
      if (isuserExists) {
        const OTP = generateOTP();
        // req.session.user1 = req.body;
        req.session.email = req.body.email

        // console.log(req.session.user);
        req.session.otp = OTP;
        sendOTP(email, OTP);
        // res.redirect("/userOtp");
        res.render("user/otp2", { otp: true, user1: true, email });
      } else {
        res.render('user/forgotPassword', { user1: true, error: "This email does not exist" })
      }


    } catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //otp verification for password===================================-->

  const postOtpVerificationPass = async (req, res) => {
    try {
      const { first, second, third, fourth, fifth, sixth } = req.body;
      const userOtp = Number(first + second + third + fourth + fifth + sixth);
      // console.log(req.session.user);
      // const { name, email, phone, password } = req.session.user1;
      // const spassword = await securePassword(password);

      if (userOtp == req.session.otp) {
        res.render('user/changePassword', { otp: true, user1: true })
      } else {
        res.render("user/otp2", { otp: true, user1: true, err: "incorrect otp" });

      }

    } catch (error) {
      console.log("OTP verification error: " + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };



  const resendOtpkk = async (req, res) => {
    try {
      const OTP = generateOTP();
      // req.session.user1 = req.body;
      // console.log(req.session.user);
      req.session.otp = OTP;
      sendOTP(req.session.email, OTP);
      res.redirect('/getotpPage2')
    } catch (error) {
      console.log(error.message)
    }
  }

  // <!--================================ //check the confirm password ===================================-->

  const passwordSubmit = async (req, res) => {
    try {

      const password = req.body.password
      const repassword = req.body.repassword

      if (password == repassword) {
        const spassword = await securePassword(password);
        await user.updateOne({ email: req.session.email }, { $set: { password: spassword } })
        res.redirect('/userLogin')
      }

      else {
        res.send("failed")
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  // <!--================================ /userProfile address===================================-->

  const getaddressBook = async (req, res) => {
    try {
      const userData = await user.findOne({ _id: req.session.user }).lean()
      res.render('user/addressBook', { user: true, user1: true, userData })
    }
    catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //Add profile address===================================-->


  const addprofileAddress = async (req, res) => {
    try {
      const userData = await user.findOne({ _id: req.session.user }).lean()

      res.render('user/addprofileAddress', { user: true, user1: true, userData })

    }
    catch (error) {
      console.log(error.message);
    }
  };


  const addNewaddress = async (req, res) => {
    try {
      const { firstname, lastname, phone, street, country, state, city, pincode } = req.body;
      await user.updateOne({ _id: req.session.user }, { $set: { firstname: firstname, lastname: lastname, phone: phone, street: street, country, state, city, pincode } })

      // const userData=await user.findOne({_id:req.session.user})

      res.redirect('/addressBook')

    }
    catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //edit profile address===================================-->

  const editprofileAddress = async (req, res) => {
    try {
      const userData = await user.findOne({ _id: req.session.user }).lean()

      res.render('user/editprofileAddress', { user: true, user1: true, userData })


    }
    catch (error) {
      console.log(error.message);
    }
  };

  const updateProfileaddress = async (req, res) => {
    try {
      const { firstname, lastname, phone, street, country, state, city, pincode } = req.body;
      await user.updateOne({ _id: req.session.user }, { $set: { firstname: firstname, lastname: lastname, phone: phone, street: street, country, state, city, pincode } })
      res.redirect('/addressBook')
    }
    catch (error) {
      console.log(error.message);
    }
  };


  // <!--================================ //findProductsByCategory ===================================-->

  const findProductsByCategory = async (req, res) => {
    try {
      const id = req.query.id
      const productData = await product.find({ category: id }).lean()
      const categoryData = await category.find().lean()
      const Largerbanner=await banner.find({type:"Larger"}).lean()
      const smallerbanner=await banner.find({type:"Smaller"}).lean()
      const isUser = await user.findOne({ _id: req.session.user }).lean();
      res.render("user/home", {
        user1: true,
        user: true,
        isUser,
        productData, categoryData,Largerbanner,smallerbanner

      })
    }
    catch (error) {
      console.log(error.message);
    }
  };

  // <!--================================ //findAllProducts ===================================-->

  const findAllProducts = async (req, res) => {
    try {
      res.redirect('/')
    }
    catch (error) {
      console.log(error.message);
    }
  };
  module.exports = {
    getHomepage,
    userLogin,
    postUserSignup,
    userSignup,
    postUserSignin,
    getUserProfile,
    getOtp,
    postOtpVerification,
    singleProduct,
    userSignout,
    shop,
    geteditProfile,
    posteditProfile,
    resendOtp,
    forgotPassword,
    forgotPassemail,
    postOtpVerificationPass,
    resendOtpkk,
    getotpPage2,
    passwordSubmit,
    getaddressBook,
    addprofileAddress,
    addNewaddress,
    editprofileAddress,
    updateProfileaddress,
    findProductsByCategory,
    findAllProducts
  };
