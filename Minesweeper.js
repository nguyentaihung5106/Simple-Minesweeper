var board = [];
var rows = 8;
var columns = 8;

var minesCount = Math.floor(Math.random() * 11) + 6;;
var minesLocation = [];
var firstClick = true;

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function(){
    startGame();
}

function setMines(safeTile){
    /*minesLocation.push("2-2");
    minesLocation.push("2-3");
    minesLocation.push("6-7");
    minesLocation.push("4-4");
    minesLocation.push("8-7");*/

    let minesLeft = minesCount;
    while(minesLeft > 0){
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        let id = r.toString() + "-" + c.toString();

        if(id == safeTile){
            continue;
        }

        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }

}

function startGame(){
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    

    for(let r = 0; r < rows; r++){
        let row = [];
        for(let c = 0; c < columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}


function setFlag(){
    if(flagEnabled){
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else{
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}


function clickTile(){
    
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    let tile = this;
    if(firstClick){
    setMines(tile.id);
    firstClick = false;
    }
    if (flagEnabled){
        if(tile.innerText == ""){
            tile.innerText = "🚩";
        }
        else if(tile.innerText == "🚩"){
            tile.innerText = "";
        }
        return;
    }
    if(minesLocation.includes(tile.id)){
        alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}





function revealMines(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c){
    if(r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;


    let minesFound = 0;

    minesFound += checkTile(r - 1, c - 1 );//top left
    minesFound += checkTile(r - 1, c  );//top
    minesFound += checkTile(r - 1, c + 1, );//top right

    minesFound += checkTile(r, c - 1 ); //left
    minesFound += checkTile(r, c + 1 );//right

    minesFound += checkTile(r + 1, c - 1 );//bottom left
    minesFound += checkTile(r + 1, c );//bottom
    minesFound += checkTile(r + 1, c + 1 );//bottom right

    if(minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
        
    }
    else{
        checkMine(r - 1, c - 1);//top left
        checkMine(r - 1, c);//top
        checkMine(r - 1, c + 1);//top right

        checkMine(r, c - 1);//left 
        checkMine(r, c + 1);//right

        checkMine(r + 1, c - 1);//bottom left
        checkMine(r + 1, c);//bottom
        checkMine(r + 1, c + 1);//bottom right
    }
    if(tilesClicked == rows * columns - minesCount){
        document.getElementById("mines-count").innerText = "Cleared!";
        gameOver = true;
    }
}

function checkTile(r, c){
    if(r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }
    if(minesLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}