const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { StackClient } = require('@stackso/js-core');

const app = express();
const port = 5001;

// 使用 CORS 中间件
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 初始化 StackClient
const stack = new StackClient({
  apiKey: "8c315641-681d-434a-88f8-06deac8ee38c",
  pointSystemId: "2781",
});

// 获取排行榜数据的路由
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await stack.getLeaderboard({ limit: 5 });
    res.json(leaderboard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching leaderboard data' });
  }
});

// 添加分数的路由
app.post('/api/addPoint', async (req, res) => {
  const { eventName, user, points } = req.body;
  try {
    const response = await stack.track(eventName, { points, account: user });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error adding points' });
  }
});

// 获取用户分数的路由
app.post('/api/getPoints', async (req, res) => {
  const { users } = req.body;
  try {
    const response = await stack.getPoints(users);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching points' });
  }
});

// 讀取 SSL 證書和私鑰
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// 創建 HTTPS 服務器
const httpsServer = https.createServer(credentials, app);

// 启动 HTTPS 服务器，监听所有网络接口
httpsServer.listen(port, '0.0.0.0', () => {
  console.log(`HTTPS Server is running on https://0.0.0.0:${port}`);
});
