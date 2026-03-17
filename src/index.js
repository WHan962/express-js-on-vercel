const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const STATS_FILE = path.join(__dirname, 'stats.json');

if (!fs.existsSync(STATS_FILE)) {
  fs.writeFileSync(STATS_FILE, JSON.stringify([], null, 2), 'utf8');
}

app.post('/api/collect-stats', (req, res) => {
  try {
    const userStats = {
      userId: req.body.userId || `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      visitCount: req.body.visitCount,
      totalStayTime: req.body.totalStayTime,
      stayRecords: req.body.stayRecords,
      reportTime: new Date().toLocaleString()
    };

    const existingData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    existingData.push(userStats);
    fs.writeFileSync(STATS_FILE, JSON.stringify(existingData, null, 2), 'utf8');

    res.status(200).json({ success: true, message: '数据上报成功' });
  } catch (err) {
    console.error('数据存储失败：', err);
    res.status(500).json({ success: false, message: '数据上报失败' });
  }
});

// 【唯一改动：适配Vercel】删掉原来的 app.listen，改成导出 app
module.exports = app;
