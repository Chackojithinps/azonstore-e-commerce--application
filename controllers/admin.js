const admin = require('../model/adminModel')
const user = require('../model/userModel')
const category = require('../model/category')
const product = require('../model/product')
const bcrypt = require('bcrypt')
const order = require('../model/orders')

// //adminDashbord
var ord = 0;
var del = 0;
var ret = 0;
var can = 0;
var shi = 0;
var dis = 0;


const adminDashboard = async (req, res) => {
    try {

        const { from, to } = req.query;
        console.log(req.query)

        const fromDate = new Date(from);
        const toDate = new Date(to);

        // Increment the toDate by 1 day to include the entire last day
        toDate.setDate(toDate.getDate() + 1);

        // Format the dates in "dd mm yy" order
        const fromFormatted = fromDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const toFormatted = toDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const orderData = await order.find({
            date: {
                $gte: fromFormatted,
                $lt: toFormatted,
            },
        }).lean();
        const orderDatas = await order.find().lean()
        console.log("orderDatas:", orderDatas)
        const datas = orderDatas.map((item) => {
            return item.status
        })
        console.log("datas:", datas)
        let ord = datas.filter(status => status === 'ordered').length;
        let del = datas.filter(status => status === 'delivered').length;
        let ret = datas.filter(status => status === 'returned').length;
        let can = datas.filter(status => status === 'Cancelled').length;
        let shi = datas.filter(status => status === 'Shipped').length;
        let dis = datas.filter(status => status === 'dispatched').length;

        var mo = 0; var tu = 0; var we = 0; var th = 0; var fr = 0; var sa = 0; var su = 0;
        for (i = 0; i < orderDatas.length; i++) {
            const date = new Date(orderDatas[i].date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });;
            console.log(dayOfWeek)
            if (dayOfWeek.toUpperCase() == "MONDAY") {
                mo++;
            }
            if (dayOfWeek.toUpperCase() == "TUESDAY") {
                tu++;
            }
            if (dayOfWeek.toUpperCase() == "WEDNESDAY") {
                we++;
            }
            if (dayOfWeek.toUpperCase() == "THURSDAY") {
                th++;
            }
            if (dayOfWeek.toUpperCase() == "FRIDAY") {
                fr++;
            }
            if (dayOfWeek.toUpperCase() == "SATURDAY") {
                sa++;
            }
            if (dayOfWeek.toUpperCase() == "SUNDAY") {
                su++;
            }

        }

        res.render('adminside/dashboard', { admin: true, admin1: true, orderDatas, orderData,ord, del, ret, can, shi, dis, mo, tu, we, th, fr, sa, su })
    } catch (error) {
        console.log(error.message)
    }

}


//userManagement
const userManangement = async (req, res) => {
    try {
        const userData = await user.find().lean()
        console.log(userData)
        res.render('adminside/user', { admin: true, admin1: true, userData })
    } catch (error) {
        console.log(error.message)
    }
}
// block user
const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData1 = await user.updateOne({ _id: id }, { $set: { status: false } })
        // console.log("___"+userData1)
        req.session.user = null;
        res.redirect('/userList')
    } catch (error) {
        console.log(error.message)
    }

}

// unblock user
const unblockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData1 = await user.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/userList')
    } catch (error) {
        console.log(error.message)
    }
}

//adminLogin
const adminLogin = async (req, res) => {
    try {
        res.render('adminside/signin', { admin1: true })

    } catch (error) {
        console.log(error.message)
    }
}

const postAdminLogin = async (req, res) => {
    try {
        const adminPassword = req.body.password;
        const findAdmin = await admin.findOne({ email: req.body.email })
        console.log(findAdmin)
        if (findAdmin) {
            const passwordMatch = await bcrypt.compare(adminPassword, findAdmin.password)
            if (passwordMatch) {
                req.session.admin = findAdmin._id
                res.redirect('/adminDashboard')
            } else {
                res.render('adminside/signin', { admin1: true, err: "invalid credentials" })

            }
        } else {
            res.render('adminside/signin', { admin1: true, err: "invalid credentials" })

        }

    } catch (error) {
        console.log(error.message)
    }
}


// adminLogout

const adminLogout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    adminLogin,
    adminDashboard,
    userManangement,
    postAdminLogin,
    blockUser,
    unblockUser,
    adminLogout
}