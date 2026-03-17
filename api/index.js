const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 用“内存”临时存数据（重启会清，但能看到数据是否收集到）
let tempData = [];

// 数据收集接口（你前端调这个地址就行）
app.post('/api/collect-stats', (req, res) => {
  try {
    // 收集前端传过来的用户数据
    const userData = {
      userId: req.body.userId || `用户_${Date.now()}`,
      访问次数: req.body.visitCount,
      总停留时间: req.body.totalStayTime,
      停留记录: req.body.stayRecords,
      上报时间: new Date().toLocaleString()
    };
    
    // 存到内存里
    tempData.push(userData);
    
    // 关键：把数据打印到 Vercel 日志里（你能在后台看到）
    console.log('✅ 收到用户数据：', JSON.stringify(userData, null, 2));
    
    // 告诉前端上报成功
    res.status(200).json({ 
      success: true, 
      message: '数据上报成功！',
      目前已收集: tempData.length + '条数据'
    });
  } catch (err) {
    console.log('❌ 报错：', err);
    res.status(500).json({ success: false, message: '上报失败' });
  }
});

// 额外加个接口：访问这个地址能看到所有收集的临时数据
app.get('/api/collect-stats', (req, res) => {
  res.status(200).json({
    所有临时数据: tempData,
    数据条数: tempData.length
  });
});

module.exports = app;
