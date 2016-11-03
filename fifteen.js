// JavaScript Document

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
     
      var puzzleArea = document.getElementById("puzzlearea").children;
      var tracker = 0;
      var moves = 0;
	  var attempt = 1;
	  var finished = false;
	  var start;
	  var trackTime = document.createElement("p");
	  var saveTime = document.createElement("ul");
	  $(trackTime).addClass("records");
	  $("#controls").append(trackTime);
	  $(saveTime).addClass("records");
	  $("#controls").append(saveTime);
	  document.getElementById("overall").insertAdjacentHTML('beforeend', "Moves: <span id='moves'>0</span>");
	
	
	
	
	
	   function timer() {
		var end = new Date(),
		difference = parseInt((end - start)/1000);
		trackTime.innerHTML = " Time: " + difference + " seconds";
		if(isComplete() && !finished) {
			var newTime = document.createElement("li");
			$(saveTime).append(newTime);
			newTime.innerHTML = "Time in " + difference + " seconds";
			attempt++;
			finished = true;
		}
		
	}
	  
	  
		//check if the game if complete
      function complete() {
        var check = "";
        var tiles = document.getElementById("puzzlearea").children;
        for (i = 0; i < tiles.length; i++) {
          check = check + tiles[i].innerHTML;
        };
        if (check == "123456789101112131415" && moves > 20) {
          youWon();
          return true;
        }
      }

      function youWon() {
        document.getElementById("puzzlearea").innerHTML = "<div><img onclick='location.reload();' src='youWon.jpg'/></div><br /><h1 onclick='location.reload();'>Good Job</h1>";
        document.getElementById("shufflebutton").outerHTML = "";
      }


		//use to shuffle the tiles
      function shuffle(tracker) {
        var rand = getRandomElement();
        shiftTiles.call(puzzleArea[rand]);
        if (tracker < 199) 
          { 
            tracker = tracker + 1;
            shuffle(tracker);
          }
          else {
            // reset
            tracker = 0;
            moves = 0; 
            document.getElementById("moves").innerHTML = moves;          
          }
		  start = new Date();
		  moves = 0;
		  finished = false;
      }


		//helper function
      function getRandomElement() {
        var movables = isMovable();
        return movables[Math.floor(Math.random() * movables.length)];
      }
	  
	  
	  var tilesLayout =  [[0,0,false],[100,0,false],[200,0,false],[300,0,false],
                   [0,100,false],[100,100,false],[200,100,false],[300,100,false],
                   [0,200,false],[100,200,false],[200,200,false],[300,200,false],
                   [0,300,false],[100,300,false],[200,300,false],[300,300,true]];



		//helper function for shiftTiles
      function empty_Square() {
        for (i = 0; i < tilesLayout .length; i++) {
          if (tilesLayout [i][2] == true){return i;}
        }
      }


		//function to check if tiles can be moved 
      function isMovable() {
        var open = empty_Square()
        var movables = [open-4, open-1, open+1, open+4]

        for (i = 0; i < movables.length; i++) {
          if (movables[i] < 0) {
			  movables[i] = null;
			  }            
          else if (movables[i] > 15) {
			  movables[i] = null;
			  }
          else if (open == 3 && open == 7 && open == 11 ) {
			   movables[movables.indexOf(open+1)] = null;
			    }
          else if (open == 4 && open == 8 && open == 12 ) {
			   movables[movables.indexOf(open-1)] = null;
			    }
        }
        movables = movables.filter(function(val) { return val !== null; })
        return movables;
      }
	  
	  
		//helper functions for the adding and removing of highlight
      function highlight() {
		  this.className = this.className + " movablepiece";
      }
      function unhighlight() {
		  this.className = "puzzlepiece";
      }
	  
	  
		//function to move tiles
      function shiftTiles() {
        moves = moves + 1;
        document.getElementById("moves").innerHTML = moves; 
        this.style.left = tilesLayout [empty_Square()][0]+"px";
        this.style.top = tilesLayout [empty_Square()][1]+"px";
        this.className = "puzzlepiece";

        var PuzzlePiece = Array.prototype.slice.call( puzzleArea )
        var moveEmptySquare = PuzzlePiece.indexOf(this)
        var empty_SquareIndex = PuzzlePiece.indexOf(puzzleArea[empty_Square()])
        var switchPuzzlePiece = PuzzlePiece[moveEmptySquare];
        PuzzlePiece[moveEmptySquare] = PuzzlePiece[empty_SquareIndex];
        PuzzlePiece[empty_SquareIndex] = switchPuzzlePiece;

        document.getElementById("puzzlearea").innerHTML = "";
        for (i = 0; i < PuzzlePiece.length; i++) {
          document.getElementById("puzzlearea").innerHTML = document.getElementById("puzzlearea").innerHTML + PuzzlePiece[i].outerHTML;
        }

        tilesLayout [empty_Square()][2] = false;
        tilesLayout [moveEmptySquare][2] = true;
        removeHighlight(isMovable());
        if (complete() == true) {return} 
        addHighlight(isMovable());
      }
	  
	  
		//functions to add and remove highlight based on mouse action
      function addHighlight(movables) {
        for (i = 0; i < movables.length; i++) {
          puzzleArea[movables[i]].addEventListener("mouseover", highlight, false);
          puzzleArea[movables[i]].addEventListener("mouseout", unhighlight, false);
          puzzleArea[movables[i]].addEventListener("click", shiftTiles);
        }
      }

      function removeHighlight(movables) {
        for (i = 0; i < movables.length; i++) {
          puzzleArea[movables[i]].removeEventListener("mouseover", highlight, false);
          puzzleArea[movables[i]].removeEventListener("mouseout", unhighlight, false);
          puzzleArea[movables[i]].removeEventListener("click", shiftTiles, false);
        }
      }
	  
	  
	  //generate puzzle area
	  function initializePuzzleArea() {
        var x = 0;
        var y = 0;
        for (i = 0; i < puzzleArea.length; i++) {
          puzzleArea[i].setAttribute("class", "puzzlepiece");
          puzzleArea[i].style.top = y+"px" ;
          puzzleArea[i].style.left = x+"px" ;
          puzzleArea[i].style.backgroundPosition = "-"+x+"px "+"-"+y+"px" ;
          if (x==300)
          {var y = y + 100; 
           var x = 0; }
          else{var x = x + 100;}
        }	


        document.getElementById("puzzlearea").innerHTML = document
		.getElementById("puzzlearea").innerHTML + "<div class='empty'></div>"
        addHighlight(isMovable());
      }

    document.getElementById("shufflebutton").onclick = function(){shuffle(tracker);}
    initializePuzzleArea();
	setInterval(timer, 100);
	setInterval(isComplete, 1000);
  }
}