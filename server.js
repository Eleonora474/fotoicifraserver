require('dotenv').config()
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const { nanoid } = require('nanoid')
const multer = require('multer')
const sendOAuthMail = require('./sendOAuthMail')
const upload = multer({ dest: 'upload' })
const app = express()
app.use(express.json({ extended: false }))
app.use(cors({ origin: '*' }))
app.get('/', (req, res) => {
  res.send('API')
})

app.post('/sendmail', upload.array('images'), async (req, res) => {
  try {
    const { name, phone, text, product, client } = req.body
    const email = 'fotoicifraserver@gmail.com'
    const subject = 'Заказ'
    const html = `
      <ul>
        <li><b>Имя: </b>${name}</li>
        <li><b>Телефон: </b>${phone}</li>
        <li><b>Почта: </b>${client}</li>
        <li><b>Товар: </b>${product}</li>
        <li><b>Комментарий: </b>${text}</li>
      </ul>
      `
    const attachments = req.files.map(({ originalname, path }) => ({
      filename: originalname,
      path,
    }))

    const result = await sendOAuthMail(email, {
      from: `Клиент <${client}>`,
      to: email,
      subject,
      html,
      attachments,
    })

    attachments.forEach(({ path }) =>
      fs.unlink(path, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    )
    return res.json(result)
  } catch (e) {
    return res.json({ message: e.message })
  }
})


const port = process.env.PORT || 5000
app.listen(port)
