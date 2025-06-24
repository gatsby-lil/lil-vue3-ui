const path = require('path');
const expres =  require('express');
const multer = require('multer');
const cors = require('cors');
const app = expres();
const uploadDir = path.resolve(__dirname, 'uploads');
const upload = multer({ dest: uploadDir });
app.use(cors());
app.post('/upload', upload.single('file'), (req, res) => { 
    if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  // 返回上传成功的消息
  res.send('File uploaded successfully.');
})

app.listen(3000, () => { 
  console.log('Server listening on port 3000');
})

