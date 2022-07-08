// index.jsに渡すミドルウェア関数（ルートハンドラー）を作成
// https://expressjs.com/ja/guide/routing.html

const express = require('express');
const { async } = require('q');
const router = express.Router();
const mysql = require('mysql2/promise');
// for parsing application/json
router.use(express.json())
// for parsing application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: true }))

// dashboardに表示するデータを取得（daily, weekly, monthly, annualの食費のそれぞれの合計）

router.use(async (req, res, next) => {

  console.log('select is working');
  // const connection = await mysql.createConnection({
  //   host : 'localhost',
  //   user : 'user1',
  //   database: 'receipt_analyst',
  //   password: 'user1'
  // });
  // connection.end();

  const response = [
    [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100, 100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100, 100, 70, 90, 70, 85, 60, 75],
    [80, 120, 105, 110, 95],
    [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
  ]
  res.send(response); // responseで返しているので、ブラウザのコンソールで確認
})

module.exports = router