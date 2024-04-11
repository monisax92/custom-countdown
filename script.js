const inputContainer = document.getElementById("input-container");
const form = document.getElementById("form");
const dateEl = document.getElementById("date-picker");
const countdownEl = document.getElementById("countdown");
const countdownTitleEl = document.getElementById("countdown-title");
const resetBtn = document.getElementById("reset-btn");
const timeEls = document.querySelectorAll("span");
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-btn");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const toSeconds = 1000;
const toMinutes = toSeconds * 60;
const toHours = toMinutes * 60;
const toDays = toHours * 24;


//Do not let choose date before today
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute('min', today);



const updateDOM = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const between = countdownValue - now;

    const days = Math.floor(between / toDays);
    const hours = Math.floor((between % toDays) / toHours);
    const minutes = Math.floor((between % toHours) / toMinutes);
    const seconds = Math.floor((between % toMinutes) / toSeconds);

    inputContainer.hidden = true;

    if(between < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      countdownTitleEl.textContent = `${countdownTitle}`;
      timeEls[0].textContent = `${days}`;
      timeEls[1].textContent = `${hours}`;
      timeEls[2].textContent = `${minutes}`;
      timeEls[3].textContent = `${seconds}`;
      
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, 1000)
}

const updateCountdown = e => {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if(countdownDate !== '') {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

const resetAll = () => {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  clearInterval(countdownActive);
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

const restoreCountdown = () => {
  const local = localStorage.getItem("countdown");
  if(local) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(local);
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

form.addEventListener("submit", updateCountdown);
resetBtn.addEventListener("click", resetAll);
completeBtn.addEventListener("click", resetAll);


//on load (check if any data from local storage)
restoreCountdown();