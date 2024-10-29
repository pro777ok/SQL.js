import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method, query } = req;
  const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

  // 初期化または既存データの読み込み
  let data = {};
  try {
    const rawdata = fs.readFileSync(dataFilePath);
    data = JSON.parse(rawdata);
  } catch (err) {
    console.error(err);
  }

  switch (method) {
    case 'GET':
      if (query.id) {
        const value = data[query.id];
        if (value) {
          res.status(200).json({ [query.id]: value });
        } else {
          res.status(404).json({ message: 'Data not found' });
        }
      } else {
        res.status(400).json({ message: 'Missing id parameter' });
      }
      break;
    case 'POST':
      const { id, value } = req.body;
      data[id] = value;
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Data saved successfully' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
