const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 关键改动：改用内存数组存数据，不用写文件了（Vercel只读文件系统）
let userStatsDatabase = [];

// 你的数据收集接口
app.post('/api/collect-stats', (req, res) => {
  try {
    const userStats = {
      userId: req.body.userId || `user_${Date.now()}`,
      visitCount: req.body.visitCount,
      totalStayTime: req.body.totalStayTime,
      stayRecords: req.body.stayRecords,
      reportTime: new Date().toLocaleString()
    };
    
    // 直接 push 到内存数组里
    userStatsDatabase.push(userStats);
    
    // 顺便把数据打印到日志里（能在Vercel后台看到）
    console.log('已上报数据：', userStats);
    
    res.status(200).json({ 
      success: true, 
      message: '数据上报成功（内存存储）',
      当前总人数: userStatsDatabase.length
    });
  } catch (err) {
    console.error('服务器错误：', err);
    res.status(500).json({ success: false, message: '服务器挂了' });
  }
});

// 👇 必须保留这行！Vercel 需要导出 app
module.exports = app;
