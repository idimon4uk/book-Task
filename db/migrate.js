const [pathNode,pathFile,method,filename] = process.argv;

const migrationFile = require(filename)

if(method==='up'){
    migrationFile.up();
}
else if(method==='down'){
    migrationFile.down();
}
else {
    console.log('Enter up/down to migrate');
}