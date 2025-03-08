const express = require('express');
const db = require('../db');
const router = express.Router();

module.exports = function(upload) {

  router.post('/createNode', upload.single('image'), (req, res) => {
    const { ListID, Node_Name, Node_Color, Node_Description, Node_Image } = req.body;

    if (!ListID || !Node_Name || !Node_Color) {
      return res.status(400).json({ message: '無効なリクエストです。必要なパラメータが不足しています。' });
    }


    db.query('INSERT INTO Node (ListID, Node_Name, Node_Color, Node_Description, Node_ImagePath) VALUES (?, ?, ?, ?, ?)', 
      [ListID, Node_Name, Node_Color, Node_Description, Node_Image], 
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'ノード作成に失敗しました', error: err });
        }
        res.status(201).json({ message: 'ノード作成成功', NodeID: result.insertId});
    });
  });

  router.post('/upload', upload.single('image'), (req, res) => {

    if (!req.file) {
      return res.status(400).json({ message: '画像が選択されていません' });
    }

    const imageUrl = `/upload/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });

  router.get('/getNodeList/:listId', (req, res) => {
    const { listId } = req.params;

    db.query('SELECT * FROM Node WHERE ListID = ?', [listId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'ノードリストの取得に失敗しました', error: err });
      }
      res.status(200).json(result);
    });
  });

  router.get('/getRelations/:listId', (req, res) => {
    const { listId } = req.params;

    db.query('SELECT * FROM NodeRelation WHERE ListID = ?', [listId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'ノード関係性の取得に失敗しました', error: err });
      }
      res.status(200).json(result);
    });
  });

  return router;
};

