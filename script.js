let homeTgl = 0
let tick = 0
const mspf = 33

// !Create array/object to store highscores for Speedrun! //
const highscores = {
    name: ['bob', 'patricia', 'aglet', 'Pi', 'scarlet', 'Vinny', 'SAM', 'stuart', 'illbert', 'squid'],
    guessAcc: [90, 85, 83, 82, 79, 75, 72, 68, 63, 58],
    time: [130985, 306845, 267535, 69854, 236581, 99045, 23486, 89845, 53453, 49494]
}

const pvpBtn = document.querySelector('#pvp')
const spdBtn = document.querySelector('#spd')
const advBtn = document.querySelector('#adv')
const pracBtn = document.querySelector('#prac')
const homeBtnArr = [pvpBtn, spdBtn, advBtn, pracBtn]

const gameCtnr = document.querySelector('.game-container')

const capName = (name) => {
    name[0] = name[0].toUpperCase()
    return name
}

class Player {
    constructor () {
        this.name = ''
        this.guesses = []
        this.guessAcc = []
        this.totalGuessAcc = 0
        this.time = 0
        this.wins = 0
    }

    giveName(name) {
        this.name = name.toUpperCase()
        
        // console.log(`This player's name is ${name}`)
    }
    newGuess(guess) {
        this.guesses.push(guess)
    }
    calcTotalAcc() {
        let i = 0
        while (i < this.guessAcc.length) {
            this.totalGuessAcc += this.guessAcc[i]
            i++
        }
        this.totalGuessAcc = Math.round(this.totalGuessAcc / 6)
    }
}
const plyrOne = new Player()
const plyrTwo = new Player()

const cycleHomeBtns = () => {
    if(homeTgl === 1) {
        pvpBtn.removeEventListener('click', startMulti)
        spdBtn.removeEventListener('click', startSpeed)
        advBtn.removeEventListener('click', startAdvnt)
        pracBtn.removeEventListener('click', startPrac)
    }
    if(homeTgl === 0) {
        pvpBtn.addEventListener('click', startMulti)
        spdBtn.addEventListener('click', startSpeed)
        advBtn.addEventListener('click', startAdvnt)
        pracBtn.addEventListener('click', startPrac)
    }
}

const newHexCode = () => {
    let hexCode = []
    while(hexCode.length < 6) {
        let value = (Math.floor(Math.random() * 16)).toString(16)
        hexCode.push(value)
    }
    return hexCode.join('')
}

function zeroPad(num, places) {return String(num).padStart(places, '0')}

const genTimedLayout = (gameType) => {
    // DEBUG CODE //
    // gameCtnr.style.zIndex = 10

    // Create array for color storage
    let gameClrs = []

    // Create game length for each game
    const rounds = 5
    if(gameType === 'pvp') {gameRunning = rounds * 2}
    else if(gameType === 'spd') {gameRunning = rounds}

    // Create elements for the timed layout design
    const clrBG = document.createElement('div')
    const fillBox = document.createElement('div')
    const plyrInfo = document.createElement('div')
    const rndInfo = document.createElement('div')
    const prmpt = document.createElement('div')
    const timeDisplay = document.createElement('div')
    const plyrGuess = document.createElement('input')
    const rndStart = document.createElement('button')
    const rndEnd = document.createElement('button')
    const plyrGuessForm = document.createElement('form')

    // --> Return here for game function
    const gameStart = () => {
        rndStart.addEventListener('click', function handler() {
            // Enable player submission
            plyrGuessForm.removeEventListener('submit', handler)

            // Make start timer do nothing if clicked again
            rndStart.removeEventListener('click', handler)

            // Display color to guess
            newClr = newHexCode()
            clrBG.style.background = `#${newClr}`
            gameClrs.push(newClr)

            // PVP GAME FUNCTION //
            if(gameType === 'pvp') {
                // Start countdown timer
                tick = 30000   // 30 seconds
                const countDown = setInterval(countDownTimer, mspf)

                // Submission function
                plyrGuessForm.addEventListener('submit', function handler(e) {
                    // Finish round
                    e.preventDefault()
                    clearInterval(countDown)
                    plyrGuessForm.removeEventListener('submit', handler)

                    // Add guess to player guesses and clear input
                    if(plyrTurn() == 0 && guessProtect(plyrTwo)) {plyrTwo.newGuess(plyrGuess.value)}
                    else if(guessProtect(plyrOne)) {plyrOne.newGuess(plyrGuess.value)}
                    plyrGuess.value = ''

                    // Check if game is ongoing or finished
                    if(gameClrs.length < gameRunning) {gameStart()}   // Repeat Round
                    else {gameEnd('pvp')}   // Continue to finish game -->
                })
            }
            
            // SPEEDRUN GAME FUNCTION //
            if(gameType === 'spd') {
                // Remove timer button
                fillBox.removeChild(rndStart)
                
                // Start stopwatch if game is
                tick = 0
                const stopWatch = setInterval(stopWatchTimer, mspf)
                
                // Submission function
                plyrGuessForm.addEventListener('submit', function handler(e) {
                    e.preventDefault()
                    
                    // Add guess to player guesses and clear input
                    if(guessProtect(plyrOne)) {plyrOne.newGuess(plyrGuess.value)}
                    plyrGuess.value = ''
                    
                    // Check if game is ongoing or finished
                    if(gameClrs.length < gameRunning) {
                        // Display new color to guess
                        newClr = newHexCode()
                        clrBG.style.background = `#${newClr}`
                        gameClrs.push(newClr)
                        
                        // Repeat round
                        gameStart()
                    }
                    else {
                        // Stop stopwatch
                        clearInterval(stopWatch)
                        plyrOne.time = tick
                        plyrGuessForm.removeEventListener('submit', handler)

                        gameEnd('spd')
                        // Continue to finish game -->
                    }
                })
            }
        })
    }

    // --> Return to finish game
    const gameEnd = (gameType) => {
        // Create index for temporary loops
        let i = 0

        // Calculate all player scores
        calcResults(plyrOne)
        if(gameType === 'pvp') {calcResults(plyrTwo)}

        // Create neccessary elements for winner display
        const winCtnr = document.createElement('div')
        const winText = document.createElement('div')
        const plyrCtnr = document.createElement('div')
        const plyrOneCtnr = document.createElement('div')
        const plyrTwoCtnr = document.createElement('div')
        const restartBtn = document.createElement('button')
        const homeBtn = document.createElement('button')
        
        // Assign classes to corresponding elements
        winCtnr.classList.add('end-display-container')
        winText.classList.add('end-display-text')
        plyrCtnr.classList.add('player-display-container')
        plyrOneCtnr.classList.add('player-one-info')
        plyrTwoCtnr.classList.add('player-two-info')
        restartBtn.classList.add('restart-button')
        homeBtn.classList.add('home-button')
        
        // --> Return here to display guesses and accuracy
        const displayPlayerCalc = (player) => {
            let plyrHighscore = ''
            const plyrName = document.createElement('div')
            
            // Assign name values for scores
            plyrName.innerText = `${player.name}`
            plyrName.style.fontWeight = '700'
            
            // Generate total Accuracy for player object(s)
            if(player === plyrTwo) {plyrTwo.calcTotalAcc()}
            else {plyrOne.calcTotalAcc()}

            // Append player names for multiplayer
            if(gameType === 'pvp') { 
                if(player === plyrTwo) {plyrTwoCtnr.append(plyrName)}
                else {plyrOneCtnr.append(plyrName)}
                
                // Appends scores to display each player's guesses and accuracy
                while(i < player.guesses.length) {
                    // Create element for player information
                    const plyrResult = document.createElement('div')
                    
                    // Edit element with corressponding information and class
                    plyrResult.innerText = `${player.guesses[i]} = ${player.guessAcc[i]}%`

                    // Append for correct gamemode
                    if(player === plyrTwo) {plyrTwoCtnr.append(plyrResult)}
                    else {plyrOneCtnr.append(plyrResult)}
                    // Increment loop
                    i++
                }
                // Reset index for future calls
                i = 0

                // Create text for total guess accuracy average
                const plyrResult = document.createElement('div')
                plyrResult.innerText = `Total: ${player.totalGuessAcc[i]}%`

                // Display average accuracy
                if(player === plyrTwo) {plyrTwoCtnr.append(plyrResult)}
                else {plyrOneCtnr.append(plyrResult)}
            }

            // Generates display for player score and all highscores
            if(gameType === 'spd') {
                const endCheck = highscores.name.length

                // Create and display elements for all highscores 
                for(i = 0; i < highscores.name.length; i++) {
                    if(player.totalGuessAcc > highscores.guessAcc[i]) {
                        if(player.time < highscores.time[i]) {
                            newHighscore(i)
                            i = endCheck
                        }
                        if(player.time >= highscores.time[i]) {
                            console.log('time is higher')
                            newHighscore(i + 1)
                            i = endCheck
                        }
                    }
                }
                
                highscores.time.forEach((time, index) => {
                    const highscoreScore = document.createElement('div')
                    highscoreScore.classList.add('highscore-list')

                    // Generate text for highscores
                    highscoreScore.innerText = `${index + 1}.${highscores.name[index]} Time:${zeroPad(Math.floor(time / 100000),2)}:${zeroPad(Math.floor(time / 1000 % 100),2)}.${zeroPad(time % 1000, 3)} Score:${highscores.guessAcc[index]}%`

                    plyrOneCtnr.append(highscoreScore)
                })
                plyrOneCtnr.style.gap = '20px'
            }
        }
        
        // Add elements to display guesses and accuracy
        displayPlayerCalc(plyrOne)
        if(gameType === 'pvp') {displayPlayerCalc(plyrTwo)}
        // Continue to display guesses and accuracy -->

        // Display winner and player guesses
        if(gameType === 'pvp') {
            if(plyrOne.totalGuessAcc > plyrTwo.totalGuessAcc) {
                winText.innerText = `${plyrOne.name} is the winner!`
            }
            else if(plyrOne.totalGuessAcc < plyrTwo.totalGuessAcc) {
                winText.innerText = `${plyrTwo.name} is the winner!`
            }
            else {
                winText.innerText = `It's a draw!`
            }
            
            winCtnr.append(winText)
            plyrCtnr.append(plyrOneCtnr, plyrTwoCtnr)
        }
        if(gameType === 'spd') {
            winText.innerText = 'HIGHSCORES'

            winCtnr.append(winText)
            plyrCtnr.append(plyrOneCtnr)
        }
        // Append elements to corresponding containers
        winCtnr.append(plyrCtnr)
        gameCtnr.append(winCtnr)
    }

    const countDownTimer = () => {
        // Setup leading zeroes for timer
        let msZero = 3
        let secZero = 2
        
        // Make variables for updating timer numbers
        const min = zeroPad(0, 2)
        const sec = zeroPad(Math.floor(tick / 1000), secZero)
        const mSec = zeroPad(tick % 1000, msZero)
        
        // Mark down tick for timer
        if(tick > 0) {tick -= mspf}
        if(tick <= 0) {tick = 0}
        
        // Update Timer
        timeDisplay.innerText = `${min}:${sec}.${mSec}`
    }

    const stopWatchTimer = () => {
        // Setup leading zeroes for timer
        const msZero = 3
        const secZero = 2
        const minZero = 2
        
        // Check and increment if minute and reset tick to prevent overflow
        // if(Math.floor(tick / 1000) === 60) {min++; tick = 0}

        // Make variables for updating stopwatch numbers
        const minSW = zeroPad(Math.floor(tick / 100000), minZero)
        const secSW = zeroPad(Math.floor(tick / 1000 % 100), secZero)
        const mSecSW = zeroPad(tick % 1000, msZero)

        // Mark up tick for stopwatch
        tick += mspf
        
        // Update stopwatch
        timeDisplay.innerText = `${minSW}:${secSW}.${mSecSW}`
    }

    // Binary counter for mulitplayer turns
    const plyrTurn = () => {
        return gameClrs.length % 2
    }

    // Prevents extra guesses during game
    const guessProtect = (player) => {
        return gameType === 'pvp' ? player.guesses.length < Math.ceil(gameClrs.length / 2) : player.guesses.length < gameClrs.length
    }

    const calcResults = (player) => {
        player.guesses.forEach((item, index) => {
            // Spread characters into arrays for comparison
            let plyrArr = []
            let gameArr = []

            if(gameType === 'pvp' && player === plyrTwo) {
                plyrArr = [...item]
                gameArr = [...gameClrs[index * 2 + 1]]
            }
            else if(gameType === 'pvp') {
                plyrArr = [...item]
                gameArr = [...gameClrs[index * 2]]
            }
            else {
                plyrArr = [...item]
                gameArr = [...gameClrs[index]]
            }
            
            // Declare loop variables
            const hexLength = 6
            let i = 0
            let accuracy = 100
            const maxMultiplier = 2.0
            const minMultiplier = 0.2

            // Iterate through both strings
            while(i < hexLength) {
                const arrPos = gameArr.length % 2
                // Remove character 1 by 1 from each array and 
                const plyrChar = parseInt(plyrArr.shift(), 16)
                const gameChar = parseInt(gameArr.shift(), 16)

                // Calculate accuracy based on hex position
                if(plyrChar !== gameChar && arrPos === 0) {
                    accuracy -= Math.round(Math.abs(plyrChar - gameChar) * maxMultiplier)
                }
                else if(plyrChar !== gameChar) {
                    accuracy -= Math.round(Math.abs(plyrChar - gameChar) * minMultiplier)
                }

                // Increment up based on gamemode
                i++
            }
            player.guessAcc.push(accuracy)
        })
        player.calcTotalAcc()
    }

    // Inserts new player score into highscore object arrays
    const newHighscore = (index) => {
        let temp = []
        let arrInsertPos = (highscores.name.length - 1) - index
        
        while(arrInsertPos > 0) {
            arrInsertPos--

            temp = [highscores.name[index + arrInsertPos], highscores.guessAcc[index + arrInsertPos], highscores.time[index + arrInsertPos]]
            highscores.name[index + arrInsertPos + 1] = temp[0]
            highscores.guessAcc[index + arrInsertPos + 1] = temp[1]
            highscores.time[index + arrInsertPos + 1] = temp[2]
        }
        
        highscores.name[index] = plyrOne.name
        highscores.guessAcc[index] = plyrOne.totalGuessAcc
        highscores.time[index] = plyrOne.time
    }

    // Assign corresponding classes to elements
    clrBG.classList.add('timed-clr')
    fillBox.classList.add('game-info-box')
    plyrInfo.classList.add('player-info')
    rndInfo.classList.add('round-info')
    prmpt.classList.add('round-prompt')
    timeDisplay.classList.add('timer')
    plyrGuess.classList.add('player-guess')
    rndStart.classList.add('round-start-button')
    rndEnd.classList.add('round-end-button')
    plyrGuessForm.classList.add('guesses')

    // Assign any necessary text or styles
    gameCtnr.style.background = 'linear-gradient(60deg, var(--clr-drk-1) 10%, var(--clr-drk-2) 70%, var(--clr-drk-2))'
    if(gameType === 'pvp') {timeDisplay.innerText = '00:30.000'}
    if(gameType === 'spd') {timeDisplay.innerText = '00:00.000'}
    if(gameType !== 'prac') {plyrInfo.innerText = `${plyrOne.name}! Please start your timer to begin`}
    prmpt.innerText = 'Guess the color that appears to the right of the screen.'
    rndStart.innerText = 'Start Timer'
    plyrGuess.placeholder = '#00FFCC'
    rndEnd.innerText = 'Enter Guess'
    
    //   :: SECURITY MEASURES ::   //
    // Prevents early player submission to refresh page
    let min = 0
    plyrGuessForm.addEventListener('submit', function handler(e) {e.preventDefault()})  
    
    // Generate initial layout
    plyrGuessForm.append(plyrGuess, rndEnd)
    fillBox.append(plyrInfo, rndStart, rndInfo, prmpt, plyrGuessForm)
    gameCtnr.append(clrBG, fillBox, timeDisplay)
    
    // Start game after Timer clicked
    gameStart()
    // Continue game function -->
}

const genAdventureLayout = () => {
    let gameRunning = true
    const gameClrs = ['#0f8340', '#a83b3b', '#8f1390', '#186bcb', '#3cd5f3']
    const rounds = 5
    
    // Create elements for adventure mode
    const advCtnr = document.createElement('div')
    const infoCtnr = document.createElement('div')
    const btnCtnr = document.createElement('div')
    const tutorial = document.createElement('div')
    const startBtn = document.createElement('button')
    const homeBtn = document.createElement('button')
    const retryBtn = document.createElement('button')
    const canvas = document.createElement('canvas')
    
    // Display all elements
    btnCtnr.append(startBtn, homeBtn, retryBtn)
    infoCtnr.append(tutorial, btnCtnr)
    advCtnr.append(infoCtnr, canvas)
    gameCtnr.append(advCtnr)
    
    // Give 2D functionality and proper resolution
    const ctx = canvas.getContext('2d')
    canvas.setAttribute('height', getComputedStyle(canvas).height)
    canvas.setAttribute('width', getComputedStyle(canvas).width)
    
    // Add any neccessary styling
    advCtnr.classList.add('adventure-container')
    infoCtnr.classList.add('adventure-info-container')
    btnCtnr.classList.add('adventure-button-container')
    tutorial.classList.add('adventure-tutorial')
    startBtn.classList.add('adventure-start-button')
    homeBtn.classList.add('return-button', 'adventure-pos')
    retryBtn.classList.add('return-button', 'adventure-pos')

    tutorial.innerText = 'To play the game, you must eliminate all enemies without dying.\nAn enemy is any block that is the color value of the one displayed below the screen.\nIf an enemy hits you, makes it past you, or you hit the wrong enemy, you lose a life.\nIf you lose all 3 lives, you will die and the game is over.\nPress the start button whenever you are ready to begin!'
    startBtn.innerText = 'Start Adventure!'
    homeBtn.innerText = 'Home'
    retryBtn.innerText = 'Retry'

    gameCtnr.style.background = 'linear-gradient(60deg, var(--clr-drk-1) 10%, var(--clr-drk-2) 70%, var(--clr-drk-2))'
    
    const randX = () => (Math.round((Math.random() - .5) * (canvas.width * 0.95)) + (canvas.width / 2))
    const randSize = () => (Math.pow(Math.floor(Math.random() * 10), Math.round(Math.random() * 1.5)) + 40)

    class Adventurer {
        constructor(x, y, height, width, clrFill, clrStroke) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.clrFill = clrFill
            this.clrStroke = clrStroke
        }

        render(xPos) {
            ctx.fillStyle = this.clrFill
            ctx.strokeStyle = this.clrStroke
            ctx.lineWidth = 5
            ctx.fillRect(xPos, this.y, this.width, this.height)
            ctx.strokeRect(xPos, this.y, this.width, this.height)
            ctx.fillRect(xPos + 17.5, this.y - 25, this.width - 35, this.height - 10)
            ctx.strokeRect(xPos + 17.5, this.y - 25, this.width - 35, this.height - 10)
        }
    }
    const plyr = new Adventurer(canvas.width / 2 - 25, 870, 50, 50, '#3d3', '#2a2')
    const enemy = new Adventurer(randX(), -100, randSize(), randSize(), gameClrs[0])
    let bullets = []
    let enemyBullets = []

    // plyr.render(500)

    
    // Render game
    const gameLoop = () => {
        // canvas.setAttribute('height', getComputedStyle(canvas).height)
        // canvas.setAttribute('width', getComputedStyle(canvas).width)
        
        
        // if(hitDetect(plyr, enemy)) {loseLife()}
        
        if(gameRunning) {
            document.addEventListener('mousemove', function handler(e) {
                const box = advCtnr.getBoundingClientRect()
                const xPos = Math.ceil(e.clientX - box.left)
                ctx.clearRect(0, 840, canvas.width, canvas.height)
                plyr.render(xPos)
                document.removeEventListener('mousemove', handler)
            })
        }
    }

    // --> Return here to start game
    const gameStart = () => {
        startBtn.addEventListener('click', function handler() {
            // Remove start button
            startBtn.removeEventListener('click', handler)
            startBtn.innerText = 'Adventure Begun!'
            startBtn.classList.add('adventure-start-clicked')
            startBtn.classList.remove('adventure-start-button')
            
            // Detect player movement through mouse hover
        })
    }

    const hitDetect = () => {

    }


    // // Run game
    const gameIs = setInterval(gameLoop, mspf)
    gameStart()
    // // Continue to start game -->
}

const promptMultiplayer = () => {
    // Brings Game Screen Forward
    gameCtnr.style.zIndex = 10

    // Create Mulitplayer Prompts
    const menuNameOne = document.createElement('div')
    const menuNameTwo = document.createElement('div')
    const inputNameOne = document.createElement('input')
    const inputNameTwo = document.createElement('input')
    const nameFormOne = document.createElement('form')
    const nameFormTwo = document.createElement('form')

    // Add CSS styling to major elements
    gameCtnr.style.backgroundColor = 'rgb(0 0 0 / .5)'
    menuNameOne.classList.add('menu-name')
    menuNameTwo.classList.add('menu-name')

    // Give menus text
    menuNameOne.innerText = 'Enter the name of the First Player:'
    menuNameTwo.innerText = 'Enter the name of the second player:'
    inputNameOne.type = 'text'
    inputNameTwo.type = 'text'

    // Add input values to Player menus
    menuNameOne.appendChild(inputNameOne)
    menuNameTwo.appendChild(inputNameTwo)

    // --> Return here to finish Player 1 processing
    nameFormOne.addEventListener('submit', function handler(e) {
        e.preventDefault()

        // Submit player 1 name and switch to player 2 menu
        plyrOne.giveName(inputNameOne.value)
        nameFormOne.removeEventListener('submit', handler)
        menuNameOne.remove(inputNameOne)
        nameFormOne.remove(menuNameOne)
        gameCtnr.append(nameFormTwo)
        nameFormTwo.append(menuNameTwo)
        inputNameTwo.focus()
        
        // Repeat menu processing for Player 2
        nameFormTwo.addEventListener('submit', function handler(e) {
            e.preventDefault()
            
            // Submit player 2 name and switch to Game
            plyrTwo.giveName(inputNameTwo.value)
            nameFormTwo.removeEventListener('submit', handler)
            menuNameTwo.remove(inputNameTwo)
            nameFormTwo.remove(menuNameTwo)
            
            // Generates Timed Layout
            genTimedLayout('pvp')
        })
    })
    
    // Display first menu
    gameCtnr.append(nameFormOne)
    nameFormOne.append(menuNameOne)
    inputNameOne.focus()
    // Continue Player 1 processing -->
}

const promptSinglePlayer = (gameType) => {
    // Brings Game Screen Forward
    gameCtnr.style.zIndex = 10

    // Create Singleplayer Prompt
    const menuNameOne = document.createElement('div')
    const inputNameOne = document.createElement('input')
    const nameFormOne = document.createElement('form')

    // Add CSS styling to major elements
    gameCtnr.style.backgroundColor = 'rgb(0 0 0 / .5)'
    menuNameOne.classList.add('menu-name')

    // Give menus text
    menuNameOne.innerText = 'Enter your Player Name:'
    inputNameOne.type = 'text'

    // Add input values to Player menus
    menuNameOne.appendChild(inputNameOne)

    // --> Return here to finish Player 1 processing
    nameFormOne.addEventListener('submit', function handler(e) {
        e.preventDefault()

        // Submit player 1 name and switch to player 2 menu
        plyrOne.giveName(inputNameOne.value)
        nameFormOne.removeEventListener('submit', handler)
        menuNameOne.remove(inputNameOne)
        nameFormOne.remove(menuNameOne)
        
        // Generates Timed Layout
        if(gameType === 'spd') {genTimedLayout('spd')}
        if(gameType === 'pve') {genAdventureLayout()}
    })
    
    // Display first menu
    gameCtnr.append(nameFormOne)
    nameFormOne.append(menuNameOne)
    inputNameOne.focus()
    // Continue Player 1 processing -->

}

const startMulti = () => {
    homeTgl++
    cycleHomeBtns()
    promptMultiplayer()
    // genTimedLayout('pvp')
}

const startSpeed = () => {
    homeTgl++
    cycleHomeBtns()
    promptSinglePlayer('spd')
    // genTimedLayout('spd')
}

const startAdvnt = () => {
    homeTgl++
    cycleHomeBtns()
    promptSinglePlayer('pve')
}

const startPrac = () => {
    homeTgl++
    cycleHomeBtns()
    genTimedLayout('prac') 
}

document.addEventListener('DOMContentLoaded', () => {
    cycleHomeBtns()
})