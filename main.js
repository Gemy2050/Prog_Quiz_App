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

// Get The Selected Language
languages.forEach((lang) => {
  lang.addEventListener("click", (e) => {
    fetch(`./json/${lang.getAttribute("lang")}.json`)
      .then((res) => res.json())
      .then((data) => {
        handleQuestions(data);
        startCounter(data);
        // Handle Submit Button
        submitBtn.addEventListener("click", (e) => {
          let res = checkAnswer(data[i].right_answer);
          if(res == undefined) {
            alert("No Answer is Selected")
            return false
          }
          
          if(i < data.length - 1) {
            i++;
            handleQuestions(data);
          } else {
            handleResult(data);
            activeScreen(resultTab);
          }
        });
        activeScreen(questionsTab);
      }).catch((err) => alert("Something Went Wrong"));

      document.body.style.backgroundImage = "url(./imgs/qs-bg.png)";
  });
});

// Get Questions And Answers
function handleQuestions(arr) {
  currQuestion.innerHTML = i + 1;
  totalQuestions.innerHTML = arr.length;
  question.innerHTML = arr[i].title;
  answers.innerHTML = "";
  for (let j = 1; j <= 4; j++) {
    answers.innerHTML += `
      <div class="answer">
        <input type="radio" name="answer" data-answer='${arr[i][`answer_${j}`]}' id="answer${j}">
        <label for="answer${j}">${arr[i][`answer_${j}`]}</label>
      </div>
    `;
  }
}

// Handle Time Counter
function startCounter(arr) {
  let id = setInterval(() => {
    countDown -= 1;
    let m = Math.floor(countDown / 60) ;
    let s = Math.floor((countDown % 60));
    counter.innerHTML = `${m < 10 ? `0`+m : m}:${s < 10 ? '0'+s : s}`
    if(countDown == 0) {
      handleResult(arr);
      activeScreen(resultTab);
      clearInterval(id);
    }
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

  if (rAnswer == theChoosenAnswer) 
    rightAnswers++;
  else {
    wrongAnswers.push(rAnswer);
    wrongQuestions.style.display = "block";
  }
    

  return theChoosenAnswer;

}

// Show Details And Wrong Questions Answer
function handleResult(arr) {
  username.innerHTML = `Name: ${nameInput.value}`;
  score.innerHTML = `Score: ${rightAnswers}`;
  let idx = 0;
  let level = document.querySelector(".progress-box .level");

  document.querySelector(".result .progress span").style.width = `${(rightAnswers / arr.length) * 100}%`;

  if(rightAnswers >= 0 && rightAnswers < arr.length/4)
    level.innerHTML = "Bad";
  else if(rightAnswers >= arr.length/4 && rightAnswers <= arr.length/2)
    level.innerHTML = "Not Bad";
  else if(rightAnswers > arr.length/2 < arr.length/4 && rightAnswers <= arr.length)
    level.innerHTML = "Good";



  wrongAnswers.forEach((answer) => {
    arr.map((el) => {
      if(el.right_answer == answer) {
        idx++;
        wrongQuestions.innerHTML += `
          <div class="wrong-questions">
            <h1 class="question">${idx}- ${el.title}</h1>
            <h3 class="answer">${answer}</h3>
          </div>
        `
      }
    })
  })
}