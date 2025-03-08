const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    db.query('SELECT * FROM PersonalInformation WHERE Email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'サーバーエラー' });

      if (results.length > 0) {
        return res.status(409).json({ message: 'このメールアドレスは既に使用されています' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query('INSERT INTO PersonalInformation (Email, Password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ message: 'サーバーエラー' });

        req.session.user_id = results.insertId;
        res.status(201).json({ message: '登録に成功しました', user_id: results.insertId });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM PersonalInformation WHERE Email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'サーバーエラー' });

    if (results.length === 0 || !await bcrypt.compare(password, results[0].Password)) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが間違っています' });
    }

    const user = results[0];
    req.session.user_id = user.User_id;
    res.status(200).json({ message: 'ログイン成功', user_id: user.User_id });
  });
});

module.exports = router;
