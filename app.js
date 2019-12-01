var canvas = document.getElementById("gameBoard");
canvas.height = 600
canvas.width = 600
/**
 * @type {Object} - selected canvas context
 */
let ctx = canvas.getContext("2d");

/**
 * @type {Object} - player object
 */
const player1 = new Player('Player-1')
const player2 = new Player('Player-2')

/**
 * @type {number} - players turn
 */
let turn = 1

/**
 * @type {number} - overall game rounds (Max: 9 rounds)
 */
let rounds = 0
/**
 * @type {Array<Tiles>} - Array of board tiles
 */
let tiles = []
/**
 * @type {boolean} - If game ended or not
 */
let gameEnd = false
/**
 * @type {Array<Array<number>>} - Listed winning conditions
 */
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

/**
 * Start new tictactoe match
 * @param {Object} player1 - reset player1 stats
 * @param {Object} player2 - reset player2  stats
 * @param {boolean} gameEnd - set game end to false
 * @param {number} turn - set to player1 turn
 * @param {Array<object>} tiles - reset tiles array
 * @returns {void}
 * clear previous match board and creates new tiles
 */
function initGame() {
    updateScores()
    player1.resetTiles()
    player2.resetTiles()
    gameEnd = false
    turn = 1
    rounds = 0
    tiles = []
    ctx.clearRect(0, 0, 600, 600)

    for (let i = 0; i < 3; i++) {
        for (let x = 0; x < 3; x++) {
            let square = new Tile(200, 200, (200 * x), (200 * i))
            square.draw()
            tiles.push(square)
        }
    }

}
/**
 * Set eventlistener on canvas.
 * @param {number} mouseX - get mouse x position from clicked canvas
 * @param {number} mouseY - get mouse y position from clicked canvas
 * @param {boolean} gameEnd - if true it wont let players select tiles
 * @param {number} turn - between 1 or 2 give player select tile
 * @return {void}
 */
canvas.addEventListener('mousedown', function (e) {
    let mouseX = e.offsetX
    let mouseY = e.offsetY

    if (!gameEnd) {
        // Player 1
        if (turn === 1) {
            let updatedTiles = selectTile(mouseX, mouseY, player1, player2)
            // Save selected tile
            player1.updateTiles(updatedTiles)
            rounds += 1
            console.log(rounds)
            checkWinCondition(player1)
            return
        }

        // Player 2 
        if (turn === 2) {
            let updatedTiles = selectTile(mouseX, mouseY, player2, player1)
            // Save selected tile
            player2.updateTiles(updatedTiles)
            rounds += 1
            console.log(rounds)
            checkWinCondition(player2)
            return
        }

    }
})

/**
 * Checks if selected tile is empty and draw cross or circle symbol on it.
 * if selected tilen
 * @param {number} mouseX - given mouse x position
 * @param {number} mouseY - given mouse y position
 * @param {Object} playerTurn - given current players turn
 * @param {Object} otherPlayer - given second player
 * @returns {Array<number>} - if selected tile is empty returns updated array 
 * on current player
 */
function selectTile(mouseX, mouseY, playerTurn, otherPlayer) {
    // Loop all tiles
    for (let i = 0; i < tiles.length; i++) {
        // Select current tile by given mouse position
        if ((tiles[i].x < mouseX && (tiles[i].x + 200) > mouseX) &&
            (tiles[i].y < mouseY && (tiles[i].y + 200) > mouseY)) {
            if ((!playerTurn.tiles.includes(i) || playerTurn.length === 0) &&
                (!otherPlayer.tiles.includes(i) || otherPlayer.length === 0)) {
                // Check wich turn and draws current turn symbol
                if (turn === 1) tiles[i].drawX(tiles[i].x, tiles[i].y)
                if (turn === 2) tiles[i].drawO(tiles[i].x, tiles[i].y)
                // Update current player turn listed tiles
                let listedTiles = playerTurn.tiles
                listedTiles.push(i)
                // Change player turn 
                turn = (turn % 2) + 1
                return listedTiles
            }
            return playerTurn.tiles
        }
    }
}

/**
 * Check given player object selected tiles,
 * if given player tiles has winning conditional tiles then end game
 * @param {Object} player - given player object
 * @returns {void}
 */
function checkWinCondition(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        if (arrayContainsArray(player.tiles, winningConditions[i])) {
            winningLine(winningConditions[i])
            gameEnd = true
            player.updateWins()
            updateScores()
            show(player.playerName)
        }
    }
    if (rounds === 9) {
        gameEnd = true
        show()
    }
}

function updateScores() {
    let score1 = document.getElementById("score1")
    let score2 = document.getElementById("score2")
    score1.innerText = `${player1.playerName}: ${player1.wins}`
    score2.innerText = `${player2.playerName}: ${player2.wins}`
}

/**
 * Draw line on winners tiles
 * @param {Array<number>} arr - given single winningCondition array
 * @returns {void} 
 */
function winningLine(arr) {
    /**
     * @type {Array<number>} - select winner tiles X position
     */
    let arrX = arr.map(index => {
        return tiles[index].x
    })
    /**
     * @type {Array<number>} - select winner tiles Y position
     */
    let arrY = arr.map(index => {
        return tiles[index].y
    })

    if (isEqual(arrX)) {
        // Draw horizontal line
        drawWinnerLine(
            arrX[0] + 100,
            arrY[0],
            arrX[2] + 100,
            arrY[2] + 200
        )
    } else if (isEqual(arrY)) {
        // Draw vertical line
        drawWinnerLine(
            arrX[0],
            arrY[0] + 100,
            arrX[2] + 200,
            arrY[2] + 100
        )
    } else {
        if (arrX[0] === 400 & arrY[2] === 400) {
            // Draw line from right top corner to left bottom corner
            drawWinnerLine(
                arrX[0] + 200,
                arrY[0],
                arrX[2],
                arrY[2] + 200
            )
        } else {
            // Draw line from left top corner to right bottom corner
            drawWinnerLine(
                arrX[0],
                arrY[0],
                arrX[2] + 200,
                arrY[2] + 200
            )
        }

    }

}
/**
 * Draw winner tiles line
 * @param {number} x1 - starting line x position
 * @param {number} y1 - starting line y position
 * @param {number} x2 - ending line x position
 * @param {number} y2 - ending line y position
 * @returns {void}
 */
function drawWinnerLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    // Line thickness
    ctx.lineWidth = 5
    // Line color
    ctx.strokeStyle = '#00ff00'
    ctx.stroke()
}
/**
 * Check if given array numbers are same, to decide 
 * draw a winning line
 * @param {Array<numbers>} arr - Array of three tiles x position
 * @returns {boolean} - returns true if given three numbers are same
 * and returns false if they arent
 */
function isEqual(arr) {
    if ([...new Set(arr)].length === 1) return true
    return false
}

/**
 * Check if player has winning tiles
 * @param {Array<number>} arr1 - given player selected tiles
 * @param {Array<number>} arr2 - given winning conditional tiles
 * @returns {boolean} - return true if player has win conditional or returns false if not
 */
function arrayContainsArray(arr1, arr2) {
    if (0 === arr2.length) {
        return false
    }
    return arr2.every(function (value) {
        return (arr1.indexOf(value) >= 0)
    })
}

/**
 * Creates tile
 * @param {number} width - given tile width
 * @param {number} height - given tile height
 * @param {number} x - given tile X position
 * @param {number} y - given tile Y position
 */
function Tile(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.player = null

    // Draws tile
    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.lineWidth = 1
        ctx.strokeStyle = '#000000'
        ctx.stroke();
    }

    /**
     * Draw cross symbol on the selected tile
     * @param {number} x - selected tile x position
     * @param {number} y - selected tile y position
     */
    this.drawX = function (x, y) {
        ctx.beginPath()
        ctx.moveTo((x + 25), (y + 25));
        ctx.lineTo(((x + 200) - 25), (y + 200) - 25)
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo((x + 25), ((y + 200) - 25))
        ctx.lineTo(((x + 200) - 25), (y + 25))
        ctx.lineWidth = 3
        ctx.stroke()
    }

    /**
     * Draw circle symbol on the selected tile
     * @param {number} x - selected tile x position
     * @param {number} y - selected tile y position
     */
    this.drawO = function (x, y) {
        ctx.beginPath()
        ctx.arc((x + 100), (y + 100), 75, 0, 2 * Math.PI)
        ctx.stroke()
    }

}

/**
 * Creates player object
 * @param {string} name - given player name 
 */
function Player(name) {
    this.playerName = name
    this.tiles = []
    this.wins = 0


    this.updateTiles = function (arr) {
        this.tiles = arr
    }
    this.resetTiles = function () {
        this.tiles = []
    }

    this.updateWins = function () {
        this.wins += 1
    }
}

/**
 * function that shows in modal winners name or draw
 * @param {string} value - Winners name. Default will be null 
 */
function show(value = null) {

    // Set modal Text
    if (value !== null) {
        $(".modal-text").text(value + " won!")
    } else {
        $(".modal-text").text("Draw!")
    }
    $(".modal").show()

}

/**
 * On click close modal on manually
 */
$('.close-btn').click(function () {
    $(".modal").hide()
    initGame()
})