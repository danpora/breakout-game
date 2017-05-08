window.onload = function() {
    window.addEventListener('resize', resizeCanvas, false);

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    let canvas = document.getElementById('main-canvas'),
        ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let paddleHeight = 10,
        paddleWidth = canvas.width/9,
        paddleX = (canvas.width - paddleWidth)/2;

    let brickRowCount = 3,
        brickPadding = 10,
        brickColumnCount = 8,
        brickWidth = (canvas.width - 10*brickPadding) / 8,
        brickHeight = 20,
        brickOffsetTop = 30,
        brickOffsetLeft = 15;

    let bricks = [];
    for(col = 0; col < brickColumnCount; col++) {
        bricks[col] = [];
        for(row = 0; row < brickRowCount; row++) {
            bricks[col][row] = { x: 0, y: 0, show: 1 };
        }
    }

    let rightPressed = false,
        leftPressed = false;

    let x = canvas.width/2,
        y = canvas.height - 30,
        dx = 4,
        dy = -4;
    let ballRadius = 10;

    function drawBricks() {
        for(col = 0; col < brickColumnCount; col++) {
            for(row = 0 ; row < brickRowCount; row++) {
                let b = bricks[col][row];
                if (b.show == 1) {
                    let brickX = (col * (brickWidth+brickPadding)) + brickOffsetLeft;
                    let brickY = (row * (brickHeight+brickPadding)) + brickOffsetTop;
                    bricks[col][row].x = brickX;
                    bricks[col][row].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#b8cedd";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#829fdd";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#dd9483";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy >= canvas.height-ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                alert("Game Over!");
                document.location.reload();
            }
        }
        x += dx;
        y += dy;

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function collisionDetection() {
        for(col = 0; col < brickColumnCount; col++) {
            for(row = 0; row < brickRowCount; row++) {
                let currBrick = bricks[col][row];
                if (currBrick.show == 1) {
                    if(x > currBrick.x && x < currBrick.x + brickWidth && y > currBrick.y && y < currBrick.y + brickHeight) {
                        dy = -dy;
                        currBrick.show = 0;
                    }
                }
            }
        }
    }

    setInterval(draw, 8);
}
