let homeTgl = 0
let tick = 0
const mspf = 33

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
    }

    giveName(name) {
        this.name = name.toUpperCase()
        
        // console.log(`This player's name is ${name}`)
    }
    newGuess(guess) {
        this.guesses.push(guess)
    }
}
const plyrOne = new Player()
const plyrTwo = new Player()

const cycleHomeBtns = () => {
    if(homeTgl) {
        pvpBtn.removeEventListener('click', startMulti)
        spdBtn.removeEventListener('click', startSpeed)
        advBtn.removeEventListener('click', startAdvnt)
        pracBtn.removeEventListener('click', startPrac)
    }
    else {
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

const testStringReturn = () => {return 'String'}

// const startCountDown = () => {
//     // Create variables for timer
//     let leadZero = 3
//     let min = zeroPad(0, 2)
//     let sec = '30'
//     let mSec = zeroPad(tick, leadZero)
//     tick++
    
    
//     return `${min}:${sec}.${mSec}`
// }

const genTimedLayout = (gameType) => {
    // DEBUG CODE //
    gameCtnr.style.zIndex = 10

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

    let hi = ''

    // --> Return here for game function
    const gameStart = () => {
        hi += 'hi'
        console.log(hi)
        rndStart.addEventListener('click', () => {
            console.log(hi)
            // Enable player submission
            plyrGuessForm.removeEventListener('submit', () => {})

            // Make start timer do nothing if clicked again
            rndStart.removeEventListener('click', () => {})

            // Display color to guess
            newClr = newHexCode()
            clrBG.style.background = `#${newClr}`
            gameClrs.push(newClr)

            // PVP GAME FUNCTION //
            if(gameType = 'pvp') {
                // Start countdown timer
                tick = 30000   // 30 seconds
                const countDown = setInterval(countDownTimer, mspf)

                // Submission function
                plyrGuessForm.addEventListener('submit', (e) => {
                    console.log(hi)
                    // Finish round
                    e.preventDefault()
                    clearInterval(countDown)

                    // Add guess to player guesses and clear input
                    if(plyrTurn() == 0 && guessProtect(plyrTwo)) {plyrTwo.newGuess(plyrGuess.value)}
                    else if(guessProtect(plyrOne)) {plyrOne.newGuess(plyrGuess.value)}
                    plyrGuess.value = ''

                    console.log(plyrOne.guesses)
                    console.log(plyrTwo.guesses)
                    console.log(gameClrs)

                    // Check if game is ongoing or finished
                    if(gameClrs.length <= rounds * 2) {return}
                    else {gameEnd()}
                })
            }
        })
    }

    const gameEnd = () => {
        console.log('We have a winner!')
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

    // Binary counter for mulitplayer turns
    const plyrTurn = () => {
        return gameClrs.length % 2
    }

    // Prevents extra guesses during game
    const guessProtect = (player) => {
        return player.guesses.length < Math.ceil(gameClrs.length / 2)
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
    plyrInfo.innerText = `${plyrOne.name}! Please start your timer to begin`
    prmpt.innerText = 'Guess the color that appears to the right of the screen.'
    rndStart.innerText = 'Start Timer'
    plyrGuess.placeholder = '#00FFCC'
    rndEnd.innerText = 'Enter Guess'

    //   :: SECURITY MEASURES ::   //
    // Prevents early player submission to refresh page
    plyrGuessForm.addEventListener('submit', (e) => {e.preventDefault()})   
    
    // Generate initial layout
    plyrGuessForm.append(plyrGuess, rndEnd)
    fillBox.append(plyrInfo, rndStart, rndInfo, prmpt, plyrGuessForm)
    gameCtnr.append(clrBG, fillBox, timeDisplay)

    // Start game after Timer clicked
    console.log('ran again')
    gameStart()
    // Continue game function -->
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
    nameFormOne.addEventListener('submit', (e) => {
        e.preventDefault()

        // Submit player 1 name and switch to player 2 menu
        plyrOne.giveName(inputNameOne.value)
        nameFormOne.removeEventListener('submit', (e) => {e.preventDefault()})
        menuNameOne.remove(inputNameOne)
        nameFormOne.remove(menuNameOne)
        gameCtnr.append(nameFormTwo)
        nameFormTwo.append(menuNameTwo)
        inputNameTwo.focus()
        
        // Repeat menu processing for Player 2
        nameFormTwo.addEventListener('submit', (e) => {
            e.preventDefault()
            
            // Submit player 2 name and switch to Game
            plyrTwo.giveName(inputNameTwo.value)
            nameFormTwo.removeEventListener('submit', (e) => {e.preventDefault()})
            menuNameTwo.remove(inputNameTwo)
            nameFormTwo.remove(menuNameTwo)
            // gameCtnr.remove(nameFormTwo)
            
            // Generates Timed Layout
            // genTimedLayout('Multiplayer')
            genTimedLayout('pvp')
        })
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
    // promptMultiplayer()
    genTimedLayout('pvp')
}

const startSpeed = () => {
    homeTgl++
    cycleHomeBtns()
    console.log('speedrun has started')    
}

const startAdvnt = () => {
    homeTgl++
    cycleHomeBtns()
    console.log('adventure has started')    
}

const startPrac = () => {
    homeTgl++
    cycleHomeBtns()
    console.log('practice has started')    
}

document.addEventListener('DOMContentLoaded', () => {
    cycleHomeBtns()
})