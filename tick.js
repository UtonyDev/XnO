const grid = [
    [1, 2, 3], 
    [4, 5, 6], 
    [7, 8, 9]
];

// initialize array for clicked Cells 
let clickedCellsArray = [];
// initialize array for blocked Cells
let blockedCellsArray = [];
// flag to mark when game has ended.

// Player turn mechanism.
let currentPlayer 
currentPlayer = 1; // Let 1 and 0 represent human and AI player turn respectively.
localStorage.setItem('currentPlayer', currentPlayer);
console.log("The current player is: ", localStorage.getItem('currentPlayer'));

let hasGameEnded;
//Check localStorage for present score and set UI.
const storedScore = localStorage.getItem("score");
if (storedScore) {
    const scoreValue = document.querySelector("#score");
    scoreValue.innerText = storedScore;
}

// Check localStorage for present speed level and set it.
const speedValue = localStorage.getItem('speedLevel');    
const slider = document.getElementById('speed');
const output = document.getElementById('output');

const setOutputPosition = (speedLvl) => {
    const sliderWidth = slider.offsetWidth;
    console.log(`The slider width is: ${sliderWidth}px`);
    // By Linear Interpolation: let x rep speedLevel and y rep output position in pixels.
    let x1 = 2000; // max speedLevel
    let x0 = 500; // min speedLevel
    let y1 = sliderWidth - (sliderWidth * 0.054); // max output position in pixels offset by 5.4% to center.
    let y0 = 0; // min output position in pixels
    let x = parseInt(speedLvl); // Current speed level value;
    console.log("the current speed X: ", x);
    let y;
    y = y0 + ( ((y1 - y0) * (x - x0)) / (x1 - x0) );
    console.log("the current y output is: ", y);
    // Use y value to set the output position.
    output.style.left = y + "px";
}

if (speedValue) {
    slider.value = parseInt(speedValue);
    setOutputPosition(parseInt(speedValue))
    output.innerHTML = speedValue;
} else {
    output.innerHTML = 1000;
}
// Function to handle settings.
const settingsIcon = document.querySelector('.settings-icon');
const settings = document.querySelector('.settings');

// Function to handle slider.
console.log(parseInt(slider.value));
let speedLevel;

slider.addEventListener('input', (e) => {
    speedLevel = e.target.value;
    setOutputPosition(Number(speedLevel));
    localStorage.setItem('speedLevel', speedLevel);
    output.innerHTML = e.target.value;
});

console.log("The speed level is: ", parseInt(speedValue));

settingsIcon.addEventListener('click', () => { 
    // Replace the Gear icon with the close icon while rotating as they toggle.
    const isRotated = settingsIcon.classList.contains('rotate-icon')  
    settingsIcon.classList.toggle('rotate-icon');
    settingsIcon.setAttribute('src', isRotated ? 'settings.png' : 'close.png');

    const speedValue = localStorage.getItem('speedLevel') || 1250; // Default to 1000 if not set.
    output.innerHTML = speedValue;
    setOutputPosition(Number(speedValue));
    settings.classList.toggle('hide-settings');
    console.log("The current Game SPEED is: ", Number(speedValue));
});

// Function to display UI for message and action based on game outcome.
const displayMessage = (msg) => {
    const messageContainer = document.querySelector("#message");

    const message = document.createElement("div");
    message.classList.add("message-style");
    
    const text = document.createElement("span");
    text.classList.add("text-style");
    text.innerText = msg;

    const button = document.createElement("button");
    button.innerText = "Play Again";
    button.classList.add("play-again-btn");
    button.addEventListener("click", () => {
    // Reset the game state
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.classList.remove("clicked", "blocked", "purpleTxt", "orangeTxt");
            cell.innerText = "";
        });
        messageContainer.classList.remove("show-message");
        messageContainer.classList.add("hide-message");
        // Event listener for when the transition ends
        const clearContentAfterTransition = () => {
            messageContainer.innerHTML = "";
            // Remove the event listener to avoid memory leaks and multiple firings
            messageContainer.removeEventListener('transitionend', clearContentAfterTransition);
        };

        messageContainer.addEventListener('transitionend', clearContentAfterTransition);
        // Empty the clicked and blocked cells arrays.
        clickedCellsArray = [];
        blockedCellsArray = [];
        // Reset the game end state to allow the play again.
        hasGameEnded = false;
        // After game session has ended switch current player.
        const sessionPlayer = localStorage.getItem('currentPlayer');
        console.log("The session player is: ",sessionPlayer);
        currentPlayer = sessionPlayer == 1 ? 0 : 1; // Here 0 indicates AI turns.
        localStorage.setItem('currentPlayer',  currentPlayer);
    });

    message.appendChild(text);
    message.appendChild(button);

    messageContainer.classList.remove("hide-message");
    messageContainer.classList.add("show-message");
    messageContainer.appendChild(message);
}
// Function to handle score state 
const handleScore = (factor) => {
    // Increment or decrement scoreboard value
    const scoreValue = document.querySelector("#score");
    const currentScore = parseInt(scoreValue.innerText) || 0;
    console.log("current score is", currentScore + factor);
    scoreValue.innerText = (currentScore + factor < 0) ? `-${((currentScore + factor).toString()).replace('-', (currentScore + factor > -10 ? '000' : '00'))}`
     : (currentScore + factor >= 10) ? "00" + (currentScore + factor)
     : "000" + (currentScore + factor);
    const score = scoreValue.innerText;
    // Store the score in local storage
    localStorage.setItem("score", score);
};
// Manual function to reset game without 
const resetGame = () => {
    // Reset the game state
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.remove("clicked", "blocked", "purpleTxt", "orangeTxt");
        cell.innerText = "";
    });
    settings.classList.add("hide-settings")
    // Empty the clicked and blocked cells arrays.
    clickedCellsArray = [];
    blockedCellsArray = [];
}
// Row array combinations
const rowPairsArr = grid.map((row, i, rowArr) => {
    return row.map((colItem, j, colItems) => {
        let rowPaths = [colItems[j], colItems[(j + 1) === row.length ? j - 2 : j + 1]];
        return rowPaths;
    });
});
console.log("Possible row paths ", rowPairsArr);
// Column array combinations
const colPairsArr = grid[0].map((_, colIdx) => {
    return grid.map((_, rowIdx, rowArr) => {
        const nextRowIdx = rowIdx === rowArr.length - 1 ? rowIdx - 2 : rowIdx + 1;
        return [rowArr[rowIdx][colIdx], rowArr[nextRowIdx][colIdx]];
    });
});             
console.log("Possible column paths ", colPairsArr);
// Diagonal array combinations
const diagPairsArr = [
    [[1, 5], [5, 9], [1, 9]],
    [[3, 5], [5, 7], [3, 7]]
];
console.log("Possible diagonal paths ", diagPairsArr);
// The winning Row combinations.
const winningRowCombinations = rowPairsArr.map((eachRows) => {
    const newArr = eachRows.flat().sort().map((num, r, rows) => {
        return (rows[r] === rows[r + 1]) ? num : 0;
    }).filter(num => num !== 0);
    return newArr;
});
// The winning Column combinations.
const winningColCombinations = colPairsArr.map((eachCols) => {
    const newArr = eachCols.flat().sort().map((num, r, cols) => {
        return (cols[r] === cols[r + 1]) ? num : 0;
    }).filter(num => num !== 0);
    return newArr;
});
// The winning Diagonal combinations.
const winningDiagCombinations = diagPairsArr.map((eachDiags) => {
    const newArr = eachDiags.flat().sort().map((num, r, diags) => {
        return (diags[r] === diags[r + 1]) ? num : 0;
    }).filter(num => num !== 0);
    return newArr;
});
console.log("the winning combo for rows are ", winningRowCombinations);
console.log("the winning combo for columns are ", winningColCombinations);
console.log("the winning combo for diagonals are ", winningDiagCombinations);

// Function to check if user or game has made a winning move.
const isRowWin = (cellsArray) => winningRowCombinations.some((row => {
    const occupiedCells = [...cellsArray].sort().map(Number);
    console.log("occupied Cells: ", occupiedCells);
    const sortedRow = [...row].sort();
    return sortedRow.filter((cell) => occupiedCells.includes(cell)).length === 3;
}));
const isColWin = (cellsArray) => winningColCombinations.some((col => {
    const clickedCells = [...cellsArray].sort().map(Number);
    const sortedCol = [...col].sort();
    return sortedCol.filter((cell) => clickedCells.includes(cell)).length === 3;
}));
const isDiagWin = (cellsArray) => winningDiagCombinations.some((diag => {
    const clickedCells = [...cellsArray].sort().map(Number);
    const sortedDiag = [...diag].sort();
    return sortedDiag.filter((cell) => clickedCells.includes(cell)).length === 3;
}));

// Function to check if game has won and perform action
const hasGameWon = (blockedCellsArray) => {
    console.log("HAS GAME is WORKNG")
    if (isRowWin(blockedCellsArray) || isColWin(blockedCellsArray) || isDiagWin(blockedCellsArray)) {
        console.log("The Winning function was called, and the Game has won.");
        // Display message to the user.
        const msg = "You Lose!, Better luck next time 😭";
        displayMessage(msg);
        // Decrement score value by -2.
        const factor = -2;
        handleScore(factor)
        // Set game end flag true to prevent any further play.
        hasGameEnded = true;
        
    }
    return isRowWin(blockedCellsArray) || isColWin(blockedCellsArray) || isDiagWin(blockedCellsArray)
}
// Generate the best possible combinations for the cell passed
const GenerateBlockCombinations = (cell) => {
    let row, col;
    for (let i = 0; i < 3; i++) {
        const idx = grid[i].indexOf(cell);
        if (idx !== -1) {
            row = i;
            col = idx;
            break;
        }
    }

    if (row === undefined || col === undefined) return [];

    const winningLines = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    const neighbors = new Set();

    for (const line of winningLines) {
        for (let i = 0; i < 3; i++) {
            const [r, c] = line[i];
            if (grid[r][c] === cell) {
                // Add the other two cells in this line
                for (let j = 0; j < 3; j++) {
                    if (j !== i) {
                        neighbors.add(grid[line[j][0]][line[j][1]]);
                    }
                }
            }
        }
    }

    return [...neighbors];
};
console.log(GenerateBlockCombinations(2));

const blockedCells = document.querySelectorAll('.blocked');

function MarkCellO(cellId, blockedCellsArray, randomCell) {
    const cell = document.getElementById(`${cellId}`);
    if (!cell.classList.contains("clicked") && !cell.classList.contains("blocked")) {
        cell.classList.add("blocked");
        cell.classList.add("orangeTxt");
        cell.innerText = "O";
        console.log(`Game Blocked cell-${cellId}`);
    } else {
        // Here the cell picked from the possible options is already occupied, so try to follow up the blocked cell.
        console.log(`Cell-${cellId} is already occupied`);
        // Pick a random cell from the blocked cells array.
        console.log("the blocked cells are ", blockedCellsArray);

        const nextBestCells = GenerateBlockCombinations(blockedCellsArray[0]).filter(cell => {
            return !clickedCellsArray.includes(cell);
        });
        console.log("the next best cells to block are", nextBestCells);
        const randomIndex = Math.floor(Math.random() * nextBestCells.length);
        const nextBestCell = nextBestCells[randomIndex];        
        console.log(`the next best cell to block is ${nextBestCell}`);
        const cell = document.getElementById(`${nextBestCell}`);
        cell?.classList.add("blocked");
        cell?.classList.add("orangeTxt");
        cell.innerText = "O";
        console.log(`Game Blocked cell-${nextBestCell}`);
    }

    // Common logic for both paths
    console.log("the blocked cells are ", (blockedCellsArray));
    if (blockedCellsArray.length > 2) {
        console.log("the game has played three times");
        console.log("isRowWin: ", isRowWin(blockedCellsArray));
        console.log("isColWin: ", isColWin(blockedCellsArray));
        console.log("isDiagWin: ", isDiagWin(blockedCellsArray));
    }

    // Delayed evaluation of win condition
    setTimeout(() => {
        if (blockedCellsArray.length > 2) {
            hasGameWon(blockedCellsArray);
        }
    }, 0);
}

let isProcessing;

// Hnadles rendering the cells as well as the click event from the user.
grid.flat().map((cell) => {
    const container = document.querySelector(".game-container");
    const cellElement = document.createElement("div");
    cellElement.innerText = "";

    hasGameEnded = false;
    isProcessing = false;

    cellElement.addEventListener("click", async () => {
        // Prevents the user from clicling after game has ended.
        if (hasGameEnded) {
            console.log("The game has ended !!");
            return;
        };
        // This prevents the user from clicking an already occupied cell.
        if (cellElement.classList.contains("clicked") || cellElement.classList.contains("blocked")) {
            console.log("Cell already occupied!");
            return;
        }
        // This prevents the user from clicking while the game is processing i.e: Prevents rapid clicks. 
        if (isProcessing) {
            console.log("Game is still running, skipping...");
            return;
        }
        // Function to mark cell with 'X' and push into the clicked cells array.
        const MarkCellX = () => { 
            console.log(`User clicked on cell-${cell}`);
            cellElement.classList.add("clicked");
            cellElement.classList.add("purpleTxt");
            // Toggle the text to "X" if clicked, otherwise empty
            cellElement.innerText = cellElement.classList.contains("clicked") ? "X" : "";
            // Add the clicked cell to the cells array.
            const clickedCells = document.querySelectorAll(".clicked");
            console.log(`${clickedCells.length} cell clicked`);

            // loop through clicked cells & store ids in array
            clickedCellsArray = []; // Clear first
            clickedCells.forEach(cell => {
                clickedCellsArray.push(cell.id);
                console.log(clickedCellsArray);
            });
        }
        MarkCellX();
        
        // Validation logic for user input on occupied cell.
        const isPrevSameAsCurrent = (clickedCellsArray.at(-1) == clickedCellsArray.at(-2)); 
        console.log("is the lastest cell same as the former ", isPrevSameAsCurrent )

        const vertexCells = ['1', '3', '7', '9'];
        const edgeCells = ['2', '4', '6', '8'];
        
        if (clickedCellsArray.length > 0 && 
            (vertexCells.some(cell => clickedCellsArray.includes(cell)))) {
            // Get the three best combinations to block based on the cell that was clicked.
            console.log("You clicked on some of the vertex cells");

            const rowIndex = grid.findIndex(row => row.includes(cell));
            const colIndex = grid.map(row => {return row.indexOf(cell)}).filter(indx => indx >= 0);
            console.log(`rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
            // Best possible combinations for game to block for vertex cells clicked.
            const blockCombinations = [
                grid[rowIndex].at( (1 + (-colIndex)) < 0 ? ((1 + (-colIndex)) * -1) : (1 + (-colIndex)) ),
                grid[(rowIndex + 1) > 2 ? (rowIndex - 1) : (rowIndex + 1)].at((-colIndex) < 0 ? ((- colIndex) * -1) : ((-colIndex))), 
                grid[(rowIndex + 1) > 2 ? (rowIndex - 1) : (rowIndex + 1)].at( (1 + (-colIndex)) < 0 ? ((1 + (-colIndex)) * -1) : (1 + (-colIndex)) ),
            ];
            console.log(`blockCombinations: ${blockCombinations}`);
            // Generate random number from 0 the combination length to use as index.
            const randomIndex = Math.floor(Math.random() * blockCombinations.length);
            const randomCell = blockCombinations[randomIndex];
            console.log(`randomCell: ${randomCell}`);
            // Compare the latest cell clicked with the former for equality to prevent the user from clicking the same cell twice.
            if (!isPrevSameAsCurrent) {
                // Only add the blocked cell to the blockedCellsArray if it is the first click.
                // This is to prevent the blocked cell from being added multiple times.
                if (clickedCellsArray.length === 1) {            
                    // Empty array before adding to avoid repititions.
                    blockedCellsArray = [];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(randomCell);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);                 
                }
                
                try {
                    await blockCell(randomCell, blockCombinations, clickedCellsArray, blockedCellsArray);
                    console.log("The blockedCells function was called !!")
                } finally {
                    isProcessing = false;
                }
                   
            } else {
                // User is clicking on an already clicked button.
                console.log("User is clicking on an already clicked button.");
            }
        } else if (clickedCellsArray.length > 0 && 
            (edgeCells.some(cell => clickedCellsArray.includes(cell)))) {
            // Get the three best combinations to block based on the cell that was clicked.
            console.log("You clicked on some of the edge cells");
            const rowIndex = grid.findIndex(row => row.includes(cell));
            const colIndex = grid.map(row => {return row.indexOf(cell)}).filter(indx => indx >= 0);
            console.log(`rowIndex: ${rowIndex}, colIndex: ${colIndex}`);

            // Best possible combinations for game to block for edged cells clicked.
            const blockCombinations = [
                grid[rowIndex].at( (1 + (-colIndex)) < 0 ? ((1 + (-colIndex)) * -1) : (1 + (-colIndex)) ),
                grid[(rowIndex + 1) > 2 ? (rowIndex - 1) : (rowIndex + 1)].at((-colIndex) < 0 ? ((- colIndex) * -1) : ((-colIndex))), 
                grid[(rowIndex === 1) ? (rowIndex - 1) : (rowIndex)].at((colIndex == 1) ? 2 : colIndex == 0 ? 0 : 2),
            ];
            console.log(`blockCombinations: ${blockCombinations}`);
            const randomIndex = Math.floor(Math.random() * blockCombinations.length);
            const randomCell = blockCombinations[randomIndex];
            console.log(`randomCell: ${randomCell}`);
            // Compare the latest cell clicked with the former for equality to prevent the user from clicking the same cell twice.
            if (!isPrevSameAsCurrent) {
                // Only add the blocked cell to the blockedCellsArray if it is the first click.
                // This is to prevent the blocked cell from being added multiple times.
                if (clickedCellsArray.length === 1) {            
                    // Empty array before adding to avoid repititions.
                    blockedCellsArray = [];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(randomCell);
                    console.log("the blocked cell at 1st click is", blockedCellsArray)
                }
                
                try {
                    await blockCell(randomCell, blockCombinations, clickedCellsArray, blockedCellsArray);
                } finally {
                    isProcessing = false;
                } 
            } else {
                // User is clicking on an already clicked button.
                console.log("User is clicking on an already clicked button.");
            }
        } else {
            // Get the 8 best combinations to block since the cell was clicked.
            console.log("The Center cell was clicked");
            const centerCellCombos = grid.flat().filter((num) => num !== 5);
            console.log(centerCellCombos);
            // Pick all 8 random best combinations for the center cell.
            const randomIndex = Math.floor(Math.random() * centerCellCombos.length);
            const randomCell = centerCellCombos[randomIndex];
            console.log(`randomCell: ${randomCell}`);

            const rowIndex = grid.findIndex(row => row.includes(cell));
            const colIndex = grid.map(row => {return row.indexOf(cell)}).filter(indx => indx >= 0);
            console.log(`rowIndex: ${rowIndex}, colIndex: ${colIndex}`);

            // Compare the latest cell clicked with the former for equality to prevent the user from clicking the same cell twice.
            if (!isPrevSameAsCurrent) {
                // Only add the blocked cell to the blockedCellsArray if it is the first click.
                // This is to prevent the blocked cell from being added multiple times.
                if (clickedCellsArray.length === 1) {            
                    // Empty array before adding to avoid repititions.
                    blockedCellsArray = [];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(randomCell);
                    console.log("the blocked cell at 1st click is", blockedCellsArray)
                }
                
                try {
                    await blockCell(randomCell, centerCellCombos, clickedCellsArray, blockedCellsArray);
                } finally {
                    isProcessing = false;
                }
            } else {
                // User is clicking on an already clicked button.
                console.log("User is clicking on an already clicked button.");
            }
        }
    });

    container.appendChild(cellElement);
    cellElement.classList.add("cell");
    cellElement.id = `${cell}`;
});

// Game Stategy logic for blocking user moves.
async function blockCell(randomCell, options, clickedCellsArray, blockedCellsArray) {
    console.log("The blockCell function answered!!!")
    // Pauses execution of logic until former blocking logic has been completed.
    if (isProcessing) {
        console.log("Function B is already running. Skipping new call.");
        return Promise.resolve("Already running"); // Or reject, depending on desired behavior
    }
    // Set the 'Processing' flag to true to prevent the user from clicking.
    isProcessing = true;

    await new Promise((resolve) => {
    // Enclose entire game strategy logic in a timeout to simulate game processing.
    setTimeout(() => {
        // Delay of 1 second to simulate processing.
        // Initialize an array to store the pair selections of two.
        const clickedCellsPairs = [];
        // Split the clicked cells or blocked cells array into pairs selections of two.
        const getPairSelections = (pairSelection, cellsArray) => {
            for (let i = 0; i < cellsArray.length; i++) {
                for (let j = i + 1; j < cellsArray.length; j++) {
                    pairSelection.push([cellsArray[i], cellsArray[j]]);
                }
            }
        }
        // Pass in both the empty array for the pair selection as well as the cells array.
        getPairSelections(clickedCellsPairs, clickedCellsArray);
        console.log("pairs: ", clickedCellsPairs);
        // Helper function to check if two arrays contain the same two elements (unordered pair).
        function isSamePair(a, b) {
            return (a[0] == b[0] && a[1] == b[1]) || (a[0] == b[1] && a[1] == b[0]);
        }
        // Check if currently Clicked cells are in a specific paths whether row, column or diagonal.
        const isInPath = (cellsPairs, path) =>
            cellsPairs.some((pair) => {
                console.log("The split pair selections  are: ", cellsPairs)
                const sortedPairs = [...path].flat().sort();
                return sortedPairs.some((row) => isSamePair(pair, row));
            });
        // Returns the pair array common with the specified path arrays: rowPairArr, colPairArr, diagPairArr e.t.c in order to determine all possible paths to block.
        const commonPairPath = (cellsPairs, commonPath) => cellsPairs.filter((pair) => {
            const sortedPairs = [...commonPath].flat().sort();
            return sortedPairs.some((row) => isSamePair(pair, row));
        }).flat();
        console.log(`clickedCellsArray: ${clickedCellsArray}`);
        
        // Get the winning combination in which the specified path belongs to.
        const getWinningCombination = (winningCombination, commonPair) => winningCombination.find((eachCombo) => {
            const cellCommonPair = [...commonPair].map(Number);
            return eachCombo.filter((cell) => cellCommonPair.includes(cell)).length >= 2;
        });
        // Function to get the next cell path needed to win.
        const nextCell = (winningCombination, commonPair) => {
            const winningCombos = winningCombination
            return winningCombos?.filter((cell) => {
                const cellCommonPair = [...commonPair].map(Number);
                return !(cellCommonPair.includes(cell));
            });
        };
        // Game strategy depending on current number of clicks.
        if (clickedCellsArray.length < 2) {
            console.log("The user has made the first 1️⃣ move");
            // Manually update previously blocked cell to array before blocking the cell.
            blockedCells.forEach((cell) => {
                blockedCellsArray.push(cell.id);
            })
            console.log("the blocked cell at 1st click is", (blockedCellsArray));
            console.log("The game has been completed...")
            MarkCellO(randomCell, (blockedCellsArray), randomCell);
            resolve(true);
            console.log(`Blocked cell-${randomCell}`);      
        } else if (clickedCellsArray.length >= 2) {
            // User has made two or more moves.
            console.log(`User has made ${clickedCellsArray.length} moves.`);
            console.log("clickedCellsArray: ", clickedCellsArray);
            console.log("blockedCellsArray: ", blockedCellsArray);

            console.log("isRowWin: ", isRowWin(clickedCellsArray));
            console.log("isColWin: ", isColWin(clickedCellsArray));
            console.log("isDiagWin: ", isDiagWin(clickedCellsArray));
            // Check if the user has made a winning move.
            
            if ((isRowWin(clickedCellsArray) || isColWin(clickedCellsArray) || isDiagWin(clickedCellsArray)) && !(isRowWin(blockedCellsArray) || isColWin(blockedCellsArray) || isDiagWin(blockedCellsArray))) {
                // User has made a winning move.
                console.log("The user has made a winning move");
                // Display UI for message and action based on game outcome.
                const msg = "Congratulations!, You have won 😎";
                displayMessage(msg);
                // Handle score state 
                const factor = 2;
                handleScore(factor);
                // Set game end flag true to prevent any further play.
                hasGameEnded = true;
                
            
            } else if (clickedCellsArray.length == 5 && blockedCellsArray.length === 4) {
                // Here the game ends at a draw display the draw message and reset the game.
                const msg = "It's a Tie! 😐";
                displayMessage(msg);
                // Deduct score by -1 to encourage the user to play again. 
                handleScore(-1);
                // Set game end flag true to prevent any further play.
                hasGameEnded = true;
                

            } else {
                console.log("The user nor game has neither made a winning move, try and block");
                // Searching the Clicked Cells Array for the last two moves by using the two pair combinations created to search each segment and checking if the next path is blocked.

                // Winning combinations for rows, columns and diagonals.
                    const rowWinningCombo = getWinningCombination(winningRowCombinations, commonPairPath(clickedCellsPairs, rowPairsArr));
                    const colWinningCombo = getWinningCombination(winningColCombinations, commonPairPath(clickedCellsPairs, colPairsArr));
                    const diagWinningCombo = getWinningCombination(winningDiagCombinations, commonPairPath(clickedCellsPairs, diagPairsArr));
                // Third cells winning combos for each combinations
                    console.log("row combo", rowWinningCombo);
                    console.log("column combo", colWinningCombo);
                    console.log("diagonal combo", diagWinningCombo);
                // Get the Next cell for specified path.
                    const row3rdCell = nextCell(getWinningCombination(winningRowCombinations, commonPairPath(clickedCellsPairs, rowPairsArr)), commonPairPath(clickedCellsPairs, rowPairsArr));
                    console.log(row3rdCell)
                    const col3rdCell = nextCell(getWinningCombination(winningColCombinations, commonPairPath(clickedCellsPairs, colPairsArr)), commonPairPath(clickedCellsPairs, colPairsArr));
                    console.log(row3rdCell)
                    const diag3rdCell = nextCell(getWinningCombination(winningDiagCombinations, commonPairPath(clickedCellsPairs, diagPairsArr)), commonPairPath(clickedCellsPairs, diagPairsArr));
                    console.log(row3rdCell);

                // Function to check if 3rd Cell is not currently occupied.
                function isCellFilled(cell) {
                    if (!Array.isArray(cell) || cell.length === 0) {
                        console.log("the recieved third move cell array is", cell);
                        return true;
                    }
                    const cellId = [...cell][0];
                    console.log(cellId);
                    const cellElement = document.getElementById(`${cellId}`);
                    return cellElement.classList.contains("clicked") || cellElement.classList.contains("blocked");
                };
                // Check if the Game is in the path to win.
                const numBlockedCells = [...blockedCellsArray].sort().map(Number);
                console.log("the number blocked cells are", numBlockedCells)
                // Return the best possible pairs for the blocked cells.
                const blockedCellsPairs = [];
                // Pass in both the empty array for the pair selection as well as the cells array.
                getPairSelections(blockedCellsPairs, numBlockedCells);
                console.log("the pairs of blocked cells are", blockedCellsPairs);
                
                // Check if Blocked cells are in a winning row, column or diagonal path as well.
                console.log("is the blocked cells in a row? ", isInPath(blockedCellsPairs, rowPairsArr));
                console.log("is the blocked cells in a column? ", isInPath(blockedCellsPairs, colPairsArr));
                console.log("is the blocked cells in a diagonal? ", isInPath(blockedCellsPairs, diagPairsArr));
                // Returns the pair array common with the specified path arrays: rowPairArr, colPairArr, diagPairArr e.t.c in order to determine all possible paths to block.

                console.log("the common blocked row pair is", commonPairPath(blockedCellsPairs, rowPairsArr));
                console.log("the common blocked column pair is", commonPairPath(blockedCellsPairs, colPairsArr));
                console.log("the common blocked diagonal pair is", commonPairPath(blockedCellsPairs, diagPairsArr));

                // Get winning combo for that common pair so to extract the third cell to win.
                const row3rdBlckCell = nextCell(getWinningCombination(winningRowCombinations, commonPairPath(blockedCellsPairs, rowPairsArr)), commonPairPath(blockedCellsPairs, rowPairsArr));
                const col3rdBlckCell = nextCell(getWinningCombination(winningColCombinations, commonPairPath(blockedCellsPairs, colPairsArr)), commonPairPath(blockedCellsPairs, colPairsArr));
                const diag3rdBlckCell = nextCell(getWinningCombination(winningDiagCombinations, commonPairPath(blockedCellsPairs, diagPairsArr)), commonPairPath(blockedCellsPairs, diagPairsArr));
                console.log("the third cell to be blocked by from the blocked cells in row is", row3rdBlckCell);
                console.log("the third cell to be blocked by from the blocked cells in column is", col3rdBlckCell);
                console.log("the third cell to be blocked by from the blocked cells in diagonal is", diag3rdBlckCell);

                console.log("Are the cells in ROW: ", isInPath(clickedCellsPairs, rowPairsArr))
                console.log("Are the cells in COLUMN: ", isInPath(clickedCellsPairs, colPairsArr))
                console.log("Are the cells in DIAG: ", isInPath(clickedCellsPairs, diagPairsArr))

                // Check if the blocked cells are in a winning path.
                if (isInPath(clickedCellsPairs, rowPairsArr) && !isCellFilled(row3rdCell) && isCellFilled(row3rdBlckCell)) {
                    console.log("the blocked cells array is after the user has place THRICE from row is", blockedCellsArray);

                    // Returns the index of the row that contains the clicked cells.
                    const rowWinningCombo = getWinningCombination(winningRowCombinations, commonPairPath(clickedCellsPairs, rowPairsArr));
                    console.log("Common row is", commonPairPath(clickedCellsPairs, rowPairsArr));
                    console.log("the row winning combination for rows is", winningRowCombinations);
                    console.log("the matching row combination is", rowWinningCombo);

                    const thirdCell = nextCell(rowWinningCombo, commonPairPath(clickedCellsPairs, rowPairsArr));
                    console.log("the clicked cells are: ", clickedCellsArray);
                    console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);
                    // First check if the third cell in the blocked cells is occupied
                    if (isInPath(blockedCellsPairs, rowPairsArr) && !isCellFilled(row3rdBlckCell)) { 
                        // If it is, then we need to block it
                        console.log("Blocking the third cell in row:", row3rdBlckCell);
                        blockedCellsArray.push(row3rdBlckCell[0]);
                        MarkCellO(row3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);
                        // Add the blocked cells to the blockedCellsArray then check if game has won
                        
                    } else {
                        // Block the clicked cell third cell.
                        const cellId = thirdCell[0];
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(cellId);
                        console.log("the blocked cell at 1st click is", blockedCellsArray);
                        MarkCellO(cellId, (blockedCellsArray), randomCell);
                        resolve(true);
                    }
                } else if (isInPath(clickedCellsPairs, colPairsArr) && !isCellFilled(col3rdCell) && isCellFilled(col3rdBlckCell)) {
                    console.log("the blocked cells array is after the user has place THRICE from col is", blockedCellsArray);

                    const colWinningCombo = getWinningCombination(winningColCombinations, commonPairPath(clickedCellsPairs, colPairsArr));
                    console.log("Common column is", commonPairPath(clickedCellsPairs, colPairsArr));
                    console.log("the column winning combination for columns is", winningColCombinations);
                    console.log("the matching column combination is", colWinningCombo);

                    const thirdCell = nextCell(colWinningCombo, commonPairPath(clickedCellsPairs, colPairsArr));
                    console.log("the clicked cells are: ", clickedCellsArray)
                    console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

                    if (isInPath(blockedCellsPairs, colPairsArr) && !isCellFilled(col3rdBlckCell)) { 
                        // If it is, then we need to block it
                        console.log("Blocking the third cell in column:", col3rdBlckCell);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(col3rdBlckCell[0]);
                        console.log("the blocked cell at 1st click is", blockedCellsArray);
                        MarkCellO(col3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);
                    } else {
                        // Block the clicked cell third cell.
                        const cellId = thirdCell[0];
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(cellId);
                        console.log("the blocked cell at 1st click is", blockedCellsArray);
                        MarkCellO(cellId, (blockedCellsArray), randomCell);
                        resolve(true);
                    }
                } else if (isInPath(clickedCellsPairs ,diagPairsArr) && !isCellFilled(diag3rdCell) && isCellFilled(diag3rdBlckCell)) {
                    console.log("the blocked cells array is after the user has place THRICE from diag is", blockedCellsArray);

                    const diagWinningCombo = getWinningCombination(winningDiagCombinations, commonPairPath(clickedCellsPairs, diagPairsArr));
                    console.log("Common diagonal is", commonPairPath(clickedCellsPairs, diagPairsArr));
                    console.log("the diagonal winning combination for diagonals is", winningDiagCombinations);
                    console.log("the matching diagonal combination is", diagWinningCombo);

                    const thirdCell = nextCell(diagWinningCombo, commonPairPath(clickedCellsPairs, diagPairsArr));
                    console.log("the clicked cells are: ", clickedCellsArray)
                    console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

                    if (isInPath(blockedCellsPairs, diagPairsArr) && !isCellFilled(diag3rdBlckCell)) { 
                        // If it is, then we need to block it
                        console.log("Blocking the third cell in column:", diag3rdBlckCell);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(diag3rdBlckCell[0]);
                        console.log("the blocked cell at 1st click is", blockedCellsArray);
                        MarkCellO(diag3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);
                    } else {
                        // Block the clicked cell third cell.
                        const cellId = thirdCell[0];
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(cellId);
                        console.log("the blocked cell at 1st click is", blockedCellsArray);
                        MarkCellO(cellId, (blockedCellsArray), randomCell);
                        resolve(true);
                    }
                } else {
                    // No winning path found.
                    console.log("The clicked cells dont line up to lead to a win path");
                    console.log("the blocked cells array is after the user has place THRICE is", (blockedCellsArray));
                    // The clicked cells dont line up to lead to a win path for the clicked cells so we check if the blocked cells do. //
                    if (isInPath(blockedCellsPairs, rowPairsArr) && !isCellFilled(row3rdBlckCell)) {
                        // If the blocked cells are in a winning path.
                        console.log("Blocking the third cell in row:", row3rdBlckCell);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(row3rdBlckCell[0]); 
                        console.log("the blocked cell at > 2 click is", (blockedCellsArray)); 
                        MarkCellO(row3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);
                        
                    } else if (isInPath(blockedCellsPairs, colPairsArr) && !isCellFilled(col3rdBlckCell)) {
                        // If the blocked cells are in a winning path.
                        console.log("Blocking the third cell in column:", col3rdBlckCell);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(col3rdBlckCell[0]);
                        console.log("the blocked cell at > 2 click is", (blockedCellsArray)); 
                        MarkCellO(col3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);

                    } else if (isInPath(blockedCellsPairs, diagPairsArr) && !isCellFilled(diag3rdBlckCell)) {
                        // If the blocked cells are in a winning path.
                        console.log("Blocking the third cell in diagonal:", diag3rdBlckCell);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(diag3rdBlckCell[0]);
                        console.log("the blocked cell at > 2 click is", (blockedCellsArray));
                        MarkCellO(diag3rdBlckCell[0], (blockedCellsArray), randomCell);
                        resolve(true);

                    } else {
                        // No winning path found for blocked cells.
                        console.log("No winning path found for blocked cells.");
                        // here theres no clear path to block so pick any of the unblocked or unclicked cells
                        const clickedCells = [...clickedCellsArray];
                        const blockedCells = [...blockedCellsArray];
                        const occupiedCells = clickedCells.concat(blockedCells).sort().map(Number);
                        console.log("the cells occupied are", occupiedCells);
                        const arr = [...grid].flat();
                        console.log("all the cell ", arr);
                        const emptyCells = arr.filter((cell) => !occupiedCells.includes(cell));
                        console.log('empty cells are', emptyCells);
                        // Check if the empty cells array is empty is so this indicates a draw.
                        if (emptyCells.length == 0) {
                            console.log("The game has ended in a DRAW!");
                            // Here the game ends at a draw display the draw message and reset the game.
                            const msg = "It's a Tie!, 😐";
                            displayMessage(msg);
                            // Deduct score by -1 to encourage the user to play again. 
                            handleScore(-1);
                        } else {
                            const randomIndex = Math.floor(Math.random() * emptyCells.length);
                            const randomCell = emptyCells[randomIndex];
                            const cellToBlock = document.getElementById(`${randomCell}`);                
                            console.log(`Blocked cell-${cellToBlock.id}`);
                            // Manually update previously blocked cell to array before blocking the cell.
                            blockedCellsArray.push(randomCell);
                            console.log("the blocked cell at > 2 click is", (blockedCellsArray)); 
                            MarkCellO(randomCell, (blockedCellsArray), randomCell);
                            resolve(true);
                        }
                        
                    }   
                }
            }
        } 
        // Reset the 'Processing' flag after the timeout to allow the user click another cell.
        isProcessing = false
        // After game session has ended switch current player.
        const sessionPlayer = localStorage.getItem('currentPlayer');
        currentPlayer = sessionPlayer == 1 ? 0 : 1; // Here 0 indicates AI turns.
        localStorage.setItem('currentPlayer',  currentPlayer);
        console.log("Game is DONE processing");
        
        console.log("The game has ended: ", hasGameEnded);
    }, speedLevel);
    // End of Enclose for entire game strategy logic in a timeout to simulate game processing.
    });
}
