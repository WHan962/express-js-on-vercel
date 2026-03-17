const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 临时存储数据（Vercel 重启会清空，测试足够用）
let statsData = [];

app.post('/api/collect-stats', (req, res) => {
  try {
    const userStats = {
      userId: req.body.userId || `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      visitCount: req.body.visitCount,
      totalStayTime: req.body.totalStayTime,
      stayRecords: req.body.stayRecords,
      reportTime: new Date().toLocaleString()
    };
    statsData.push(userStats);
    res.status(200).json({ success: true, message: '数据上报成功' });
  } catch (err) {
    console.error('错误：', err);
    res.status(500).json({ success: false, message: '数据上报失败' });
  }
});

module.exports = app;
