let globalValidSpots = [];
let globalCurrentSpots = [];
let globalCurrentSpot;
let lastSolution;
let solutionCount = 0;

function setup() {
    createCanvas(600, 600);
    noStroke();
    setTimeout(async () => {
        await findSolution([]);
        globalCurrentSpots = lastSolution;
        globalCurrentSpot = lastSolution[7];
    }, 0);
}

function draw() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            (i + j) % 2 == 0 ? fill(255, 255, 255) : fill(100, 100, 100);
            rect((i * width) / 8, (j * height) / 8, width / 8, height / 8);
            if (globalValidSpots[j] && globalValidSpots[j][i]) {
                fill(255, 0, 0);
                ellipse(
                    (i * width) / 8 + width / 16,
                    (j * height) / 8 + height / 16,
                    width / 8,
                    height / 8
                );
            }
        }
    }

    for (let currentSpot of globalCurrentSpots) {
        fill(0, 255, 0);
        ellipse(
            (currentSpot.x * width) / 8 + width / 16,
            (currentSpot.y * height) / 8 + height / 16,
            width / 8,
            height / 8
        );
    }

    fill(0, 0, 255);
    if (globalCurrentSpot)
        ellipse(
            (globalCurrentSpot.x * width) / 8 + width / 16,
            (globalCurrentSpot.y * height) / 8 + height / 16,
            width / 8,
            height / 8
        );
}

const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function findSolution(currentSpots) {
    let validSpots = getValidSpots(currentSpots);
    globalValidSpots = validSpots;
    globalCurrentSpots = currentSpots;
    if (currentSpots.length == 8) {
        console.log("Solutions found: " + ++solutionCount);
        console.log(currentSpots);
        lastSolution = currentSpots;
        await sleep(1000);
        // return currentSpots
    }
    
    await sleep(50);
    for (let i = 0; i < validSpots.length; i++) {
        for (let j = 0; j < validSpots[0].length; j++) {
            if (validSpots[j][i]) {
                let loc = new Pos(i, j);
                globalCurrentSpot = loc;
                let solution = await findSolution([...currentSpots, loc]);
                if (solution) {
                    currentSpots = solution;
                    return solution;
                }
            }
        }
    }

    return false;
}

function getAllSpots() {
    return JSON.parse(JSON.stringify(Array(8).fill(Array(8).fill(true))));
}

function getValidSpots(currentSpots) {
    let output = getAllSpots().slice();
    for (let i = 0; i < 8; i++) {
        if (i != currentSpots.length) {
            output[i] = JSON.parse(JSON.stringify(Array(8).fill(false)));
        }
    }
    for (let currentSpot of currentSpots) {
        let x = currentSpot.x;
        let y = currentSpot.y;
        for (let j = 0; j < 8; j++) {
            output[y][j] = false;
            output[j][x] = false;
            if (output[j][-(j - x) + y]) {
                output[j][-(j - x) + y] = false;
            }
            if (output[j][j + (x - y)]) {
                output[j][j + (x - y)] = false;
            }
        }
    }
    return output;
}

function printPositions(positions) {
    console.log("--------");
    for (let i = 0; i < positions.length; i++) {
        console.log(positions[i].map(x => (x ? 1 : 0)));
    }
}

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
