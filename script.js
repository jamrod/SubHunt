//get html game components
const game = document.querySelector("#game")
const display = document.querySelector("#display")
const reset = document.querySelector("#reset")

//initialize gameState
let gameState = {
    hit: false,
    target: {
        row: 0,
        col: 0
    },
    message: {
        shots: 5,
        status: "Click a square"
    },
    squares: [[], [], [], [], []]
}

//click handeler
function clickHandle(div) {
    let row = Math.floor(parseInt(div.id.slice(3)) / 10)
    let col = parseInt(div.id.slice(3)) % 10
    if (gameState.message.shots <= 0 || gameState.hit || gameState.squares[row][col].clicked) {
        return
    }
    gameState.squares[row][col].clicked = true
    let marker = document.createElement("h2")
    marker.textContent = gameState.squares[row][col].content
    div.appendChild(marker)
    gameState.message.shots -= 1
    if (gameState.squares[row][col].content == 'X' && gameState.message.shots > 0) {
        marker.style.color = "red"
        gameState.message.status = "You got it!"
        gameState.hit = true
    } else if (gameState.message.shots > 0) {
        gameState.message.status = "Miss!"
    } else {
        gameState.message.status = "Out of Shots!"
        let target = document.createElement("h2")
        target.textContent = "X"
        target.style.color = "red"
        gameState.squares[gameState.target.row][gameState.target.col].ref.appendChild(target)
    }
    displayer(gameState.message)
}

//update display
function displayer(msg) {
    display.textContent = `Shots: ${msg.shots} ${msg.status}`
}

//initialize target squares
gameState.squares.forEach((row, r) => {
    for (let i = 0; i < 10; i++) {
        let childDiv = document.createElement("div")
        childDiv.classList.add("squares")
        childDiv.id = `div${r}${i}`
        game.appendChild(childDiv)
        childDiv.addEventListener("click", function () {
            clickHandle(childDiv)
        })
        row[i] = {
            content: "O",
            clicked: false,
            ref: childDiv
        }
    }
})

function distanceMap(r, c) {
    gameState.squares.forEach((row, i) => {
        row.forEach((sq, ii) => {
            if (sq.content == "X") {
                return
            }
            let vDist = Math.abs(i - r)
            let hDist = Math.abs(ii - c)
            let distance
            vDist > hDist ? distance = vDist : distance = hDist
            sq.content = `${distance}`
        })
    })
}

//determine target location
function placeSub() {
    let row = Math.floor(Math.random() * 5)
    let col = Math.floor(Math.random() * 10)
    gameState.squares[row][col].content = "X"
    gameState.target = {
        row: row,
        col: col
    }
    distanceMap(row, col)
}

//reset game state
function resetGame() {
    //   gameState.squares = []
    gameState.squares.forEach(row => {
        row.forEach(square => {
            if (square.ref.firstChild) {
                square.ref.removeChild(square.ref.firstChild)
            }
            square.content = "O"
            square.clicked = false
        })
    })
    gameState.message = {
        shots: 5,
        status: "Click a square"
    }
    gameState.hit = false
    displayer(gameState.message)
    placeSub()
}

reset.addEventListener("click", function () {
    resetGame()
})

//start game
displayer(gameState.message)
placeSub()