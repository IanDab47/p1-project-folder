# !:: Pick the color ::

"pick the color" is a simple idea with many different ways to play. There are 4 different modes for you to choose from: Multiplayer, Speedrun, Adventure, and Practice. Each mode will test you on how well you can determine the values of a digital color.

!Multiplayer (2 player only) allows you and another player to compete against each other to see who can determine color values most accurately. You'll be prompted to enter a name for each player, and the game will start after player one starts their timer. Each player will have 30 seconds to guess their displayed color with a total of 5 rounds. Once completed, the winner will be calculated and displayed.

!Speedrun Mode tests how fast and accurate you can determine colors displayed on a screen. Five random colors will be presented to you and you'll have to guess each one as fast as possible to get the highest score.

!Adventure Mode will place you in a box where you'll have to defend your territory by destroying boxes. Each box will have specific color and a random color value will be presented for you destroy. Destroy the wrong one and you'll lose a life. Allowing the wrong box inside will also lose you a life. Lose too many lives and you'll lose the game. 

!Practice Mode lets you hone your color evaluating skills to your heart's content. Infinitely guess the displayed color and see how close you get every time. You'll be able to see your most previous estimate after every guess

# MVP Goals:
- PvP:
  - Win condition: Closest pick wins
  - Prompt players to enter custom names
  - Generate 10 unique random color values (5 per player)
  - Display a 30sec timer for each player
  - Prompt each player to start their timer
  - Calculate percentage of accuracy for each player
  - Display total and each guess accuracy and winner after all 10 guesses + correct values
  - Prompt players to restart game or return home
!    - If restarted, prompt players to use same or different usernames

- PvE:
  - Win condition: Complete the 5 levels in Adventure Mode
  - Prompt player to enter custom name
  - Select CPU difficulty (determines accuracy of RNG)???
  - Generate any amount of random color values
  - Canvas:
    - Create backdrop for game
    - Create constantly scrolling boxes to move down highway
    - Create hitbox for player interaction to hit boxes (lmao)
    - Increase speed of boxes per level
  - Display when player wins or loses
!  - Prompt player to restart or return home when game ends

- Speedrun:
  - Win condition: Closest pick + fastest time
  - Prompt player to enter custom name
  - Generate 5 unique random color values
  - Run an accumulating timer during gameplay
  - Calculate percentage of accuracy
  - Display individual and total guess accuracy, and total time for score
  - Create a local storage for all highscores w/ corresponding username
  - Prompt user to restart game or return home
!    - If restarted, player uses same name

- Practice:
  - No win condition
  - Generate random color value every round
  - Caclulate and display guess accuracy upon submission + correct value
!  - Display previous color below current color

- Display Exit & Restart buttons during gameplay
- Home menu to select gamemodes
!- Generate necessary pages through JS w/ DOM Manip

# Stretch Goals:
- Set difficulty before starting: Easy: #---, Medium: #------, Hard: rgb(#,#,#), Extreme: hsl(#,#,#))
- Write a story for adventure mode
- Give boxes HP and have them shrink per hit
- Create a GLOBAL storage for all highscores and corresponding username
- Prevent players from creating vulgar or insulting usernames
- Light & Dark backgrounds
- SFX!!!
