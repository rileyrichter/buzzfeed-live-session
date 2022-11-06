const motionState = window.matchMedia("(prefers-reduced-motion: reduce)");
const questionTwo = document.querySelector("#two-wrapper");
const questionThree = document.querySelector("#three-wrapper");
const questionFour = document.querySelector("#four-wrapper");
const questionOneItems = document.querySelectorAll("#one-wrapper > ul > li");
const questionTwoItems = document.querySelectorAll("#two-wrapper > ul > li");
const questionThreeItems = document.querySelectorAll(
  "#three-wrapper > ul > li"
);
const questionFourItems = document.querySelectorAll("#four-wrapper > ul > li");

window.onload = (event) => {
  questionOneItems.forEach((item) => {
    item.addEventListener("click", toQuestionTwo);
  });
  questionTwoItems.forEach((item) => {
    item.addEventListener("click", toQuestionThree);
  });
  questionThreeItems.forEach((item) => {
    item.addEventListener("click", toQuestionFour);
  });
};

function respectMotionPreferences(e) {
  if (motionState.matches === true) {
    e.scrollIntoView({ block: "start" });
  } else {
    e.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function toQuestionTwo() {
  respectMotionPreferences(questionTwo);
}

function toQuestionThree() {
  respectMotionPreferences(questionThree);
}

function toQuestionFour() {
  respectMotionPreferences(questionFour);
}

$("#quiz-form").submit(function () {
  submitResult();
  return false;
});

function submitResult() {
  respectMotionPreferences(document.querySelector("#results"));
  fadeOut(document.querySelector("#submit"));
  fadeIn(document.querySelector(".loading-wrapper"));

  const handleError = (response) => {
    if (!response.ok) {
      throw Error(`${response.status} ${response.statusText}`);
    } else {
      return response.json();
    }
  };

  const answerOne = Number(
    document.querySelector('input[name="one"]:checked').value
  );
  const answerTwo = Number(
    document.querySelector('input[name="two"]:checked').value
  );
  const answerThree = Number(
    document.querySelector('input[name="three"]:checked').value
  );
  const answerFour = Number(
    document.querySelector('input[name="four"]:checked').value
  );

  fetch("https://bparker.autocode.dev/buzzfeed-quiz@dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      answerOne: answerOne,
      answerTwo: answerTwo,
      answerThree: answerThree,
      answerFour: answerFour,
    }),
  })
    .then(handleError)
    .then((data) => {
      document.querySelector("#resultName").innerText = data.fields.resultName;
      document.querySelector("#resultDescription").innerText =
        data.fields.resultDescription;
      document.querySelector("#resultImage").src = data.fields.resultImage;
    })
    .catch(function writeError(err) {
      console.log(err);
    })
    .finally(() => {
      fadeOut(document.querySelector(".loading-wrapper"));
      fadeIn(document.querySelector(".result-wrapper"));
      respectMotionPreferences(document.querySelector("#results"));
      document.querySelector(".result-wrapper").setAttribute("tabindex", "-1");
      document.querySelector(".result-wrapper").focus();
    });
}

function fadeOut(element) {
  element.style.transtion = "opacity 0.5s ease-in-out";
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, 700);
}

function fadeIn(element) {
  element.style.opacity = 0;
  element.style.display = "block";
  element.style.transtion = "opacity 0.5s ease-in-out";
  setTimeout(() => {
    element.style.opacity = 1;
  }, 200);
}
