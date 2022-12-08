import * as fs from 'fs';

function getSize(dir, smallDirs, folderSizes) {
    let sizes = [];
    sizes.push(...dir.files.map(file => file.size));
    sizes.push(...dir.dirs.map(childDir => getSize(childDir, smallDirs, folderSizes)));
    let total = sizes.reduce((p, c) => p + c, 0);

    folderSizes.push(total);
    if (total <= 100000) {
        smallDirs.push(total);
    }

    return total;
}

function findOrMakeChildDir(currentDir, findName) {
    let foundDir = currentDir.dirs.find(dir => dir.name == findName);

    if (!foundDir) {
        foundDir = {
            name: findName,
            files: [],
            dirs: [],
            parent: currentDir
        };
        currentDir.dirs.push(foundDir);
    }

    return foundDir;
}

function preprocess(input) {
    return input
        .split('$ ')
        .map(group => group.split('\r\n')
            .filter(line => line != ''))
        .filter(group => group.length > 0)
        .map(group => group.map(line => line.split(' ')))
}

function run(input) {
    let cmdGroups = preprocess(input);

    let root = {
        name: '/',
        files: [],
        dirs: [],
        parent: null
    };
    let currentDir = root;

    cmdGroups.forEach((group) => {
        let inputs = group[0]
        let outputs = group.slice(1, group.length)

        if (inputs[0] == 'cd') {
            if (inputs[1] == '..') {
                if (currentDir.parent) {
                    currentDir = currentDir.parent;
                } else {
                    throw 'cannot nav up';
                }
            } else {
                if (inputs[1] == '/' && currentDir.name == '/') return; //don't duplicate root

                currentDir = findOrMakeChildDir(currentDir, inputs[1])
            }
        }

        if (inputs[0] == 'ls') {
            outputs.forEach(outputGroup => {
                if (outputGroup[0] == 'dir') {
                    findOrMakeChildDir(currentDir, outputGroup[1]);
                } else {
                    currentDir.files.push({
                        size: parseInt(outputGroup[0]),
                        name: outputGroup[1]
                    })
                }
            })
        }

    });

    let smallDirs = [];
    let folderSizes = [];
    let totalSize = getSize(root, smallDirs, folderSizes);
    let totalDisk = 70000000;
    let need = 30000000;
    let freeSpace = totalDisk - totalSize;
    let minSize = need - freeSpace;

    folderSizes = folderSizes.sort((a, b) => a - b)
    let firstBigEnough = folderSizes.find(x => x >= minSize);

    console.log(`07a: ${smallDirs.reduce((p, c) => p + c, 0)}`)
    console.log(`07b: ${firstBigEnough}`)
}

function execute() {
    fs.readFile('./day 7/day-7.txt', 'utf8', (err, value) => run(value))
}

export { execute }