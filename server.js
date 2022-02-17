const express = require('express'); 
var http = require('http');
const app = express(); 
const port = process.env.PORT || 5000;
const axios = require('axios')
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "***",
    multipleStatements: true,
    database: "vladb"
});
  

app.listen(port, () => console.log(`Listening on port ${port}`)); 
app.use(express.json());
// GET route
app.get("/express_backend", (req, res) => { 
  res.send({express: 'express has been connected to react'}); 
});

app.post("/fetch_res", (req, res2) => { 
  console.log(req.body);
  console.log(req.body.link);
  console.log(req.body.keywords);
  let json_res = "{}";
  axios
  .post('http://localhost:8000/api/pyconnect/',{params:{link:req.body.link, keywords:req.body.keywords,result:{}}})
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log("****************")
    //console.log(res.data.result)
    json_res = res.data.result
    res2.send(json_res); 
    res_list = [];
    res_obj = JSON.parse(json_res);
    for (var k in res_obj){
      if(res_obj.hasOwnProperty(k)){
        for(var idx in res_obj[k]){
          if(res_obj[k].hasOwnProperty(idx)){
            res_list.push([String(res_obj[k][idx][0]),String(res_obj[k][idx][1])]);
          }
        }
      }
    }

    console.log("Connected!");
    var q = "INSERT INTO queries (link, keywords) VALUES('"+req.body.link+"','"+req.body.keywords+"'); "+
    "SELECT MAX(id) AS maxid FROM queries;";
    let res_idx = -1;
    con.query(q, function (err, result) {
      if (err) throw err;
      res_idx =result[1][0].maxid;
      console.log(res_idx);
      console.log("Insert Complete");
            q = "CREATE TABLE result"+res_idx+" (snippet MEDIUMTEXT, timeframe VARCHAR(255));";
            con.query(q, function (err, result) {
            if (err) throw err;
            console.log("Table Complete");
                    q = "INSERT INTO result"+res_idx+" (snippet, timeframe) VALUES ?";
                    con.query(q,[res_list], function (err, result) {
                      if (err) throw err;
                      console.log("Results Insertion Complete");
                    });
            });
    });

  })
  .catch(error => {
    console.error(error)
  })
});
