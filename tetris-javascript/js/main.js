// Make variables can't be accessed from Globle scope.
(function(){
	// call when the page is already loaded
	$(document).ready(function(){
		var game = {};

		game.constants = {
			ratiohw: 1.4,	// ratiohw = height / width of main canvas
			unitX: 20,
			unitY: 20,
		}

		game.KEYCODE = {
			LEFT : 37,
			UP : 38,
			RIGHT : 39,
			DOWN : 40,
			w : 87,
			a : 65,
			s : 83,
			d : 68,
			ENTER : 13
		}

		game.numMainCanvas = 5;
		game.backgroundCanvas = document.getElementById('backgroundCanvas');
		game.movingCanvas = document.getElementById('movingCanvas');
		game.staticCanvas = document.getElementById('staticCanvas');
		game.gridCanvas = document.getElementById('gridCanvas');
		game.textCanvas = document.getElementById('textCanvas');

		game.backgroundCtx = game.backgroundCanvas.getContext('2d');
		game.movingCtx = game.movingCanvas.getContext('2d');
		game.staticCtx = game.staticCanvas.getContext('2d');
		game.gridCtx = game.gridCanvas.getContext('2d');
		game.textCtx = game.textCanvas.getContext('2d');

		game.numPrCanvas = 3;
		game.backgroundPrCanvas = document.getElementById('backgroundPrCanvas');
		game.brickPrCanvas = document.getElementById('brickPrCanvas');
		game.gridPrCanvas = document.getElementById('gridPrCanvas');

		game.backgroundPrCtx = game.backgroundPrCanvas.getContext('2d');
		game.brickPrCtx = game.brickPrCanvas.getContext('2d');
		game.gridPrCtx = game.gridPrCanvas.getContext('2d');

		game.mainCanvasProps = {
			sizeX : 0,
			sizeY : 0,
			width : 0,	// width = sizeX / unitX
			height : 0  // height = sizeY / unitY
		}

		game.previewCanvasProps = {
			sizeX : 0,
			sizeY : 0,
			width : 0,  // width = sizeX / unitX
			height : 0 // height = sizeY / unitY
		}

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
		game.numberTypes = 19;

		game.colors = ["#FF0000", "#00CC00", "#0099FF", "yellow", "#FF0066"];
    game.numberColors = 5;

		game.brick = {
			id : 0,
			x : game.mainCanvasProps.width / 2 - 1,
			y : -2,
			row : game.rowMatrix[0],
			col : game.colMatrix[0],
			color : 0,
			matrix : game.matrixs[0]
		};

		game.brickPreview = {
			id : 0,
			x : game.previewCanvasProps.width / 2 - 1,
			y : -2,
			row : game.rowMatrix[0],
			col : game.colMatrix[0],
			color : 0,
			matrix : game.matrixs[0]
		};

		game.state = [];
		game.keys = [];
		game.count = 0;
		game.timeDrop = 12;
		game.idPreview = 0;
		game.colorPreview = 0;
		game.reachBottom = false;
		game.score = 0;
		game.maxScore = 20;
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

		game.modalStartOpen = false;

		updateSize();

		$(window).resize(function(){
				updateSize();
				drawGrid(game.gridCtx, game.mainCanvasProps.sizeX, game.mainCanvasProps.sizeY);
				drawGrid(game.gridPrCtx, game.previewCanvasProps.sizeX, game.previewCanvasProps.sizeY);
		});

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
						if(y + brick.y >= game.mainCanvasProps.height) return false;
						if(x + brick.x >= game.mainCanvasProps.width || x + brick.x < 0) return false;
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
            if(xright >= game.mainCanvasProps.width) return false;
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
            if(ynext >= game.mainCanvasProps.height) return false;
            if(ynext >= 0 && game.state[ynext][x + brick.x].visible !== 0) return false;
          }
        }
			}
      return true;
    }

		$('#btn-htp').click(function(){
			if(!game.pause) pauseContinueGame();

			if(game.modalStartOpen === false){
				game.modalStartOpen = true;
				$('#modalStart').modal('show');
			}else{
				game.modalStartOpen = false;
				$('#modalStart').modal('hide');
			}
		});

		$('#modalStart').on('hidden.bs.modal', function () {
			game.modalStartOpen = false;
			$('#modalStart').modal('hide');
		});

		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;

      clearBrick(game.movingCtx, game.brick);
      if(game.keys[game.KEYCODE.LEFT] || game.keys[game.KEYCODE.a]){
				e.preventDefault();
      	if(!game.pause && checkLeft(game.brick)) game.brick.x--;
      }
      else if(game.keys[game.KEYCODE.RIGHT] || game.keys[game.KEYCODE.d]){
				e.preventDefault();
      	if(!game.pause && checkRight(game.brick)) game.brick.x++;
      }
      else if(game.keys[game.KEYCODE.DOWN] || game.keys[game.KEYCODE.s]){
				e.preventDefault();
      	if(!game.pause && checkDown(game.brick)) game.brick.y++;
      }
      else if(game.keys[game.KEYCODE.UP] || game.keys[game.KEYCODE.w]){
				e.preventDefault();
      	if(!game.pause && checkRotate(game.brick)) rotateBrick(game.brick);
      }
			else if(game.keys[game.KEYCODE.ENTER] && !game.gameOver && game.started){
				e.preventDefault();
				pauseContinueGame();
			}
		});

		function pauseContinueGame(){
			if(!game.pause){
				game.pause = true;
				drawTextMain(game.textCtx, "  Paused", 40,
										 game.mainCanvasProps.sizeX / 2 - 100,
										 game.mainCanvasProps.sizeY / 2 - 100);

				drawTextMain(game.textCtx, "Press ENTER to continue", 20,
										 game.mainCanvasProps.sizeX / 2 - 120,
										 game.mainCanvasProps.sizeY / 2 - 50);
			}
			else{
				game.pause = false;
				clearRect(game.textCtx, 0, 0,
									game.mainCanvasProps.sizeX,
									game.mainCanvasProps.sizeY);
			}
		}

		function drawTextMain(context, string, size, x, y){
			context.fillStyle = "#ffffff";
			context.font = size + "px Arial";
			context.fillText(string, x, y);
		}

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		function setBrick(brick, id, color, width, offsetY){
				brick.id = id;
				brick.row = game.rowMatrix[id];
				brick.col = game.colMatrix[id];
				brick.x = Math.floor(width / 2) - 1;
				brick.y = -brick.row + 1 + offsetY;
				brick.color = color;
				brick.matrix = game.matrixs[id];
		}

		function updateProps(canvasProps, container, canvas, numCanvas, ratiohw, margin, offset){
			canvasProps.sizeX = container.offsetWidth - offset;
			canvasProps.sizeY = canvasProps.sizeX * ratiohw;

			canvasProps.width = Math.floor(canvasProps.sizeX / game.constants.unitX);
			canvasProps.height = Math.floor(canvasProps.sizeY / game.constants.unitY);

			canvasProps.sizeX = canvasProps.width * game.constants.unitX;
			canvasProps.sizeY = canvasProps.height * game.constants.unitY;

			for(i = 0; i < numCanvas; i++) {
				canvas[i].setAttribute('width', canvasProps.sizeX);
				canvas[i].setAttribute('height', canvasProps.sizeY);
				canvas[i].style.marginLeft = margin + 'px';
			}
		}

		function updateSize(){
			// update width and height of main canvas keeping aspect ratio
			updateProps(game.mainCanvasProps,
									$('.col-main')[0],
									$('.canvas-main'),
									game.numMainCanvas,
									game.constants.ratiohw,
									0,
									0
								);

			updateProps(game.previewCanvasProps,
									$('.col-preview')[0],
									$('.canvas-preview'),
									game.numPrCanvas,
									1,
									0,
									0
								);

			// update size pannel primary
			for(i = 0; i < 2; i++){
				$('.panel-primary')[i].setAttribute('style',
																						'width:' + game.previewCanvasProps.sizeX + 'px');
			}

		  // update btn-htp
			$('#btn-htp')[0].setAttribute('style',
																		'width:' + game.previewCanvasProps.sizeX + 'px');
		}

		function drawGrid(context, sizeX, sizeY){
			context.clearRect(0, 0, sizeX, sizeY);

			for(y = 0; y <= sizeY; y += game.constants.unitY){
				context.beginPath();
				context.strokeStyle = "#555555";
				context.lineWidth = 1;
				context.moveTo(0, y);
				context.lineTo(sizeX, y);
				context.stroke();
				context.closePath();
			}

			for(x = 0; x <= sizeX; x += game.constants.unitX){
				context.beginPath();
				context.strokeStyle = "#555555";
				context.moveTo(x, 0);
				context.lineTo(x, sizeY);
				context.stroke();
				context.closePath();
			}
		}

		function initState(){
				for(r = 0; r < game.mainCanvasProps.height; r++){
						var row = [];
						for(c = 0; c < game.mainCanvasProps.width; c++){
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

		function centerBrickPreview(){
			game.brickPreview.x = Math.floor((game.previewCanvasProps.width - game.brickPreview.col) / 2);
			game.brickPreview.y = Math.floor((game.previewCanvasProps.height - game.brickPreview.row) / 2);
		}

		function drawBrick(context, brick){
				for(y = 0; y < brick.row; y++){
						for(x = 0; x < brick.col; x++){
								if(y + brick.y >= 0 && brick.matrix[y][x] !== 0){
										drawRect(context, game.colors[brick.color], x + brick.x, y + brick.y, 1, 1);
								}
						}
				}
		}

		function clearBrick(context, brick){
				for(y = 0; y < brick.row; y++){
						for(x = 0; x < brick.col; x++){
								if(y + brick.y >= 0 && brick.matrix[y][x] !== 0){
										clearRect(context, x + brick.x, y + brick.y, 1, 1);
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

		function drawRect(context, color, x, y, width, height){
			context.fillStyle = color;
			context.fillRect( x * game.constants.unitX,
				 								y * game.constants.unitY,
												width * game.constants.unitX,
												height * game.constants.unitY
											);
		}

		function clearRect(context, x, y, width, height){
			context.clearRect( x * game.constants.unitX,
				 								 y * game.constants.unitY,
												 width * game.constants.unitX,
												 height * game.constants.unitY
											 );
		}

		function drawState(context){
			for(y = 0; y < game.mainCanvasProps.height; y++){
				for(x = 0; x < game.mainCanvasProps.width; x++){
					if(game.state[y][x].visible !== 0){
						drawRect(context, game.state[y][x].color, game.state[y][x].x, game.state[y][x].y, 1, 1);
					}
					else {
						clearRect(context, game.state[y][x].x, game.state[y][x].y, 1, 1);
					}
				}
			}
		}

		function drawScore(score, level){
				$('#score').text(score * 100);
				$('#level').text(level);
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

		function checkEarnScore(){
			var extraScore = 0;
			var y = game.mainCanvasProps.height - 1;

			while(y >= 0){
				// Check each row, if every cell is filled, then erase this row
				var cnt = 0;
				for(x = 0; x < game.mainCanvasProps.width; x++){
					if(game.state[y][x].visible !== 0){
						cnt++;
					}
				}

				if(cnt == game.mainCanvasProps.width){
					for(r = y; r > 0; r--){
						for(c = 0; c < game.mainCanvasProps.width; c++){
							game.state[r][c].color = game.state[r - 1][c].color;
							game.state[r][c].visible = game.state[r - 1][c].visible;
						}
					}

					for(c = 0; c < game.mainCanvasProps.width; c++){
						game.state[0][c].visible = 0;
					}

					drawState(game.staticCtx);
					extraScore++;
				}
				else{
					y--;
				}
			}
			return extraScore;
		}

		function updateLevel(){
			if(game.score > 0 && game.score % game.maxScore === 0){
				game.level++;
				if(game.timeDrop > 2) game.timeDrop -= 2;
			}
		}

		function drawEffect(context, width, height){
			var interval = setInterval(blinker, 50);
			var blinkNum = 5;
			var i = 1;
			var color = ["#333333", "#666666"];

			function blinker(){
				if(i <= blinkNum){
					context.clearRect(0, 0, width, height);
					drawRect(context, color[i%2], 0, 0, width, height);
					i++;
				}
				else{
					context.clearRect(0, 0, width, height);
					drawRect(context, color[0], 0, 0, width, height);
					clearInterval(interval);
				}
			}
		}

		function init(){
      drawGrid(game.gridCtx, game.mainCanvasProps.sizeX, game.mainCanvasProps.sizeY);
			drawGrid(game.gridPrCtx, game.previewCanvasProps.sizeX, game.previewCanvasProps.sizeY);
			setBrick(game.brick,
							 Math.floor(Math.random() * game.numberTypes),
							 Math.floor(Math.random() * game.numberColors),
							 game.mainCanvasProps.width,
							 0
							);
			setBrick(game.brickPreview,
						 	 game.brick.id,
					     game.brick.color,
					     game.previewCanvasProps.width,
					 	 	 5
				       );
      initState();
			centerBrickPreview();

      drawBrick(game.brickPrCtx, game.brickPreview);
			drawScore(game.score, game.level);
		}

		function update(){
			game.count++;
      if(game.count == game.timeDrop){
      	clearBrick(game.movingCtx, game.brick);

        if(checkDown(game.brick)){
        	game.brick.y++;
					game.reachBottom = false;
      	}else{
					clearBrick(game.brickPrCtx, game.brickPreview);
	        game.gameOver = updateState(game.brick);
					var extraScore = checkEarnScore();
					updateScore(extraScore);
					if(extraScore > 0) updateLevel();
	        setBrick(	game.brick,
										game.brickPreview.id,
										game.brickPreview.color,
										game.mainCanvasProps.width,
										0
									);
					setBrick(	game.brickPreview,
										Math.floor(Math.random() * game.numberTypes),
										Math.floor(Math.random() * game.numberColors),
										game.previewCanvasProps.width,
										5
									);
					centerBrickPreview();
					game.reachBottom = true;
    		}
      	game.count = 0;
      }
		}

		function render(){
    	drawBrick(game.movingCtx, game.brick);
			if(game.reachBottom){
				drawState(game.staticCtx);
				drawBrick(game.brickPrCtx, game.brickPreview);
				if(game.earnScore){
					drawScore(game.score, game.level);
					drawEffect(game.backgroundCtx, game.mainCanvasProps.sizeX, game.mainCanvasProps.sizeY);
					game.earnScore = false;
				}
			}
		}

		function loop(){
			if(game.gameOver){
				game.gameOverSound.play();
				drawTextMain(game.textCtx, "  Game Over!", 40,
										 game.mainCanvasProps.sizeX / 2 - 120,
										 game.mainCanvasProps.sizeY / 2 - 100);
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
			if(game.keys[game.KEYCODE.ENTER]){
				game.started = true;
				clearBrick(game.brickPrCtx, game.brickPreview);
				setBrick(	game.brickPreview,
					 				Math.floor(Math.random() * game.numberTypes),
				     			Math.floor(Math.random() * game.numberColors),
				     			game.previewCanvasProps.width,
					 				5
				    		);
				centerBrickPreview();
				drawBrick(game.brickPrCtx, game.brickPreview);
				loop();
			}
			else if(game.started === false){
				setTimeout(function(){
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
