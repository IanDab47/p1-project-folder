let homeTgl = 0;

const pvpBtn = document.querySelector('#pvp')
const spdBtn = document.querySelector('#spd')
const advBtn = document.querySelector('#adv')
const pracBtn = document.querySelector('#prac')
const homeBtnArr = [pvpBtn, spdBtn, advBtn, pracBtn]

const gameCtnr = document.querySelector('.game-container')

class Player {
    constructor () {
        this.name = ''
        this.guesses = []
    }

    giveName(name) {
        this.name = name
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

const genTimedLayout = (gameType) => {
    // Create elements for the timed layout design
    const clrBG = document.createElement('div')
    const prmpt = document.createElement('div')
    const timer = document.createElement('div')
    const prmptEntr = document.createElement('input')

    // Assign corresponding classes to elements
    clrBG.classList.add('timed-clr')

    // Generate initial layout
    gameCtnr.style.background = 'linear-gradient(60deg, var(--clr-drk-1) 10%, var(--clr-drk-2) 70%, var(--clr-drk-2))'
    gameCtnr.appendChild(clrBG)
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
            genTimedLayout()
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
    promptMultiplayer()
    // genTimedLayout()
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