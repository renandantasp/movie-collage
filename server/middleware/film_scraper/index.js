import puppeteer from "puppeteer";
import * as dotenv from 'dotenv'

const getFilms = async (user,time) => {
  dotenv.config()
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB}&query=`
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--single-process',
      '--no-zygote'
    ],
    executablePath: 
      process.env.NODE_ENV === "production" 
        ? process.env.EXECUTABLE_PATH
        : puppeteer.executablePath() 
    // headless: "new",
    // headless: false,
    // defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(`https://letterboxd.com/${user}/films/diary/`, {
    waitUntil: "domcontentloaded",
  });

  var min_date = new Date()
  min_date = min_date.setMonth(min_date.getMonth()-time)




  const films = await page.evaluate(() => {
    const entries = document.querySelectorAll(".diary-entry-row");
    const arr = Array.from(entries).map (async (entry) => {
      
      const day = entry.querySelector(".td-day a").getAttribute("href").slice(-11).substring(0,10).replace(/\//g,"-")
      var date = new Date(day)
      const film_name = entry.querySelector(".headline-3 a").innerText
      const rating = entry.querySelector(".td-rating div span").innerText
      return { film_name, rating, date:date.getTime() };
        
    })
    return Promise.all(arr)

  });
  await browser.close();
  

  const collage_films = films.filter( film => film.date > min_date).map(async (film) => {
    const inital_poster_path = "https://image.tmdb.org/t/p/original"
    const res = await fetch(`${url}${film.film_name}`)
    const poster_path = await res.json()
    return {...film, poster_path:`${inital_poster_path}${poster_path.results[0].poster_path}`}
  })
  return Promise.all(collage_films)

};

export default getFilms 
