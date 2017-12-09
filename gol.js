var game;
var stillColors;

function setup() {
    createCanvas(400, 400);
    game = new Game();
}

function draw() {
    background(255);
    game.newGeneration();
    game.display();
}

function mousePressed() {
    game.init();
}

function Game() {
    this.cellSize = 4;
    this.columns = width/this.cellSize;
    this.rows = height/this.cellSize;

        this.board = new Array(this.columns);
        for (var i = 0; i < this.columns; i++) {
            this.board[i] = new Array(this.rows);
        }

    //creating a new Cell in each squareof the board
    this.init = function() {

        for (var i =0;i < this.columns;i++) {
            for (var j =0;j < this.rows;j++) {
                this.board[i][j] = new Cell(i*this.cellSize,j*this.cellSize,this.cellSize,0);
            }
        }
        for (var i =20;i < this.columns - 25;i++) {
            for (var j =25;j < this.rows - 25;j++) {
                this.board[i][j] = new Cell(i*this.cellSize,j*this.cellSize,this.cellSize,Math.floor(random(2)) );
            }
        }
    }
    this.init();
    

    this.newGeneration = function(){

        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.board[i][j].savePrevious();
            }
        }
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                
                var neighbors = 0;
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neighbors += this.board[(x+i+this.columns)%this.columns][(y+j+this.rows)%this.rows].previous;
                    }
                }
                neighbors -= this.board[x][y].previous;
                
                //neighborhood rules
                if (this.board[x][y].state == 1 && neighbors< 2) this.board[x][y].newState(0);//underpopulation
                else if (this.board[x][y].state == 1 && neighbors>3) this.board[x][y].newState(0);//overpopulation
                else if (this.board[x][y].state === 0 && neighbors== 3) this.board[x][y].newState(1);//reproduction
                //for identifying still lives
                else if (this.board[x][y].state === 1 && neighbors== 3) this.board[x][y].newState(1);
                else if (this.board[x][y].state === 1 && neighbors== 2) this.board[x][y].newState(1);
               
            }
        }
    }

    this.display = function() {
        for ( var i = 0; i < this.columns;i++) {
            for ( var j = 0; j < this.rows;j++) {
                this.board[i][j].display();
            }
        }
    }

}

var oldCells=[];

function Cell(x_,y_,size_,startVal){
    this.x = x_;
    this.y = y_;
    this.size = size_;
    this.initVal = startVal;
    this.age = 0;
    var h=random(360);

    this.state = this.initVal;
        this.previous = this.state;

    this.savePrevious = function(){
        this.previous = this.state;
    }

    this.newState = function(s){
        this.state = s;
            this.age+=this.state;
            if (this.state===0){
                this.age=0;
            }
    }

    this.display = function(){
        
        if (this.previous === 0 && this.state ==1) fill("black");//birth 
        else if (this.state == 1) fill("black");
        //else if (this.previous == 1 && this.state === 0) fill("pink"); //death
        else fill("pink");

        if(this.state == 1 && this.age>=15){
            colorMode(HSL);
            fill(h,50,50,1);
        }
        noStroke();
        rect(this.x,this.y,this.size,this.size);
    }
}
