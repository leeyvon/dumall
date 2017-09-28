var express = require('express');
var router = express.Router();

let User = require('./../models/user');

router.post('/login', function(req, res, next) {
    let param = {
        userName:req.body.userName,
        userPwd:req.body.userPwd
    }
    User.findOne(param,(err,doc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(doc){
                // 客户端保存用户id和name，有效时间为1小时
                res.cookie('userId',doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                })
                res.cookie('userName',doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                })
                res.json({
                    status:'0',
                    msg:'',
                    login:true,
                    result:{
                        userName:doc.userName
                    }
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    login:false
                })
            }
        }
    })
});

// 检查登陆
router.get('/checkLogin',(req,res,next)=>{
    if(req.cookies.userId){
        res.json({
            status:'0',
            msg:'',
            result:req.cookies.userName || ''
        })
    }else{
        res.json({
            status:'1',
            msg:'未登录',
            result:''
        })
    }
});

//登出
router.post('/logout',(req,res,next)=>{
    res.cookie('userId','',{
        path:'/',
        maxAge:-1
    })
    res.json({
        status:'0',
        msg:'',
        result:''
    })
})
// 查询当前用户购物车
router.get('/cartList',(req,res,next)=>{
    let userId = req.cookies.userId;
    User.findOne({
        userId:userId
    },(err,doc)=>{
        if(err){
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        }else {
            if(doc){
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
})
// 修改购物车某个商品状态
router.post('/cartEdit',(req,res,next)=>{
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;
    User.update({
        'userId':userId,
        'cartList.productId':productId
    },{
        'cartList.$.productNum':productNum,
        'cartList.$.checked':checked
    },(err,doc)=>{
        if(err){
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
        }else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            })
        }
    })
})

module.exports = router;
