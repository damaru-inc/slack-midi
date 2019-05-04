var charMap = new Map([
    ['a', 60], // C4
    ['t', 48], // C3
    ['a', 72], // C5
    ['o', 67], // G4
    ['i', 55], // G3
    ['n', 64], // E4
    ['s', 52], // E3
    ['r', 65], // F4
    ['h', 53], // F3
    ['d', 69], // A4
    ['l', 57], // A3
    ['u', 62], // D4
    ['c', 50], // D3
    ['m', 71], // B4
    ['f', 59], // B3
    ['y', 74], // D5
    ['w', 47], // B2
    ['g', 76], // E5
    ['p', 45], // A2
    ['b', 77], // F5
    ['v', 43], // G2
    ['k', 79], // G5
    ['x', 41], // F2
    ['q', 81], // A5
    ['j', 40], // E2
    ['z', 38], // D2
]);


var s = "The time has come";

for (c of s) {
    var i = isUpper(c);
    var l = c.toLowerCase();
    var n = noteForChar(l)
    if (!n) {
        n = 'rest'
    }
    console.log('note ' + c + ' ' + i + ' ' + n);
}

function noteForChar(char) {

    return charMap.get(char);
};

function isUpper(character) {
  return (character === character.toUpperCase()) && (character !== character.toLowerCase());
}

