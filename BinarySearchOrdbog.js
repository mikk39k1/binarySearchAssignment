
const fs = require('fs')

let rawtext = fs.createReadStream("../binarySearchOrdbog/data/ddo_fullforms_2023-10-11.csv");

let data = '';
rawtext.on('data', (chunk) => {
    data += chunk;
});

let globalArrayOfWords = [];


const compareMethod = (searchWord, check) => {
    return searchWord.variant.localeCompare(check.variant);
};

const binarySearch = (value, values, compare) => {

    if (values.length === 0) return;
    let start = 0;
    let end = values.length - 1;
    

    while (start <= end) {
        const middle = Math.floor(start + ((end - start) / 2));
        const comparedValue = compare(value, values[middle]);

        if (comparedValue === 0) {
            return middle;
        } else if (comparedValue === 1) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }

    return -1;
}


rawtext.on('end', () => {
    globalArrayOfWords = data.split('\n').map(line => {
        const parts = line.split('\t');
        return {
            variant: parts[0],
            headword: parts[1],
            homograph: parts[2],
            partofspeech: parts[3],
            id: parts[4]
        }
    });

    globalArrayOfWords = globalArrayOfWords.sort((a, b) => a.variant.localeCompare(b.variant));

    const searchWord = "hestevogn"
    const resultIndex = binarySearch({variant: searchWord}, globalArrayOfWords, compareMethod);
    console.log(`Word found: ${globalArrayOfWords[resultIndex].variant}, And index: ${resultIndex}`);


    performance.mark('find-start');
    globalArrayOfWords.findIndex((word) => word.variant === searchWord);
    performance.mark('find-end');
    performance.measure('find-method', 'find-start', 'find-end');

    performance.mark('binary-start');
    binarySearch({variant: searchWord}, globalArrayOfWords, compareMethod);
    performance.mark('binary-end');
    performance.measure('binary-search', 'binary-start', 'binary-end');


    console.log("Performance of findIndex: ", performance.getEntriesByName('find-method'));
    console.log("Performance of binarySearch: ", performance.getEntriesByName('binary-search'));
});






