const TABLE = {
    'A': 0,
    'T': 1,
    'G': 2,
    'C': 3,
}

Array.prototype.contains = function(element){
    return this.indexOf(element) >= 0;
}


const fs = require('node:fs');

fs.readFile('covid-19-genome.fna', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    translator(data);
});


function translator(data){
    let binaryDNA = [];

    let dnaSegment = [];
    for(letter of data){
        if(Object.keys(TABLE).contains(letter)){
            if(dnaSegment.length == 4){
                binaryDNA.push(traslateSegment(dnaSegment));
                dnaSegment = [];
            }
            dnaSegment.push(letter);
        }
    }

    if (dnaSegment.length > 0){
        binaryDNA.push(traslateSegment(dnaSegment));
    }

    var buffer = Buffer.alloc(binaryDNA.length);

    var c = "";
    for (var i = 0;i < binaryDNA.length;i++) {
        buffer[i] = binaryDNA[i];
        c = c + " " + binaryDNA[i]
    }

    fs.writeFile("covid19.bin", buffer,  "binary",function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}

function translateLatter(dnaLetter){
    return TABLE[dnaLetter];
}

function traslateSegment(dnaSegment){
    let byte = 0;

    if(dnaSegment[3] != undefined){
        byte += translateLatter(dnaSegment[3]);
        byte <<= 2;
    }
    if(dnaSegment[2] != undefined){
        byte += translateLatter(dnaSegment[2]);
        byte <<= 2;
    };
    if(dnaSegment[1] != undefined){
        byte += translateLatter(dnaSegment[1]);
        byte <<= 2;
    }
    if(dnaSegment[0] != undefined){
        byte += translateLatter(dnaSegment[0]);
    }

    console.log("segment"+dnaSegment);
    console.log("bynary:"+byte.toString(2));

    return byte;
}