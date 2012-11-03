var solution = [];

$(document).ready(function() {
	FillBoard();
	$("#neweasy").click(function() {
		solution = newGame(30);
	});
	$("#newhard").click(function() {
		solution = newGame(23);
	});
	$("#solve").click(function() {
		setSolution();
	});
	$("#hint").click(function() {
		giveHint();
	});
});

function changeImage (src) {
	$("#status").clearCanvas();
	$("#status").drawImage({
		source: "images/"+src,
		fromCenter: false,
		width: 200,
		height: 200
	});
}

function newGame (difficulty) {
	clearBoard();
	/* make game */
	var board = [];
	var temp = [];
	for(var i = 0; i < 9; ++i){
		board[i] = [0,0,0,0,0,0,0,0,0];
		temp[i] = [];
		for(var j = 0; j < 9; ++j){
			temp[i][j] = [1,2,3,4,5,6,7,8,9];
		}
	}
	for(var i = 0; i < 9; ++i){
		for(var j = 0; j < 9; ++j){
			var pass = true;
			if(temp[i][j].length == 0) pass = false;
			while(temp[i][j].length > 0){
				var conflict = false;
				var rand = Math.floor(temp[i][j].length*Math.random());
				var num = temp[i][j].splice(rand, 1)[0];
				for(var row = 0; row < 9; ++row){
					if(board[i][row] == num) conflict = true;
					else if(board[row][j] == num) conflict = true;
				}
				for(var boxRow = 3*(Math.floor(i/3)); 
						boxRow < 3*(Math.floor(i/3))+3; ++boxRow)
					for(var boxCol = 3*(Math.floor(j/3)); 
							boxCol < 3*(Math.floor(j/3))+3; ++boxCol)
						if(board[boxRow][boxCol] == num) conflict = true;
						
				if(!conflict) {
					board[i][j] = num;
					pass = true;
					break;
				} else {
					pass = false;
				}
			}
			if(!pass){
				temp[i][j] = [1,2,3,4,5,6,7,8,9];
				board[i][j] = 0;
				if(j > 1){
					j -= 2;
				} else {
					if(j == 1){
						i -= 1;
						j = 8;
					} else {
						j = 7;
						i -= 1;
					}
				}
			}
		}
	}
	var solTemp = [];
	for(var i = 0; i < board.length; i++){
		solTemp[i] = [];
		for(var j = 0; j < board[i].length; j++){
			solTemp[i][j] = board[i][j];
		}
	}
	
	/* Remove elements here (look up sudoku board algorithm) */
	//solTemp is the solved board solution. Make a list of all cell positions and shuffle it.
	//As long as the list is not empty, take the next position from the
	//list and remove the number from the board.
	var cellList = [];
	for(var i = 0; i < 81; i++){
		cellList[i] = i;
	}
	randomCellList = shuffleArray(cellList);
	while(randomCellList.length > difficulty ){
		boardIndex = randomCellList[0];
		boardRow = Math.floor(boardIndex/9); 
		boardCol = boardIndex - (boardRow*9);
		board[boardRow][boardCol] = 0;
		randomCellList.shift();
	}
	for(var i = 0; i < 9; ++i){
		for(var j = 0; j < 9; ++j){
			if(board[i][j] == 0) setNumber($("div[id='"+i+""+j+"']"),'');
			else setNumberFinal($("div[id='"+i+""+j+"']"),board[i][j]);
		}
	}
	changeImage();
	return solTemp;
}

function shuffleArray(array) {
	for(var i = array.length - 1; i > 0 ; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

//checks the board to find all the non-final cells
//then, randomly chooses one of them and makes it
//final with the correct value
function giveHint () {
	var spot = false;
	for(var i = 0; i < 9; ++i){
		for(var j = 0; j < 9; ++j){
			if(!$("div[id='"+i+""+j+"']").hasClass('final')) spot = true;
		}
	}
	while(spot){
		var row = Math.floor(9*Math.random());
		var col = Math.floor(9*Math.random());
		if($("div[id='"+row+""+col+"']").hasClass("final")) continue;
		setNumberFinal($("div[id='"+row+""+col+"']"),solution[row][col]);
		break;
	}

	if(!spot){
		for(var i = 0; i < 9; ++i){
			for(var j = 0; j < 9; ++j){
				$("div[id='"+i+""+j+"']").find('.selected').addClass('wrong');
			}
		}
		changeImage("cheating.png");
	}
}

function setSolution () {
	for(var i = 0; i < 9; ++i){
		for(var j = 0; j < 9; ++j){
			if(solution[i][j] == 0) setNumber($("div[id='"+i+""+j+"']"),'');
			else setNumberSolution($("div[id='"+i+""+j+"']"),solution[i][j]);
		}
	}
	changeImage("regret.jpg");
}

function clearBoard () {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			setNumber($("div[id='"+i+""+j+"']"),'');
		};
	};
}

// This Function is for setting the original board numbers
function setNumberFinal(cell /*Jquery Element for div*/, num /*Num to set */) {
	cell.find(".selected").removeClass('selected');
	cell.find(":contains('"+num+"')")
		.addClass('selected final');
	cell.addClass('final');
} 

function setNumberSolution(cell, num){
	cell.find(".selected").removeClass('selected');
	cell.find(":contains('"+num+"')")
		.addClass('selected right');
	cell.addClass('final');
}

function setNumber (cell, num) {
	cell.removeClass('final');
	cell.find(".selected").removeClass('right');
	cell.find(".selected").removeClass('wrong');
	cell.find(".selected").removeClass('final');
	if(num == ''){
		cell.find(".selected").removeClass('selected');
		cell.find("#default").addClass('selected');
	} else {
		cell.find(".selected").removeClass('selected');
		cell.find(":contains('"+num+"')")
			.addClass('selected');
	}
}

function flower() { 
	for(var i = 0; i <= 9; ++i) {
		var petal = $(document.createElement('span'))
						.html(i)
						.addClass('cell petal');
		switch(i) {
			case 0: petal.attr('id','default')
						 .addClass('selected')
						 .html('&nbsp;'); break;
			case 1: petal.attr('id','topleft'); break;
			case 2: petal.attr('id','top'); break;
			case 3: petal.attr('id','topright'); break;
			case 4: petal.attr('id','left'); break;
			case 5: petal.attr('id','center'); break;
			case 6: petal.attr('id','right'); break;
			case 7: petal.attr('id','bottomleft'); break;
			case 8: petal.attr('id','bottom'); break;
			case 9: petal.attr('id','bottomright'); break;
		}

		petal.click(function() {
				$(this).parent().find('.selected').removeClass('selected');
				$(this).addClass('selected');
				validateBoard(); 
		});

		$(this).parent().append(petal);
	}
}

function validateBoard() {
	var full = true;
	var globlWrong = false;
	for(var i = 0; i < 9; ++i) {
		for(var j = 0; j < 9; ++j) {
			var holder = $("div.select[id^='"+i+"'][id$='"+j+"']");
			var selected = holder.find(".selected");
			var val = selected.html();
			var rowCells = $("div.select[id^='"+i+"']");
			var colCells = $("div.select[id$='"+j+"']");
			var boxCells = $("div.select");
			var isWrong = false;

			rowCells.each(function(index) {
				var hereCol = $(this).attr('id').charAt(1);

				if(hereCol != j) {
					here = $(this).find('.selected');
					hereVal = here.html();
					if(hereVal=='&nbsp;') {	
						full = false;
					}
					if(hereVal!='&nbsp;' && hereVal == val) {
						selected.addClass('wrong');
						here.addClass('wrong');
						isWrong = true;
					}
				}
			});

			colCells.each(function(index) {
				var hereRow = $(this).attr('id').charAt(0);

				if(hereRow != i) {
					here = $(this).find('.selected');
					hereVal = here.html();

					if(hereVal!='&nbsp;' && hereVal == val) {
						selected.addClass('wrong');
						here.addClass('wrong');
						isWrong = true;
					}
				}
			});


			boxCells.each(function(index) {
				if($(this).hasClass("box"+(Math.floor(j/3)+Math.floor(i/3)*3))) {
					var hereCol = $(this).attr('id').charAt(1);
					var hereRow = $(this).attr('id').charAt(0);

					if(hereRow != i || hereCol != j) {
						here = $(this).find('.selected');
						hereVal = here.html();

						if(hereVal!='&nbsp;' && hereVal == val) {
							selected.addClass('wrong');
							here.addClass('wrong');
							isWrong = true;
						}
					}
				}
			});

			if(!isWrong) {
				holder.find('.wrong').removeClass('wrong');
			} else {
				globlWrong = true;
			}
		}
	}

	if(full && !globlWrong){
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				$("div[id='"+i+""+j+"']").find(".selected").addClass('right');
				$("div[id='"+i+""+j+"']").addClass('final');
			}
		}
		changeImage("winner.jpg");
	}
}

function FillBoard() {

	var box = $("#gameBox");

	var table = $(document.createElement('table'));
	
	for(var i = 0; i < 9; ++i) {
		var newRow = $(document.createElement('tr'))
							.attr('id',i)
							.attr('class','row');
		
		for(var j = 0; j < 9; ++j) {

			var cell = $(document.createElement('td'))
			var input = $(document.createElement('div'))
								.attr('id',i+''+j)
								.addClass('select box'+(Math.floor(j/3)+Math.floor(i/3)*3));
			if((j%3==0) && (j!=0)) {
				input.css('margin-left','10px');
			}
			if((i%3==0) && (i!=0)) { 
				input.css('margin-top','10px');
			}
			 
			var oneTo9 = $(document.createElement('span'))
								.attr('class','cell') 
								.css('z-index', '0')
								.html('&nbsp;');
			
			input.append(oneTo9);
			cell.append(input);
			newRow.append(cell);
		}
		
		table.append(newRow);
	}
	box.append(table);
	// Have to allow positioning
	$(".cell").each(flower);
	solution = newGame(30);
}
