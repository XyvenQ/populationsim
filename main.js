var cayoteImg = new Image(40, 40);
var rabbitImg = new Image(40, 40);
var chart;
cayoteImg.src = "resources/cayote.png";
rabbitImg.src = "resources/rabbit.png";
var canvas = document.getElementById('canvas');
var tick;
var isRunning;
var cayotes = 0;
var rabbits = 0;
var cpp = [];
var rpp = [];
var xVal = 0;
var dataLength = 1000; 
var fps = 0;

var a = 1;
var b = .03125;
var c = .16;
var d = 20;
var P = 400;
var timeInc = .005;

newChart();

function start() {
  if (isRunning){
    alert("Simulation is already running. Reset to start a new simulation")
    return null;
  }
  update();
  tick = setInterval(update, 1000/fps);
  isRunning = true;
}

function reset() {
  clearInterval(tick);
  isRunning = false;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  updateInput();
  resetChart();
  window.requestAnimationFrame(draw);
}

function resetChart(){
  cpp=[];
  rpp=[];
  xVal = 0;
  newChart();
  updateChart();
}
function pause() {
  clearInterval(tick);
  isRunning = false;
}

function update() {
  updatePop();
  updateChart();
  if(document.getElementById("render").checked){
    window.requestAnimationFrame(draw);
  }
}

function updateInput() {
  cayotes = parseFloat(document.getElementById("startPopCayote").value, 10);
  rabbits = parseFloat(document.getElementById("startPopRabbit").value, 10);
  timeInc = parseFloat(document.getElementById("timeInc").value, 10);
  fps = parseFloat(document.getElementById("fps").value, 10);
  a = parseFloat(document.getElementById("a").value, 10);
  b = parseFloat(document.getElementById("b").value, 10);
  c = parseFloat(document.getElementById("c").value, 10);
  d = parseFloat(document.getElementById("d").value, 10);
  P = parseFloat(document.getElementById("P").value, 10);
  update(); 
}

function updatePop() {
  var dCayotePop = c*rabbits*cayotes-d*cayotes;
  var dRabbitPop = a*(rabbits*(P-rabbits)/P)-b*rabbits*cayotes;
  if(cayotes<1)
    cayotes=0;
  else  
    cayotes += dCayotePop*timeInc;
  if(rabbits<1)
    rabbits=0;
  
    rabbits += dRabbitPop*timeInc;
}

function draw() {
  var ctx = canvas.getContext('2d');
  ctx.canvas.width = canvas.clientWidth;
  ctx.canvas.height = canvas.clientWidth / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  for (let index = 0; index < Math.floor(cayotes); index++) {
    ctx.drawImage(cayoteImg, randomRange(0, ctx.canvas.width - 80), randomRange(0, ctx.canvas.height - 80), 80, 80);
  }
  for (let index = 0; index < Math.floor(rabbits); index++) {
    ctx.drawImage(rabbitImg, randomRange(0, ctx.canvas.width - 40), randomRange(0, ctx.canvas.height - 40), 40, 40);
  }
  ctx.restore();
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function newChart(){
  chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Population"
    },
    axisY: {
      includeZero: true,
      title: "Rabbit Pop",
      minimum: 0,
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    axisY2: {
      includeZero: true,
      title: "Cayote Pop",
      minimum: 0,
      titleFontColor: "#C0504E",
      lineColor: "#C0504E",
      labelFontColor: "#C0504E",
      tickColor: "#C0504E"
    },
    axisX:{
      title: "Years"
    },
    data: [{
        type: "spline",
        dataPoints: rpp,
        markerType: "none"
      },
      {
        type: "spline",
        dataPoints: cpp,
        axisYType: "secondary",
        markerType: "none"
      }
    ]
  });
}

function updateChart() {
  for (var j = 0; j < 1; j++) {
    cpp.push({
      x: xVal*timeInc,
      y: cayotes,
    });
    rpp.push({
      x: xVal*timeInc,
      y: rabbits,
    });
    xVal++;
  }
  if (rpp.length > dataLength) {
    rpp.shift();
    cpp.shift();
  }
  chart.render();
};