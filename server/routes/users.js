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

module.exports = router;
