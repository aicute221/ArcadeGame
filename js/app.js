/**
 * 敌人类：位置，速度，图片
 * @param row
 * @param speed
 * @constructor
 */
var Enemy = function (row, speed) {
    this.row = row;
    this.speed = speed;
    this.left = -101;
    this.sprite = 'images/enemy-bug.png';
};

/**
 * 敌人更新自身update位置方法
 * @param dt
 */
Enemy.prototype.update = function (dt) {
    //当游戏结束时，stop the world
    if (game.running === false) {
        return;
    }

    this.left = this.left + dt * this.speed;

    // 敌人移动超出右屏幕时，移除此敌人
    if (this.left > 505) {
        for (var i = 0; i < allEnemies.length; i++) {
            if (allEnemies[i] === this) {
                allEnemies.splice(i, 1);
                return;
            }
        }
    }

    // 碰撞检测
    if (player.row > 0 && player.row < 4) {
        //玩家视觉宽度的偏移量估算为20
        let left = 101 * player.col + 20;
        let right = left + 101 - 20;
        if (this.row === player.row) {
            if ((this.left <= left && left <= this.left + 101) ||
                (this.left <= right && right <= this.left + 101)
            ) {
                game.lose();
            }
        }
    }
};

/**
 * 在屏幕上画出敌人
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.left, this.row * 75);
};


/**
 * 玩家的位置和图片
 * @param row
 * @param col
 * @constructor
 */
var Player = function (row, col, sprite) {
    this.row = row;
    this.col = col;
    this.sprite = sprite;
};

Player.prototype.update = function () {
    //玩家到河边赢
    if (this.row === 0) {
        game.win();
    }
};

/**
 * 在屏幕上画出玩家
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83);
};

/**
 * 玩家根据上下左右按键做出相对应的移动
 * @param s
 */
Player.prototype.handleInput = function (s) {
    let r = this.row;
    let c = this.col;
    switch (s) {
        case "left":
            c -= 1;
            break;
        case "right":
            c += 1;
            break;
        case "up":
            r -= 1;
            break;
        case "down":
            r += 1;
            break;
    }

    if(isStone(r,c)){
        return;
    }

    this.row = r;
    this.col = c;

    //防止玩家超出屏幕
    if (this.col >= 4) {
        this.col = 4;
    }
    if (this.col <= 0) {
        this.col = 0;
    }
    if (this.row >= 5) {
        this.row = 5;
    }
    if (this.row <= 0) {
        this.row = 0;
    }
};

//判断当前格子是否有石头
function isStone(row,col){
   return allStones.some(function(item){
        return item.row === row && item.col === col
    });
}

//数组存放敌人
var allEnemies = [];

//数组存放石头
var allStones = [];

//自动添加敌人
setInterval(function () {
    // 当游戏结束时，stop the world
    if (game.running === false) {
        return;
    }
    allEnemies.push(new Enemy(Math.ceil(Math.random() * 3), 200 - Math.random() * 40));
}, 1000);


let player = new Player(5, 3, "images/char-boy.png");

// 监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()方法里面
document.addEventListener('keyup', function (e) {
    // 当游戏结束时，stop the world
    if (game.running === false) {
        if(game.chooseOrNot === true){
            //选人界面
            if(e.keyCode === 37){
                game.chooseLeft();
            }

            if(e.keyCode === 39){
                game.chooseRight();
            }

            //选好人按下enter13重新开始游戏
            if (e.keyCode === 13) {
                game.startRun();
            }
        }else{
            // 失败或成功页面
            // 按下enter13重新开始进入选人界面
            if(e.keyCode === 13){
                game.restart();
            }
        }
        return;
    }

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

var Stone = function(row,col){
    this.row = row;
    this.col = col;
    this.sprite = 'images/Rock.png';
};

Stone.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 75);
};



/**
 * 游戏类，控制游戏的开始，结束和运行状态
 * @constructor
 */
var Game = function () {
    this.running = false;
    this.lose_div = document.getElementById("lose");
    this.win_div = document.getElementById("win");
    this.choose_div = document.getElementById("choose");
    this.imgs = [
        document.getElementById("img1"),
        document.getElementById("img2"),
        document.getElementById("img3"),
        document.getElementById("img4"),
        document.getElementById("img5")
    ];
    this.current_img = 0;
    this.srcs = [
        "images/char-boy.png",
        "images/char-cat-girl.png",
        "images/char-horn-girl.png",
        "images/char-pink-girl.png",
        "images/char-princess-girl.png"
    ];
    this.chooseOrNot = true;
};

Game.prototype.lose = function () {
    this.running = false;
    this.lose_div.style.display = "block";
    this.chooseOrNot = false;
};

Game.prototype.win = function () {
    this.running = false;
    this.win_div.style.display = "block";
    this.chooseOrNot = false;
};

Game.prototype.startRun = function(){
    allStones = [];
    this.running = true;
    this.choose_div.style.display = "none";


    for(let i = 0;i<3;i++){
        let stone = new Stone( Math.ceil(Math.random()*3),Math.floor(Math.random()*5));
        if(!isStone(stone.row , stone.col)){
            allStones.push(stone);
        }else{
            i--;
        }
    }

};

Game.prototype.restart = function () {
    this.lose_div.style.display = "none";
    this.win_div.style.display = "none";
    this.choose_div.style.display = "block";
    player.row = 5;
    player.col = 3;
    this.chooseOrNot = true;
};

Game.prototype.chooseLeft = function(){
    this.imgs[this.current_img].className = "";
    this.current_img--;
    if(this.current_img === -1){
        this.current_img = 4;
    }
    this.imgs[this.current_img].className = "selected";
    player = new Player(5,3,this.srcs[this.current_img]);
};

Game.prototype.chooseRight = function(){
    this.imgs[this.current_img].className = "";
    this.current_img++;
    if(this.current_img === 5){
        this.current_img = 0;
    }
    this.imgs[this.current_img].className = "selected";
    player = new Player(5,3,this.srcs[this.current_img]);
};

var game = new Game();