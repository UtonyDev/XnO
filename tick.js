const grid = [
    [1, 2, 3], 
    [4, 5, 6], 
    [7, 8, 9]
];

// initialize array for clicked Cells 
let clickedCellsArray = [];
// initialize array for blocked Cells
let blockedCellsArray = [];

//Check localStorage for present score
const storedScore = localStorage.getItem("score");
if (storedScore) {
    const scoreValue = document.querySelector("#score");
    scoreValue.innerText = storedScore;
}    
// Function to display UI for message and action based on game outcome.
const displayMessage = (msg, imagesrc) => {
            const messageContainer = document.querySelector("#message");

            const message = document.createElement("div");
            message.classList.add("message-style");

            const img = document.createElement("img");
            img.src = imagesrc;
            img.alt = "Congratulations!";
            img.classList.add("outcome-img");
            
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
                messageContainer.classList.replace("show-message", "hide-message");
                messageContainer.innerHTML = "";
                // Empty the clicked and blocked cells arrays.
                clickedCellsArray = [];
                blockedCellsArray = [];
            });

            message.appendChild(img);
            message.appendChild(text);
            message.appendChild(button);

            messageContainer.classList.replace("hide-message", "show-message");
            messageContainer.appendChild(message);
}
// Function to handle score state 
const handleScore = (factor) => {
    // Increment or decrement scoreboard value
    const scoreValue = document.querySelector("#score");
    const currentScore = parseInt(scoreValue.innerText) || 0;
    console.log("current score is", currentScore);
    scoreValue.innerText = (currentScore + factor) >= 10 ? "00" + (currentScore + factor) : "000" + (currentScore + factor);
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
    // Empty the clicked and blocked cells arrays.
    clickedCellsArray = [];
    blockedCellsArray = [];
}

// row array combinations
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
        const msg = "You Lose!, Better luck next time 😭"
        const imgsrc = "lose.png";
        displayMessage(msg, imgsrc);
        // Decrement score value by -2.
        const factor = -2;
        handleScore(factor)
    }
    return isRowWin(blockedCellsArray) || isColWin(blockedCellsArray) || isDiagWin(blockedCellsArray)
}

// Remove duplicate values from an array
const removeDuplicates = (arr) => {
    return [...new Set(arr)];
};

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

    return [...neighbors];};
console.log(GenerateBlockCombinations(2)); // Example usage, replace 1 with the cell you want to check


function MarkCell(cellId, blockedCellsArray, randomCell) {
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
        blockedCellsArray.push(nextBestCell);
        console.log(`the next best cell to block is ${nextBestCell}`);
        const cell = document.getElementById(`${nextBestCell}`);
        cell?.classList.add("blocked");
        cell?.classList.add("orangeTxt");
        cell.innerText = "O";
        console.log(`Game Blocked cell-${nextBestCell}`);
    }

    // Common logic for both paths
    console.log("the blocked cells are ", removeDuplicates(blockedCellsArray));
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

function blockCell(randomCell, options, clickedCellsArray, blockedCellsArray) {

    const otherCellOptions = options.filter((cell) => cell !== randomCell);
    console.log("other options: ", otherCellOptions);

    const currentCell = document.getElementById(`${randomCell}`);
    console.log(currentCell.classList.contains("clicked"));
    console.log(currentCell.classList.contains("purpleTxt"));

    // Initialize an array to store the clicked cells whose combinations of two will be determined.
    const pairSelections = [];
    // Split the clicked cells or blocked cells array into pairs selections of two.
    const getPairSelections = () => {
        for (let i = 0; i < clickedCellsArray.length; i++) {
            for (let j = i + 1; j < clickedCellsArray.length; j++) {
                pairSelections.push([clickedCellsArray[i], clickedCellsArray[j]]);
            }
        }
    }    
    getPairSelections();
    console.log("pairs: ", pairSelections);

    // Helper function to check if two arrays contain the same two elements (unordered pair).
    function isSamePair(a, b) {
    return (a[0] == b[0] && a[1] == b[1]) || (a[0] == b[1] && a[1] == b[0]);
    }

    // Check if currently picked cells are in a specific paths whether row, column or diagonal.
    const isInRow = pairSelections.some((pair) => {
        console.log("The split pair selections  are: ", pairSelections)
        const sortedPairs = [...rowPairsArr].flat().sort();
        return sortedPairs.some((row) => isSamePair(pair, row));
    });
    const isInCol = pairSelections.some((pair) => {
        console.log("The split pair selections are: ", pairSelections)
        const sortedPairs = [...colPairsArr].flat().sort();
        return sortedPairs.some((col) => isSamePair(pair, col));
    });
    const isInDiag = pairSelections.some((pair) => {
        console.log("The split pair selections are: ", pairSelections)
        const sortedPairs = [...diagPairsArr].flat().sort();
        return sortedPairs.some((diag) => isSamePair(pair, diag));
    });

    // Returns the pair array common with the specified path arrays: rowPairArr, colPairArr, diagPairArr e.t.c in order to determine where is all possible paths to block.
    const commonRowPair = pairSelections.filter((pair) => {
        const sortedPairs = [...rowPairsArr].flat().sort();
        return sortedPairs.some((row) => isSamePair(pair, row));
    }).flat();
    const commonColPair = pairSelections.filter((pair) => {
        const sortedPairs = [...colPairsArr].flat().sort();
        return sortedPairs.some((col) => isSamePair(pair, col));
    }).flat();
    const commonDiagPair = pairSelections.filter((pair) => {
        const sortedPairs = [...diagPairsArr].flat().sort();
        return sortedPairs.some((diag) => isSamePair(pair, diag));
    }).flat();
    console.log(`clickedCellsArray: ${clickedCellsArray}`);

    // Get the winning combination in which the specified path belongs to.
    const getWinningCombination = (winningCombination, commonPair) => winningCombination.find((eachCombo) => {
        const cellCommonPair = [...commonPair].map(Number);
        return eachCombo.filter((cell) => cellCommonPair.includes(cell)).length >= 2;
    });
    // Function to get the last cell path needed to win.
    const nextCell = (winningCombination, commonPair) => {
        const winningCombos = winningCombination
        return winningCombos?.filter((cell) => {
            const cellCommonPair = [...commonPair].map(Number);
            return !(cellCommonPair.includes(cell));
        });
    };

    if (clickedCellsArray.length < 2) {
        console.log("The user has made the first move");
        // Manually update previously blocked cell to array before blocking the cell.
        blockedCellsArray.push(randomCell);
        console.log("the blocked cell at 1st click is", removeDuplicates(blockedCellsArray));
        MarkCell(randomCell, removeDuplicates(blockedCellsArray), randomCell);
        console.log(`Blocked cell-${randomCell}`);      
    } else if (clickedCellsArray.length === 2) {
        console.log("The user has made the second move");
        // check if currently clicked cells line up to a win path.
        console.log("clickedCellsArray: ", clickedCellsArray);
        console.log("is the selected path in a ROW? ", isInRow);
        console.log("is the selected path in a COLUMN? ", isInCol);
        console.log("is the selected path in a DIAGONAL? ", isInDiag);

       if (isInRow) {
            // Returns the index of the row that contains the clicked cells.
            const rowWinningCombo = getWinningCombination(winningRowCombinations, commonRowPair);
            console.log("Common row is", commonRowPair);
            console.log("the row winning combination for rows is", winningRowCombinations);
            console.log("the matching row combination is", rowWinningCombo);

            const thirdCell = nextCell(rowWinningCombo, commonRowPair);
            console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

            const cellId = thirdCell[0];
            // Manually update previously blocked cell to array before blocking the cell.
            blockedCellsArray.push(cellId);
            console.log("the blocked cell at 1st click is", removeDuplicates(blockedCellsArray));
            MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);

       } else if (isInCol) {
            // Returns the index of the column that contains the clicked cells.
            const colWinningCombo = getWinningCombination(winningColCombinations, commonColPair);
            console.log("Common column is", commonColPair);
            console.log("the column winning combination for columns is", winningColCombinations);
            console.log("the matching column combination is", colWinningCombo);

            const thirdCell = nextCell(colWinningCombo, commonColPair);
            console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

            const cellId = thirdCell[0];
            // Manually update previously blocked cell to array before blocking the cell.
            blockedCellsArray.push(cellId);
            console.log("the blocked cell at 1st click is", removeDuplicates(blockedCellsArray));
            MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);

       } else if (isInDiag) {
            // Returns the index of the diagonal that contains the clicked cells.
            const diagWinningCombo = getWinningCombination(winningDiagCombinations, commonDiagPair);
            console.log("Common diagonal is", commonDiagPair);
            console.log("the diagonal winning combination for diagonals is", winningDiagCombinations);
            console.log("the matching diagonal combination is", diagWinningCombo);

            const thirdCell = nextCell(diagWinningCombo, commonDiagPair);
            console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

            const cellId = thirdCell[0];
            // Manually update previously blocked cell to array before blocking the cell.
            blockedCellsArray.push(cellId);
            console.log("the blocked cell at 1st click is", removeDuplicates(blockedCellsArray));
            MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);
            
       } else {
            // Here the clicked cells dont line up to lead to a win path.
            console.log("Here the clicked cells dont line up to lead to a win path.");
            console.log("the blocked cells are ", blockedCellsArray);
            // Game should try to win by picking a winning combination.

    // ** These dont work well cause the blockedCellsArray is still empty at this time ** //
            const test = (winningCombinations) => winningCombinations.filter((arr) => {
                return arr.some((cell) => {
                    const clickedCells = [...blockedCellsArray].sort().map(Number);
                    return clickedCells.includes(cell);
                });
            });

            console.log("the matching row index that contains the cell best to block is ", test(winningRowCombinations));
            console.log("the matching column index that contains the cell best to block is ", test(winningColCombinations));
            console.log("the matching diagonal index that contains the cell best to block is ", test(winningDiagCombinations));

            //now check each array that contains the blocked Cell for the cells that arent clicked.
            const testPath = (winningCombinations) => winningCombinations.map((arr) => {
                return arr.filter((cell) => {
                    const clickedCells = [...clickedCellsArray].sort().map(Number);
                    const blockedCells = [...blockedCellsArray].sort().map(Number);
                    return !clickedCells.includes(cell) && !blockedCells.includes(cell);
                });
            });
        
            console.log("the matching row index that contains the cell best to block is ", testPath(test(winningRowCombinations)).filter(arr => arr.length > 1));
            console.log("the matching column index that contains the cell best to block is ", testPath(test(winningColCombinations)).filter(arr => arr.length > 1));
            console.log("the matching diagonal index that contains the cell best to block is ", testPath(test(winningDiagCombinations)).filter(arr => arr.length > 1));

            const cellPath = () => {
                const rowPaths = testPath(test(winningRowCombinations)).filter(arr => arr.length > 1).flat();
                const colPaths = testPath(test(winningColCombinations)).filter(arr => arr.length > 1).flat();
                const diagPaths = testPath(test(winningDiagCombinations)).filter(arr => arr.length > 1).flat();
                return [...rowPaths, ...colPaths, ...diagPaths].sort();
            }
            console.log("the matching index that contains the cell best to block is ", cellPath());
            // Pick any random path from the array of best possible game win paths to use;
            const randomIndex = Math.floor(Math.random() * cellPath().length);
            const randomPath = cellPath();
            console.log("the cell path picked at random is", randomPath[randomIndex]);
            
    // ** These dont work well cause the blockedCellsArray is still empty at this time ** //
            if (randomPath[randomIndex] == undefined || randomPath[randomIndex] == null) {
                console.log("the random path is undefined or null, so just pick any random unclicked or unblocked cell");
                const arr = [...grid].flat();
                const clickedCells = [...clickedCellsArray];
                const blockedCells = [...blockedCellsArray];
                const occupiedCells = clickedCells.concat(blockedCells).sort().map(Number);
                console.log("the cells occupied are", occupiedCells);

                const emptyCells = arr.filter((cell) => !occupiedCells.includes(cell));
                console.log('empty cells are', emptyCells);
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const newCell = emptyCells[randomIndex];                
                const cellElement = document.getElementById(`${newCell}`);

                // here the occupiued cells are only clicked and the winning combo cant be used to generate best selections 
                if (cellElement.classList.contains("clicked") && cellElement.classList.contains("blocked")) {
                    console.log(" use this cell first", newCell)
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(newCell);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(newCell, removeDuplicates(blockedCellsArray), randomCell);
                    
                } else {
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(cellId);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(randomCell, removeDuplicates(blockedCellsArray), randomCell);
                    console.log(`Blocked cell-${randomCell}`);
                };
            } else {
                const cellToBlock = document.getElementById(`${randomPath[randomIndex]}`);
                MarkCell(randomPath[randomIndex], removeDuplicates(blockedCellsArray), randomCell);

                console.log(`Blocked cell-${cellToBlock.id}`);
            }    
        }

    } else if (clickedCellsArray.length > 2) {
        // User has made more than two moves
        console.log("The user has made more than two moves");
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
            const imgsrc = "confetti.png";
            displayMessage(msg, imgsrc);
            // Handle score state 
            const factor = 2;
            handleScore(factor);
        
        } else if (clickedCellsArray.length == 5 && blockedCellsArray.length === 4) {
            // Here the game ends at a draw display the draw message and reset the game.
            const msg = "It's a Tie! 😐";
            const imgsrc = "tie.png";
            displayMessage(msg, imgsrc);
            // Deduct score by -1 to encourage the user to play again. 
            handleScore(-1);
        } else {
            console.log("The user has not made a winning move try and block");
            // Searching the Clicked Cells Array for the last two moves by using the two pair combinations created to search each segment and checking if the next path is blocked.

            // Winning combinations for rows, columns and diagonals.
                const rowWinningCombo = getWinningCombination(winningRowCombinations, commonRowPair);
                const colWinningCombo = getWinningCombination(winningColCombinations, commonColPair);
                const diagWinningCombo = getWinningCombination(winningDiagCombinations, commonDiagPair);
            // Third cells for each combinations
                const rowWCombo = rowWinningCombo;
                console.log("row combo", rowWCombo);
                const colWCombo = colWinningCombo;
                console.log("column combo", colWCombo);
                const diagWCombo = diagWinningCombo;
                console.log("diagonal combo", diagWCombo);
                const row3rdCell = nextCell(getWinningCombination(winningRowCombinations, commonRowPair), commonRowPair);
                const col3rdCell = nextCell(getWinningCombination(winningColCombinations, commonColPair), commonColPair);
                const diag3rdCell = nextCell(getWinningCombination(winningDiagCombinations, commonDiagPair), commonDiagPair);

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
                console.log("is the Third Cell in row currently occupied ? ", isCellFilled(row3rdCell));
                console.log("is the Third Cell in column currently occupied ? ", isCellFilled(col3rdCell));
                console.log("is the Third Cell in diagonal currently occupied ? ", isCellFilled(diag3rdCell));

            // Check if the Game is in the path to win.
            const numBlockedCells = [...blockedCellsArray].sort().map(Number);
            console.log("the number blocked cells are", numBlockedCells)
            
            // Return the best possible pairs of blocked cells.
            function getAllPairs(arr) {
                const blockedPairs = [];
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        blockedPairs.push([arr[i], arr[j]]);
                    }
                }
                return blockedPairs;
            }

            const blockedCellsPairs = getAllPairs(numBlockedCells);
            console.log("the pairs of blocked cells are", blockedCellsPairs);
            // Check if Blocked cells are in a winning row, column or diagonal path as well.
            const isBlockInRow = blockedCellsPairs.some((pair) => {
                console.log("The split pair selections  are: ", blockedCellsPairs)
                const sortedPairs = [...rowPairsArr].flat().sort();
                return sortedPairs.some((row) => isSamePair(pair, row));
            });
            const isBlockInCol = blockedCellsPairs.some((pair) => {
                console.log("The split pair selections are: ", blockedCellsPairs)
                const sortedPairs = [...colPairsArr].flat().sort();
                return sortedPairs.some((col) => isSamePair(pair, col));
            });
            const isBlockInDiag = blockedCellsPairs.some((pair) => {
                console.log("The split pair selections are: ", blockedCellsPairs)
                const sortedPairs = [...diagPairsArr].flat().sort();
                return sortedPairs.some((diag) => isSamePair(pair, diag));
            });
            console.log("is the blocked cells in a row? ", isBlockInRow);
            console.log("is the blocked cells in a column? ", isBlockInCol);
            console.log("is the blocked cells in a diagonal? ", isBlockInDiag);

            const comBlckRowPair = blockedCellsPairs.filter((pair) => {
                    const sortedPairs = [...rowPairsArr].flat().sort();
                    return sortedPairs.some((row) => isSamePair(pair, row));
            }).flat();
            const comBlckColPair = blockedCellsPairs.filter((pair) => {
                const sortedPairs = [...colPairsArr].flat().sort();
                return sortedPairs.some((col) => isSamePair(pair, col));
            }).flat();
            const comBlckDiagPair = blockedCellsPairs.filter((pair) => {
                const sortedPairs = [...diagPairsArr].flat().sort();
                return sortedPairs.some((diag) => isSamePair(pair, diag));
            }).flat();

            console.log("the common blocked row pair is", comBlckRowPair);
            console.log("the common blocked column pair is", comBlckColPair);
            console.log("the common blocked diagonal pair is", comBlckDiagPair);

            // Get winning combo for that common pair so to extract the third cell to win.
            const row3rdBlckCell = nextCell(getWinningCombination(winningRowCombinations, comBlckRowPair), comBlckRowPair);
            const col3rdBlckCell = nextCell(getWinningCombination(winningColCombinations, comBlckColPair), comBlckColPair);
            const diag3rdBlckCell = nextCell(getWinningCombination(winningDiagCombinations, comBlckDiagPair), comBlckDiagPair);
            console.log("the third cell to be blocked by from the blocked cells in row is", row3rdBlckCell);
            console.log("the third cell to be blocked by from the blocked cells in column is", col3rdBlckCell);
            console.log("the third cell to be blocked by from the blocked cells in diagonal is", diag3rdBlckCell);

            // Check if the blocked cells are in a winning path.
            if (isInRow && !isCellFilled(row3rdCell) && isCellFilled(row3rdBlckCell)) {
                console.log("the blocked cells array is after the user has place THRICE from crow is", blockedCellsArray);

                // Returns the index of the row that contains the clicked cells.
                const rowWinningCombo = getWinningCombination(winningRowCombinations, commonRowPair);
                console.log("Common row is", commonRowPair);
                console.log("the row winning combination for rows is", winningRowCombinations);
                console.log("the matching row combination is", rowWinningCombo);

                const thirdCell = nextCell(rowWinningCombo, commonRowPair);
                console.log("the clicked cells are: ", clickedCellsArray);
                console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);
                // First check if the third cell in the blocked cells is occupied
                if (isBlockInRow && !isCellFilled(row3rdBlckCell)) { 
                    // If it is, then we need to block it
                    console.log("Blocking the third cell in row:", row3rdBlckCell);
                    blockedCellsArray.push(row3rdBlckCell[0]);
                    MarkCell(row3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);
                    // Add the blocked cells to the blockedCellsArray then check if game has won
                    
                } else {
                    // Block the clicked cell third cell.
                    const cellId = thirdCell[0];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(cellId);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);

                }
            } else if (isInCol && !isCellFilled(col3rdCell) && isCellFilled(col3rdBlckCell)) {
                console.log("the blocked cells array is after the user has place THRICE from col is", blockedCellsArray);

                const colWinningCombo = getWinningCombination(winningColCombinations, commonColPair);
                console.log("Common column is", commonColPair);
                console.log("the column winning combination for columns is", winningColCombinations);
                console.log("the matching column combination is", colWinningCombo);

                const thirdCell = nextCell(colWinningCombo, commonColPair);
                console.log("the clicked cells are: ", clickedCellsArray)
                console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

                if (isBlockInCol && !isCellFilled(col3rdBlckCell)) { 
                    // If it is, then we need to block it
                    console.log("Blocking the third cell in column:", col3rdBlckCell);
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(col3rdBlckCell[0]);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(col3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);
                } else {
                    // Block the clicked cell third cell.
                    const cellId = thirdCell[0];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(cellId);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);
                }
            } else if (isInDiag && !isCellFilled(diag3rdCell) && isCellFilled(diag3rdBlckCell)) {
                console.log("the blocked cells array is after the user has place THRICE from diag is", blockedCellsArray);

                const diagWinningCombo = getWinningCombination(winningDiagCombinations, commonDiagPair);
                console.log("Common diagonal is", commonDiagPair);
                console.log("the diagonal winning combination for diagonals is", winningDiagCombinations);
                console.log("the matching diagonal combination is", diagWinningCombo);

                const thirdCell = nextCell(diagWinningCombo, commonDiagPair);
                console.log("the clicked cells are: ", clickedCellsArray)
                console.log("The uncommon cell btw the combo and the selection and hence the cell to be used is", thirdCell);

                if (isBlockInDiag && !isCellFilled(diag3rdBlckCell)) { 
                    // If it is, then we need to block it
                    console.log("Blocking the third cell in column:", diag3rdBlckCell);
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(diag3rdBlckCell[0]);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(diag3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);
                } else {
                    // Block the clicked cell third cell.
                    const cellId = thirdCell[0];
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(cellId);
                    console.log("the blocked cell at 1st click is", blockedCellsArray);
                    MarkCell(cellId, removeDuplicates(blockedCellsArray), randomCell);
                }
            } else {
                // No winning path found.
                console.log("The clicked cells dont line up to lead to a win path");
                console.log("the blocked cells array is after the user has place THRICE is", removeDuplicates(blockedCellsArray));
                // The clicked cells dont line up to lead to a win path for the clicked cells so we check if the blocked cells do. //
                if (isBlockInRow && !isCellFilled(row3rdBlckCell)) {
                    // If the blocked cells are in a winning path.
                    console.log("Blocking the third cell in row:", row3rdBlckCell);
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(row3rdBlckCell[0]); 
                    console.log("the blocked cell at > 2 click is", removeDuplicates(blockedCellsArray)); 
                    MarkCell(row3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);
                    
                } else if (isBlockInCol && !isCellFilled(col3rdBlckCell)) {
                    // If the blocked cells are in a winning path.
                    console.log("Blocking the third cell in column:", col3rdBlckCell);
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(col3rdBlckCell[0]);
                    console.log("the blocked cell at > 2 click is", removeDuplicates(blockedCellsArray)); 
                    MarkCell(col3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);
                    

                } else if (isBlockInDiag && !isCellFilled(diag3rdBlckCell)) {
                    // If the blocked cells are in a winning path.
                    console.log("Blocking the third cell in diagonal:", diag3rdBlckCell);
                    // Manually update previously blocked cell to array before blocking the cell.
                    blockedCellsArray.push(diag3rdBlckCell[0]);
                    console.log("the blocked cell at > 2 click is", removeDuplicates(blockedCellsArray));
                    MarkCell(diag3rdBlckCell[0], removeDuplicates(blockedCellsArray), randomCell);

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
                        const imgsrc = "tie.png";
                        displayMessage(msg, imgsrc);
                        // Deduct score by -1 to encourage the user to play again. 
                        handleScore(-1);
                    } else {
                        const randomIndex = Math.floor(Math.random() * emptyCells.length);
                        const randomCell = emptyCells[randomIndex];
                        const cellToBlock = document.getElementById(`${randomCell}`);                
                        console.log(`Blocked cell-${cellToBlock.id}`);
                        // Manually update previously blocked cell to array before blocking the cell.
                        blockedCellsArray.push(randomCell);
                        console.log("the blocked cell at > 2 click is", removeDuplicates(blockedCellsArray)); 
                        MarkCell(randomCell, removeDuplicates(blockedCellsArray), randomCell);
                    }
                    
                }   
            }
        }
    } 
}

grid.flat().map((cell) => {
    const container = document.querySelector(".game-container");
    const cellElement = document.createElement("div");
    cellElement.innerText = "";

    
    //const currentCell = document.getElementById(`${cell}`);
    //if (!currentCell.classList.contains("clicked") || !currentCell.classList.contains("blocked")) {
        // If the button has not been clicked or blocked allow the the user to click. 
    //} else {
        // The cell you clicked has been clicked or blocked.
      //  console.log("The cell you clicked has been clicked or blocked.");
        
    //};
    //
    cellElement.addEventListener("click", () => {
            console.log(`User clicked on cell-${cell}`);
            cellElement.classList.add("clicked");
            cellElement.classList.add("purpleTxt");
            // Toggle the text to "X" if clicked, otherwise empty
            cellElement.innerText = cellElement.classList.contains("clicked") ? "X" : "";
            // Add the clicked cell to the cells array.
            const clickedCells = document.querySelectorAll(".clicked");
            console.log(`${clickedCells.length} cell clicked`);
    
                // loop through clicked cells & store ids in array
                for (let i = 0; i < clickedCells.length; i++) {
                    clickedCellsArray.push(clickedCells[i].id);
                    console.log(clickedCellsArray);
                }

                // Validation logic for user input on occupied cell.
                const isPrevSameAsCurrent = (clickedCellsArray.at(-1) ==  clickedCellsArray.at(-2)); 
                    console.log("is the lastest cell same as the former ", isPrevSameAsCurrent )
                
                if (clickedCellsArray.length > 0 && 
                    (clickedCellsArray.includes("1") || clickedCellsArray.includes("3") || clickedCellsArray.includes("7") || clickedCellsArray.includes("9"))) {
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
                    const randomIndex = Math.floor(Math.random() * blockCombinations.length);
                    const randomCell = blockCombinations[randomIndex];
                    console.log(`randomCell: ${randomCell}`);

                    // Compare the latest cell clicked with the former for equality to prevent the user from clicking the same cell twice.
                    if (!isPrevSameAsCurrent) {
                        // Only add the blocked cell to the blockedCellsArray if it is the first click.
                        // This is to prevent the blocked cell from being added multiple times.
                        if (clickedCellsArray.length === 1) {            
                            // Manually update previously blocked cell to array before blocking the cell.
                            blockedCellsArray.push(randomCell);
                            console.log("the blocked cell at 1st click is", blockedCellsArray)
                        }
                        
                        setTimeout(() => {
                            blockCell(randomCell, blockCombinations, clickedCellsArray, blockedCellsArray);
                        }, 1000); 
                    } else {
                        // User is clicking on an already clicked button.
                        console.log("User is clicking on an already clicked button.");
                    }
                } else if (clickedCellsArray.length > 0 && 
                    (clickedCellsArray.includes("2") || clickedCellsArray.includes("4") || clickedCellsArray.includes("6") || clickedCellsArray.includes("8"))) {
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
                            // Manually update previously blocked cell to array before blocking the cell.
                            blockedCellsArray.push(randomCell);
                            console.log("the blocked cell at 1st click is", blockedCellsArray)
                        }
                        
                        setTimeout(() => {
                            blockCell(randomCell, blockCombinations, clickedCellsArray, blockedCellsArray);
                        }, 1000); 
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
                            // Manually update previously blocked cell to array before blocking the cell.
                            blockedCellsArray.push(randomCell);
                            console.log("the blocked cell at 1st click is", blockedCellsArray)
                        }
                        
                        setTimeout(() => {
                            blockCell(randomCell, centerCellCombos, clickedCellsArray, blockedCellsArray);
                        }, 1000); 
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