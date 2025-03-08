const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/checkRelationExists', (req, res) => {
  const { ListID, relations } = req.body;

  if (!ListID || !relations || relations.length === 0) {
    return res.status(400).json({ message: '無効なリクエストです。必要なパラメータが不足しています。' });
  }

  const checks = relations.map(relation => {
    const { NodeID, targetNodeID } = relation;

    return new Promise((resolve, reject) => {

      db.query(
        'SELECT * FROM NodeRelation WHERE ListID = ? AND ((NodeID = ? AND TargetNodeID = ?) OR (NodeID = ? AND TargetNodeID = ?))',
        [ListID, NodeID, targetNodeID, targetNodeID, NodeID],
        (err, result) => {
          if (err) {
            return reject({ message: 'データベースエラーが発生しました', error: err });
          }
          if (result.length > 0) {
            return reject({ message: 'この関係はすでに存在します', relation });
          }
          resolve();
        }
      );
    });
  });

  Promise.all(checks)
    .then(() => res.status(200).json({ message: '重複なし' }))
    .catch((error) => res.status(400).json(error));
});

router.post('/createNodeRelation', (req, res) => {
  const { ListID, NodeID, TargetNodeID, NodeRelation_Direction } = req.body;

  if (!ListID || !NodeID || !TargetNodeID || !NodeRelation_Direction) {
    return res.status(400).json({ message: 'リクエストに必要なパラメータが不足しています。' });
  }

  db.query(
    'SELECT * FROM NodeRelation WHERE (NodeID = ? AND TargetNodeID = ?) OR (NodeID = ? AND TargetNodeID = ?)',
    [NodeID, TargetNodeID, TargetNodeID, NodeID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '関係確認中にエラーが発生しました', error: err });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'この関係性はすでに存在します。' });
      }

      db.query(
        'INSERT INTO NodeRelation (ListID, NodeID, TargetNodeID, NodeRelation_Direction) VALUES (?, ?, ?, ?)',
        [ListID, NodeID, TargetNodeID, NodeRelation_Direction],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: '関係作成中にエラーが発生しました', error: err });
          }
          res.status(201).json({ message: '関係が正常に作成されました', NodeRelationID: result.insertId });
        }
      );
    }
  );
});

router.post('/createNodeRelationLine', (req, res) => {
  const { ListID, NodeRelationID, NodeRelationLine_Color, NodeRelationLine_Description } = req.body;

  if (!ListID || !NodeRelationID || !NodeRelationLine_Color || !NodeRelationLine_Description) {
    return res.status(400).json({ message: 'リクエストに必要なパラメータが不足しています。' });
  }
  db.query('SELECT * FROM NodeRelation WHERE NodeRelationID = ?', [NodeRelationID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '関係性の確認中にエラーが発生しました', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: '指定された関係性が存在しません。' });
    }
    db.query(
      'INSERT INTO NodeRelationLine (ListID, NodeRelationID, NodeRelationLine_Color, NodeRelationLine_Description) VALUES (?, ?, ?, ?)',
      [ListID, NodeRelationID, NodeRelationLine_Color, NodeRelationLine_Description],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '関係線作成中にエラーが発生しました', error: err });
        }
        res.status(201).json({ message: '関係線が正常に作成されました' });
      }
    );
  });
});

module.exports = router;
