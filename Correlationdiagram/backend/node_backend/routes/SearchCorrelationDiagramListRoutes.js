const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/SearchCorrelationDiagramList', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userIdが指定されていません' });
  }

  db.query('SELECT * FROM CorrelationDiagramList WHERE User_id = ?', [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'データベースの取得に失敗しました' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '相関図が見つかりませんでした' });
    }

    res.status(200).json(results);
  });
});


module.exports = router;