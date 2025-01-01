const sqlite3 = require("sqlite3").verbose();
const nodemailer = require('nodemailer');
const fs = require("fs");
const randomInt = require("crypto");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require("socket.io")

let readData = [null, null, null, null, null, null, null];
const dbPath = "DataBaseSQLite.db"// DATA_BASE NAME AND LOCATION
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

            readData[0] = result[0].PRIVATE_PATH;
            readData[1] = result[0].CERTIFICATE_PATH;
            readData[2] = result[0].CHAIN_PATH;
            readData[3] = result[0].EMAIL;
            readData[4] = result[0].PASSWORD;
            readData[5] = result[0].HOSTNAME;
            readData[6] = result[0].PORT;


            const app = express() //Here we initialize the application with Express for HTTPS Request
            app.use(bodyParser.json()); //JSON int

            const server = https.createServer({

                key: fs.readFileSync(readData[0]),
                cert: fs.readFileSync(readData[1]),
                ca: fs.readFileSync(readData[2]),

            }, app);

            const startSocketIo = socketIO(server , { maxHttpBufferSize: 1e8 } ); //Here we initialize Socketio and specify maxHttpBuffer to 100mb
            const currentDate = new Date(); //Creating an instance of the day/month/year

            function emailSender(email, code) {

                //Create a transporter with your SMTP configuration
                const transporter = nodemailer.createTransport({

                    service: 'gmail',
                    auth: {

                        user: readData[3],
                        pass: readData[4]

                    }

                });

                // Compose the email
                const mailOptions = {

                    from: readData[3],
                    to: email,
                    subject: 'Verification code',
                    text: 'Your code is:' + code

                };

                // Send the email
                transporter.sendMail(mailOptions, function (error, info) {

                    if (error) {

                        console.error('Error sending email:', error);

                    } else {

                        console.log('Email sent:', info.response);

                    }

                });

            }
            
            // Random string generator
            function codeGenerator(lenght) {

                const characters = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

                let password = '';

                for (let i = 0; i < lenght; i++) {

                    const randomIndex = randomInt.randomInt(characters.length);
                    password += characters.charAt(randomIndex);

                }

                console.log("Code generated is: " + password);

                return password;

            }
            
            //Finds the email in db
            function emailFinder(email, callback) {

                const query = "SELECT ID FROM USERS WHERE EMAIL = ?";

                try {

                    db.all(query, [email], function (error, result) {

                        if (error) {

                            console.log("DATA BASE EMAIL FINDER, NO ID FOUND FOR EMAIL: ", email); callback(false);

                        }
                        else {

                            console.log("DATA BASE EMAIL FINDER, EMAIL FOUND WITH ID: ", result[0].ID); callback(true);

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //Registers account into db
            function registerAccount(email, password, username) {

                let id = codeGenerator(12);
                let secure_code = codeGenerator(16);

                const query = "INSERT INTO USERS (ID,EMAIL, PASSWORD, USERNAME, SECURE_CODE, CODE, STATUS, DAYS, LOG, NUMBER , NOF , SOCKET_ID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

                try {

                    db.run(query, [id, email, password, username, secure_code, secure_code, "INACTIVE", 365, "", 128, 0, ""], function (error) {

                        if (error) {

                            console.log("DATA BASE ACCOUNT ADD: ERROR", error.message);

                        }
                        else { console.log("DATA BASE ACCOUNT ADD: USER WITH EMAIL: ", email + " HAS BEEN CREATED"); }

                    });

                } catch (error) {

                    console.log(error);

                }

            }
            
            //Login
            function authEmail(email, password, callback) {

                let query = "SELECT PASSWORD FROM USERS WHERE EMAIL = ?";

                try {

                    db.all(query, [email], function (error, result) {

                        if (error) {

                            console.log("AUTH EMAIL: ", error.message);
                            callback(false);

                        }
                        else {

                            if (result[0].PASSWORD === password) {

                                console.log("AUTH EMAIL MAIN, SUCCESS FOR EMAIL: " + email);
                                callback(true);

                            }
                            else {

                                console.log("AUTH EMAIL MAIN,INCORRECT PASSWORD FOR EMAIL: " + email);
                                callback(false);

                            }

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //Get the Username and Id from db
            function getUsernameId(email, callback) {

                let query = "SELECT USERNAME , ID FROM USERS WHERE EMAIL = ?";

                try {

                    db.all(query, [email], function (error, result) {

                        if (error) {

                            console.log("GET USERNAME & ID: " + error.message);
                            callback(false, "EMPTY", "EMPTY");

                        }
                        else if (result.length > 0) {

                            console.log("GET USRENAME & ID , RETRIVED USERNAME: " + result[0].USERNAME + " AND ID: " + result[0].ID);
                            callback(true, result[0].USERNAME, result[0].ID);

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //Get socketId from db
            function getSocketId(email, callback) {

                query = "SELECT SOCKET_ID FROM USERS WHERE EMAIL = ?";

                try {

                    db.all(query, [email], function (error, result) {

                        if (error) {

                            console.log("GET SOCKET ID: " + error.message);
                            callback(false);

                        }
                        else {

                            if (result.length > 0) {

                                console.log("GET SOCKET ID , RETRIVED ID: " + result[0].SOCKET_ID);
                                callback(result[0].SOCKET_ID);

                            }
                            else {

                                console.log("GET SOCKET ID: NO ID PRESENT");
                                callback(false);

                            }

                        }

                    });

                } catch (error) {

                    console.log(error);
                    callback(false)

                }

            }

            //Registers the socketId to db
            function registerSocketId(email, socketId) {

                let query = "UPDATE USERS SET SOCKET_ID = ? WHERE EMAIL = ?";

                try {

                    db.run(query, [socketId, email], function (error) {

                        if (error) {

                            console.log("ADD USERS SOCKET_ID FAILED FOR USER: " + email + " WITH ERROR " + error.message);

                        }
                        else {

                            console.log("ADD USER SOCKET_ID WORKING!");

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //Modify password field for a specific email
            function changePassword(email, newPassword, callback) {

                let query = "UPDATE USERS SET PASSWORD = ? WHERE EMAIL = ?";

                try {

                    db.run(query, [newPassword, email], function (error) {

                        if (error) {

                            console.log("PASSWORD NOT CHANGED FOR: " + email + " WITH ERROR " + error.message);
                            callback(false)

                        }
                        else {

                            console.log("PASSWORD CHANGED FOR: " + email);
                            callback(true)

                        }

                    });

                } catch (error) {

                    console.log(error);
                    callback(false)

                }

            }

            //Modify Username field for a specific email
            function changeUsername(email, newUsername, callback) {

                let query = "UPDATE USERS SET USERNAME = ? WHERE EMAIL = ?";

                try {

                    db.run(query, [newPassword, email], function (error) {

                        if (error) {

                            console.log("USERNAME NOT CHANGED FOR: " + email + " WITH ERROR " + error.message);
                            callback(false)

                        }
                        else {

                            console.log("USERNAME CHANGED FOR: " + email);
                            callback(true)

                        }

                    });

                } catch (error) {

                    console.log(error);
                    callback(false)

                }

            }

            //Verify the input code with the one in db
            function verifyCode(email, code, callback) {

                const currentTime = currentDate.toLocaleString();

                let queryA = "SELECT CODE FROM USERS WHERE EMAIL = ?";

                try {

                    db.all(queryA, [email], function (errorA, resultA) {

                        if (errorA) {

                            console.log("CODE VERIFICATION: " + errorA.message);
                            callback(false, "false");

                        }
                        else {

                            if (resultA[0].CODE === code) {

                                let queryB = "UPDATE USERS SET STATUS = ? , LOG = ? , CODE = ?  WHERE EMAIL = ?";

                                db.run(queryB, ["ACTIVE", currentTime, codeGenerator(16), email], function (errorB) {

                                    if (errorB) {

                                        console.log("CODE VERIFICATION: " + errorB.message);
                                        callback(false, "false");

                                    }
                                    else {

                                        let queryC = "SELECT SECURE_CODE FROM USERS WHERE EMAIL = ?";

                                        db.all(queryC, [email], function (errorC, resultC) {

                                            if (errorC) {

                                                console.log("CODE VERIFICATION: " + errorC.message);
                                                callback(false, "false");

                                            }
                                            else {

                                                console.log("CODE VERIFICATION: SUCCES WITH ID: " + resultC[0].SECURE_CODE);
                                                callback(true, resultC[0].SECURE_CODE);

                                            }

                                        });

                                    }

                                });

                            }
                            else {

                                console.log("CODE VERIFICATION: FAILED , WRONG CODE!");
                                callback(false, "false");

                            }

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //Register code for a specific email
            function registerCode(email, callback) {

                let code = codeGenerator(8);
                let query = "UPDATE USERS SET CODE = ? WHERE EMAIL = ?";

                try {

                    db.run(query, [code, email], function (error) {

                        if (error) {

                            console.log("ADD CODE TO DB ERROR: " + error.message);
                            callback(false);

                        }
                        else {

                            console.log("ADD CODE TO DB: WORKING! , WITH CODE: " + code);
                            callback(code);

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

            //The main method of auth after login 
            function authServer(secure_code, email, callback) { // TODO: ADD USER PASSWORD AS A DOUBLE MESURE

                let query = "SELECT SECURE_CODE FROM USERS WHERE EMAIL = ?";

                db.all(query, [email], function (error, result) {

                    if (error) {

                        console.log("ECV: " + error.message);
                        callback(false);

                    }
                    else {

                        try {

                            if (result[0].SECURE_CODE === secure_code) {

                                console.log("SERVER ACCESS: NO ERRORS!");
                                callback(true);

                            }
                            else {

                                console.log("SERVER ACCESS: SECURE_CODE DOSE NOT MACH FROM EMAIL: ", email);
                                callback(false);

                            }

                        } catch (error) {

                            console.log("SERVER ACCESS: FUNCTION FAIL, ERROR");
                            callback(false);

                        }

                    }

                });

            }

            //FUN 1 -->> LOGIN
            app.post('/fun1', async (request, response) => {

                const { email, password } = request.body;

                authEmail(email, password, (valid) => {

                    if (valid) {

                        registerCode(email, (resultCode) => {

                            if (resultCode) {

                                getUsernameId(email, (valid, username, id) => {

                                    if (valid) {

                                        console.log("LOGIN SUCCES FOR USER:", email);
                                        response.json({ "username": username, "id": id });
                                        emailSender(email, resultCode);

                                    }
                                    else {

                                        console.log("LOGIN FAILED FOR USER:", email);
                                        response.json({ "username": "FAILED", "id": "DUCK" });

                                    }

                                });

                            }
                            else {

                                console.log("LOGIN FAILED FOR USER:", email);
                                response.json({ "username": "FAILED", "id": "DUCK" });

                            }

                        });

                    }
                    else {

                        console.log("LOGIN FAILED FOR USER:", email);
                        response.json({ "username": "FAILED", "id": "DUCK" });

                    }

                });

            });

            // FUN4 -->> SIGN UP
            app.post('/fun4', async (request, response) => {

                const { username, email, password } = request.body;

                if (username.length > 3 && username.length < 50 && email.length >= 5 && password.length >= 8 && password.length <= 50 && email.includes("@")) {

                    emailFinder(email, (result) => {

                        if (!result) {

                            console.log("SIGN UP SUCESS FOR EMAIL:", email);
                            response.json({ "response": "true" }); // FAL BOOLEANA
                            registerAccount(email, password, username)

                        }
                        else {

                            console.log("SIGN UP ERROR FOR EMAIL:", email + " USER ALREADY EXISTS!");
                            response.json({ "response": "false" }); // FAL BOOLEANA

                        }

                    });

                }
                else {

                    console.log("SIGN UP ERROR FOR EMAIL:", email);
                    response.send("false"); // FAL BOOLEANA

                }

            });

            // FUN5 -->> CODE_VERIFICATION
            app.post('/fun5', async (request, response) => {

                const { code, email } = request.body;

                verifyCode(email, code, (valid, resultCode) => {

                    if (valid) {

                        console.log("CODE VERIFICATION WORKING!" + resultCode);
                        response.json({ "response": resultCode }); // FAL BOOLEANA

                    }
                    else {

                        console.log("CODE VERIFICATION FAILED! " + resultCode[1]);
                        response.json({ "response": "false" }); // FAL BOOLEANA

                    }

                });

            });

            // FUN7 -->> CHANGE_USERNAME
            app.post('/fun7', async (request, response) => {

                const { email, newUsername, serverAccessCode } = request.body;

                authServer(serverAccessCode, email, (valid) => {

                    if (valid) {

                        changeUsername(email, newUsername, (result) => {

                            if (result) {

                                response.json({ "response": true })

                            } else {

                                response.json({ "response": false })

                            }

                        });

                    } else {

                        response.json({ "response": false })

                    }

                });

            });

            // FUN8 -->> CHANGE_PASSWORD 1
            app.post('/fun8', async (request, response) => {

                const { email } = request.body;

                emailFinder(email, (result) => {

                    if (result) {

                        registerCode(email, (resultCode) => {

                            if (resultCode) {

                                response.json({ "response": true })
                                emailSender(email, resultCode)

                            } else {

                                response.json({ "response": false })

                            }

                        });

                    } else {

                        response.json({ "response": false })

                    }

                });

            });

            // FUN -->> CHANGE_PASSWORD 2
            app.post('/fun6', async (request, response) => {

                const { email, newPassword, code } = request.body;

                emailFinder(email, (result) => {

                    if (result) {

                        verifyCode(email, code, (valid, resultCode) => {

                            if (valid) {

                                changePassword(email, newPassword, (valid) => {

                                    if (valid) {

                                        response.json({ "response": true })

                                    } else {

                                        response.json({ "response": false })

                                    }

                                });

                            } else {

                                response.json({ "response": false })

                            }

                        });

                    } else {

                        response.json({ "response": false })

                    }

                });

            });

            
            startSocketIo.on('connection', (ioRoute) => {

                // REGISTERS THE SOCKET ID
                ioRoute.on("on_connect", (data) => {

                    const { senderEmail, serverAccessCode } = data;
                    const socket_id = ioRoute.id

                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            console.log("ON_CONNECT:: USER " + senderEmail + " HAS CONNECTED TO SERVER AT TIME: " /* ADD TIME HERE */)
                            registerSocketId(senderEmail, socket_id);

                        }

                    });

                });

                ioRoute.on("on_disconnect", (data) => {

                    const { senderEmail, serverAccessCode } = data;

                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            console.log("ON_DISCONNECT:: USER " + senderEmail + " HAS DISCONNECTED FROM THE SERVER AT TIME: " /* ADD TIME HERE */)

                        } else {

                            console.log("ON_DISCONNECT:: USER " + senderEmail + " WARNING , UNAUTORIZED USER DETECTED! , TIME: " /* ADD TIME HERE */)

                        }

                    });

                });

                //ROUTE TO SEND ACTIVITY STATUS/REQUEST
                ioRoute.on("activity_?", (data) => {

                    const { senderEmail, receiverEmail, serverAccessCode, senderRequest, connCode } = data;

                    console.log("ACTIVITY_?:: USER " + senderEmail + " WITH REQUEST: " + senderRequest + " TO: " + receiverEmail);
                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            getSocketId(receiverEmail, (resultId) => {

                                if (resultId) {

                                    if (storageActivityA.includes(senderRequest)) {

                                        ioRoute.volatile.to(resultId).emit(receiverEmail + "STATUS", { 'senderRequest': senderRequest, "senderEmail": senderEmail, "connCode": connCode });
                                        console.log("ACTIVITY_?:: USER " + senderEmail + ", REQUEST HAS BEEN EMITED TO " + receiverEmail)

                                    }
                                    else if (storageActivityB.includes(senderRequest)) {

                                        ioRoute.volatile.to(resultId).emit(receiverEmail + "STAND_BY", { 'senderRequest': senderRequest, "senderEmail": senderEmail, "connCode": connCode });
                                        console.log("ACTIVITY_?:: USER " + senderEmail + ", REQUEST HAS BEEN EMITED TO " + receiverEmail)

                                    }

                                }

                            });

                        }

                    });

                });

                // ROUTE TO REQUEST_CONN
                ioRoute.on("conn_request", (data) => {

                    const { senderEmail, receiverEmail, senderId, serverAccessCode, connCode, senderUsername } = data;

                    console.log("CONN_REQUEST:: USED BY USER: " + senderEmail);
                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            getSocketId(receiverEmail, (resultId) => {

                                if (resultId) {

                                    ioRoute.volatile.to(resultId).emit(receiverEmail + "GET_REQUEST", { "senderEmail": senderEmail, "connCode": connCode, "senderRequest": "CONN?", "senderId": senderId, "senderUsername": senderUsername })
                                    console.log("CONN_REQUEST:: USER " + senderEmail + " SENT TO " + receiverEmail)

                                }

                            });

                        }

                    });

                });

                // A- ACCEPT , R- REFUSE , B- BLOCK
                ioRoute.on("arb_request", (data) => {

                    const { senderUsername, receiverEmail, senderEmail, senderId, serverAccessCode, connCode, senderRequest } = data;

                    console.log("CONN ACCEPT,REFUSE,BLOCK USED BY USER: " + senderEmail);
                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            getSocketId(receiverEmail, (resultId) => {

                                if (resultId) {

                                    ioRoute.volatile.to(resultId).emit(receiverEmail + "PROCESS_REQUEST", { "senderEmail": senderEmail, "senderUsername": senderUsername, "connCode": connCode, "senderId": senderId, "senderRequest": senderRequest });

                                }

                            });

                        }

                    });

                });

                // ROUTE TO SEND MESSAGE
                ioRoute.on("send_message", (data) => {

                    const { senderEmail, receiverEmail, serverAccessCode, connCode, senderId, message, messageTimeStamps, messageId } = data;

                    console.log("SEND MESSAGE:: USED BY USER:" + senderEmail + " WITH MESSAGE:" + message);
                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            getSocketId(receiverEmail, (resultId) => {

                                if (resultId) {

                                    ioRoute.volatile.to(resultId).emit(receiverEmail + "RECEIVE_MESSAGE", { "senderEmail": senderEmail, "connCode": connCode, "message": message, "senderId": senderId, "messageTimeStamps": messageTimeStamps, "messageId": messageId })
                                    console.log("SEND MESSAGE:: USER " + senderEmail + " SENT MESSAGE TO " + receiverEmail)

                                }

                            });

                        }

                    });

                });

                //ROUTE TO SEND A LOT OF MESSAGES
                ioRoute.on("send_messages_bulk", (data) => {

                    const { senderEmail, receiverEmail, serverAccessCode, connCode, senderId, messageList, messageListSize, messageTimeStamps, messageIdList } = data;

                    console.log("MESSAGE BULK::  USED BY USER:" + senderEmail + " WITH MESSAGES:" + messageList);
                    authServer(serverAccessCode, senderEmail, (valid) => {

                        if (valid) {

                            getSocketId(receiverEmail, (resultId) => {

                                if (resultId) {

                                    ioRoute.volatile.to(resultId).emit(receiverEmail + "RECEIVE_BULK_MESSAGE", { "senderEmail": senderEmail, "connCode": connCode, "senderId": senderId, "messageList": messageList, "messageListSize": messageListSize, "messageTimeStamps": messageTimeStamps, "messageIdList": messageIdList })
                                    console.log("USER:" + senderEmail + " SENT MESSAGES:" + messageList + " TO " + receiverEmail)

                                }

                            });

                        }

                    });

                });

                //ROUTE TO CONFIRM MESSAGE IS RECEIVED 
                ioRoute.on("check_message_sent?", (data) => {

                    const { senderEmail, receiverEmail, serverAccessCode, connCode, senderId, message, senderRequest, messageList, messageListSize, messageIdList, messageId } = data;

                    authServer(serverAccessCode, senderEmail, (valid) => {

                        getSocketId(receiverEmail, (resultId) => {

                            if (valid) { //va exista si received++ , dar mai e pana il implementam , mai e mult

                                if ((senderRequest === "received+" || senderRequest === "stb_messages_received") && resultId) {

                                    ioRoute.volatile.to(resultId).emit(receiverEmail + "CHECK_MESSAGE_SENT?", { "senderEmail": senderEmail, "connCode": connCode, "senderId": senderId, "message": message, "senderRequest": senderRequest, "messageList": messageList, "messageListSize": messageListSize, "messageIdList": messageIdList, "messageId": messageId })
                                    console.log("CMS:: USER " + senderEmail + " SENT MESSAGE[S]: " + message + messageList + " TO " + receiverEmail + " WITH REQUEST " + senderRequest)

                                }

                            }

                        });

                    });

                });

                // Static function, only for testing purposes
                ioRoute.on("file", (data) => {
                    
                    const { someEncodedFile , fileMime } = data;
                    
                    console.log("FILE STREAM USED!");

                    getSocketId("antoniomihalceacatalin43@gmail.com" , (resultId) => {

                        if(resultId) {

                            // There is no need for decoding as there is no use of the file inside the server
                            ioRoute.volatile.to(resultId).emit("FILE_STREAM_RECEIVER", { "someEncodedFile": someEncodedFile , "fileMime": fileMime })
                            console.log("FILE STREAM: A file was sent to user(static)")

                        }

                    })

                });

            });



            // SERVER START LOGIC
            const port = parseInt(readData[6]); //portul care il vom folosi;
            const hostname = readData[5]; //numele domeniului(daca avem unul) sau adresa IPV4;

            server.listen(port, hostname, () => {

                console.log("SERVER IS RUNNING on https://" + hostname + ":" + port);

            });


        }

    });

} catch (error) {

    console.error("Error reading values from database table INPUT" + error.message);

}


// Todo: .Net App finished, binded to the server too.

// Master Comment:
// implemented in the app function 6, tested, we still have to implement function 7 in the app
// to add TRY and Catch and to IF inside DB functions!


// Server Ver: 1.62A
// todo: add maximum users, so admin can set a maximum
// todo: add email sender chnage , so we can send emails on other type of EMIAL domains

// dev: M.C.A

let storageActivityA = ["statusMessage", "statusRequest", "request_received", "request_accepted_received", "request_denied_received", "arb_standby", "request_block_received"];
let storageActivityB = ["imOnline", "stb_messages", "stb_request", "stb_arb_standby", "stb_arb"];






























/*DACA UITI JS DB OPERATIONS , IMBECILULE !


pentru SELECT se foloseste db.all(query , etc , function(error , result){
        result este returnat ca array , nu ca vector(un fel de vector) , asa ca citim cu result[0].numeColoana(NUMELE COLOANEI DIN SELECT)
});

pentru orice query de tipul WRITE DB se foloseste db.run(query , etc(informatie si ce din query cu ?), function(error){
        //asta nu inseamna ca nu poate avea callback !!!
});

*/  