
const fuzz = require('jsfuzz');

function myFunction(input) {
    if (input.includes('error')) {
        throw new Error("Found error!");
    }
    return `Processed: ${input}`;
}

// Fuzzing test
fuzz.fuzzedFunction(myFunction);
