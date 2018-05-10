"use strict";
const express=require("express"),
    bodyParser=require("body-parser"),
    albumCtrl=require("./control/AlbumCtrl"),
    formidable=require("formidable"),
    fs=require("fs"),
    pt=require("path");
var app=express();
//post参数注入
//body-parser node.js(http)请求体解析中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
//express.static负责托管express应用内的静态资源
app.use('/',express.static("webapp"));
app.use('/',express.static("upload"));
//把模板对象注入到app中
app.set("view engine","ejs")
app.set("views","webapp")

app.get("/",function(req,res){
    albumCtrl.renderFile(req,res);
})
app.get("/favicon.ico",function(req,res){
    return "img/xx.png"
})
app.post("/search",function(req,res){
    albumCtrl.searchFile(req,res);
})
app.post("/fileupload",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        console.log(files);
        fs.readFile(files.fileup.path,function(err,data){
            fs.writeFile(pt.join(__dirname,"../upload"),data,function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("success")
                }
            })
        })

    });
    res.end();
})
app.use("/",function (req,res) {
    albumCtrl.renderFileByFolder(req,res);
})

app.listen(9090,function(err){
    if(err) throw err;
});