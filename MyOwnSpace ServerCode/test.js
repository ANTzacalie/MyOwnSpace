
const sqlite3 = require("sqlite3").verbose();


const dbPath = "myOwnSpaceDb.sqlite"// DATA_BASE NAME AND LOCATION
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    const query = `DELETE FROM users WHERE PASSWORD = "b26792c080e46d3fcb436845fec5696dcdd40007017a48478240b0067d53ed547ce4cb308e2b6cc5da91b001e527a4c239158f5f7068f423263210931dfe5808"`;
    db.run(query , (err)=> {

        if (err) {
            console.log("POOP");
        }

    });

    const query2 = `INSERT INTO users (EMAIL, PASSWORD) VALUES("antoniomihalceacatalin@gmail.com", "ebc1f11e0111c95971339f95685282ecc402e8a11972b2cf87a1c61c9f67e8de7af2e7e7da5e4ffbf8874511de83a491cdd02843f5b62e6ccbba50b44579a852");`;
    db.run(query2 , (err)=> {

        if (err) {
            console.log("POOP");
        }

    });

    console.log('Connected to SQLite database');

});



/*
function verifyHash(string, hash, callback) {
                
                try{

                    const stringHash = crypto.createHash("sha512")
                                           .update(string)
                                           .digest("hex");

                    if(stringHash.localeCompare(hash)) {

                        console.log("HEELO")
                        callback(true); 

                    } else { 
                        
                        console.log("NIGGER")
                        callback(false); 
                
                    }

                } catch(e) {

                    console.log("Error trown by verifyHash: " + e.message);
                    
                    callback(false);

                }

            }


function validateUser(email, password , callback) {
    // AICI VERIFICAM CODUL DE SECURITATE TRIMIS DE USER SI ACTUALIZAM ACESUL LA SESIUNE , REINTOARCEM SESSION_ID

    const query = `SELECT PASSWORD FROM users WHERE EMAIL = ?`;
    db.get(query, [email] , (error, column) => {
        console.log(column.PASSWORD)
        if(error) {

            console.log("Error in trying to validate user, database error: " + error.message);
            callback(false);

        } else if(column && column.PASSWORD) {

            verifyHash(password, column.PASSWORD , (result) => {

                console.log("User validated successfully!");
                callback(result); 

            });

        } else {

            console.log("Error in trying to validate user, database error: no row" );
            callback(false);

        }

    });

}
let buss = false;
validateUser("antoniomihalceacatalin43@gmail.com", "vrajitoarea", (buss) => {

    if(buss) {
        console.log("LOL");
    }

});

/*
function resetTries(ip) {

    const query = `UPDATE session SET SESSION_TRIES = 30 , SESSION_OPEN = 1 WHERE IP = ?`;
    db.run(query, [ip]);

}

resetTries("192.168.5.1");
*/


/*

function insertIntoFolder() {

    const query = `DELETE FROM session WHERE IP = "192.168.5.1"`;
    db.run(query , (err)=> {

        if (err) {
            console.log("POOP");
        }

    });

}

const query = `INSERT INTO users (EMAIL, PASSWORD) VALUES("antoniomihalceacatalin43@gmail.com", "b26792c080e46d3fcb436845fec5696dcdd40007017a48478240b0067d53ed547ce4cb308e2b6cc5da91b001e527a4c239158f5f7068f423263210931dfe5808");`;
    db.run(query , (err)=> {

        if (err) {
            console.log("POOP");
        }

    });

function insertIntoFolder() {

    const query = `DELETE FROM users WHERE PASSWORD = "ebc1f11e0111c95971339f95685282ecc402e8a11972b2cf87a1c61c9f67e8de7af2e7e7da5e4ffbf8874511de83a491cdd02843f5b62e6ccbba50b44579a852"`;
    db.run(query , (err)=> {

        if (err) {
            console.log("POOP");
        }

    });

}    

const crypto = require("crypto");

function hash(string) {

                return crypto.createHash("sha512")
                             .update(string)
                             .digest("hex");

            }
console.log("hash is: " + hash("vrajitoare"));
*/

// b26792c080e46d3fcb436845fec5696dcdd40007017a48478240b0067d53ed547ce4cb308e2b6cc5da91b001e527a4c239158f5f7068f423263210931dfe5808
