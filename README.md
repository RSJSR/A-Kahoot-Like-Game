# ReactJS: A Kahoot Like Game

0. Introduction
1. Run the project
2. Functions
3. Differences with [Kahoot](https://kahoot.com/)

## 0. Introduction

[Kahoot](https://kahoot.com/) is a popular quiz platform, we developed a Kahoot like game in this project.

## 1. Background & Motivation

### 1.1. Run the Backend Server
 * To run the backend server, simply run `npm start` in the `backend` directory. This will start the backend.

### 1.2. Run the Frontend Server
 * Navigate to the `frontend` folder and run `npm install` to install all of the dependencies necessary to run the ReactJS app. Then run `npm start` to start the ReactJS app.

Now you're ready.

## 2. Functions

### 2.1. Admin Auth

#### 2.1.1. Register Screen
 * User could register with their `email` and `password` and `name`.

#### 2.1.2. Login Screen
 * User could login with their registered `email` and `password`.

#### 2.1.3. Logout Button
 * A logout button exists on all screens that require an authorised user, returns to the login screen when click the logout button.

### 2.2. Admin Creating & Editing a Game

#### 2.2.1. Dashboard
 * The dashboard will show all games of current user, where users could create a new game, edit their existing games, or delete a game.


#### 2.2.2. Edit a Game
 * This screen allows users to add a new question, delete a particular question, or add a new question, or edit a specific question.

#### 2.2.3. Edit BigBrain Game Question
 * This screen allows users to create or edit a question.

### 2.3. Admin Control a Game, and Show Results

#### 2.3.1. Starting a game
 * Users could start a game on the dashboard page.
 * When the game is started, a popup will display the new session ID and a clickable "Copy Link" button, and the players could join the session with the url.

#### 2.3.2. Move on to the next question
 * Users could move on to the next question by click "Advance" button on the popup page.

#### 2.3.3. Stopping a game and show result
 * When the game is stopped, a popup appears that prompts the admin "Would you like to view the results?" If the user click yes, a table will show the top 5 users and their score.

### 2.4. Player Able to Join and Play

#### 2.4.1. Play Join
 * A user is able to join the session with the url generated when start the game.

#### 2.4.2. Play Game
 * Player could answer the current question until the timer hits 0.

#### 2.4.3. Game Results
 * After the session is stopped, a page is displayed showing the player's overall points and performance in each question.

### 2.5. Past Quiz Results
 * Allow admins to access a page whereby they can see a list of previous sessions for a quiz, and then view results for those previous sessions as well.
 
## 3. Differences with [Kahoot](https://kahoot.com/)
