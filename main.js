// Selectors
let homeTab = document.querySelector(".home");
let questionsTab = document.querySelector(".questions");
let resultTab = document.querySelector(".result");
let startBtn = document.querySelector(".start button");
let nameInput = document.querySelector(".start input");
let languages = document.querySelectorAll(".home .lang");
let counter = document.querySelector(".questions .counter")
let currQuestion = document.querySelector(".questions-nums .num");
let totalQuestions = document.querySelector(".questions-nums .total");
let question = document.querySelector(".questions .question");
let answers = document.querySelector(".questions .answers");
let submitBtn = document.querySelector(".container .submit");
let username = document.querySelector(".result .name");
let score = document.querySelector(".result .score");
let wrongQuestions = document.querySelector(".result .wrong");

let i = 0;
let rightAnswers = 0;
let wrongAnswers = [];
let countDown = 180;

// Function To Show Current Tab
function activeScreen(tab) {
  document.querySelectorAll(".container > div").forEach((div) => {
    div.style.display = "none";
  });
  tab.style.display = "block";
}

// Handle Start Button
startBtn.onclick = () => {
  if (nameInput.value !== "") {
    document.body.style.backgroundImage = "url(./imgs/home-bg.png)";
    activeScreen(homeTab);
  } else {
    alert("Please, Enter The Name");
  }
};
// Handle Enter Button
nameInput.onkeyup = function (e) {
  if (e.key == "Enter")
    startBtn.click();
};

// Handle Restart Button
document.querySelector(".result .restart").onclick = () => {
  location.reload()
}

function onSubmit(data) {
  // Handle Submit Button
  submitBtn.addEventListener("click", (e) => {
    // Call Check Answer Function on Submit
    let res = checkAnswer(data[i].right_answer);

    // Stop Submiting if No Answer is Selected
    if(res == false) {
      return false
    }
    
    // Condition To Increament Index To Get Next Question
    if(i < data.length - 1) {
      i++;
      handleQuestions(data);
    } else {
      // Get Result And Show Result Tab
      handleResult(data);
      activeScreen(resultTab);
    }
  });
}

// Get The Selected Language Questions
languages.forEach((lang) => {
  lang.addEventListener("click", (e) => {
    // Fetch Questions of Choosed Language 
    fetch(`./json/${lang.getAttribute("lang")}.json`)
      .then((res) => res.json())
      .then((data) => {
        // Call Get Questions And Start Count Functions
        handleQuestions(data);
        startCounter(data);

        // Call Submit Function
        onSubmit(data);

        // Show Question Tab
        activeScreen(questionsTab);
      }).catch((err) => alert("Something Went Wrong"));

      document.body.style.backgroundImage = "url(./imgs/qs-bg.png)";
  });
});

// Get Questions And Answers
function handleQuestions(arr) {
  // Get The Question, Answers and Add The To Page
  currQuestion.innerHTML = i + 1;
  totalQuestions.innerHTML = arr.length;
  question.innerHTML = arr[i].title;
  answers.innerHTML = "";
  for (let j = 1; j <= 4; j++) {
    answers.innerHTML += `
      <label class="answer" for="answer${j}">
        <input type="radio" name="answer" data-answer='${arr[i][`answer_${j}`]}' id="answer${j}">
        <label for="answer${j}">${arr[i][`answer_${j}`]}</label>
      </label>
    `;
  }
}

// Handle Time Counter
function startCounter(arr) {
  // Interval To Reduce Time Every 1 Second
  let id = setInterval(() => {
    countDown -= 1;
    let m = Math.floor(countDown / 60) ;
    let s = Math.floor((countDown % 60));
    counter.innerHTML = `${m < 10 ? `0`+m : m}:${s < 10 ? '0'+s : s}`;
    if(countDown == 0) {
      handleResult(arr);
      activeScreen(resultTab);
      clearInterval(id);
    }
    else if(countDown == 30)
      document.querySelector("#clock").play();

  }, 1000);
}


// Check Weather The Answer is Right or Not
function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("answer");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if(theChoosenAnswer == undefined) {
    alert("No Answer Selected");
    return false;
  }
  
  if (rAnswer == theChoosenAnswer) 
  rightAnswers++;
  else {
    wrongAnswers.push(question.innerHTML);
    wrongQuestions.style.display = "block";
  }

}

// Show Details And Wrong Questions Answer
function handleResult(arr) {

  // Stop Clock
  document.querySelector("#clock").pause();

  // Show Name And Score
  username.innerHTML = `Name: ${nameInput.value}`;
  score.innerHTML = `Score: ${rightAnswers}`;
  
  document.querySelector(".result .progress span").style.width = `${(rightAnswers / arr.length) * 100}%`;
  
  let level = document.querySelector(".progress-box .level");
  // Get The Level
  if(rightAnswers >= 0 && rightAnswers < arr.length/4)
  level.innerHTML = "Bad";
  else if(rightAnswers >= arr.length/4 && rightAnswers <= arr.length/2)
  level.innerHTML = "Not Bad";
  else if(rightAnswers > arr.length/2 < arr.length/4 && rightAnswers <= arr.length)
  level.innerHTML = "Good";
  
  
  let idx = 0;
  // Add The Wrong Questions To The Page
  wrongAnswers.forEach((question) => {
    arr.map((el) => {
      if(el.title == question) {
        idx++;
        wrongQuestions.innerHTML += `
          <div class="wrong-questions">
            <h1 class="question">${idx}- ${question}</h1>
            <h3 class="answer">${el.right_answer}</h3>
          </div>
        `
      }
    })
  })
}