window.onload = function() {
    window.addEventListener('resize', resizeCanvas, false);

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

    canvas.id = 'main-canvas';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let paddleHeight = 10,
        paddleWidth = canvas.width/9,
        paddleX = (canvas.width - paddleWidth)/2;

    let brickPadding = 10,
        brickColumnCount = 8,
        brickWidth = (canvas.width - 10*brickPadding) / 8,
        brickHeight = 20,
        brickRowCount = (canvas.height / 6) / brickHeight,
        brickOffsetTop = 30,
        brickOffsetLeft = 15;

    let rightKeyPressed = false,
        leftKeyPressed = false;

    let ball_x = canvas.width/2,
        ball_y = canvas.height - 30,
        ball_dx = 4,
        ball_dy = -4;

    let ballRadius = 10;
    let bricksArr = []

    initBricksArr();

    function drawBricks() {
        for(let col = 0; col < brickColumnCount; col++) {
            for(let row = 0 ; row < brickRowCount; row++) {
                let b = bricksArr[col][row];
                if (b.show == 1) {
                    let brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricksArr[col][row].x = brickX;
                    bricksArr[col][row].y = brickY;
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
        ctx.arc(ball_x, ball_y, ballRadius, 0, Math.PI*2);
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

        if (ball_x + ball_dx > canvas.width-ballRadius || ball_x + ball_dx < ballRadius) {
            ball_dx = -ball_dx;
        }

        if (ball_y + ball_dy < ballRadius) {
            ball_dy = -ball_dy;
        } else if (ball_y + ball_dy >= canvas.height-ballRadius) {
            if (ball_x > paddleX && ball_x < paddleX + paddleWidth) {
                ball_dy = -ball_dy;
            } else {
                alert("Game Over!");
                document.location.reload();
            }
        }

        ball_x += ball_dx;
        ball_y += ball_dy;

        if(rightKeyPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftKeyPressed && paddleX > 0) {
            paddleX -= 7;
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightKeyPressed = true;
        }
        else if(e.keyCode == 37) {
            leftKeyPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightKeyPressed = false;
        }
        else if(e.keyCode == 37) {
            leftKeyPressed = false;
        }
    }

    function collisionDetection() {
        for(let col = 0; col < brickColumnCount; col++) {
            for(let row = 0; row < brickRowCount; row++) {
                let currBrick = bricksArr[col][row];
                if (currBrick.show == 1) {
                    if(ball_x > currBrick.x && ball_x < currBrick.x + brickWidth && ball_y > currBrick.y && ball_y < currBrick.y + brickHeight) {
                        ball_dy = -ball_dy;
                        currBrick.show = 0;
                    }
                }
            }
        }
    }

    function initBricksArr() {
        for(let col = 0; col < brickColumnCount; col++) {
            bricksArr[col] = [];
            for(let row = 0; row < brickRowCount; row++) {
                bricksArr[col][row] = { x: 0, y: 0, show: 1 };
            }
        }
    }

    if (confirm("Press Ok to start!")) {
        setInterval(draw, 8);
    }
}
