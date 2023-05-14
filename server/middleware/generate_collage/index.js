import { createCanvas, Image } from 'canvas'
import getFilms from '../film_scraper/index.js'

const generateCollage = async (user,time,size,rating) => {
  let films = await getFilms(user, time)
  films = (films.length > size*size) ? films.slice(0,size*size) : films
  const width = 250
  const height = width*1.5
  const font_size = 12

  const canvas = createCanvas(width*size, height*size)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = "black"
  ctx.fillRect(0,0,width*size,height*size)
  ctx.fillStyle = "white"
  ctx.font = "30px Courier New";
  
  let i = 0
  let j = 0
  films.map((film) => {
    ctx.strokeStyle = 'black';
    // const img = new Image()
    // img.onload = () => {
      // ctx.drawImage(img, width*i, height*j, width, height)
    ctx.font = `${font_size}px Courier New`;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    ctx.strokeText(film.film_name, (width*i)+5, (height*j)+font_size,width)
    ctx.fillText(film.film_name, (width*i)+5, (height*j)+font_size,width)
    ctx.fillStyle = "#00e054"
    ctx.strokeText(film.rating, (width*i)+5, (height*j)+font_size*2.25,width)
    ctx.fillText(film.rating, (width*i)+5, (height*j)+font_size*2.25,width)
    // }
    // img.onerror = err => { throw err }
    // img.src = `src/tmp/${film.film_name.replace(/ /g,'_')}.png`
    
    i = ((j+1)==3) ? i = i + 1 : i
    j = ((j+1)==3) ? j = 0 : j = j + 1
  })






  return '<img src="' + canvas.toDataURL() + '" />' 
}

export default generateCollage

