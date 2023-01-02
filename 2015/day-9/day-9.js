import { max, min } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

const distances = {
    AlphaCentauri: {
        Snowdin: 66,
        Tambi: 28,
        Faerun: 60,
        Norrath: 34,
        Straylight: 34,
        Tristram: 3,
        Arbre: 108,
    },
    Snowdin: {
        Tambi: 22,
        Faerun: 12,
        Norrath: 91,
        Straylight: 121,
        Tristram: 111,
        Arbre: 71,
        AlphaCentauri: 66
    },
    Tambi: {
        Faerun: 39,
        Norrath: 113,
        Straylight: 130,
        Tristram: 35,
        Arbre: 40,
        AlphaCentauri: 28,
        Snowdin: 22
    },
    Faerun: {
        Norrath: 63,
        Straylight: 21,
        Tristram: 57,
        Arbre: 83,
        AlphaCentauri: 60,
        Snowdin: 12,
        Tambi: 39
    },
    Norrath: {
        Straylight: 9,
        Tristram: 50,
        Arbre: 60,
        Faerun: 63,
        AlphaCentauri: 34,
        Snowdin: 91,
        Tambi: 113
    },
    Straylight: {
        Tristram: 27,
        Arbre: 81,
        Norrath: 9,
        Faerun: 21,
        AlphaCentauri: 34,
        Snowdin: 121,
        Tambi: 130
    },
    Tristram: {
        Arbre: 90,
        Straylight: 27,
        Norrath: 50,
        Faerun: 57,
        AlphaCentauri: 3,
        Snowdin: 111,
        Tambi: 35
    },
    Arbre: {
        AlphaCentauri: 108,
        Snowdin: 71,
        Tambi: 40,
        Faerun: 83,
        Norrath: 60,
        Straylight: 81,
        Tristram: 90,
    }
}

// const distances = {
//     London: {
//         Dublin: 464,
//         Belfast: 518
//     },
//     Dublin: {
//         Belfast: 141,
//         London: 464
//     },
//     Belfast: {
//         London: 518,
//         Dublin: 141
//     }
// }

const visitedCities = new Set();
let shortestRoute = Infinity;
let longestRoute = 0;
let countRoutes = 0

function searchRoutes(currentCity, distanceTravelled) {
    visitedCities.add(currentCity);

    if (visitedCities.size === Object.keys(distances).length) {
        countRoutes++
        shortestRoute = min(shortestRoute, distanceTravelled);
        longestRoute = max(longestRoute, distanceTravelled);
    } else {
        for (const city in distances[currentCity]) {
            if (!visitedCities.has(city)) {
                searchRoutes(city, distanceTravelled + distances[currentCity][city]);
            }
        }
    }

    visitedCities.delete(currentCity);
};



function findAllRoutes() {
    for (const key in distances) {
        searchRoutes(key, 0);
    }
    console.log(`shortest: ${shortestRoute}`);
    console.log(`longest: ${longestRoute}`);
}

function run(input) {
    let t0 = performance.now()

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    findAllRoutes()
    let t2 = performance.now()
    console.log(`9a: ${~~(t2 - t1)}ms ${shortestRoute}`);

    let t3 = performance.now()
    console.log(`9b: ${~~(t3 - t2)}ms ${longestRoute}`);
}

function execute() {
    // readFile('./2015/day-9/data-day-9.txt').then(value => run(value.toString()));
    readFile('./2015/day-9/data-test-day-9.txt').then(value => run(value.toString()));
}

export default { execute }