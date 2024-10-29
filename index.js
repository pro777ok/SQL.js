const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// JSONデータを保存するファイル名
const dataFile = 'data/data.json';

// 初期化（ファイルが存在しない場合は空のオブジェクトを作成）
let data = {};
try {
  const rawdata = fs.readFileSync(dataFile);
  data = JSON.parse(rawdata);
} catch (err) {
  console.error(err);
  data = {};
}

// /saveエンドポイントでデータを保存
app.get('/save', (req, res) => {
  const { id, value } = req.query;

  data[id] = value;

  // JSONデータをファイルに書き込む
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.send('true');
});

// /loadエンドポイントでデータを読み込む
app.get('/load', (req, res) => {
  const { id } = req.query;
  const value = data[id];
  if (value) {
    res.json({ [id]: value });
  } else {
    res.status(404).send('Data not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
