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
  const connection = await mysql.createConnection({
    host : 'localhost',
    user : 'user1',
    database: 'receipt_analyst',
    password: 'user1',
    dateStrings: 'date' // 取得するdateのデータ型を指定できる（DBにはdatetime型で格納されている）
  });

  // 現在の時刻
  const nowDate = new Date();
  const date = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
  // const oneMonthAgo = `${nowDate.getFullYear()}-${nowDate.getMonth()==0 ? 12 : nowDate.getMonth()}-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;

  // [daily],[weekly],[monthly]
  const eachTotal = [[], [], []];
  const eachLabel = [[], [], []];

  // 1. Daily
  const dailyQuery = "select sum(total) as each_day_total, date_format(date ,'%Y-%m-%d') as day from receipt group by day";
  // 一ヶ月前
  const oneMonthAgo = new Date(nowDate.getTime());
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  // 翌日
  const tomorrow = new Date(nowDate.getTime());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [daily_rows, daily_fields] = await connection.query(dailyQuery);
  dateLoop: for (let current=oneMonthAgo; current<tomorrow; current.setDate(current.getDate() + 1)) {
    // console.log("current: " + current);
    let currentDay = `${current.getFullYear()}-${(current.getMonth()+1).toString().padStart(2, "0")}-${(current.getDate()).toString().padStart(2, "0")}`;
    for (let i=0; i<daily_rows.length; i++){
      // console.log(currentDay);
      // console.log(rows[i].day);
      if (currentDay === daily_rows[i].day) {
        console.log("Matched!" + daily_rows[i].day);
        eachTotal[0].push(Number(daily_rows[i].each_day_total));
        eachLabel[0].push(currentDay);
        continue dateLoop; // ラベル構文で指定したループ（外側）を進められる
      }
    }
    eachTotal[0].push(0);
    eachLabel[0].push(currentDay);
  }

  // 2. Weekly
  // dateをその週の月曜の日付にそろえる→date_format(SUBDATE(date, WEEKDAY(date)) ,'%Y-%m-%d')
  const weeklyQuery = "SELECT sum(total) as each_week_total, date_format(SUBDATE(date, WEEKDAY(date)) ,'%Y-%m-%d') AS week FROM receipt GROUP BY week"
  
  // 3ヶ月前の月曜日
  const mondayOfThreeMonthAgo = new Date(nowDate.getTime());
  mondayOfThreeMonthAgo.setMonth(mondayOfThreeMonthAgo.getMonth() - 3); 
  mondayOfThreeMonthAgo.setDate(mondayOfThreeMonthAgo.getDate() - mondayOfThreeMonthAgo.getDay() + 1);
  // 翌週
  const nextWeek = new Date(nowDate.getTime());
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [weekly_rows, weekly_fields] = await connection.query(weeklyQuery);
  weekLoop: for (let current=mondayOfThreeMonthAgo; current<nextWeek; current.setDate(current.getDate() + 7)) {
    console.log("current: " + current);
    let currentWeek = `${current.getFullYear()}-${(current.getMonth()+1).toString().padStart(2, "0")}-${(current.getDate()).toString().padStart(2, "0")}`;
    for (let i=0; i<weekly_rows.length; i++){
      console.log(currentWeek);
      console.log(weekly_rows[i].week);
      if (currentWeek === weekly_rows[i].week) {
        console.log("Matched!" + weekly_rows[i].week);
        eachTotal[1].push(Number(weekly_rows[i].each_week_total));
        eachLabel[1].push(currentWeek);
        continue weekLoop; // ラベル構文で指定したループ（外側）を進められる
      }
    }
    eachTotal[1].push(0);
    eachLabel[1].push(currentWeek);
  }

  // 3. Monthly
  const monthlyQuery = "select sum(total) as each_month_total, date_format(date ,'%Y-%m') as month from receipt group by month";

  // 1年前
  const firstOf1yearAgo = new Date(nowDate.getTime());
  firstOf1yearAgo.setFullYear(firstOf1yearAgo.getFullYear() - 1); 
  // firstOf1yearAgo.setDate(1);

  // 翌月
  const nextMonth = new Date(nowDate.getTime());
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const [monthly_rows, monthly_fields] = await connection.query(monthlyQuery);
  monthLoop: for (let current=firstOf1yearAgo; current<nextMonth; current.setMonth(current.getMonth() + 1)) {
    // console.log("current: " + current);
    let currentMonth = `${current.getFullYear()}-${(current.getMonth()+1).toString().padStart(2, "0")}`;
    for (let i=0; i<monthly_rows.length; i++){
      // console.log(currentDay);
      // console.log(rows[i].day);
      if (currentMonth === monthly_rows[i].month) {
        console.log("Matched!" + monthly_rows[i].month);
        eachTotal[2].push(Number(monthly_rows[i].each_month_total));
        eachLabel[2].push(currentMonth);
        continue monthLoop; // ラベル構文で指定したループ（外側）を進められる
      }
    }
    eachTotal[2].push(0);
    eachLabel[2].push(currentMonth);
  }

  console.log("eachTotal[0]: " + eachTotal[0]);
  console.log("eachTotal[1]: " + eachTotal[1]);
  console.log("eachTotal[2]: " + eachTotal[2]);


  connection.end();

  // const response = [
  //   [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100, 100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100, 100, 70, 90, 70, 85, 60, 75],
  //   [80, 120, 105, 110, 95],
  //   [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
  // ]

  const response = {eachTotal: eachTotal, eachLabel: eachLabel};
  res.send(response); // responseで返しているので、ブラウザのコンソールで確認
})

module.exports = router