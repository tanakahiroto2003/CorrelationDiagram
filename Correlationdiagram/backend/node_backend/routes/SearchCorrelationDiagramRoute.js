const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/correlation/:listId', (req, res) => {
  const listId = req.params.listId;

  const nodeQuery = 'SELECT * FROM Node WHERE ListID = ?';
  db.query(nodeQuery, [listId], (err, nodes) => {
    if (err) {
      console.error('ノードデータの取得に失敗しました:', err);
      return res.status(500).json({ error: 'ノードデータの取得エラー' });
    }

    const relationQuery = 'SELECT * FROM NodeRelation WHERE ListID = ?';
    db.query(relationQuery, [listId], (err, relations) => {
      if (err) {
        console.error('関係性データの取得に失敗しました:', err);
        return res.status(500).json({ error: '関係性データの取得エラー' });
      }

      const relationLineQuery = 'SELECT * FROM NodeRelationLine WHERE ListID = ?';
      db.query(relationLineQuery, [listId], (err, relationLines) => {
        if (err) {
          console.error('関係線データの取得に失敗しました:', err);
          return res.status(500).json({ error: '関係線データの取得エラー' });
        }

        res.json({ nodes, relations, relationLines });
      });
    });
  });
});

module.exports = router;