const timerDisplay = document.getElementById("timer");
const modeText = document.getElementById("modeText");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");

const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");

const historyList = document.getElementById("historyList");

const sessionCount = document.getElementById("sessionCount");
const focusMinutes = document.getElementById("focusMinutes");

const progressBar = document.getElementById("progressBar");

const themeBtn = document.getElementById("themeBtn");

const alarm = document.getElementById("alarm");

let focusTime = 25;
let breakTime = 5;

let secondsLeft = focusTime * 60;

let totalSeconds = focusTime * 60;

let mode = "focus";

let interval = null;

let history = [];

loadHistory();

updateDisplay();

function updateDisplay(){

    const mins =
        Math.floor(secondsLeft/60);

    const secs =
        secondsLeft % 60;

    timerDisplay.textContent =
        `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

    let progress =
        ((totalSeconds-secondsLeft)/totalSeconds)*100;

    progressBar.style.width =
        `${progress}%`;
}

function startTimer(){

    if(interval) return;

    interval =
        setInterval(() => {

            secondsLeft--;

            updateDisplay();

            if(secondsLeft <= 0){

                clearInterval(interval);

                interval = null;

                alarm.play();

                sessionFinished();

            }

        },1000);
}

function pauseTimer(){

    clearInterval(interval);

    interval = null;
}

function resumeTimer(){

    startTimer();
}

function resetTimer(){

    pauseTimer();

    secondsLeft =
        mode==="focus"
        ? focusTime*60
        : breakTime*60;

    totalSeconds =
        secondsLeft;

    updateDisplay();
}

function sessionFinished(){

    if(mode==="focus"){

        addHistory();

        mode="break";

        modeText.textContent =
            "BREAK MODE";

        document.body.className =
            "break-mode";

        secondsLeft =
            breakTime*60;

        totalSeconds =
            breakTime*60;

    }
    else{

        mode="focus";

        modeText.textContent =
            "FOCUS MODE";

        document.body.className =
            "focus-mode";

        secondsLeft =
            focusTime*60;

        totalSeconds =
            focusTime*60;
    }

    updateDisplay();

    startTimer();
}

function addHistory(){

    const item = {

        duration:focusTime,

        time:new Date()
            .toLocaleTimeString()
    };

    history.push(item);

    saveHistory();

    renderHistory();
}

function renderHistory(){

    historyList.innerHTML="";

    history.forEach(h => {

        const div =
            document.createElement("div");

        div.className =
            "history-item";

        div.innerHTML =
            `✓ ${h.duration}:00 Focus - ${h.time}`;

        historyList.appendChild(div);

    });

    sessionCount.textContent =
        history.length;

    const total =
        history.reduce(
            (sum,item)=>
            sum+item.duration,
            0
        );

    focusMinutes.textContent =
        total;
}

function saveHistory(){

    localStorage.setItem(
        "pomodoroHistory",
        JSON.stringify({

            date:
            new Date()
            .toDateString(),

            sessions:
            history

        })
    );
}

function loadHistory(){

    const data =
        JSON.parse(
            localStorage.getItem(
                "pomodoroHistory"
            )
        );

    const today =
        new Date()
        .toDateString();

    if(data && data.date===today){

        history =
            data.sessions;
    }
    else{

        localStorage.removeItem(
            "pomodoroHistory"
        );
    }

    renderHistory();
}

focusInput.addEventListener(
    "change",
    ()=>{

        focusTime =
            Number(
                focusInput.value
            );

        if(mode==="focus"){

            secondsLeft =
                focusTime*60;

            totalSeconds =
                secondsLeft;

            updateDisplay();
        }

    }
);

breakInput.addEventListener(
    "change",
    ()=>{

        breakTime =
            Number(
                breakInput.value
            );

    }
);

startBtn.addEventListener(
    "click",
    startTimer
);

pauseBtn.addEventListener(
    "click",
    pauseTimer
);

resumeBtn.addEventListener(
    "click",
    resumeTimer
);

resetBtn.addEventListener(
    "click",
    resetTimer
);

themeBtn.addEventListener(
    "click",
    ()=>{

        document
        .querySelector(".container")
        .classList
        .toggle("dark");

    }
);

document.addEventListener(
    "keydown",
    (e)=>{

        if(e.code==="Space"){

            e.preventDefault();

            if(interval)
                pauseTimer();
            else
                resumeTimer();
        }

        if(e.key==="r"){

            resetTimer();
        }

    }
);