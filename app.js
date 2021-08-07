const express = require('express');
const app = express()
const path = require("path");
var bodyParser = require("body-parser");

app.set("view engine","ejs");
app.set("views",__dirname);
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+"/public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+"/index.html"));
})
app.get('/loginauth', function (req, res) {
    res.sendFile(path.join(__dirname+"/login.html"));
})
app.get('/savetodb', function (req, res) {
    res.sendFile(path.join(__dirname+"/register.html"));
})
app.get('/adminauth', function (req, res) {
  res.sendFile(path.join(__dirname+"/alogin.html"));
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname+"/about.html"));
})

app.get('/apply', function (req, res) {
  res.sendFile(path.join(__dirname+"/apply.html"));
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname+"/home.html"));
})

app.get('/alotmentor', function (req, res) {
  res.sendFile(path.join(__dirname+"/alotmentor.html"));
})

app.get('/formsubmitted', function (req, res) {
  res.sendFile(path.join(__dirname+"/formsubmitted.html"));
})

app.get('/nomentor', function (req, res) {
  res.sendFile(path.join(__dirname+"/nomentor.html"));
})

app.get("/admin", function (req, res) {

    var mysql = require("mysql");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    connection.connect();
    console.log("connected to database");
 
    connection.query("SELECT * FROM candidate_info", function (err, result) {

        if(err) throw err;
        res.render("admin",{bdata:result});
    });
    connection.end();
    // res.sendFile(path.join(__dirname + "/home.html"));
  });
  

  app.get("/applicants", function (req, res) {

    var mysql = require("mysql");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    connection.connect();
    console.log("connected to database");
 
    connection.query("SELECT * FROM candidate_info", function (err, result) {

        if(err) throw err;
        res.render("applicants",{bdata:result});
    });
    connection.end();
    // res.sendFile(path.join(__dirname + "/home.html"));
  });
 
app.post("/savetodb",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    var data = {
        name:name,
        email:email,
        password:password,
    };
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"vikram"
    });
    connection.connect();

    connection.query("INSERT INTO signup SET?",data, function(err,result,fields){
        {
            if(err) throw err;
            else
                console.log("data inserted");
                
        };
    });
    connection.end();
    res.sendFile(path.join(__dirname+"/login.html"));
});
app.listen(3000);


app.post("/formapplied",(req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const gender=req.body.gender;
  const age=req.body.age
  const jobID=req.body.jobID;
  const skills=req.body.skills;

  var data = {
      name:name,
      email:email,
      gender:gender,
      age:age,
      jobID:jobID,
      skills:skills,
  };
  var mysql = require("mysql");
  var connection = mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"vikram"
  });
  connection.connect();

  connection.query("INSERT INTO candidate_info SET?",data, function(err,result,fields){
      {
          if(err) throw err;
          else
              console.log("data inserted");
              return res.redirect('/formsubmitted');
              
      };
  });
  connection.end();
  
});

app.post("/loginauth",(req,res)=>{
    
    const email = req.body.email;
    const password = req.body.password;
    
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"vikram"
    });
    connection.connect();
    
    connection.query("SELECT * FROM signup WHERE email =?",email, function(err,result){
        if(err) throw err;
        else{
            if(result.length == 0)
            {
                console.log ("user not available");
                res.sendFile(path.join(__dirname+"/login.html"));
            }
            else if(result[0].password == password)
            {
                console.log("login succesfull");
                res.sendFile(path.join(__dirname+"/home.html"));
            }
            else{
                console.log("email/password error");
                res.sendFile(path.join(__dirname+"/login.html"));
            }
        }    
    });
    connection.end();
});


app.post("/adminauth",(req,res)=>{
    
  const email = req.body.email;
  const password = req.body.password;
  
  var mysql = require("mysql");
  var connection = mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database:"vikram"
  });
  connection.connect();
  
  connection.query("SELECT * FROM admin_info WHERE email =?",email, function(err,result){
      if(err) throw err;
      else{
          if(result.length == 0)
          {
              console.log ("user not available");
              res.sendFile(path.join(__dirname+"/login.html"));
          }
          else if(result[0].password == password)
          {
              console.log("login succesfull");
              return res.redirect('/admin');
          }
          else{
              console.log("email/password error");
              res.sendFile(path.join(__dirname+"/login.html"));
          }
      }    
  });
  connection.end();
});

app.get("/delete/(:ID)", function (req, res) {
    var did = req.params.ID; 
    console.log(did);
    var mysql = require("mysql"); 
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    connection.connect();
    var sql = "DELETE FROM candidate_info WHERE ID=?";
    connection.query(sql, did, function (err, result) {
      console.log("deleted record");
    });
    connection.end();
    res.redirect(req.get("referer"));
  });

app.get("/edit/(:ID)/(:s)", function (req, res) {
    var id = req.params.ID; 
    console.log(id);
    var sel = req.params.s;
    if (sel == 0) {
      sel = 1;
    } else {
      sel = 0;
    }
    var mysql = require("mysql");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "vikram",
    });
    let udata = [sel, id];
    connection.connect();
    connection.query(
        "UPDATE candidate_info SET selected=? WHERE ID=?",
        udata,
        function (err, res) {
          if (err) throw err;
          console.log("updated");
        }
      );
      connection.end();
      res.redirect(req.get("referer"));
    });
    
  
console.log("server running");
