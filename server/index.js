import generateCollage from "./middleware/generate_collage/index.js";
import express from "express"


const app = express()

const PORT = process.env.PORT || 4000

app.get('/', (req,res) => {
  res.send('Running puppeteer.')
})

app.get('/collage', async (req,res) => {
  const img_tag = await generateCollage(req.query.user,req.query.time,req.query.size,true)
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': img_tag.length
  });
  res.end(img_tag);

})

app.listen(PORT)