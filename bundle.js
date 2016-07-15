/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	
	let canvasBoard = document.getElementById("canvasBoard");
	let ctx = canvasBoard.getContext("2d");
	let canvasPower = document.getElementById("canvasPower");
	let ctxPower = canvasPower.getContext("2d");
	let canvasAim = document.getElementById("canvasAim");
	let ctxAim = canvasAim.getContext("2d");
	
	let obstNotBuilt = true;
	let ballRadius = Constants.BALL_RADIUS;
	let xPos = Constants.CANVAS_WIDTH/2;
	let yPos = 15 + ballRadius;
	let yHoleStart = Constants.CANVAS_HEIGHT - (3*Constants.HOLE_RADIUS);
	let holeRadius = Constants.HOLE_RADIUS;
	let strokes = 3;
	let initialPower = 0;
	let deltX = 0;
	let deltY = 0;
	let onSwing = false;
	let mouseX, ballX, ballY, mouseY;
	let masterRadians, masterPower;
	let obstArray = [];
	let level = 1;
	window.mouseX
	window.mouseY
	
	canvasBoard.addEventListener("mousedown", (function(e) {
	    filterClick(e);
	}));
	
	window.addEventListener("mousemove", (function(e) {
	  updatePos(e);
	}));
	
	function filterClick(e) {
	  e.preventDefault();
	  if (((xPos - ballRadius) <= e.offsetX && e.offsetX <= (xPos + ballRadius)) && ((yPos - ballRadius) <= e.offsetY && e.offsetY <= (yPos + ballRadius))) {
	    // debugger//run the function to get speed and direction
	    ballX = window.mouseX;
	    ballY = window.mouseY;
	    onSwing = true;
	    swing(ballX, ballY)
	  }
	
	  console.log("miss");
	};
	
	function strikeBall(xEnd, yEnd) {
	  console.log("striking ball");
	  console.log(ballX);
	  console.log(ballY);
	  ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
	  ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
	  let xDif = (xEnd > ballX) ? (xEnd - ballX) : (ballX - xEnd);
	  let yDif = (yEnd > ballY) ? (yEnd - ballY) : (ballY - yEnd);
	  let pyth = (xDif * xDif) + (yDif * yDif);
	  let tot = Math.floor(Math.sqrt(pyth));
	
	
	  console.log(`masterPower= ${masterPower}`);
	  console.log(`masterRadians= ${Math.tan(masterRadians)}`);
	  // console.log(`yPos=${yPos}`);
	  // console.log(`yEnd=${yEnd}`);
	  // console.log(tot)
	  // console.log(xDif/yDif);
	
	  if (tot < 5) {
	    console.log("too small")
	    return;
	  } else if (tot > 150) {
	    initialPower = 150;
	    strokes --;
	  } else {
	    initialPower = tot;
	    strokes --;
	  }
	
	  deltX = (Math.cos(masterRadians));
	  deltY = (Math.sin(masterRadians));
	
	  // console.log(tot)
	}
	
	function updatePos(e) {
	  window.mouseX = e.screenX;
	  window.mouseY = e.screenY;
	}
	
	function swing(xInit, yInit) {
	
	  this.addEventListener("mouseup", (function() {
	    clearInterval(window.drawHitDetailInterval);
	    if (onSwing) {
	      strikeBall(window.mouseX, window.mouseY)
	      onSwing = false;
	    }
	    onSwing = false;
	  }));
	
	  window.drawHitDetailInterval = setInterval(function() {drawHitDetails(xInit, yInit, window.mouseX, window.mouseY)}, 5);
	};
	
	function buildObstacles (level) {
	  let i, x, y, dx, dy, distance;
	  let status = true;
	  i = 0;
	  while (i < (level + 3)) {
	    x = Math.floor(Math.random() * ((Constants.CANVAS_WIDTH - (Constants.OBS_RAD)) - (Constants.OBS_RAD)) + (Constants.OBS_RAD));
	    y = Math.floor(Math.random() * ((Constants.CANVAS_HEIGHT - 100) - 75) + 75);
	    for (let j = 0; j < obstArray.length; j++ ) {
	      status = true;
	      dx = x - obstArray[j][0];
	      dy = y - obstArray[j][1];
	      distance = Math.sqrt(dx * dx + dy * dy);
	      if (distance < (Constants.OBS_RAD * 2) + (Constants.BALL_RADIUS * 6)) {
	        status = false;
	        break;
	      }
	    }
	    if (status) {
	      obstArray.push([x, y]);
	      i++;
	    }
	
	  }
	  obstNotBuilt = false;
	}
	
	function draw() {
	  ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	  drawBall();
	  drawHole();
	  drawScore();
	  if (obstNotBuilt) {
	    buildObstacles(level);
	  }
	  drawObstacles();
	  if (initialPower > .4) {
	    xPos = xPos + (deltX * initialPower/10);
	    yPos = yPos + (deltY * initialPower/10);
	    initialPower *= .97;
	    checkStatus();
	  } else {
	    let holeX = xPos - (Constants.CANVAS_WIDTH/2);
	    let holeY = yPos - yHoleStart;
	    let distance = Math.sqrt((holeX * holeX) + (holeY * holeY));
	    if (distance < (Constants.HOLE_RADIUS - ballRadius/2)) {
	      alertWinner();
	    }
	
	    if (strokes === 0) {
	      endGame();
	    }
	  }
	
	}
	
	function drawObstacles () {
	  let x, y, i;
	  for (i = 0; i < obstArray.length; i++) {
	    x = obstArray[i][0];
	    y = obstArray[i][1];
	    ctx.beginPath();
	    ctx.arc(x, y, Constants.OBS_RAD, 0, Math.PI*2);
	    ctx.fillStyle = "red";
	    ctx.fill();
	    ctx.closePath
	  }
	}
	
	function drawBall() {
	  ctx.beginPath();
	  ctx.arc(xPos, yPos, ballRadius, 0, Math.PI*2);
	  ctx.fillStyle = "white";
	  ctx.fill();
	  ctx.closePath();
	  // setDirection();
	  // setInitialSpeed();
	};
	
	function checkStatus() {
	  if (xPos < 0) {
	    endGame();
	  }
	
	  if (xPos > Constants.CANVAS_WIDTH) {
	    endGame();
	  }
	
	  if (yPos > Constants.CANVAS_HEIGHT) {
	    endGame();
	  }
	
	  for (let i = 0; i < obstArray.length; i++ ) {
	    var circle1 = {radius: Constants.OBS_RAD, x: obstArray[i][0], y: obstArray[i][1]};
	    var circle2 = {radius: ballRadius, x: xPos, y: yPos};
	
	    var dx = circle1.x - circle2.x;
	    var dy = circle1.y - circle2.y;
	    var distance = Math.sqrt(dx * dx + dy * dy);
	
	    if (distance < circle1.radius + circle2.radius) {
	        endGame();
	    }
	  }
	
	
	
	}
	
	
	function drawScore () {
	  ctx.font = "20px Georgia";
	  ctx.fillText(`strokes: ${strokes}`, Constants.CANVAS_WIDTH - 100, 30);
	}
	
	
	function drawHole() {
	  ctx.beginPath();
	  ctx.arc(Constants.CANVAS_WIDTH/2, yHoleStart, holeRadius, 0, Math.PI*2);
	  ctx.strokeStyle = "black";
	  ctx.lineWidth = 5;
	  ctx.stroke();
	}
	
	function drawHitDetails(xPos, yPos, xEnd, yEnd) {
	  // if (xEnd === undefined || yEnd === undefined) {
	  //   xEnd = xPos;
	  //   yEnd = yPos;
	  // }
	  ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
	  ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
	  let xDif = (xEnd > xPos) ? (xEnd - xPos) : (xPos - xEnd);
	  let yDif = (yEnd > yPos) ? (yEnd - yPos) : (yPos - yEnd);
	  let pyth = (xDif * xDif) + (yDif * yDif);
	  let tot = Math.floor(Math.sqrt(pyth));
	
	  masterPower = tot;
	
	  let startRad = getRad(xPos, yPos, xEnd, yEnd);
	  // console.log(startRad);
	
	  ctxPower.beginPath();
	  ctxPower.rect(0, 0, Constants.CP_WIDTH, (tot * 2));
	  ctxPower.fillStyle = "red";
	  ctxPower.fill();
	  ctxPower.closePath();
	
	  ctxAim.beginPath();
	  ctxAim.arc((Constants.CA_WIDTH/2), (Constants.CA_HEIGHT/2), Math.floor(Constants.CA_WIDTH/3), startRad - (Constants.ARC_CONST/2), (startRad + Constants.ARC_CONST));
	  ctxAim.lineWidth = 15;
	  ctxAim.strokeStyle = "red";
	  ctxAim.stroke();
	}
	
	function getRad(xPos, yPos, xEnd, yEnd) {
	  let slope, begin;
	  let xVal = xEnd - xPos;
	  let yVal = yPos - yEnd;
	  let xDif = Math.abs(xEnd - xPos);
	  let yDif = Math.abs(yEnd - yPos);
	  let slopeConst = (yDif/(xDif + .001))
	  // console.log(slopeConst)
	  if (slopeConst <= 1) {
	    slope = (1.570796 * slopeConst) / 2;
	    begin = 0;
	  } else {
	    slope = 1.570796 - (xDif/yDif);
	    begin = 1;
	  }
	  // console.log(`slope start=${slope}`);
	
	  if ((xVal > 0) && (yVal > 0)) {
	    slope = 3.141592 - slope;
	    // console.log(`slope=${slope}`)
	    // console.log(`1`)
	  }
	  if ((xVal <= 0) && (yVal >= 0)) {
	    slope = 0 + slope;
	    // console.log(`slope=${slope}`)
	    // console.log(`2`)
	  }
	  if ((xVal <= 0) && (yVal <= 0)) {
	    slope = 6.2831853 - slope;
	    // console.log(`slope=${slope}`)
	    // console.log(`3`)
	  }
	  if ((xVal > 0) && (yVal < 0)) {
	    slope = 3.141592 + slope;
	    // console.log(`slope=${slope}`)
	    // console.log(`4`)
	  }
	  masterRadians = slope;
	  return slope
	}
	
	function alertWinner() {
	  xPos = Constants.CANVAS_WIDTH/2;
	  yPos = 15 + ballRadius;
	  obstNotBuilt = true;
	  obstArray = [];
	  strokes = 3;
	  level ++;
	  window.alert("Congrats, you won.")
	}
	
	function endGame() {
	  xPos = Constants.CANVAS_WIDTH/2;
	  yPos = 15 + ballRadius;
	  obstNotBuilt = true;
	  obstArray = [];
	  strokes = 3;
	  initialPower = 0;
	  window.alert("Sorry, try again.")
	}
	
	// (Constants.ARC_CONST)/2
	setInterval(draw, 10);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	  CANVAS_WIDTH: 600,
	  CANVAS_HEIGHT: 600,
	  BALL_RADIUS: 6,
	  HOLE_RADIUS: 16,
	  CP_WIDTH: 100,
	  CP_HEIGHT: 300,
	  CA_WIDTH: 150,
	  CA_HEIGHT: 150,
	  ARC_CONST: .5,
	  OBS_RAD: 30
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map