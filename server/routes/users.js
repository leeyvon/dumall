var express = require('express');
var router = express.Router();
require('./../util/util')
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
                    maxAge:1000*60*60*60
                })
                res.cookie('userName',doc.userName,{
                    path:'/',
                    maxAge:1000*60*60*60
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
});
// orderConfirm
router.get('/orderList',(req,res,next)=>{
    let userId = req.cookies.userId;
    let orderList = [];
    User.findOne({userId:userId},(err,doc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            if(doc){
                doc.cartList.forEach((item)=>{
                    if(item.checked === '1'){
                        orderList.push(item);
                    }
                })
                res.json({
                    status:'0',
                    msg:'',
                    result:orderList
                })
            }
        }
    });
});

// 支付订单
router.post('/payMent',(req,res,next)=>{
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    let orderTotal = req.body.orderTotal;
    User.findOne({userId:userId},(err,doc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            let address = '';
            let goodsList = [];
            // 获取用户当前的地址信息
            doc.addressList.forEach((item)=>{
                if(addressId === item.addressId){
                    address = item;
                }
            });
            // 获取用户购物车的购买商品
            doc.cartList.filter((item)=>{
                if(item.checked === '1'){
                    goodsList.push(item);
                    // 从购物车中删除用户购买的商品
                    User.update({userId:userId},{
                        $pull:{
                            'cartList':{
                                'productId':item.productId
                            }
                        }
                    },(err,doc)=>{
                        if(err){
                            console.log('从购物车删除购买商品失败')
                        }else{
                            console.log('从购物车删除购买商品成功')
                        }
                    })
                }
            });

            // 平台码
            let platform = '622'
            // 随机数字
            let r1 = Math.floor(Math.random()*10)
            let r2 = Math.floor(Math.random()*10)
            // 日期
            let sysDate = new Date().Format('yyyyMMddhhmmss');
            let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
            // 订单号
            let orderId = platform + r1 +sysDate +r2
            // 生成的订单
            let order = {
                orderId:orderId,
                orderTotal:orderTotal,
                addressInfo:address,
                goodsList:goodsList,
                orderStatus:'1',
                createDate:createDate
            }

            doc.orderList.push(order);

            doc.save((err1,doc1)=>{
                if(err1){
                    res.json({
                        status:'1',
                        msg:err1.message,
                        result:''
                    })
                }else{
                    res.json({
                        status:'0',
                        msg:'',
                        result:{
                            orderId:order.orderId,
                            orderTotal:order.orderTotal
                        }
                    })
                }
            })
        }
    })
})
// 根据订单id查询订单信息
router.get('/orderDetail',(req,res,next)=>{
    let userId = req.cookies.userId;
    let orderId = req.query.orderId;
    User.findOne({userId:userId},(err,userInfo)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            let orderList = userInfo.orderList;
            if(orderList.length>0){
                let orderTotal = 0;
                orderList.forEach((item)=>{
                    if(item.orderId === orderId){
                        orderTotal = item.orderTotal
                    }
                })
                console.log(orderTotal);
                if(orderTotal>0){
                    res.json({
                    status: '0',
                    msg: '',
                    result: {
                      orderId: orderId,
                      orderTotal: orderTotal
                    }
                  })
              }else{
                  res.json({
                      status: '120002',
                      msg: '无此订单',
                      result: ''
                  })
              }
          }else{
              res.json({
                  status:'120001',
                  msg:'当前用户未常见订单',
                  result:''
              })
          }
        }
    })
});
// 获取购物车数量
router.get('/getCartCount',(req,res,next)=>{
    if(req.cookies && req.cookies.userId){
        let userId = req.cookies.userId;
        User.findOne({userId:userId},(err,doc)=>{
            if(err){
                res.json({
                    status:'1',
                    msg:err.message,
                    result:''
                })
            }else{
                let cartList = doc.cartList;
                let cartCount = 0;
                cartList.map((item)=>{
                    cartCount += parseInt(item.productNum)
                })
                res.json({
                    status:'0',
                    msg:'',
                    result:cartCount
                })
            }
        })
    }
})
module.exports = router;
