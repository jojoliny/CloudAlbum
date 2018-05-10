"use strict";
const fs=require("fs"),
    pt=require("path"),
    multer=require("multer");
let url=pt.join(__dirname,"../upload");
//渲染文件
function renderFile(req,res){
    let json=_readFile(url);
    res.render("index.ejs",json);
}

//渲染文件夹下的文件
function renderFileByFolder(req,res) {
    let json=_readFile(pt.join(url,decodeURI(req.url)));
    res.render("index.ejs",json)
}
let files=[];
function searchFile(req,res){
    files=[];
    let keyword=req.body.key;
    fileSearch(url,keyword,"/");
    let json={
        folders:[],
        files:files
    }
    res.render("index.ejs",json)
}

function fileSearch(url,keyword,filename){
    let fls=fs.readdirSync(url);
    fls.forEach(function (f) {
        let stat=fs.statSync(pt.join(url,f));
        console.log(stat)
        if(stat.isFile()){
            if(f.indexOf(keyword)>=0){
                files[files.length]={filename:pt.join(filename,f)}
            }
            return files;
        }else{
            fileSearch(pt.join(url,f),keyword,pt.join(filename,f));
        }
    })
}
//文件遍历
function _readFile(mypath) {
    //文件夹搜索操作 readdirSync读取一个目录的内容
    let fls=fs.readdirSync(mypath);
    let folders=[];
    let files=[];
    fls.forEach(function (f) {
        let state=fs.statSync(pt.join(mypath,f));
        if(state.isFile()){
            files[files.length]={filename:f};
        }else{
            folders[folders.length]={foldername:f};
        }
    })
    return {folders,files}
}

module.exports={renderFile,renderFileByFolder,searchFile}