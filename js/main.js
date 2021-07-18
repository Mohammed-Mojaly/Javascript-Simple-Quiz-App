// Select Eelemnts

let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContiner = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let startButton = document.querySelector(".start-button");
let resultsContainer = document.querySelector(".results");
let countdownElemnet = document.querySelector(".countdown");
// set options
let fileOfName = "";
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let questionsArray = [];
let qRandom;


function addItemsToArry(value) {
    for (let i = 0; i < value; i++) {
        questionsArray.push(i);
    }
}

function shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

            let qusetionsObject = JSON.parse(this.responseText);

            let qCount = qusetionsObject.length;

            // add items to arrayOfqusetions
            addItemsToArry(qCount);

            // randming array and set to qRandom
            qRandom = shuffle(questionsArray);

            // create Bullets + set count
            createBullets(qCount);

            // statrt countdown
            countDown(30, qCount);

            // add question data 
            addQuestionData(qusetionsObject[qRandom[currentIndex]], qCount);


            // click on submit
            submitButton.onclick = () => {

                // Get Right Answer
                let theRightAnswer = qusetionsObject[qRandom[currentIndex]].right_answer;

                currentIndex++;

                // check the answer
                checkAnswers(theRightAnswer, qCount);

                // remove old question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";


                addQuestionData(qusetionsObject[qRandom[currentIndex]], qCount);
                /// handle bullets class
                handleBullets();
                clearInterval(countdownInterval);
                countDown(30, qCount);
                // show result
                showResult(qCount);

            };
        }
    };

    myRequest.open("GET", `json-quizes/${fileOfName}.json`, true);
    myRequest.send();
}

function startQuiz() {
    quizArea.style.display = "none";
    bullets.style.display = "none";
    // click on startButton
    startButton.onclick = () => {



        let listQuizes = document.querySelector(".list-quizes");
        let value = listQuizes.options[listQuizes.selectedIndex].value;

        fileOfName = value;

        getQuestions();
        quizArea.style.display = "flex";
        bullets.style.display = "flex";
        submitButton.style.visibility = "visible";
        startButton.style.visibility = "hidden";

    };
}
startQuiz();

function createBullets(num) {
    countSpan.innerHTML = num;
    //Create span

    for (let i = 0; i < num; i++) {
        //create Bullet
        let theBullet = document.createElement('span');

        if (i === 0) {
            theBullet.className = 'on';
        }
        // Append Bullets Main Continer

        bulletsSpanContiner.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {

    if (currentIndex < count) {
        let qusetionTilte = document.createElement("h2");

        let questionText = document.createTextNode(obj['title']); // or obj.title

        qusetionTilte.appendChild(questionText);

        // Append H2 to The quiz Area

        quizArea.appendChild(qusetionTilte);

        // create answers

        let ulElemnt = document.createElement("ul");

        for (let i = 1; i <= 4; i++) {
            let liElemnt = document.createElement("li");
            // create main answers div
            let mainDiv = document.createElement("div");


            // add class to main div
            mainDiv.className = 'answer';

            let radioInput = document.createElement("input");

            // add type + name + Id + Data-Attribute

            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;

            radioInput.dataset.answer = obj[`answer_${i}`];

            //Create Label 

            let theLabel = document.createElement("label");

            // add afor attribute

            theLabel.htmlFor = `answer_${i}`;

            // create label text

            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // add text to Label

            theLabel.appendChild(theLabelText);

            // add input + label to main div

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            liElemnt.appendChild(mainDiv);
            ulElemnt.appendChild(liElemnt);
            // append all div to answers area

        }
        answersArea.appendChild(ulElemnt);
    }

}

function checkAnswers(rAnswer, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    console.log(`Right Answer Is: ${rAnswer}`);
    console.log(`Choosen Answer Is: ${theChoosenAnswer}`);

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletSpans);
    arrayOfSpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }

    });
}

function showResult(count) {
    let results;
    if (currentIndex === count) {

        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            results = `<span class="good">Good</span>, ${rightAnswers} From ${count} `;
        } else if (rightAnswers === count) {
            results = `<span class="perfect">Perfect</span>, All Answers is right`;
        } else {
            results = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML = results;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.background = "white";
        resultsContainer.style.marginTop = "10px";
        resultsContainer.style.textAlign = "center";
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElemnet.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}