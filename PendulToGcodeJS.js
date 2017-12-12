

var writeNumberOfCommands = 7000; // 10000
var gcodeWriteCounter = 0;
var startGcode = 0;
var disableFirstLines = 0;

var PauseAnimation = false;

var initAnim = true;
var arm1;

var angle=0;
var angle1 = 1;
var angle2 = 0;

var arm1mult = 1.7;
var arm2mult = 1.2;
var arm3mult = 2.7;

var oldArm3X = 0;
var oldArm3Y = 0;
var startAnimation = false;

var arm1Len =50;
var arm2Len = 50;
var arm3Len = 50;
var angleMult1, angleMult2, angleMult3;

var OriginX = 300;
var OriginY = 400;

var oldX, oldY;


function setup(){

	var myCanvas = createCanvas(600, 800);
    myCanvas.parent("preview");
   // myCanvas.class("preview");


}


function draw(){

	if(startAnimation === false){
		initAnim = true;
		background(100);
		var temp1 = parseInt(arm1Len);
		temp1 = temp1 + parseInt(OriginX);
		stroke(0,0,0);
		line(parseInt(OriginX), parseInt(OriginY),  temp1 , parseInt(OriginY)); // pendulum1 


		var temp2 = parseInt(arm2Len);
		temp2 = temp2 + temp1;
		stroke(250,0,0);
		line(temp1,parseInt(OriginY), temp2 , parseInt(OriginY)); // pendulum2

		var temp3 = parseInt(arm3Len);
		temp3 = temp3 + temp2;
		stroke(255,255,0);
		line(temp2,parseInt(OriginY), temp3 , parseInt(OriginY)); // pendulum3


		ellipse(OriginX,OriginY,10,10);

	}

	if(startAnimation === true){
		
		if(initAnim === true){
			background(100);
			initAnim = false;
		}
		//background(100);
		
		if(PauseAnimation === false){
			fill(0);
			//ellipse(300,400,10,10);
			arm1 = new arm(parseInt(OriginX), parseInt(OriginY), angle, 100);
			arm1.angle = sin(angle) * arm1mult;
			arm1.update();

			arm2 = new arm(arm1.endX, arm1.endY, angle1, 70);
			arm2.angle = sin(arm1.angle * arm2mult) + angle2
			arm2.update();

			arm3 = new arm(arm2.endX, arm2.endY, angle2, 50);
			arm3.angle = arm2.angle * arm3mult;
			arm3.update();

		//ellipse(arm3.endX, arm3.endY, 0.5, 0.5);
			angle += 0.01;
			angle1 += 0.03;
			angle2 += 0.03;

				if(disableFirstLines > 20){
					line(oldX, oldY, arm3.endX, arm3.endY);
					gcode(arm3.endX.toFixed(2), arm3.endY.toFixed(2));
				}
			oldX = arm3.endX;
			oldY = arm3.endY;
		}	


		disableFirstLines += 1 ;
	}
	

}

function gcode(x,y){
	if(startGcode === 0){
		console.log("$H");
		startGcode = 1;
		document.getElementById("textAreaGcode").append("$H");
		document.getElementById("textAreaGcode").append("\n");
	}
	if(gcodeWriteCounter < writeNumberOfCommands){
		var writeGc = "G0 "+"X" + x + " Y" + y;
		console.log("G0 "+"X" + x + " Y" + y);
		document.getElementById("textAreaGcode").append( writeGc );
		document.getElementById("textAreaGcode").append("\n");
	}

}


function arm(x, y, angle, len){
	
	
	this.endX = 0;
	this.endY = 0;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.len = len;

	this.getNewX = function(x,len,angle){
		this.endX = x + cos(angle) * this.len;
	}
	this.getNewY = function(y,len,angle){
		this.endY = y + sin(angle) * this.len;
	}

	this.makeLine = function(x,y,angle,len){
		this.getNewX(x,len,angle);
		this.getNewY(y,len,angle);
		//console.log(this.endY);
		
		//line(this.x,this.y,this.endX,this.endY); 

	}
	this.update = function(){
		
		this.makeLine(this.x, this.y, this.angle, this.len);
	}

}