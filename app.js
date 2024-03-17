var express = require("express");
var app = express();


app.listen(8000,()=>{
    console.log("正在運行");
})

var bp =require("body-parser");
app.use(bp.urlencoded({extended:false}))
app.set("view engine", "ejs");

// 將 public 文件夾下的靜態文件暴露出來
app.use(express.static(__dirname +'/public'));

//連接資料庫(npm i mysql)
var mysql=require("mysql");
const { findSourceMap } = require("module");
var conn= mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"jiuing"
})

app.get("/",(req, res)=> {
     // 查詢數據庫中的數據
     conn.query("SELECT * FROM post", {},(err, results) => {
         // 渲染模板並將數據發送到客戶端
         res.render("index", { data: results });
        //  console.log(results);[{}]
     });
    
})

app.get("/post/:id",(req,res)=>{
    conn.query("select * from post where postId = ?",
        [req.params.id],
        function (err,results){
            if (err) {
                console.error(err);
                return res.status(500).render("error_page500.ejs");
            }
    
            // 如果找不到紀錄，導致錯誤頁面
            if (results.length === 0) {
                return res.status(404).render("error_page400.ejs");
            }

            // 執行第二個查詢
            conn.query("SELECT * FROM coment WHERE com_postId = ?", [req.params.id], function(err, comentResult) {
                if (err) {
                    console.error(err);
                    return res.status(500).render("error_page500.ejs");
                }
            
                // 渲染模板
                res.render("post_page.ejs", { 
                    post: results[0],
                    comments: comentResult // 將評論資料傳遞給模板
                });
                // console.log(results);
                // console.log(comentResult);
    });
        }
    )  
})


//登入者的貼文
app.get("/ownpost/:id",(req,res)=>{
    conn.query("select * from post where postId = ?",
        [req.params.id],
        function (err,results){
            if (err) {
                console.error(err);
                return res.status(500).render("error_page500.ejs");
            }
    
            // 如果找不到紀錄，導致錯誤頁面
            if (results.length === 0) {
                return res.status(404).render("error_page400.ejs");
            }

            // 執行第二個查詢
            conn.query("SELECT * FROM coment WHERE com_postId = ?", [req.params.id], function(err, comentResult) {
                if (err) {
                    console.error(err);
                    return res.status(500).render("error_page500.ejs");
                }
            
                // 渲染模板
                res.render("own_post_page.ejs", { 
                    post: results[0],
                    comments: comentResult // 將評論資料傳遞給模板
                });
                // console.log(results);
                // console.log(comentResult);
    });
        }
    )  
})

//登入者的會員頁面 
app.get("/ownMember",(req,res)=>{
    res.render("own_member");
})

//登入者的會員帳號編輯頁面 
app.get("/ownMember/settingEdit",(req,res)=>{
    res.render("setting_edit");
})

//註冊 
app.get("/register",(req,res)=>{
    res.render("register");
})

