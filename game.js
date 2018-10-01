const Block = require("./block");
const Background = require("./background");

class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.canvas.width= 1500;
    this.canvas.height= 1000;
    this.initialBlockHeight = 75;
    this.initialBlockWidth = 400;
    this.swingSpeed = 2.2;
    let baseColorValue = Math.floor(Math.random() * 361);
    const bl = new Block (
      {x: this.canvas.width/2-this.initialBlockWidth/2, y: canvas.height - this.initialBlockHeight, width: this.initialBlockWidth, height: this.initialBlockHeight, color:"hsla(" + `${baseColorValue}` +", 73%, 50%, 1)", dx: 0, dy: 0 }
    );
    const sw = new Block (
      {x: this.canvas.width/2-this.initialBlockWidth/2, y: 222, width: this.initialBlockWidth, height: this.initialBlockHeight, color:"hsla(" + `${baseColorValue + 4}` +", 73%, 50%, 1)", dx: this.swingSpeed, dy: 0 }
    );
    this.background = new Background ({x:0 ,y:-(7725-(this.canvas.height)) , width: 4700,height: 7715});
    this.baseBlocks = [bl];
    this.swingingBlock = sw;
    this.endScrollDone = false;
    this.drop = false;
    this.collision = false;
    this.score = 0;
    this.gameOver = false;
    this.ctx = ctx;
    this.addSwingingBlock = this.addSwingingBlock.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.collisionCheck = this.collisionCheck.bind(this);
    this.gameOverCheck = this.gameOverCheck.bind(this);
    this.gameOverResize = this.gameOverResize.bind(this);
  }

  addSwingingBlock() {
    let newColor = this.swingingBlock.incrementColor();
    let lastWidth = this.swingingBlock.width
    this.baseBlocks.push(this.swingingBlock);
    this.swingingBlock = new Block({
      x: this.canvas.width/2-lastWidth/2,
      y: 222,
      width: lastWidth,
      height: this.initialBlockHeight,
      color: "hsla(" + `${newColor}` + ", 73%, 50%, 1)",
      dx: this.swingSpeed,
      dy: 0
    });
  }

  keyDownHandler(e){
    if (e.keyCode === 32) {
      this.drop = true;
    }
  }

  collisionCheck(){
    if ((this.swingingBlock.x < this.baseBlocks[this.baseBlocks.length - 1].x + this.baseBlocks[this.baseBlocks.length - 1].width &&
   this.swingingBlock.x + this.swingingBlock.width > this.baseBlocks[this.baseBlocks.length - 1].x &&
   this.swingingBlock.y < this.baseBlocks[this.baseBlocks.length - 1].y + this.baseBlocks[this.baseBlocks.length - 1].height &&
   this.swingingBlock.y + this.swingingBlock.height > this.baseBlocks[this.baseBlocks.length - 1].y)) {
      this.collision = true;
    }
  }

  gameOverCheck(){
    let bottom = this.swingingBlock.y + this.swingingBlock.height;
    let top = this.baseBlocks[this.baseBlocks.length - 1].y + 3;
    if (bottom > top) {
      this.gameOver = true;
    }
  }


  gameOverResize(){

    this.baseBlocks.forEach((bl,idx)=>{
      bl.y -= 4;
    });
    this.background.y -= 4;

  }

  draw(myVar){
    this.gameOverCheck();
    if (this.gameOver) {
      this.swingingBlock.color = "hsla(0, 0%, 0%, 0)";

        if (this.background.y > -6725 && this.endScrollDone === false) {
          this.gameOverResize();
        }

        else {
            this.endScrollDone = true;
            if (this.canvas.height < this.score * this.initialBlockHeight *1.22) {
              this.canvas.height += 2;
              this.canvas.width += 3;
              this.background.y += 2;
              this.baseBlocks.forEach((bl,idx)=>{
                bl.y += 2;
              });
            } else {
              clearInterval(myVar);
            }
          }
      }



    this.collisionCheck();
    if (this.collision) {
      this.score += 1;
      this.drop = false;
      this.swingingBlock.dx = 0;
      this.swingingBlock.dy = 0;
      this.collision = false;
      this.swingingBlock.removeOverhang(this.baseBlocks[this.baseBlocks.length - 1]);
      this.addSwingingBlock();
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.draw(this.ctx, this.canvas);


    if (this.baseBlocks[this.baseBlocks.length-1].y < this.canvas.height * 0.6) {
      this.background.y += 0.15;
      this.baseBlocks.forEach((bl)=>{
        bl.y += 0.15;
        bl.draw(this.ctx);
      });
    } else {
      this.baseBlocks.forEach((bl)=>{
        bl.draw(this.ctx);
      });
    }

    this.swingingBlock.draw(this.ctx);

    if(this.swingingBlock.x + this.swingingBlock.dx > this.canvas.width-this.swingingBlock.width - 100|| this.swingingBlock.x + this.swingingBlock.dx < 100) {
       this.swingingBlock.dx = -this.swingingBlock.dx;
     }

   if (this.drop) {
     this.swingingBlock.dx = this.swingingBlock.dx*0.997;
     this.swingingBlock.dy = 3;
   }

   this.swingingBlock.x += this.swingingBlock.dx;
   this.swingingBlock.y += this.swingingBlock.dy;

   this.ctx.font = "30px Arial";
   this.ctx.fillStyle = "red";
   this.ctx.textAlign = "center";
   this.ctx.fillText("Score: " + this.score, this.canvas.width/2, 40);

   if (this.gameOver) {
     this.ctx.font = "30px Arial";
     this.ctx.fillStyle = "red";
     this.ctx.textAlign = "center";
     this.ctx.fillText("Game Over", this.canvas.width/2, 80);
   }

  }

}

module.exports = Game;
