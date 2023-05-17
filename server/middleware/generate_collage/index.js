import { createCanvas, Image } from 'canvas'
import { promises as fs } from "fs";
import getFilms from '../film_scraper/index.js'


async function download_poster(user, films) {
  const rng = Math.floor(Math.random()*(999999 - 100000) + 100000)
  const tmp_folder = `${user}${rng}_tmp`
  fs.mkdir(tmp_folder, { recursive: true })
  for (let i=0;i<films.length;i++){
    const path = `${tmp_folder}/${films[i].film_name.replace(/ /g,'_')}.png`
    const response = await fetch(films[i].poster_path);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);
  }
  return tmp_folder
}

const generateCollage = async (user,time,size,rating) => {
  let films = await getFilms(user, time)
  films = (films.length > size*size) ? films.slice(0,size*size) : films
  const width = 350
  const height = width*1.5
  const font_size = 16

  const tmp_folder = await download_poster(user, films)

  const canvas = createCanvas(width*size, height*size)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = "black"
  ctx.fillRect(0,0,width*size,height*size)
  ctx.fillStyle = "white"
  ctx.font = "30px Courier New";
  
  let idx = 0
  for (let i = 0; i < size; i++){
    for (let j = 0; j< size; j++){
      ctx.strokeStyle = 'black';
      const img = new Image()
      img.onload = () => {
        
        ctx.drawImage(img, width*j, height*i, width, height)
    
        var grd = ctx.createLinearGradient(0, height*i, 0, (height*i)+height)
    
        grd.addColorStop(0, 'rgba(0,0,0,0.65)');
        grd.addColorStop(0.25, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(width*j, height*i, width, height); 
    
    
        ctx.font = `${font_size}px Courier New`;
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        ctx.fillText(films[idx].film_name, (width*j)+5, (height*i)+font_size,width)
        ctx.fillStyle = "#00e054"
        ctx.fillText(films[idx].rating, (width*j)+5, (height*i)+font_size*2.25,width)
      }
      img.onerror = err => { throw err }
      img.src = `${tmp_folder}/${films[idx].film_name.replace(/ /g,'_')}.png`
      idx = idx + 1
    }
  }

  fs.rm(tmp_folder, {force:true, recursive: true})

  return '<img src="' + canvas.toDataURL() + '" />' 
}

export default generateCollage

