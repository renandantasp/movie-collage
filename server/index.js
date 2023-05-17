import generateCollage from "./middleware/generate_collage/index.js";
import express from "express"


const app = express()

const PORT = process.env.PORT || 4000

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/', (req,res) => {
  res.send('Running puppeteer.')
})

app.get('/collage', async (req,res) => {
  typeof(req.size)
  const img_tag = await generateCollage(req.query.user,req.query.time,req.query.size,true)
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': img_tag.length
  });
  res.end(img_tag);

})

app.listen(PORT)