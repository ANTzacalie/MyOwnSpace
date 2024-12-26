const https = require("https");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const { call } = require("function-bind");


let readData = [null, null, null, null, null, null, null];

const dbPath = "myOwnSpaceDb.sqlite"// DATA_BASE NAME AND LOCATION
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite database');

});

const readQuery = "SELECT PRIVATE_PATH , CERTIFICATE_PATH , CHAIN_PATH, EMAIL , PASSWORD, HOSTNAME, PORT FROM INPUT WHERE Id = 1";
try {

    db.all(readQuery, (error, result) => {

        if (error) {

            console.error("Error reading values from database table INPUT" + error.message);

        } else {

            console.log("All data form table INPUT have been read");

            try {

                readData[0] = result[0].PRIVATE_PATH;
                readData[1] = result[0].CERTIFICATE_PATH;
                readData[2] = result[0].CHAIN_PATH;
                readData[3] = result[0].EMAIL;
                readData[4] = result[0].PASSWORD;
                readData[5] = result[0].HOSTNAME;
                readData[6] = result[0].PORT;

            } catch(e) {

                console.log("Error at begin , database has no init rows: " + e.message);

            }

            const app = express() //Here we initialize the application with Express for HTTPS Request
            app.use(express.json()); //tells the app how to parse json

            const server = http.createServer(app); // http server

            /*
            const server = https.createServer({ // https server

                key: fs.readFileSync(readData[0]),
                cert: fs.readFileSync(readData[1]),
                ca: fs.readFileSync(readData[2]),

            }, app);
            */

            function emailSender(email, code) {
                console.log(date() + " si codul: " + code);

                //Create a transporter with your SMTP configuration
                const transporter = nodemailer.createTransport({

                    service: "gmail",
                    auth: {

                        user: "antoniomihalceacatalin43@gmail.com",//readData[3],
                        pass: "duczgjxzkhrylfio",//readData[4] //ducz gjxz khry lfio

                    }

                });

                // Compose the email
                const mailOptions = {

                    from: readData[3],
                    to: email,
                    subject: "Verification code",
                    text: "Your code is:" + code

                };

                // Send the email
                transporter.sendMail(mailOptions, function (error, info) {

                    if (error) {

                        console.error("Error sending email:", error);

                    } else {

                        console.log("Email sent:", info.response);

                    }

                });

            }
            
            // Random string generator
            function codeGenerator(lenght) {

                const characters = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789";

                let password = "";

                for (let i = 0; i < lenght; i++) {

                    const randomIndex = crypto.randomInt(characters.length);
                    password += characters.charAt(randomIndex);

                }

                console.log("Code generated is: " + password);

                return password;

            }
            
            function makeHash(string) {

                return crypto.createHash("sha512").update(string).digest("hex");

            }

            function verifyHash(string, db_hash, callback) {

                try{

                    let stringHash = makeHash(string);

                    console.log("Password Hash: " + stringHash + '\n');
                    console.log("Hash from db: " + db_hash + '\n');

                    if(stringHash === db_hash) {

                        callback(true); 

                    } else { 
                    
                        callback(false); 
                
                    }

                } catch(e) {

                    callback(false);
                    throw "Error trown by verifyHash: " + e.message;

                }

            }

            function date() {

                const currentDate = new Date(); //Creating an instance of the day/month/year

                return currentDate;

            }

            function updatefileName() {

                // ACTUALIZAM NUMELE FISIEULUI RESPECTIV IN TABELUL DATA , DAR SI FIZIC IN LOCUL DE STOCARE

                
            }   

            function checkFileName() {

                // O FUNCTIE CARE RETURNEAZA TRUE/FALSE DACA NUMELE FISIERULUI ESTE GASIT

            }

            function deleteFile() {

                // STERGEM FISIERE DIN TABELUL DATA , CAT SI DIN LOCATIA FIZICA

            }

            function retriveFilesExistance() { 

                // SHOWS THE USER IN THE APP WHAT FILES ARE AVALIBLE ON THE SERVER

            }

            function retriveFile() {

                // GETS THE FILE TRANSFERED TO THE USER

            }

            function retriveALL() {

                // GETS ALL THE FILES TO THE USER 

            }

            function deketeAll() {

                /*
                const query = `DELETE FROM data`;
                db.run(query, [session_id, ip], (error) => {
            
                    if (error) {
            
                        console.error("Cannot delete all rows in data:", error.message);
                        callback(false);
            
                    } else {
            
                        console.log("Row from table data sucefully deleated.");
                        callback(true);
                             
                    }
            
                });
                */
            
            }

            function insertIntoFolder(file_name, file_uri, file_type, file_size, callback) {

                /*
                    const file_date = date();

                    const query = `INSERT INTO data (FILE_NAME, FILE_URI, FILE_DATE, FILE_TYPE, FILE_SIZE) VALUES (?, ?, ?, ?, ?)`;
                    db.run(query, [file_name, file_uri , file_date , file_type , file_size], (error) => {

                        if (error) {

                            console.log("Error inserting into table:" + error.message);
                            callback(false);

                        } else {

                            console.log("File inserted successfully.");
                            callback(true);
                             
                        }

                    });
                */

            }

            function closeSession(ip, email) {

                    const query = `UPDATE session SET SESSION_OPEN = ? WHERE IP = ? AND EMAIL = ?`;
                    db.run(query, [0, ip, email], (error) => {

                        if (error) {

                            console.log("Failed to clouse session for ip: " + ip + " with error: " + error.message);

                        } else {

                            console.log("Session closed for ip: " + ip);
                             
                        }

                    });

            }

            function addSession(ip, email,device_type, callback) {

                // ADAUGAM O NOUA SESIUNE
                const session_id = codeGenerator(64);
                const session_hash = makeHash(session_id);

                // Luam anul,luna,ziua,ora,secunda curenta 
                const current_date = date();

                const query = `INSERT INTO session (IP , SESSION_ID , DATE , SESSION_OPEN , DEVICE_TYPE, EMAIL) VALUES (?, ?, ?, ?, ?,?)`;
                db.run(query, [ip , session_hash , current_date , 1 , device_type, email], (error) => {

                    if (error) {

                        console.log("Failed creating a session for ip: " + ip + " with cause: " + error.message);
                        callback(false);

                    } else {

                        console.log("Session created for ip: " + ip);
                        callback(true);
                             
                    }

                });

            }

            function decrementTries(ip, email, callback) {

                const query = `UPDATE session SET SESSION_TRIES = SESSION_TRIES - 1 WHERE IP = ? AND SESSION_OPEN = 1 AND EMAIL = ?`;
                db.run(query, [ip, email] , (error) => {
                    callback(true);
                });

            }

            function resetTries(ip, email) {

                const query = `UPDATE session SET SESSION_TRIES = 3 , SESSION_OPEN = 1 WHERE IP = ? AND EMAIL = ?`;
                db.run(query, [ip,email], (error) => {  });

            }

            function checkSessionId(session_id, ip, email , callback) {

                    // VERIFICAM DACA USERUL ESTE IN POSESIA SESSION_ID
                    const query = `SELECT SESSION_ID FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.log("Error in trying to select session_id, database error: " + error.message);
                            callback(-1);

                        } else if(column){ 

                            if(column.SESSION_ID != null) {
                                
                                console.log("SESSION_ID_USER: " + session_id);
                                console.log("SESSION_ID_DB: " + column.SESSION_ID);
                                
                                if(session_id === column.SESSION_ID) {

                                    console.log("Code verification complete with no errors");
                                    callback(true); 

                                } else {

                                    console.log("No valid session id for ip: " + ip);
                                    callback(false);

                                }

                            }
 
                        }

                    });

            }

            function getSessionId(ip, email, callback) {

                // VERIFICAM DACA USERUL ESTE IN POSESIA SESSION_ID
                    const query = `SELECT SESSION_ID FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.log("Error in trying to select session_id, database error: " + error.message);
                            callback(-1);

                        } else if(column) { 

                            if(column.SESSION_ID != null) {
                            
                                callback(column.SESSION_ID); 

                            } else {

                                callback(false);

                            }

                        } 

                    });

            }

            function checkSesionOpen(ip , email, callback) {

                    // VOM VERIFICA DATA CURENTA CU DATA DIN DATE SI DACA DIFERENTA ESTE MAI MARE DE 3 ORE SE VA CERE RECONECTAREA , CHIAR DACA USERUL ARE SESSION_ID

                    const query = `SELECT SESSION_OPEN FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.log("Error in trying to check session, database error: " + error.message);
                            callback(-2);

                        } else if(column){ 
                                
                            if(column.SESSION_OPEN == 1) {

                                callback(true);

                            } else {

                                callback(false);

                            }

                        } else { callback(-1); }

                    });

            }

            function checkSessionTries(ip, email, callback) {

                    // VERIFICAM CATE TRIES MAI ARE USERUL LA CONECTARE CU IP
             
                    const query = `SELECT SESSION_TRIES FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.log("Error in trying to verify session tries, database error: " + error.message);
                            callback(-1);

                        } else if(column) {

                            if(column.SESSION_TRIES > 0 && column.SESSION_TRIES != null) {

                                callback(true);

                            } else {

                                console.log("Session out of tries , reset time on await!");
                                callback(false);

                            }

                        }

                    });

            }

            function addSecurityCode(security_code , email, callback) {
                
                let code_hash = makeHash(security_code);
                let current_date = date();

                const query = `UPDATE users SET SECURITY_CODE = ?, CODE_SENT_DATE = ? WHERE EMAIL = ?`;
                db.run(query, [code_hash, current_date, email], (error) => {

                    if (error) {

                        console.error("Failed inserting code into users", error.message);
                        callback(false);

                    } else {

                        console.log("Code inserted successfully into users.");
                        callback(true);
                             
                    }

                });

            }

            function isCodeStillValid(email , callback) {

                let current_date = date();

                const query = `SELECT CODE_SENT_DATE FROM users WHERE EMAIL = ?`;
                db.get(query, [email] , (error, column) => {

                    if(error) {

                        console.log("Error in trying to verify the code_date, database error: " + error.message);
                        callback(-2);

                    } else if(column) { 

                        if(column.CODE_SENT_DATE != null) {
                            
                            if((current_date - new Date(column.CODE_SENT_DATE)) < 15 * 60 * 1000) {

                                callback(true);

                            } else {

                                callback(-3);

                            }

                        } else {

                            console.log("Error in trying to verify date, code_date is null in database");
                            callback(-1);

                        }

                    }

                });

            }

            function emailExists(email , callback) {

                const query = `SELECT id FROM users WHERE EMAIL = ?`;
                db.get(query, [email] , (error, column) => {

                    if(error) {

                        callback(false);

                    } else if(column) { 

                        if(column.id != 0) {
                            
                            callback(true);

                        } else {

                            callback(false);

                        }

                    } else { callback(false) }

                });

            }

            function verifySecurityCode(security_code , email , callback) {

                // AICI VERIFICAM CODUL DE SECURITATE TRIMIS DE USER SI ACTUALIZAM ACESUL LA SESIUNE , REINTOARCEM SESSION_ID
                isCodeStillValid(email, (result) => {

                    if(result) {

                        const query = `SELECT SECURITY_CODE FROM users WHERE EMAIL = ?`;
                        db.get(query, [email] , (error, column) => {

                            if(error) {

                                console.log("Error in trying to verify the code, database error: " + error.message);
                                callback(-1);

                            } else {

                                if(column.SECURITY_CODE != null) {
                                
                                    verifyHash(security_code, column.SECURITY_CODE , (result) => {

                                        callback(result); 

                                    });

                                }

                            }

                        });

                    } else if(result == -3) {

                        callback(-3);

                    } else if(result == -2) {

                        callback(-2);
                    
                    } else if(result == -1) {

                        callback(-1);

                    }

                });

            }

            function validateUser(email, password , callback) {
                
                    // AICI VERIFICAM CODUL DE SECURITATE TRIMIS DE USER SI ACTUALIZAM ACESUL LA SESIUNE , REINTOARCEM SESSION_ID

                    const query = `SELECT PASSWORD FROM users WHERE EMAIL = ?`;
                    db.get(query, [email] , (error, column) => {

                        if(error) {

                            console.log("Error in trying to validate user, database error: " + error.message);
                            callback(-2);

                        } else if(column) {
                        
                            if(column.PASSWORD != null) {

                                verifyHash(password, column.PASSWORD , (result) => {

                                    callback(result); 

                                });

                            }

                        } else {

                            console.log("Error in trying to validate user, password is null" );
                            callback(-1);

                        }

                    });

            }

            function loginLastTime(email) {

                const query = `UPDATE users SET LAST_TIME_CONNECTED = ?, SECURITY_CODE = ? WHERE EMAIL = ?`;
                db.run(query, [date() ,null ,email]);

            }

            function isSecurityCodeNull(email, callback) {

                const query = `SELECT SECURITY_CODE FROM users WHERE EMAIL = ?`;
                db.get(query, [email] , (error, column) => {

                    if(error) {

                        console.log("Error in trying to validate user, database error: " + error.message);
                        callback(-1);

                    } else if(column) {
                        
                        if(column.SECURITY_CODE != null){

                            callback(true);

                        } else { callback(false); }

                    } else {

                        callback(false);

                    }

                });

            }
            
            //Login 3
            app.post("/authStep3" , async (request, response) => {

                const { email , password , session_id } = request.body;
                const ip = request.ip;

                console.log("AuthStep3 used for ip: " + ip + " with email: " + email + ", password: " + password + " and session_id: " + session_id);

                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            if(resultA) {
                                
                                validateUser(email, password, (resultUser) => {

                                    if(resultUser == true) {

                                        response.json({"RET_VALUE": "True"});
        
                                    } else if(resultUser == false) {
        
                                        decrementTries(ip , email , (rez) => {
        
                                            checkSessionTries(ip , email , (resultCode) => {
        
                                                if(resultCode) {
        
                                                    response.json({"RET_VALUE": "False"});
        
                                                } else if(resultCode == -1) {
        
                                                    response.json({"RET_VALUE": "LOGIN_FAIL"});
        
                                                } else {
        
                                                    closeSession(ip, email);
                                                    response.json({"RET_VALUE": "SESSION_LOCK"});
        
                                                }
        
                                            });
        
                                        });
        
                                    } else if(resultUser == -1 || resultUser == -2) {
        
                                        response.json({"RET_VALUE": "LOGIN_FAIL"});
        
                                    }

                                });

                            } else if(resultA == -1) {

                                response.json({"RET_VALUE": "LOGIN_FAIL"});

                            } else {

                                decrementTries(ip, email , (rez) => {
        
                                    checkSessionTries(ip, email, (resultCode) => {

                                        if(resultCode) {

                                            response.json({"RET_VALUE": "False"});

                                        } else if(resultCode == -1) {

                                            response.json({"RET_VALUE": "LOGIN_FAIL"});

                                        } else {

                                            closeSession(ip, email);
                                            response.json({"RET_VALUE": "SESSION_LOCK"});

                                        }

                                    });

                                });

                            }

                        });

                    } else {

                        response.json({"RET_VALUE": "RECONNECT"});

                    }

                })
 
            });

            // Login 2
            app.post("/authStep2" , async (request, response) => {

                const {email, security_code } = request.body;
                const ip = request.ip;
               
                console.log("AuthStep2 used for ip: " + ip + " with email: " + email + " and code: " + security_code);

                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        isSecurityCodeNull(email, (resultA) => {

                            if(resultA) {

                                verifySecurityCode(security_code, email, (resultB) => {

                                    if(resultB) {

                                        getSessionId(ip, email, (resultC) => {

                                            if(resultC) {

                                                resetTries(ip,email);
                                                loginLastTime(email);
                                                response.json({"RET_VALUE": "True", "SESSION_ID": resultC});

                                            } else {

                                                response.json({"RET_VALUE": "LOGIN_FAIL", "SESSION_ID": "ERROR"});

                                            }

                                        });

                                    } else if(resultB == -3) {

                                        response.json({"RET_VALUE": "RECONNECT_CODE", "SESSION_ID": "ERROR"});

                                    } else if(resultB == -1 || resultB == -2) {

                                        response.json({"RET_VALUE": "LOGIN_FAIL", "SESSION_ID": "ERROR"});

                                    } else {

                                        decrementTries(ip, email , (rez) => {
        
                                            checkSessionTries(ip, email, (resultCode) => {
        
                                                if(resultCode) {

                                                    response.json({"RET_VALUE": "False", "SESSION_ID": "ERROR"});
        
                                                } else if(resultCode == -1) {
        
                                                    response.json({"RET_VALUE": "LOGIN_FAIL", "SESSION_ID": "ERROR"});
        
                                                } else {
        
                                                    closeSession(ip, email);
                                                    response.json({"RET_VALUE": "SESSION_LOCK", "SESSION_ID": "ERROR"});
        
                                                }
        
                                            });
        
                                        });

                                    }

                                });

                            } else {

                                response.json({"RET_VALUE": "RECONNECT", "SESSION_ID": "ERROR"});

                            }

                        });

                    } else if(result == false){

                        response.json({"RET_VALUE": "SESSION_LOCK", "SESSION_ID": "ERROR"});

                    } else if(result == -1) {

                        response.json({"RET_VALUE": "SC_EMPTY", "SESSION_ID": "ERROR"});

                    } else {

                        response.json({"RET_VALUE": "LOGIN_FAIL", "SESSION_ID": "ERROR"});

                    }   
                    
                }); 

            
            });
            
            
            // Login 1
            app.post("/authStep1" , async (request, response) => {

                const { email , password } = request.body;
                const ip = request.ip;

                console.log("AuthStep1 used for ip: " + ip + " with email: " + email + " and password: " + password);

                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        validateUser(email, password, (resultUser) => {

                            if(resultUser == true) {

                                let code = codeGenerator(8);
                                addSecurityCode(code, email , (resultCode) => {

                                    if(resultCode) {

                                        resetTries(ip, email);
                                        emailSender(email, code);
                                        response.json({"RET_VALUE": "True"});

                                    } else {

                                        response.json({"RET_VALUE": "LOGIN_FAIL"});

                                    }

                                });

                            } else if(resultUser == false) {

                                decrementTries(ip , email , (rez) => {

                                    checkSessionTries(ip , email , (resultCode) => {

                                        if(resultCode) {

                                            response.json({"RET_VALUE": "False"});

                                        } else if(resultCode == -1) {

                                            response.json({"RET_VALUE": "LOGIN_FAIL"});

                                        } else {

                                            closeSession(ip, email);
                                            response.json({"RET_VALUE": "SESSION_LOCK"});

                                        }

                                    });

                                });

                            } else if(resultUser == -1 || resultUser == -2) {

                                response.json({"RET_VALUE": "LOGIN_FAIL"});

                            }

                        });

                    } else if(result == false) {

                        response.json({"RET_VALUE": "SESSION_LOCK"});

                    } else if(result == -1) {

                        emailExists(email, (rez) => {
                        
                        if(rez) {
                        addSession(ip , email , "TO_BE_ADDED", (result) => {

                            if(result) {

                                validateUser(email, password, (resultUser) => {

                                    if(resultUser == true) {
        
                                        let code = codeGenerator(8);
                                        addSecurityCode(code , email , (resultCode) => {
        
                                            if(resultCode) {
        
                                                resetTries(ip, email);
                                                emailSender(email, code);
                                                response.json({"RET_VALUE": "True"});
        
                                            } else {
        
                                                response.json({"RET_VALUE": "LOGIN_FAIL"});
        
                                            }
        
                                        });
        
                                    } else if(resultUser == false) {
        
                                        decrementTries(ip, email , (rez) => {
        
                                            checkSessionTries(ip, email, (resultCode) => {
        
                                                if(resultCode) {

                                                    response.json({"RET_VALUE": "False"});
        
                                                } else if(resultCode == -1) {
        
                                                    response.json({"RET_VALUE": "LOGIN_FAIL"});
        
                                                } else {
        
                                                    closeSession(ip, email);
                                                    response.json({"RET_VALUE": "SESSION_LOCK"});
        
                                                }
        
                                            });
        
                                        });
        
                                    } else if(resultUser == -1) {
        
                                        response.json({"RET_VALUE": "LOGIN_FAIL"});
        
                                    }
        
                                });

                            } else {

                                response.json({"RET_VALUE": "LOGIN_FAIL"});

                            }

                        });
                        } else {

                            response.json({"RET_VALUE": "LOGIN_FAIL"});

                        }

                    });

                    } else if(result == -2) {

                        response.json({"RET_VALUE": "LOGIN_FAIL"});

                    } 

                });
                
            });

            // SERVER START LOGIC
            const hostname = "192.168.1.146";//readData[5]; //numele domeniului(daca avem unul) sau adresa IPV4;
            const port = 443; // parseInt(readData[6]); //portul care il vom folosi;

            server.listen(port, hostname, () => {

                console.log("Server is running on https://" + hostname + ":" + port);

            });

        }

    });

} catch (error) {

    console.error("Error reading values from database table INPUT" + error.message);

}


// VER 1.8a

/* 

    THINGS TO BE IMPLEMENTED:

        - IP BAN FOR SOME TIME AFTER AN AMOUNT OF TRIES , DO RESEARCH;
        - ALL SERVER FUNCTIONS TO BE MODIFIED TO FIT APP SPECIFICS;
        - ROUTES FOR FILE TRANSFER ETC... BE IMPLEMNTED;
        - .NET APP FOR SERVER LOGIC START TO BE CREATED , SIMPLE INTERFACE + ACCOUNT CREATION COMMAND!

        - LOGIN PHASE 1 MERGE , MAI RAMANE DE TRIMIS DOAR EMAIL CU CODUL;
        - PHASE 2 NU MERGE IN APP , VEDEM MAINE;
        - TREBUIE MODIFICATE FUNCTIILE IN APP;
        - O SA AVEM UN ALT PROGRAM CARE O SA VERIFICE BAZA DE DATE PT A RESETA CODUL DE SECURITATE LA NULL SI PT A STERGE OLD SESSIONS , TOTUL ESTE BAZAT PE TIMP;

        -- ATUNCI CAND USERUL VA INCERCA SA FOLOSESCA FISIERE , DACA IP NU EXISTA , NU VA DI LUATA IN CALCUL NICIO OPERATIE!
        -- LA AUTH2 SI 3 , DACA IP NU SE AFLA IN TABELUL SESSION , SA NU FIE LUAT IN CONSIDERARE LA AUTH2 SI LA AUTH3 sa fie redirectionat la login!
*/

// dev: M.C.A



