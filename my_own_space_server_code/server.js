const https = require("https");
const express = require("express");
const multer = require('multer');
const fs = require("fs");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const { call } = require("function-bind");
const path = require("path");
const { EMPTY } = require("sqlite3");
const checkDiskSpace = require('check-disk-space').default;

const dbOnePath = "admin_db.sqlite";
const dbOne = new sqlite3.Database(dbOnePath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite admin_db');

});

const dbTwoPath = "ip_list.sqlite";
const dbTwo = new sqlite3.Database(dbTwoPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite ip_list');

});

let readData = [null, null, null, null, null, null, null];
const dbPath = "myOwnSpaceDb.sqlite"// DATA_BASE NAME AND LOCATION
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to main SQLite database');

});

const readQuery = "SELECT PRIVATE_PATH , CERTIFICATE_PATH , CHAIN_PATH, EMAIL , PASSWORD, HOSTNAME, PORT FROM INPUT WHERE Id = 1";
try {

    db.get(readQuery, (error, result) => {

        if (error) {

            console.error("Error reading values from database table INPUT" + error.message);

        } else {

            console.log("All data form table INPUT have been read");

            try {

                
                if(result.PRIVATE_PATH != null) {

                    readData[0] = result.PRIVATE_PATH;
                    readData[1] = result.CERTIFICATE_PATH;
                    readData[2] = result.CHAIN_PATH;
                    readData[3] = result.EMAIL;
                    readData[4] = result.PASSWORD;
                    readData[5] = result.HOSTNAME;
                    readData[6] = result.PORT;
                    
                }

            } catch(e) {

                console.log("Error at begin , database has no init rows: " + e.message);

            }

            const app = express() //Here we initialize the application with Express for HTTPS Request
            app.use(express.json()); //tells the app how to parse json
            app.use('/', express.static(path.join(__dirname, 'my_own_space_web'))); //tells the app where to find the static files
            
            const server = https.createServer({ // https server

                key: fs.readFileSync(readData[0]),
                cert: fs.readFileSync(readData[1]),
                ca: fs.readFileSync(readData[2]),

            }, app);
            

            function emailSender(email, code) {

                //Create a transporter with your SMTP configuration
                const transporter = nodemailer.createTransport({

                    service: "gmail",
                    auth: {

                        user: readData[3],
                        pass: readData[4] 

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

                return password;

            }
            
            function makeHash(string) {

                return crypto.createHash("sha512").update(string).digest("hex");

            }

            function verifyHash(string, db_hash, callback) {

                try{

                    let stringHash = makeHash(string);

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

            function updatefileName(fileName, filePath , newFileName, newFilePath, callback) {

                const query = `UPDATE data SET FILE_NAME = ? , FILE_URI = ? WHERE FILE_NAME = ? AND FILE_URI = ?`;
                db.run(query, [newFileName, newFilePath, fileName, filePath] , (error) => {

                    if (error) {

                        console.log("Failed to update file name , error: " + error.message);
                        callback(false);

                    } else {

                        callback(true);
                             
                    }

                });

            }

            function getFileInfo(file_name, file_id, callback) {

                const query = `SELECT FILE_NAME, FILE_URI , FILE_DATE, FILE_TYPE FROM data WHERE FILE_NAME = ? AND FILE_ID = ?`;
                db.get(query, [file_name, file_id] ,(error, rows) => {

                    if(error) {

                        console.error("Error in trying to retreive file names: " + error.message);
                        callback(false);

                    } else if(rows){ 
                            
                        if(rows.FILE_NAME != null) {

                            callback(rows);

                        } else {

                            callback(false);

                        }

                    } else { callback(false); }

                });

            }

            function deleteFile(fileName, fileId) {

                const query = `DELETE FROM data WHERE FILE_NAME = ? AND FILE_ID = ?`;
                db.run(query, [fileName, fileId], (error) => {
            
                    if (error) {
            
                        console.error("Cannot delete row in table data:", error.message);
            
                    } else {
            
                        console.log("Row from table data sucefully deleated.");
                             
                    }
            
                });

            }


            function retriveFileNames(callback) {

                // GETS ALL THE FILE NAMES TO THE USER as a list of maps;
                const query = `SELECT FILE_NAME, FILE_DATE, FILE_TYPE, FILE_SIZE, FILE_ID FROM data`;
                db.all(query, (error, rows) => {

                    if(error) {

                        console.error("Error in trying to retreive file names: " + error.message);
                        callback(-2);

                    } else if(rows){ 
                            
                        if(rows.length > 0 && rows[0].FILE_NAME != null) {

                            callback(rows);

                        } else {

                            callback([]);

                        }

                    } else { callback([]); }

                });

            }

            function retriveFilePath(callback) {

                // GETS ALL THE FILE NAMES TO THE USER as a list of maps;
                const query = `SELECT FILE_URI FROM data`;
                db.all(query, (error, rows) => {

                    if(error) {

                        console.error("Error in trying to retreive file paths: " + error.message);
                        callback(-2);

                    } else if(rows){ 
                            
                        if(rows.length > 0 && rows[0].FILE_URI != null) {

                            callback(rows);

                        } else {

                            callback(false);

                        }

                    } else { callback(false); }

                });

            }

            function deleteAllFiles() {

                const query = `DELETE FROM data`;
                db.run(query, (error) => {
            
                    if (error) {
            
                        console.error("Cannot delete all rows in data:", error.message);
            
                    } else {
            
                        console.log("Row from table data sucefully deleated.");
                             
                    }
            
                });
            
            }

            function insertIntoFolder(file_name, file_uri, file_type, file_size, file_id, callback) {

                const file_date = date();

                const query = `INSERT INTO data (FILE_NAME, FILE_URI, FILE_DATE, FILE_TYPE, FILE_SIZE, FILE_ID) VALUES (?, ?, ?, ?, ?, ?)`;
                db.run(query, [file_name, file_uri , file_date , file_type , file_size, file_id], (error) => {

                    if (error) {

                        console.log("Error inserting into table:" + error.message);
                        callback(false);

                    } else {

                        console.log("File inserted successfully.");
                        callback(true);
                             
                    }

                });

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

            function addIp(ip) {

                // current date in ms
                const current_date = date();

                const query = `INSERT INTO ip_table (IP , DATE) VALUES (?, ?)`;
                dbTwo.run(query, [ip , current_date], (error) => {

                    if (error) {

                        console.error("Failed inserting ip in database, with cause: " + error.message);

                    }

                });

            }

            function addSession(ip, email,device_type, callback) {

                const session_id = codeGenerator(64);
                const session_hash = makeHash(session_id);

                // current date in ms 
                const current_date = date();

                const query = `INSERT INTO session (IP , SESSION_ID , DATE , SESSION_OPEN , DEVICE_TYPE, EMAIL) VALUES (?, ?, ?, ?, ?,?)`;
                db.run(query, [ip , session_hash , current_date , 1 , device_type, email], (error) => {

                    if (error) {

                        console.error("Failed creating a session for ip: " + ip + " with cause: " + error.message);
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

                    const query = `SELECT SESSION_ID FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.error("Error in trying to select session_id, database error: " + error.message);
                            callback(-1);

                        } else if(column){ 

                            if(column.SESSION_ID != null) {
                                
                                if(session_id === column.SESSION_ID) {

                                    console.log("Session id is valid for ip: " + ip);
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

                    const query = `SELECT SESSION_ID FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.error("Error in trying to select session_id, database error: " + error.message);
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

            function getAdminKey(callback) {

                    const query = `SELECT KEY FROM admin_table WHERE id = 1`;
                    dbOne.get(query , (error, column) => {

                        if(error) {

                            console.error("Error in trying to select session_id, database error: " + error.message);
                            callback(false);

                        } else if(column) { 

                            if(column.KEY != null) {
                            
                                callback(column.KEY); 

                            } else {

                                callback(false);

                            }

                        } else { callback(false); }

                    });

            }

            function checkSesionOpen(ip , email, callback) {

                    const query = `SELECT SESSION_OPEN FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.error("Error in trying to check session, database error: " + error.message);
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
             
                    const query = `SELECT SESSION_TRIES FROM session WHERE IP = ? AND EMAIL = ?`;
                    db.get(query, [ip, email] , (error, column) => {

                        if(error) {

                            console.error("Error in trying to verify session tries, database error: " + error.message);
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

                        console.error("Error in trying to verify the code_date, database error: " + error.message);
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

                isCodeStillValid(email, (result) => {

                    if(result) {

                        const query = `SELECT SECURITY_CODE FROM users WHERE EMAIL = ?`;
                        db.get(query, [email] , (error, column) => {

                            if(error) {

                                console.error("Error in trying to verify the code, database error: " + error.message);
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
                
                    const query = `SELECT PASSWORD FROM users WHERE EMAIL = ?`;
                    db.get(query, [email] , (error, column) => {

                        if(error) {

                            console.error("Error in trying to validate user, database error: " + error.message);
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

            function loginLastTime(email, ip) {

                const query = `UPDATE users SET LAST_TIME_CONNECTED = ?, SECURITY_CODE = ? WHERE EMAIL = ?`;
                db.run(query, [date() ,null ,email]);

                const query2 = `UPDATE session SET DATE = ? WHERE EMAIL = ? AND IP = ?`;
                db.run(query2, [date() ,email, ip]);

            }

            function isSecurityCodeNull(email, callback) {

                const query = `SELECT SECURITY_CODE FROM users WHERE EMAIL = ?`;
                db.get(query, [email] , (error, column) => {

                    if(error) {

                        console.error("Error in trying to validate user, database error: " + error.message);
                        callback(-1);

                    } else if(column) {
                        
                        if(column.SECURITY_CODE != null) {

                            callback(true);

                        } else { callback(false); }

                    } else {

                        callback(false);

                    }

                });

            }

            app.post("/multi/onFile", async(request, response) => {

                const { email, session_id, file_name, file_id, new_file_name, reason } = request.body;
                const ip = request.ip; addIp(ip);
              
                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            loginLastTime(email, ip);

                            if(resultA) { 
                                
                                if(reason === "rename") { 

                                    getFileInfo(file_name, file_id , (resultB) => { 

                                        if(resultB != null) {

                                            const filePath = resultB.FILE_URI;
                                            const fileType = resultB.FILE_TYPE;
                                            if (!fs.existsSync(filePath)) {

                                                console.log("File path not existent! \n");
                                                return response.status(500).send("NO_MESSAGE");
    
                                            } else {

                                                const safeId = path.basename(file_id);
                                                const safeName = path.basename(new_file_name);
                                                const safeType = path.basename(fileType);

                                                const newPathFile = path.join("./main/" + safeId + safeName + "." + safeType);

                                                fs.rename(filePath, newPathFile, (err) => {

                                                    if (err) {

                                                        response.status(500).send("ERROR");

                                                    } else {

                                                        console.log('File renamed successfully!');
                                                        updatefileName(file_name, filePath, new_file_name, newPathFile, (resultC) => {

                                                            if(resultC) {

                                                                response.status(200).send("NO_MESSAGE");

                                                            } else {

                                                                response.status(500).send("ERROR");

                                                            }

                                                        });

                                                    }

                                                });
                                                
                                            }

                                        } else {

                                            response.status(500).send("ERROR");

                                        }

                                    });

                                } else if(reason === "delete") { 

                                    const safeName = path.basename(file_name);
                                    const safeId = path.basename(file_id);

                                    getFileInfo(safeName, safeId , (resultB) => { 

                                        if(resultB != null) {

                                            const filePath = resultB.FILE_URI;
                                            if (!fs.existsSync(filePath)) {

                                                console.log("File path not existent! \n");

                                                deleteFile(file_name, file_id);
                                                return response.status(700).send("FILE_PATH_ERROR");
    
                                            } else {

                                                fs.unlink(filePath, (err) => {

                                                    if (err) {

                                                        console.error('Error deleting file:', err);
                                                        response.status(500).send("ERROR");

                                                    } else {

                                                        console.log('File deleted successfully!');
                                                        deleteFile(file_name, file_id);
                                                        response.status(200).send("NO_MESSAGE");

                                                    }

                                                });
                                                
                                            }

                                        } else {

                                            response.status(500).send("ERROR");

                                        }

                                    });

                                } else if(reason === "delete_all") {

                                    retriveFilePath( (paths) => {

                                        if(paths.length > 0) {
    
                                            for(const i of paths) {

                                                fs.unlink(i.FILE_URI, (err) => { if(err) { console.error(err); } });

                                            }

                                            deleteAllFiles();
    
                                        } else {
    
                                            response.status(500).send("ERROR");

                                        }
    
                                    });

                                }

                            } else if(resultA == -1) {

                                console.log("Error in multi data.");
                                response.status(100).send("SESSION_INVALID");

                            } else {

                                decrementTries(ip, email , (rez) => {
        
                                    checkSessionTries(ip, email, (resultCode) => {

                                        if(resultCode) {

                                            response.status(100).send("SESSION_INVALID");

                                        } else if(resultCode == -1) {

                                            response.status(300).send("AWAIT_SESSION");

                                        } else {

                                            closeSession(ip, email);
                                            response.status(600).send("SESSION_CLOSED");

                                        }

                                    });

                                });

                            }

                        });

                    } else {

                        console.log("Error in multi data, session dose not exist or is locked.")
                        response.status(500).send("ERROR");

                    }

                })

            });

            app.get("/download", async(request, response) => {

                // request.query is used to get the query parameters from the url only on GET requests
                const { email, session_id, file_name, file_id } = request.query;
                const ip = request.ip; addIp(ip);
              
                checkSesionOpen(ip, email, (result) => { 

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            if(resultA) { 
                                
                                getFileInfo(file_name, file_id , (resultB) => {

                                    if(resultB != false) {

                                        const safeId = path.basename(file_id);
                                        const safeName = path.basename(file_name);
                                        const fileFullName = path.join(safeId + safeName + "." + resultB.FILE_TYPE);
                                        const filePath = resultB.FILE_URI;

                                        // Check if the file exists on the filesystem, in main folder inside app files;
                                        if (!fs.existsSync(filePath)) {

                                            console.log("File path not existent! \n \n");
                                            return response.status(500).send("ERROR");

                                        }
                
                                        // Send the file to the client(app);
                                        response.download(filePath, fileFullName, (err) => {

                                            if (err) {

                                                console.error("Error sending data: ", err);
                                                response.status(500).send("ERROR");

                                            } else { loginLastTime(email, ip); }

                                        });


                                    } else {

                                        response.status(500).send("ERROR");

                                    }

                                });

                            } else if(resultA == -1) {

                                console.log("Error in downoading data.");
                                response.status(100).send("SESSION_INVALID");

                            } else {

                                decrementTries(ip, email , (rez) => {
        
                                    checkSessionTries(ip, email, (resultCode) => {

                                        if(resultCode) {

                                            response.status(100).send("SESION_INVALID");

                                        } else if(resultCode == -1) {

                                            response.status(300).send("AWAIT_SESSION");

                                        } else {

                                            closeSession(ip, email);
                                            response.status(600).send("SESSION_CLOSED");

                                        }

                                    });

                                });

                            }

                        });

                    } else {

                        console.log("Error in downloading data, session dose not exist or is locked.")
                        response.status(500).send("ERROR");

                    }

                })

            });

            const storage = multer.diskStorage({

                destination: (req, file, cb) => {

                  cb(null, './main'); // Directory where files will be saved

                },

                filename: (req, file, cb) => {

                  cb(null, `${file.originalname}`); // File 

                },

            });

            const upload = multer({ 
                storage,
                limits: { fileSize: 1024 * 1024 * 1024 * 100 } // 100GB safety cap
            });

            app.post("/upload" , async(request, response) => {

                const email = request.headers['email'];  // Access email from headers
                const session_id = request.headers['session_id'];  // Access session_id from headers
                const fileName = request.headers['file_name'];
                const fileSize = request.headers['file_size'];
                const fileType = request.headers['file_type'];
                const file_id = request.headers['file_id'];
                const ip = request.ip; addIp(ip);

                // --------- added disk space check -------
                const driveRoot = path.parse(__dirname).root; // Windows safe
                const { free } = await checkDiskSpace(driveRoot);

                // Convert MB → bytes
                const incomingSize =  parseFloat(fileSize) * 1024 * 1024;
                const safetyBuffer = 5 * 1024 * 1024 * 1024; // 5GB buffer

                if (incomingSize > free - safetyBuffer) {
                    console.log("***User tried to upload a file too large, system is out of space.");
                    return response.status(400).send("NOT_ENOUGH_SPACE");
                }
                // ----------------------------------------

                checkSesionOpen(ip, email, (result) => { 

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            if(resultA) { 
                                
                                upload.single('file')(request, response, (error) => {

                                    if (!error) {
                                        
                                        const safeName = path.basename(fileName);
                                        const safeType = path.basename(fileType);
                                        const safeId = path.basename(file_id);

                                        const filePath = path.join("./main/" + safeId + safeName + "." + safeType);
                                        insertIntoFolder(safeName, filePath, safeType, fileSize + " MB", safeId, (result) => {

                                            if(result) {

                                                loginLastTime(email, ip);
                                                response.status(200).send("NO_MESSAGE");

                                            } else {

                                                response.status(500).send("ERROR");

                                            }

                                        });

                                    } else {
                                        
                                        console.log("***" + error);
                                        response.status(500).send("ERROR");

                                    }
                    
                                });

                            } else if(resultA == -1) {

                                console.log("Error in uploading data.");
                                response.status(100).send("SESSION_INVALID");

                            } else {

                                decrementTries(ip, email , (rez) => {
        
                                    checkSessionTries(ip, email, (resultCode) => {

                                        if(resultCode) {

                                            response.status(100).send("SESSION_INVALID");

                                        } else if(resultCode == -1) {

                                            response.status(300).send("AWAIT_SESSION");

                                        } else {

                                            closeSession(ip, email);
                                            response.status(600).send("SESSION_CLOSED");

                                        }

                                    });

                                });

                            }

                        });

                    } else {

                        console.log("Error in uploading data, session dose not exist or is locked.")
                        response.status(500).send("ERROR");

                    }

                })

            });

            app.post("/fetch/file/names", async(request, response) => {

                const { email, session_id } = request.body;
                const ip = request.ip; addIp(ip);

                checkSesionOpen(ip, email, (result) => { 

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            if(resultA) { 
                                
                                retriveFileNames( (fileNames) => {

                                    if(fileNames != -2) {
                                        console.log("Data from server has been fetch.");

                                        loginLastTime(email, ip);
                                        response.json([{"RET_VALUE": "True"}, fileNames]);

                                    } else {

                                        console.log("Error in fetching data, retrive error.")
                                        response.json([{"RET_VALUE": "ERROR"}]);

                                    }

                                });

                            } else if(resultA == -1) {

                                console.log("Error in fetching data.");
                                response.json([{"RET_VALUE": "ERROR"}]);

                            } else {

                                decrementTries(ip, email , (rez) => {
        
                                    checkSessionTries(ip, email, (resultCode) => {

                                        if(resultCode) {

                                            response.json([{"RET_VALUE": "ERROR"}]);

                                        } else if(resultCode == -1) {

                                            response.json([{"RET_VALUE": "ERROR"}]);

                                        } else {

                                            closeSession(ip, email);
                                            response.json([{"RET_VALUE": "ERROR"}]);

                                        }

                                    });

                                });

                            }

                        });

                    } else {

                        console.log("Error in fetching data, session dose not exist or is locked.")
                        response.json([{"RET_VALUE": "ERROR"}]);

                    }

                })

            });
            

            function sleep(ms) {

                return new Promise(resolve => setTimeout(resolve, ms));
            
            }

            app.post("/admin/protocol", async(request) => {

                const { procedure , key } = request.body;
                const ip = request.ip; addIp(ip);

                await sleep(150000);
                getAdminKey(result => {

                    if(result) {

                        if(procedure == "e") {

                            if(result == key) {

                                server.close(() => {

                                    console.log('Server closed ' + date());

                                    db.close();
                                    dbOne.close();
                                    dbTwo.close();
                                    process.exit(0); // Ensure all processes are terminated

                                });

                            }

                        }

                    }

                });

            });

            //Login 3
            app.post("/authStep3" , async (request, response) => {

                const { email , password , session_id } = request.body;
                const ip = request.ip; addIp(ip);

                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        checkSessionId(session_id, ip, email, (resultA) => {

                            if(resultA) {
                                
                                validateUser(email, password, (resultUser) => {

                                    if(resultUser == true) {

                                        resetTries(ip, email);
                                        loginLastTime(email, ip);
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

                    } else if(result == -1) {

                        response.json({"RET_VALUE": "RECONNECT"});

                    } else {

                        response.json({"RET_VALUE": "ERROR"});

                    }

                })
 
            });

            // Login 2
            app.post("/authStep2" , async (request, response) => {

                const {email, security_code } = request.body;
                const ip = request.ip; addIp(ip);
               
                checkSesionOpen(ip, email, (result) => {

                    if(result == true) {

                        isSecurityCodeNull(email, (resultA) => {

                            if(resultA) {

                                verifySecurityCode(security_code, email, (resultB) => {

                                    if(resultB) {

                                        getSessionId(ip, email, (resultC) => {

                                            if(resultC) {

                                                resetTries(ip,email);
                                                loginLastTime(email,ip);
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
                const ip = request.ip; addIp(ip);

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

            app.get("/", (request, response) => {

                response.sendFile(path.join(__dirname, 'my_own_space_web', 'index.html'), error => {

                    if(error) {

                        console.error(new Date() + ", error in sending file: " + error.message);

                    }

                });

            });

            // SERVER START LOGIC
            const hostname = readData[5]; //numele domeniului(daca avem unul) sau adresa IPV4;
            const port = parseInt(readData[6]); //portul care il vom folosi;

            server.listen(port, hostname, () => {

                console.log("Server is running on https://" + hostname + ":" + port);

            });

        }

    });

} catch (error) {

    console.error("Error reading values from database table INPUT" + error.message);

}


// VER 1.2 release;
// dev: M.C.A;
// COMPLETE VERSION OF SERVER FOR VER 1.2;



