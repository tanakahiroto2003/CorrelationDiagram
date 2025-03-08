const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/CreateCorrelationDiagramList', (req, res) => {
  const { listName, userId } = req.body;

  if (!listName || !userId) {
    return res.status(400).json({ message: '無効なリクエストです' });
  }

  db.query('INSERT INTO CorrelationDiagramList (ListName, User_id) VALUES (?, ?)', [listName, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '登録に失敗しました' });
    }
    res.status(201).json({ message: '相関図が作成されました', listId: results.insertId });
  });
});

router.put('/UpdateCorrelationDiagramList/:listId', (req, res) => {
  const { listId } = req.params;
  const { newListName } = req.body;

  if (!newListName) {
    return res.status(400).json({ message: '新しいリスト名が必要です' });
  }

  if (isNaN(listId) || typeof newListName !== 'string') {
    return res.status(400).json({ message: '無効なデータ型です: listIdは数値、newListNameは文字列でなければなりません' });
  }

  db.query(
    'UPDATE CorrelationDiagramList SET ListName = ? WHERE ListID = ?',
    [newListName, listId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'データベースエラー: 更新に失敗しました' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: '指定されたリストは存在しません' });
      }

      console.log(`更新成功: ${results.affectedRows} 行が更新されました`);
      res.status(200).json({ message: '相関図リスト名が更新されました' });
    }
  );
});

router.delete('/UpdateCorrelationDiagramList/:listId', (req, res) => {
  const { listId } = req.params;

  if (isNaN(listId)) {
    return res.status(400).json({ message: '無効なリストIDです' });
  }

  db.query('DELETE FROM CorrelationDiagramList WHERE ListID = ?', [listId], (err, results) => {
    if (err) {
      console.error('SQLエラー:', err);
      return res.status(500).json({ message: 'データベースエラー: 削除に失敗しました' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: '指定されたリストは存在しません' });
    }

    res.status(200).json({ message: 'リストが削除されました' });
  });
});


module.exports = router;