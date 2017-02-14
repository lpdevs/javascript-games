// Make variables can't be accessed from Globle scope.
(function(){
	// call when the page is already loaded
	$(document).ready(function(){
		var game = {};
		
		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextMoving = document.getElementById("movingCanvas").getContext("2d");
        game.contextStatic = document.getElementById("staticCanvas").getContext("2d");
        game.contextGrid = document.getElementById("gridCanvas").getContext("2d");
		game.contextText = document.getElementById("textCanvas").getContext("2d");
		game.contextBgPreview = document.getElementById("bgPreviewCanvas").getContext("2d");
		game.contextBrPreview = document.getElementById("brPreviewCanvas").getContext("2d");
        game.contextGrPreview = document.getElementById("gdPreviewCanvas").getContext("2d");
		game.contextScore = document.getElementById("scoreCanvas").getContext("2d");
		game.contextBgScore = document.getElementById("bgScoreCanvas").getContext("2d");
		game.contextIntro = document.getElementById("introCanvas").getContext("2d");
		
		game.KEY_LEFT = 37;
		game.KEY_UP = 38;
		game.KEY_RIGHT = 39;
		game.KEY_DOWN = 40;
		game.KEY_w = 87;
		game.KEY_a = 65;
		game.KEY_s = 83;
		game.KEY_d = 68;
		game.KEY_SPACE = 32;
        
        game.scaleX = 20;
        game.scaleY = 20;
        game.contextMoving.scale(game.scaleX, game.scaleY);
		game.contextStatic.scale(game.scaleX, game.scaleY);
		game.contextBrPreview.scale(game.scaleX, game.scaleY);
        
        game.sizeX = 320;
        game.sizeY = 540;
		game.width = game.sizeX / game.scaleX;     // 240 / 20 = 12
		game.height = game.sizeY / game.scaleY;    // 400 / 20 = 20
		
		game.sizeXPreview = 200;
		game.sizeYPreview = 200;
		game.widthPreview = game.sizeXPreview / game.scaleX;
		game.heightPreview = game.sizeYPreview / game.scaleY;
		
        game.keys = [];
        game.state = [];
		game.reachBottom = false;
		
		game.score = 0;
		game.maxScore = 10;
		game.level = 1;
		game.earnScore = false;
		game.cookieName = "highestscore";
		game.gameOver = false;
		game.pause = false;
		game.started = false;
		
		game.movingSound = new Audio("sound/moving.wav");
		game.earningSound = new Audio("sound/earning.wav");
		game.gameOverSound = new Audio("sound/gameover.wav");
		
		game.movingSound.volume = 0.5;
		
        game.count = 0;
        game.timeDrop = 12;
		
		game.idPreview = 0;
		game.colorPreview = 0;
		
        game.colors = ["#FF0000", "#00CC00", "#0099FF", "yellow", "#FF0066"];
        game.numberColors = 5;
		
		game.numberTypes = 19;
		game.matrixs = [
			// type 1
            [
			 [0, 0, 0],
			 [1, 1, 1],
             [0, 1, 0]
			],
			[
			 [0, 1, 0],
			 [1, 1, 0],
             [0, 1, 0]
			],
			[
			 [0, 1, 0],
			 [1, 1, 1],
             [0, 0, 0]
			],
			[
			 [0, 1, 0],
			 [0, 1, 1],
             [0, 1, 0]
			],
			// type 2
			[
			 [0, 0, 0],
			 [1, 1, 0],
             [0, 1, 1]
			],
			[
			 [0, 0, 1],
			 [0, 1, 1],
             [0, 1, 0]
			],
			// type 3
			[
			 [0, 0, 0],
			 [0, 1, 1],
             [1, 1, 0]
			],
			[
			 [1, 0, 0],
			 [1, 1, 0],
             [0, 1, 0]
			],
			// type 4
			[
			 [1, 0, 0],
			 [1, 0, 0],
             [1, 1, 0]
			],
			[
			 [0, 0, 0],
			 [1, 1, 1],
             [1, 0, 0]
			],
			[
			 [0, 1, 1],
			 [0, 0, 1],
             [0, 0, 1]
			],
			[
			 [0, 0, 0],
			 [0, 0, 1],
             [1, 1, 1]
			],
			// type 5
			[
			 [0, 0, 1],
			 [0, 0, 1],
             [0, 1, 1]
			],
			[
			 [0, 0, 0],
			 [1, 0, 0],
             [1, 1, 1]
			],
			[
			 [1, 1, 0],
			 [1, 0, 0],
             [1, 0, 0]
			],
			[
			 [1, 1, 1],
			 [0, 0, 1],
             [0, 0, 0]
			],
			// type 6
			[
			 [1, 1],
             [1, 1]
			],
			// type 7
			[
			 [1, 0, 0, 0],
			 [1, 0, 0, 0],
             [1, 0, 0, 0],
			 [1, 0, 0, 0],
			],
			[
			 [1, 1, 1, 1],
			 [0, 0, 0, 0],
             [0, 0, 0, 0],
			 [0, 0, 0, 0],
			]
        ];
		
		game.rowMatrix = [
						// type 1
						3,
						3,
						3,
						3,
						// type 2
						3,
						3,
						// type 3
						3,
						3,
						// type 4
						3,
						3,
						3,
						3,
						// type 5
						3,
						3,
						3,
						3,
						// type 6
						2,
						// type 7
						4,
						4
						 ];
		
		game.colMatrix = [
						// type 1
						3,
						3,
						3,
						3,
						// type 2
						3,
						3,
						// type 3
						3,
						3,
						// type 4
						3,
						3,
						3,
						3,
						// type 5
						3,
						3,
						3,
						3,
						// type 6
						2,
						// type 7
						4,
						4
						 ];
        
        game.brick = {
			id : 0,
			x : game.width / 2 - 1,
			y : -2,
			row : game.rowMatrix[0],
			col : game.colMatrix[0],
			color : 0,
			matrix : game.matrixs[0]
		};
			
		game.brickPreview = {
			id : 0,
			x : game.widthPreview / 2 - 1,
			y : -2,
			row : game.rowMatrix[0],
			col : game.colMatrix[0],
			color : 0,
			matrix : game.matrixs[0]	
		};
        
        function setBrick(brick, id, color, width, offsetY){
			brick.id = id;
            brick.row = game.rowMatrix[id];
            brick.col = game.colMatrix[id];
			brick.x = width / 2 - 1;
            brick.y = -brick.row + 1 + offsetY;
            brick.color = color;
            brick.matrix = game.matrixs[id];
        }
		
		function centerBrickPreview(){
			game.brickPreview.x = Math.floor((game.widthPreview - game.brickPreview.col) / 2);
			game.brickPreview.y = Math.floor((game.heightPreview - game.brickPreview.row) / 2);
		}
		
		function nextId(id){
			var min, max;
			if(id >= 0 && id <= 3){
				min = 0;
				max = 3;
			}
			else if(id >= 4 && id <= 5)
			{
				min = 4;
				max = 5;
			}
			else if(id >= 6 && id <= 7){
				min = 6;
				max = 7;
			}
			else if(id >= 8 && id <= 11){
				min = 8;
				max = 11;
			}
			else if(id >= 12 && id <= 15){
				min = 12;
				max = 15;
			}
			else if(id == 16){
				min = 16;
				max = 16;
			}
			else if(id >= 17 && id <= 18){
				min = 17;
				max = 18;
			}
			return (id - min + 1) % (max - min + 1) + min;
		}
		
		function rotateBrick(brick){
			var id = nextId(brick.id);
			
			brick.id = id;
			brick.row = game.rowMatrix[id];
            brick.col = game.colMatrix[id];
			brick.matrix = game.matrixs[id];
		}
		
		function checkRotate(brick){
			var id = nextId(brick.id);
			var row = game.rowMatrix[id];
			var col = game.colMatrix[id];
			var matrix = game.matrixs[id];
			
			for(y = 0; y < row; y++){
				for(x = 0; x < col; x++){
					if(matrix[y][x] !== 0){
						if(y + brick.y >= game.height) return false;
						if(x + brick.x >= game.width || x + brick.x < 0) return false;
						if(y + brick.y >= 0 && game.state[y + brick.y][x + brick.x].visible !== 0) return false;
					}
				}
			}
			return true;
		}
        
        function checkLeft(brick){
			for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(brick.matrix[y][x] !== 0){
                        var xleft = x + brick.x - 1;
                        if(xleft < 0) return false;
                        if(y + brick.y >= 0 && game.state[y + brick.y][xleft].visible !== 0) return false;
                    }
                }
            }
			return true;
        }
        
        function checkRight(brick){
			for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(brick.matrix[y][x] !== 0){
                        var xright = x + brick.x + 1;
                        if(xright >= game.width) return false;
                        if(y + brick.y >= 0 && game.state[y + brick.y][xright].visible !== 0) return false;
                    }
                }
            }
			return true;
        }
        
        function checkDown(brick){
            for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(brick.matrix[y][x] !== 0){
                        var ynext = y + brick.y + 1;
                        if(ynext >= game.height) return false;
                        if(ynext >= 0 && game.state[ynext][x + brick.x].visible !== 0) return false;
                    }
                }
            }
            return true;         
        }
		
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
            
            clearBrick(game.contextMoving, game.brick);
            if(game.keys[game.KEY_LEFT] || game.keys[game.KEY_a]){
                if(!game.pause && checkLeft(game.brick)) game.brick.x--;
            }
            else if(game.keys[game.KEY_RIGHT] || game.keys[game.KEY_d]){
                if(!game.pause && checkRight(game.brick)) game.brick.x++;
            }
            else if(game.keys[game.KEY_DOWN] || game.keys[game.KEY_s]){
                if(!game.pause && checkDown(game.brick)) game.brick.y++;
            }
            else if(game.keys[game.KEY_UP] || game.keys[game.KEY_w]){
                if(!game.pause && checkRotate(game.brick)) rotateBrick(game.brick);
            }
			else if(game.keys[game.KEY_SPACE] && !game.gameOver && game.started){
				if(!game.pause){
					game.pause = true;
					drawTextMain(game.contextText, "  Paused!",  game.sizeX / 2 - 100, game.sizeY / 2 - 100);
				}
				else{
					game.pause = false;
					game.contextText.clearRect(0, 0, game.sizeX, game.sizeY);
				}
			}
		});

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});
        
        function drawGrid(context, sizeX, sizeY){
            for(y = 0; y <= sizeY; y += game.scaleY){
                context.beginPath();
                context.strokeStyle = "#555555";
                context.moveTo(0, y);
                context.lineTo(sizeX, y);
                context.stroke();
                context.closePath();
            }
            
            for(x = 0; x <= sizeX; x += game.scaleX){
                context.beginPath();
                context.strokeStyle = "#555555";
                context.moveTo(x, 0);
                context.lineTo(x, sizeY);
                context.stroke();
                context.closePath();
            }
        }
        
        function drawBrick(context, brick){
            for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(y + brick.y >= 0 && brick.matrix[y][x] !== 0){
                        context.fillStyle = game.colors[brick.color];
                        context.fillRect(x + brick.x, y + brick.y, 1, 1);
                    }
                }
            }
        }
        
        function clearBrick(context, brick){
            for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(y + brick.y >= 0 && brick.matrix[y][x] !== 0){
                        context.clearRect(x + brick.x, y + brick.y, 1, 1);
                    }
                }
            }
        }
		
		function checkEarnScore(){
			var extraScore = 0;
			var y = game.height - 1;
			
			while(y >= 0){
				// Check each row, if every cell is filled, then erase this row
				var cnt = 0;
				for(x = 0; x < game.width; x++){
					if(game.state[y][x].visible !== 0){
						cnt++;
					}
				}
					
				if(cnt == game.width){
					for(r = y; r > 0; r--){
						for(c = 0; c < game.width; c++){
							game.state[r][c].color = game.state[r - 1][c].color;
							game.state[r][c].visible = game.state[r - 1][c].visible;
						}
					}
					
					for(c = 0; c < game.width; c++){
						game.state[0][c].visible = 0;
					}
					
					drawState(game.contextStatic);
					extraScore++;
				}
				else{
					y--;
				}
			}
			return extraScore;
		}
		
		function updateScore(extraScore){
			if(extraScore > 0){
				game.score += extraScore;
				game.earnScore = true;
				game.earningSound.play();
			}
			else{
				game.movingSound.play();
			}
		}
		
		function updateLevel(){
			if(game.score > 0 && game.score % game.maxScore === 0){
				game.level++;
				if(game.timeDrop > 3) game.timeDrop -= 3;
			}
		}
		
		function drawScore(context, score, level){
			context.clearRect(0, 0, game.sizeXPreview, game.sizeYPreview);
			
			context.fillStyle = "#ffffff";
			context.font = "24px Arial";
			context.fillText("Level : " + level, 10, 50);
			
			context.fillStyle = "#ffffff";
			context.font = "24px Arial";
			context.fillText("Score: " + score, 10, 100);
		}
		
		function drawEffect(context, width, height){
			var interval = setInterval(blinker, 50);
			var blinkNum = 5;
			var i = 1;
			var color = ["#333333", "#666666"];
			
			function blinker(){
				if(i <= blinkNum){
					context.clearRect(0, 0, width, height);
					context.fillStyle = color[i%2];
					context.fillRect(0, 0, width, height);
					i++;
				}
				else{
					context.clearRect(0, 0, width, height);
					context.fillStyle = color[0];
					context.fillRect(0, 0, width, height);
					clearInterval(interval);
				}
			}
		}
		
		function update(){
			game.count++;
            if(game.count == game.timeDrop){
                clearBrick(game.contextMoving, game.brick);
                if(checkDown(game.brick)){
                    game.brick.y++;
					game.reachBottom = false;
                }
                else{
					clearBrick(game.contextBrPreview, game.brickPreview);
                    game.gameOver = updateState(game.brick);
					updateScore(checkEarnScore());
					updateLevel();
                    setBrick(game.brick,
							 game.brickPreview.id,
							 game.brickPreview.color,
							 game.width,
							 0
							);
					setBrick(game.brickPreview,
							 Math.floor(Math.random() * game.numberTypes),
							 Math.floor(Math.random() * game.numberColors),
							 game.widthPreview,
							 5
							);
					centerBrickPreview();
					game.reachBottom = true;
                }
                game.count = 0;
            }
		}
		
		function render(){
            drawBrick(game.contextMoving, game.brick);
			if(game.reachBottom){
				drawState(game.contextStatic);
				drawBrick(game.contextBrPreview, game.brickPreview);
				if(game.earnScore){
					drawScore(game.contextScore, game.score, game.level);
					drawEffect(game.contextBackground, game.sizeX, game.sizeY);
					game.earnScore = false;
				}
			}
		}
        
        function initState(){
            for(r = 0; r < game.height; r++){
                var row = [];
                for(c = 0; c < game.width; c++){
                    row.push({
                        x : c,
                        y : r,
                        color: 0,
                        visible: 0
                        });
                }
                game.state.push(row);
            }
        }
        
        function drawState(context){
            for(y = 0; y < game.height; y++){
                for(x = 0; x < game.width; x++){
                    if(game.state[y][x].visible !== 0){
                        context.fillStyle = game.state[y][x].color;
                        context.fillRect(game.state[y][x].x, game.state[y][x].y, 1, 1);
                    }
					else {
						context.clearRect(game.state[y][x].x, game.state[y][x].y, 1, 1);
					}
                }
            }
        }
        
        function updateState(brick){
            for(y = 0; y < brick.row; y++){
                for(x = 0; x < brick.col; x++){
                    if(y + brick.y >= 0 && brick.matrix[y][x] !== 0){
                        game.state[y + brick.y][x + brick.x].visible = 1;
                        game.state[y + brick.y][x + brick.x].color = game.colors[brick.color];
                    }
					else if(y + brick.y < 0) {
						return true;
					}
                }
            }
			return false;
        }
		
		function drawIntro(context){
			context.fillStyle = "#0099FF";
			context.font = "30px Arial";
			context.fillText("How to play?", 10, 230);
			
			context.fillStyle = "#ffffff";
			context.font = "20px Arial";
			context.fillText("Left:", 10, 260);
			context.fillText("a or arrow_left", 10, 290);
			context.fillText("Right:", 10, 320);
			context.fillText("d or arrow_right", 10, 350);
			context.fillText("Down:", 10, 380);
			context.fillText("s or arrow_down", 10, 410);
			context.fillText("Rotate:", 10, 440);
			context.fillText("w or arrow_up", 10, 470);
			context.fillText("Pause:", 10, 500);
			context.fillText("space", 10, 530);
		}
		
		function init(){
            drawGrid(game.contextGrid, game.sizeX, game.sizeY);
			drawGrid(game.contextGrPreview, game.sizeXPreview, game.sizeYPreview);
			setBrick(game.brick,
					 Math.floor(Math.random() * game.numberTypes),
					 Math.floor(Math.random() * game.numberColors),
					 game.width,
					 0
					);
			setBrick(game.brickPreview,
					 game.brick.id,
				     game.brick.color,
				     game.width,
					 5
				    );
            initState();
			centerBrickPreview();
            drawBrick(game.contextBrPreview, game.brickPreview);
			drawScore(game.contextScore, game.score, game.level);
			drawIntro(game.contextIntro);
		}
        
		function drawTextMain(context, string, x, y){
			context.fillStyle = "#ffffff";
			context.font = "40px Arial";
			context.fillText(string, x, y);
		}
		
		function loop(){
			if(game.gameOver){
				game.gameOverSound.play();
				drawTextMain(game.contextText, "Game Over!", game.sizeX / 2 - 100, game.sizeY / 2 - 100);
				return;
			}
			
			requestAnimFrame(function(){
				loop();
			});
			if(!game.pause){
				update();
				render();	
			}
		}
		
		function startGame(){
			if(game.keys[game.KEY_SPACE]){
				game.started = true;
				game.contextText.clearRect(0, 0, game.sizeX, game.sizeY);
				clearBrick(game.contextBrPreview, game.brickPreview);
				setBrick(game.brickPreview,
					 Math.floor(Math.random() * game.numberTypes),
				     Math.floor(Math.random() * game.numberColors),
				     game.widthPreview,
					 5
				    );
				drawBrick(game.contextBrPreview, game.brickPreview);
				loop();
			}
			else{
				setTimeout(function(){
				game.contextText.fillStyle = "#ffffff";
				game.contextText.font = "30px Arial";
				game.contextText.fillText("Tap space to start!", game.sizeX / 2 - 120, game.sizeY / 2 - 100);
				startGame();
				}, 1);
			}
		}
		
		init();
        startGame();
	});
})();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame    	 ||
		  window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();