const classifier = ml5.imageClassifier("MobileNet", modelLoaded);
let modelHasLoaded = false;

const takePictureButton = document.getElementById("take-picture-btn");
const takeNewPictureButton = document.getElementById("take-new-picture-btn");
const classifyButton = document.getElementById("classify-btn");
const outputContainer = document.querySelector(".output");
const output = document.querySelector(".output__image");
const outputData = document.querySelector(".output__data");

function modelLoaded() {
  console.log("Model has loaded!");
  document.querySelector(".container h1").innerText =
    "Take a picture to classify";
  modelHasLoaded = true;

  takePictureButton.style.display = "block";
}

const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const snapSoundElement = document.getElementById("snapSound");
const webcam = new Webcam(
  webcamElement,
  "user",
  canvasElement,
  snapSoundElement
);

webcam
  .start()
  .then((result) => {
    console.log("webcam started");
  })
  .catch((err) => {
    console.log(err);
  });

// $("#cameraFlip").click(function () {
//   webcam.flip();
//   webcam.start();
// });

document.getElementById("cameraFlip").addEventListener("click", function () {
  webcam.flip();
  webcam.start();
});

takePictureButton.addEventListener("click", async () => {
  var picture = webcam.snap();
  webcam.stop();

  console.log("picture taken");
  console.log(picture);

  const outputImage = document.createElement("img");
  outputImage.src = picture;

  output.innerHTML = "";
  output.appendChild(outputImage);

  outputContainer.style.display = "flex";
  canvasElement.style.display = "none";
  webcamElement.style.display = "none";

  document.querySelector(".container h1").innerText =
    "Click on the image to classify";

  takePictureButton.style.display = "none";
  classifyButton.style.display = "block";
  // takeNewPictureButton.style.display = "block";
});

classifyButton.addEventListener("click", function () {
  if (modelHasLoaded) {
    classifier.classify(output.querySelector("img"), (err, results) => {
      console.log(results);
      outputData.innerHTML = "";
      for (let result of results) {
        console.log(result);
        if (result.confidence >= 0.1) {
          //0.8
          outputData.innerHTML += `<h2>${result.label}</h2>`;
          // outputData.innerHTML += `<h3>Confidence: ${result.confidence}</h3>`;
        }
        if (outputData.innerHTML === "") {
          outputData.innerHTML = `<h2>no result found</h2>`;
          // outputData.innerHTML += `<h3>Confidence: ${result.confidence}</h3>`;
        }
      }
    });
  }

  takeNewPictureButton.style.display = "block";
  classifyButton.style.display = "none";
});

takeNewPictureButton.addEventListener("click", async () => {
  webcam.start();
  outputContainer.style.display = "none";
  // canvasElement.style.display = "block";
  webcamElement.style.display = "block";

  document.querySelector(".container h1").innerText =
    "Take a picture to classify";

  outputData.innerHTML = "";

  takePictureButton.style.display = "block";
  takeNewPictureButton.style.display = "none";
});
