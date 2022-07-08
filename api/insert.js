const express = require('express');
const { async } = require('q');
const router = express.Router();
const mysql = require('mysql2/promise');
// for parsing application/json
router.use(express.json())
// for parsing application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: true }))


router.use(async (req, res, next) => {
  console.log('insert is working');
  const connection = await mysql.createConnection({
    host : 'localhost',
    user : 'user1',
    database: 'receipt_analyst',
    password: 'user1'
  });
  console.log('connection created')
  
  const user_id = req.body.user_id;

  const nowDate = new Date();
  const date = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
  // 2022-05-21 17:32:44 の形式に
  // 謎に月が0-11なので+1
  console.log("date: " + date);
  const total = req.body.total

    // receipt挿入
    const new_receipt_record = {user_id: user_id, date: date, total:total};
    const newReceipt = await connection.query('INSERT INTO receipt SET ?', new_receipt_record);
    console.log('receipt登録が完了しました');

    // receipt挿入で作成されたreceipt_idを取得
    const receipt_id = newReceipt[0].insertId;
    console.log(`今追加されたreceipt_idは${receipt_id}です`);

    // detailを繰り返しでDBに保存していく
    const details = req.body.details
    for (let i=0; i<details.length; i++) {
      let food_name = details[i].food_name
      let amount = details[i].amount
      let price = details[i].price
      let subtotal = details[i].subtotal

      // food_name挿入
      const new_food_record = {food_name: food_name, user_id: user_id};

      // すでに登録されていればIGNOREしたい
      await connection.query("INSERT IGNORE INTO food SET ?", new_food_record);
      // console.log(await connection.query("INSERT INTO food_name(food_name, user_id) VALUES(?, ?);"),[food_name, user_id]);
      console.log('food登録が完了しました');

      // detail挿入
      const new_detail_record = {receipt_id: receipt_id, food_name: food_name, user_id: user_id, amount: amount, price: price, subtotal: subtotal};
      await connection.query("INSERT INTO detail SET ?", new_detail_record);
      console.log('detail登録が完了しました');
    }
    
    // 必ずconnectionはend()する
    connection.end();
    res.send('データベースへの登録が完了しました'); // responseで返しているので、ブラウザのコンソールで確認
})

module.exports = router