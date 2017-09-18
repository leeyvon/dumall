var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods');

// 连接mongodb数据库
mongoose.connect('mongodb://localhost:27017/dumall');

mongoose.connection.on('connected',()=>{
    console.log('MongoDB has connected');
});

mongoose.connection.on('error',()=>{
    console.log('MongoDB connected fail');
});

mongoose.connection.on('disconnected',()=>{
    console.log('MongoDB disconnected');
});

router.get('/list', function(req, res, next) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let skip = (page - 1) * pageSize;
  let priceLevel = req.query.priceLevel;
  let sort = req.query.sort; //使用req.query获取参数
  let params = {};  //查询的参数

  // 按价格筛选
  let priceGt = '';
  let priceLte = '';
  if(priceLevel !== 'all'){
      switch (priceLevel){
          case '0':
            priceGt = 0;
            priceLte = 100;
            break;
          case '1':
           priceGt = 100;
           priceLte = 500;
           break;
          case '2':
           priceGt = 500;
           priceLte = 1000;
           break;
          case '3':
           priceGt = 1000;
           priceLte = 5000;
           break;
      }
      params = {
          salePrice:{
              $lte:priceLte,
              $gt:priceGt
          }
      }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec((err,doc)=>{
      if(err){
          res.json({
              status:'1',
              msg:err.message
          })
      }else{
          res.json({
              status:'0',
              msg:'success',
              result:{
                  count:doc.length,
                  list:doc
              }
          })
      }
  })
});

router.post('/addCart',(req,res,next)=>{
    let userId = '100000077';
    let productId = req.body.productId;
    let User = require('../models/user');
    User.findOne({
        userId:userId
    },(err,userDoc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            if(userDoc){
                let goodsItem = '';
                // 如果购物车里存在此商品，则数量+1并保存
                userDoc.cartList.forEach((item)=>{
                    if(item.productId === productId){
                        goodsItem = item;
                        item.productNum++;
                    }
                })
                if(goodsItem){
                    userDoc.save((err2,doc2)=>{
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'添加成功',
                                result:'success'
                            })
                        }
                    })
                }else{
                    // 购物车不存在此商品，添加到购物车
                    Goods.findOne({
                        productId:productId
                    },(err,doc)=>{
                        if(err){
                            res.json({
                                status:'1',
                                msg:err.message
                            })
                        }else{
                            if(doc){
                                // 商品数量初始化为1，并为选中状态
                                doc.productNum = 1;
                                doc.checked = 1;
                                console.log(doc);
                                userDoc.cartList.push(doc);
                                userDoc.save((err2,doc2)=>{
                                    if(err2){
                                        res.json({
                                            status:'1',
                                            msg:err2.message
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'添加成功',
                                            result:'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
});
module.exports = router;
