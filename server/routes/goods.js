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
  let goodsModel = Goods.find().skip(skip).limit(pageSize);
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
module.exports = router;
