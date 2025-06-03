let data2 = "";
let lat = 0;
let lon = 0;
async function getWeather(country) {
  try {
    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${country}&count=1&format=json`;
    let res1 = await fetch(url);
    let data1 = await res1.json();

    if (!data1.results || data1.results.length === 0) {
      throw new Error("Location not found");
    }

    lat = data1.results[0].latitude;
    lon = data1.results[0].longitude;

    console.log(`Lat:${lat} & Lon:${lon}`);

    let url2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,is_day,rain,wind_speed_10m,precipitation,relative_humidity_2m,snowfall,weather_code,cloud_cover`;
    let res2 = await fetch(url2);
    data2 = await res2.json();
    console.log(data2);
    await getData(data2);
  } catch (err) {
    console.log("Error:", err.message);
    throw err; 
  }
}

let cloud_cover= 0;
let is_day= 0;
let rain= 0;
let snowfall= 0;
let temperature= 0;
let Date_time=0;
let wind_speed= 0;
async function getData(data) {
  cloud_cover = data.current.cloud_cover;
  is_day = data.current.is_day;
  rain = data.current.rain;
  snowfall = data.current.snowfall;
  temperature = data.current.temperature_2m;
  wind_speed = data.current.wind_speed_10m;

  if (data.current.time) {
    Date_time = new Date(data.current.time);
  } else {
    Date_time = new Date();
  }
}


//dropDown menu
const hamburger = document.getElementById("hamburger");
const dropdownMenu = document.getElementById("dmenu");
const body = document.querySelector("body");

hamburger.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

const input = document.querySelector(".form-control");
const btn = document.querySelector(".btn");
btn.addEventListener("click", async() => {
  const country = input.value;
  let errDisplay = document.querySelector(".errDisplay");
  await getWeather(country)
    .then(() => {
      errDisplay.style.display = "none";
    })
    .catch((err) => {
      errDisplay.style.display = "block";
    });
  updateWeatherUI();
})


const track = document.querySelector(".carousel_track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".btn_right");
const prevButton = document.querySelector(".btn_left");
const dotsNav = document.querySelector(".carousel_nav");
const dots = Array.from(dotsNav.children);

// Dynamically set slide width
const setSlidePosition = () => {
  const slideWidth = slides[0].getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  });
};
setSlidePosition(); 
window.addEventListener("resize", setSlidePosition); 

// Move to a target slide
const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("currentSlide");
  targetSlide.classList.add("currentSlide");
};

// Update indicators
const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove("currentSlide");
  targetDot.classList.add("currentSlide");
};

// Show/hide arrows
const updateArrows = (targetIndex) => {
  if (targetIndex === 0) {
    prevButton.style.display = "none";
    nextButton.style.display = "block";
  } else if (targetIndex === slides.length - 1) {
    nextButton.style.display = "none";
    prevButton.style.display = "block";
  } else {
    prevButton.style.display = "block";
    nextButton.style.display = "block";
  }
};

// Right button click
nextButton.addEventListener("click", () => {
  const currentSlide = track.querySelector(".currentSlide");
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav.querySelector(".currentSlide");
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides.findIndex(slide => slide === nextSlide);

  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  updateArrows(nextIndex);
});

// Left button click
prevButton.addEventListener("click", () => {
  const currentSlide = track.querySelector(".currentSlide");
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav.querySelector(".currentSlide");
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides.findIndex(slide => slide === prevSlide);

  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  updateArrows(prevIndex);
});

// Dot navigation click
dotsNav.addEventListener("click", e => {
  const targetDot = e.target.closest("button");

  if (!targetDot) return;

  const currentSlide = track.querySelector(".currentSlide");
  const currentDot = dotsNav.querySelector(".currentSlide");
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  updateArrows(targetIndex);
});

updateArrows(0); 

//Data rendering
 
let tempData = document.querySelector(".card_temp");

let cloudData = document.querySelector(".card_cloudy");

let snowData = document.querySelector(".card_snow");

let windData = document.querySelector(".card_wind");

let rainData = document.querySelector(".card_rain");

let isDayData = document.querySelector(".card_isDay");

let dateData = document.querySelector(".card_date");

function updateWeatherUI() {
  tempData.innerHTML = temperature + " °C";
  cloudData.innerHTML = cloud_cover==0? "No cloud":cloud_cover+"%";
  snowData.innerHTML = snowfall == 0 ? "No SnowFall" : snowfall + "cm";
  windData.innerHTML = wind_speed +" Km/h";
  rainData.innerHTML = rain == 0 ? "No Rain" : rain + "mm";
  isDayData.innerHTML = is_day == 1?"Day time":"Night time";
  if (Date_time instanceof Date && !isNaN(Date_time)) {
    dateData.innerHTML = Date_time.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    dateData.innerHTML = "Invalid Date";
  }
  
  
}
