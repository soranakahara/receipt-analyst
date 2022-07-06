// index.jsに渡すミドルウェア関数（ルートハンドラー）を作成
// https://expressjs.com/ja/guide/routing.html


const express = require('express')
const router = express.Router()

// for parsing application/json
router.use(express.json())
// for parsing application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: true }))

router.use((req, res, next) => {
  console.log('select is working');
  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host : 'localhost',
    user : 'receipt_analyst',
    database: 'receipt_analyst',
    password: 'receipt'
  });
  var ret=[];
  connection.connect();
  
  connection.query('SELECT * from detail;', function(error, results, fields){
    if (error) {
      console.log("error発生: " + error);
    } 
    var dat = [];
    for (var i = 0;i < results.length; i++) {
      dat.push({
          id: results[i].detail_id,
          receipt_id: results[i].receipt_id,
          food_name: results[i].food_name,
          user_id: results[i].user_id,
          amount: results[i].amount,
          price: results[i].price,
          subtotal: results[i].subtotal,
        });
    }
    // console.log(results);
    ret = JSON.stringify(results); // JavaScriptオブジェクトのリストをJSON文字列に
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
  connection.end();
})
module.exports = router