var gameEngine = new GameEngine();
var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawFrameAttack = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        gameEngine.attack = false;
        gameEngine.keyOne = false;
        gameEngine.keyTwo = false;
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function InnerRage(game, spritesheet1, spritesheet2, spritesheet3, spritesheet4,
    spritesheet5, spritesheet6, spritesheet7, spritesheet8) {
    this.animationStill_L = new Animation(spritesheet1, 139, 181, 1, 0.065, 8, true, 1); // Standing Left
    this.animationStill_R = new Animation(spritesheet2, 139, 181, 1, 0.065, 8, true, 1); // Standing Right
    this.animationMove_L = new Animation(spritesheet3, 133, 179, 1, 0.065, 8, true, 1); // Moving Left
    this.animationMove_R = new Animation(spritesheet4, 133, 179, 1, 0.065, 8, true, 1); // Moving Right
    this.animationAttackOne_L = new Animation(spritesheet5, 772, 348, 1, 0.065, 30, true, 1); // Attack 1 Left
    this.animationAttackOne_R = new Animation(spritesheet6, 772, 348, 1, 0.065, 30, true, 1); // Attack 1 Right
    this.animationAttackTwo_L = new Animation(spritesheet7, 1084, 861, 1, 0.065, 31, true, 1); // Attack 2 Left
    this.animationAttackTwo_R = new Animation(spritesheet8, 1084, 861, 1, 0.065, 31, true, 1); // Attack 2 Right
    this.x = 0;
    this.y = 265;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.right = true;
}

InnerRage.prototype.draw = function () {
    if (!gameEngine.attack) {
        if (!gameEngine.movement) {
            // Standing/Idle Animation
            if (!this.right) {
                this.animationStill_L.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            } else {
                this.animationStill_R.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            }
        } else {
            // Movement Animation
            if (!this.right) {
                this.animationMove_L.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            } else {
                this.animationMove_R.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            }
        }
    }

    if (gameEngine.keyOne) {
        // Attack 1 Animation
        if (!this.right) {
            this.animationAttackOne_L.drawFrameAttack(this.game.clockTick, this.ctx, this.x - 455, this.y - 90);
        } else {
            this.animationAttackOne_R.drawFrameAttack(this.game.clockTick, this.ctx, this.x - 178, this.y - 90);
        }
    } else if (gameEngine.keyTwo) {
        // Attack 2 Animation
        if (!this.right) {
            this.animationAttackTwo_L.drawFrameAttack(this.game.clockTick, this.ctx, this.x - 450, this.y - 500);
        } else {
            this.animationAttackTwo_R.drawFrameAttack(this.game.clockTick, this.ctx, this.x - 495, this.y - 500);
        }
    }
}

InnerRage.prototype.update = function () {
    // If player goes out of bounds, make them come out the other side
    // Hardcoded values, but 1350 is the canvas width and -139 is the offset
    // which is the player width.
    if (this.x < -139) {
        this.x = 1350;
    } else if (this.x > 1350) {
        this.x = -139;
    }
    if (!gameEngine.attack) {
        if (gameEngine.keyLeft) {
            this.x -= 5;
            this.right = false;
        }
        
        if (gameEngine.keyRight) {
            this.x += 5;
            this.right = true;
        }
    } else {
        
    }
}

AM.queueDownload("./img/background.png");
AM.queueDownload("./img/stand_l.png");
AM.queueDownload("./img/stand_r.png");
AM.queueDownload("./img/move_l.png");
AM.queueDownload("./img/move_r.png");
AM.queueDownload("./img/attack1_l.png");
AM.queueDownload("./img/attack1_r.png");
AM.queueDownload("./img/attack2_l.png");
AM.queueDownload("./img/attack2_r.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.setAttribute("style",
        "position: absolute; left: 50%; margin-left:-675px; top:50%; margin-top:-300px");
    document.body.style.backgroundColor = "white";

    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png")));

    gameEngine.addEntity(new InnerRage(gameEngine,
    AM.getAsset("./img/stand_l.png"), AM.getAsset("./img/stand_r.png"),
    AM.getAsset("./img/move_l.png"), AM.getAsset("./img/move_r.png"),
    AM.getAsset("./img/attack1_l.png"), AM.getAsset("./img/attack1_r.png"),
    AM.getAsset("./img/attack2_l.png"), AM.getAsset("./img/attack2_r.png")));
});