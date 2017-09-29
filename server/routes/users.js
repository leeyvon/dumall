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
// 购物车删除
router.post('/cartDel',(req,res,next)=>{
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    User.update({
        userId:userId
    },{
        $pull:{
            'cartList':{
                'productId':productId
            }
        }
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
});
// 购物车全选与全部不选
router.post('/editCheckAll',(req,res,next)=>{
    let userId = req.cookies.userId;
    let checkAll = req.body.checkAll ? '1' :'0';
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
                doc.cartList.forEach((item)=>{
                    item.checked = checkAll;
                });
                doc.save((err1,doc1)=>{
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
            }
        }
    })
});
// 获取用户地址
router.get('/address',(req,res,next)=>{
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
            res.json({
              status: '0',
              msg: '',
              result: doc.addressList
            })
        }
    })
});
// 设置默认地址
router.post('/setDefault',(req,res,next)=>{
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    if(!addressId){
        res.json({
          status: '1003',
          msg: 'addressId is null',
          result: ''
        })
        return;
    }
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
            let addressList = doc.addressList;
            addressList.forEach((item)=>{
                if(item.addressId === addressId){
                    console.log(item.addressId);
                    item.isDefault = true;
                }else{
                    item.isDefault = false;
                }
            })
            doc.save((err1,doc)=>{
                if(err1){
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
        }
    })
});
// 删除地址
router.post('/delAddress',(req,res,next)=>{
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    User.update({
        userId:userId
    },{
        $pull:{
            'addressList':{
                'addressId':addressId
            }
        }
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
