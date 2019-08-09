var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true;
var chessBoard = [];
var myWin = [];
var computerWin = [];
var over = false;

//棋盘
context.strokeStyle = '#bfbfbf';
for (var i = 0; i < 15; i++) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
}
window.onload = function () {
    //棋子
    var oneStep = function (i, j, me) {
        context.beginPath();
        context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI)
        context.closePath();
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        if (me) {
            gradient.addColorStop(0, '#0A0A0A');
            gradient.addColorStop(1, "#636766");
        } else {
            gradient.addColorStop(0, '#D1D1D1');
            gradient.addColorStop(1, '#F9F9F9');
        }
        context.fillStyle = gradient;
        context.fill();
    }

    //落棋
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
    chess.onclick = function (e) {
        if (over) {
            return;
        }
        if (!me) {
            return;
        }
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if (chessBoard[i][j] == 0) {
            oneStep(i, j, me);
            chessBoard[i][j] = 1;//我已占位置
        }

        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                computerWin[k] = 6;
                if (myWin[k] == 5) {
                    window.alert("you win!");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }

    //赢法数组
    var wins = [];
    for (var i = 0; i < 15; i++) {
        wins[i] = [];
        for (var j = 0; j < 15; j++) {
            wins[i][j] = [];
        }
    }
    var count = 0;
    //竖线
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }
    //横线
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 15; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j][count] = true;
            }
            count++;
        }
    }
    //斜线
    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    //反斜线
    for (var i = 0; i < 11; i++) {
        for (var j = 14; j > 3; j--) {
            for (var k = 0; k < 5; k++) {
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }

    console.log(count);

    //赢法的统计数组

    for (var i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0
    }

    var computerAI = function () {
        var myScore = [];
        var computerScroe = [];
        var max = 0;
        var u = 0,
            v = 0;
        for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScroe[i] = [];
            for (var j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScroe[i][j] = 0;
            }
        }
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (chessBoard[i][j] == 0) {
                    for (var k = 0; k < count; k++) {
                        if (wins[i][j][k]) {
                            if (myWin[k] == 1) {
                                myScore[i][j] += 200;
                            } else if (myWin[k] == 2) {
                                myScore[i][j] += 400;
                            } else if (myWin[k] == 3) {
                                myScore[i][j] += 2000;
                            } else if (myWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }
                            if (computerWin[k] == 1) {
                                computerScroe[i][j] += 200;
                            } else if (computerWin[k] == 2) {
                                computerScroe[i][j] += 400;
                            } else if (computerWin[k] == 3) {
                                computerScroe[i][j] += 2000;
                            } else if (computerWin[k] == 4) {
                                computerScroe[i][j] += 10000;
                            }
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] == max) {
                        if (computerScroe[i][j] > computerScroe[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                    if (computerScroe[i][j] > max) {
                        max = computerScroe[i][j];
                        u = i;
                        v = j;
                    } else if (computerScroe[i][j] == max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }
        oneStep(u, v, false);
        chessBoard[u][v] = 2; //计算机占据位置
        for (var k = 0; k < count; k++) {
            if (wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 6;
                if (computerWin[k] == 5) {
                    window.alert("computer win!");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
        }
    }
}