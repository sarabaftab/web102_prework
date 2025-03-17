/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const gameElement = document.createElement("div");

    gameElement.classList.add("game-card");
    gameElement.innerHTML = `
            <h3>${game.name}</h3>
            <img class="game-img" src="${game.img}" alt="${game.name}">
            <p><strong>Pledged:</strong> $${game.pledged.toLocaleString()}</p>
            <p><strong>Backers:</strong> ${game.backers.toLocaleString()}</p>
        `;
    gamesContainer.appendChild(gameElement);
  }
}
addGamesToPage(GAMES_JSON);
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce(
  (total, game) => total + game.backers,
  0
);
contributionsCard.textContent = totalContributions.toLocaleString();
// set the inner HTML using a template literal and toLocaleString to get a number with commas

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
raisedCard.textContent = totalRaised.toLocaleString();

// set inner HTML using template literal

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = totalGames.toLocaleString();
/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
  addGamesToPage(unfundedGames);

  console.log("Number of unfunded games:", unfundedGames.length);
}
filterUnfundedOnly();
// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);
  addGamesToPage(fundedGames);
  console.log("Number of funded games:", fundedGames.length);
}
filterFundedOnly();
// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);
  addGamesToPage(GAMES_JSON);
  // add all games from the JSON data to the DOM
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(
  (game) => game.pledged < game.goal
).length;
console.log("Number of unfunded games:", unfundedGamesCount);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames} games. 
Currently, ${unfundedGamesCount} game${
  unfundedGamesCount === 1 ? "" : "s"
} remain${unfundedGamesCount === 1 ? "s" : ""} unfunded. 
We need your help to fund these amazing games!`;
// create a new DOM element containing the template string and append it to the description container

const descriptionParagraph = document.createElement("p");
descriptionParagraph.textContent = displayStr;
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;
// console.log("Top Funded Game:", firstGame);
// console.log("Runner-Up:", secondGame);
// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement("p");
firstGameName.textContent = firstGame.name;
firstGameContainer.appendChild(firstGameName);
// do the same for the runner up item
const secondGameName = document.createElement("p");
secondGameName.textContent = secondGame.name;
secondGameContainer.appendChild(secondGameName);

// my custom feature: total funding progress bar(color of exceeded part changes to orange if exceeds goal):
function updateFundingProgress() {
  const totalPledged = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);
  const totalGoal = GAMES_JSON.reduce((sum, game) => sum + game.goal, 0);

  let percentageFunded = (totalPledged / totalGoal) * 100;

  const progressBar = document.getElementById("funding-progress");
  const overfillBar = document.getElementById("funding-overfill");
  const fundingText = document.getElementById("funding-text");

  if (percentageFunded <= 100) {
    // If funding is 100% or less, only fill the green progress bar
    progressBar.style.width = `${percentageFunded}%`;
    overfillBar.style.width = "0%";
  } else {
    // If funding exceeds 100%, set the green bar to 100% and fill the overfill part
    progressBar.style.width = "100%";
    overfillBar.style.width = `${percentageFunded - 100}%`;
  }

  fundingText.textContent = `Raised $${totalPledged.toLocaleString()} out of $${totalGoal.toLocaleString()} (${percentageFunded.toFixed(
    2
  )}%)`;
}

window.onload = function () {
  updateFundingProgress();
};
