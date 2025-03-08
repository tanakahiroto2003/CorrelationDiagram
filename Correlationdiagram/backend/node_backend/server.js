require('dotenv').config({ path: '../.env' });
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const SearchListRoutesconst = require('./routes/SearchCorrelationDiagramListRoutes');
const CreateCorrelationDiagramListRoutes = require('./routes/CreateCorrelationDiagramListRoutes');
const CreateNodeNodeRoutes = require('./routes/CreateNodeRoute');
const CreateNodeRelationRoutes = require('./routes/CreateRelationRoute');
const SearchCorrelationDiagramListRoutes = require('./routes/SearchCorrelationDiagramRoute');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'upload/'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
     }
}));

app.use('/api', authRoutes);
app.use('/api', SearchListRoutesconst);
app.use('/api', CreateCorrelationDiagramListRoutes);
app.use('/api', CreateNodeNodeRoutes(upload))
app.use('/api', CreateNodeRelationRoutes)
app.use('/api', SearchCorrelationDiagramListRoutes);

const PORT = process.env.BACK_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));