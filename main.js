var cayoteImg = new Image(40, 40);
var rabbitImg = new Image(40, 40);
cayoteImg.src = "resources/cayote.png";
rabbitImg.src = "resources/rabbit.png";
var canvas = document.getElementById('canvas');
var tick;
var isRunning;
var cayotes = 15;
var rabbits = 140;
var cpp = [];
var rpp = [];
var xVal = 0;
var dataLength = 1000; 

var a = 1;
var b = .03125;
var c = .16;
var d = 20;
var P = 400;
var timeInc = .005;

function start() {
  if (isRunning)
    return null;
  update();
  tick = setInterval(update, 0);
  isRunning = true;
}

function reset() {
  clearInterval(tick);
  isRunning = false;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  updateInput();
  //updateChart();
}

function resetChart(){
  chart.options.data[0].dataPoints = [];
  chart.options.data[1].dataPoints = [];
  cpp=[];
  rpp=[];
  xVal = 0;
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
  cayotes = parseInt(document.getElementById("startPopCayote").value, 10);
  rabbits = parseInt(document.getElementById("startPopRabbit").value, 10);
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

var chart = new CanvasJS.Chart("chartContainer", {
  title: {
    text: "Population"
  },
  axisY: {
    includeZero: true,
    name: "Rabbit Pop",
    minimum: 0
  },
  axisY2: {
    includeZero: true,
    name: "Cayote Pop",
    minimum: 0
  },
  axisX:{
    name: "Years"
  },
  data: [{
      type: "spline",
      dataPoints: rpp
    },
    {
      type: "spline",
      dataPoints: cpp,
      axisYType: "secondary"
    }
  ]
});

function updateChart(count) {

  count = count || 1;

  for (var j = 0; j < count; j++) {
    cpp.push({
      x: xVal,
      y: cayotes,
    });
    rpp.push({
      x: xVal,
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