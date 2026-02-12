const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const crypto = require("crypto");


let Key = "";
let admin_email = "";
let max_ip_entries = 10000; // maximum number of allowed ip entries that request login
let session_inactive_time = 3600 * 60 * 1000; // time in ms
let shutdown = 0;
let serverAddress = "";


function keyGenerator() {

    const characters = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789*&^%$#@!";

    let password = "";

    for (let i = 0; i < 128; i++) {

        const randomIndex = crypto.randomInt(characters.length);
        password += characters.charAt(randomIndex);

    }

    return password;

}

let readData = [null, null, null, null, null, null, null];
const dbPath = "myOwnSpaceDb.sqlite"// DATA_BASE NAME AND LOCATION
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite database');

});

const readQuery1 = "SELECT PRIVATE_PATH , CERTIFICATE_PATH , CHAIN_PATH, EMAIL , PASSWORD, HOSTNAME, PORT FROM INPUT WHERE Id = 1";
db.get(readQuery1, (error, result) => {

        if (error) {

            console.error("Error reading values from database table INPUT" + error.message);

        } else {

            console.log("All data form table INPUT have been read");

            try {

                if(result.EMAIL != null && result.PASSWORD != null && result.HOSTNAME != null && result.PORT != null) {

                    readData[3] = result.EMAIL;
                    readData[4] = result.PASSWORD;
                    serverAddress = "https://" + result.HOSTNAME + ":" + result.PORT + "/admin/protocol";
                    
                }

            } catch(e) {

                console.log("Error at begin , database has no init rows: " + e.message);

            }
        }

});

const dbOnePath = "admin_db.sqlite";
const dbOne = new sqlite3.Database(dbOnePath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite admin_db');

});

const readQuery2 = "SELECT EMAIL,MAX_CONN_DAY,ALLOW_SHUTDOWN,KEY FROM admin_table WHERE Id = 1";
dbOne.get(readQuery2, (error, result) => {

    if (error) {

        console.error("Error reading values from database table INPUT" + error.message);

    } else {

        console.log("Data from admin_db has been read");

        if(result) {

            try {

                if(result.EMAIL != null) {

                    admin_email = result.EMAIL;

                    if(result.MAX_CONN_DAY != 0 && result.ALLOW_SHUTDOWN == 1) {
                        max_ip_entries = result.MAX_CONN_DAY;
                    }
                    
                    shutdown = result.ALLOW_SHUTDOWN;
                    Key = result.KEY;

                }

            } catch(e) {

                console.log("Error at begin , database has no init rows: " + e.message);

            }
        
        } else { 
            
            console.log("NO ROWS IN TABLE ADMIN, TRY RESTARTING THE SERVER WITH VALUES IN DB"); 
        
        }

    }

});

const dbTwoPath = "ip_list.sqlite";
const dbTwo = new sqlite3.Database(dbTwoPath, sqlite3.OPEN_READWRITE, (error) => { //creating the instance of the database 

    if (error) {

        console.error('Error connecting to SQLite database:', error.message);
        return;

    }

    console.log('Connected to SQLite ip_list');

});

function emailSender() {

    console.log("SERVER MAX_REQUEST HAS BEEN HIT ON DATE: " + new Date());

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

        from: "SERVER", 
        to: admin_email,
        subject: "Alert!",
        text: "The maximum number of requests on server has passed the limit, potential attack warning! , date of this warning is: " + new Date()

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

const time_limit_ms = 15 * 60 * 1000;
function ifSessionBlockExpired() { 

    const current_date = new Date();

    const query = "UPDATE session SET SESSION_OPEN = 1, SESSION_TRIES = 3 WHERE SESSION_OPEN = 0 AND (? - DATE) > ?";
    db.run(query, [current_date, time_limit_ms], (error) => { if(error) { console.error(error.message)} });

}

function ip_max_check() {

    const query = "SELECT COUNT(*) AS rowCount FROM ip_table";
    dbTwo.get(query, (error, result) => {

        if(error) {

            console.error("Error in trying to get row count, " + error.message);

        } else {

            if(result) {

                if(result.rowCount > max_ip_entries) {

                    emailSender();
                    if(shutdown == 1) {

                        setTimeout( () => { 

                            const data = { procedure: "e" , key: Key }; 

                            fetch(serverAddress, {

                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),

                            }).catch(error => console.error('Error:', error));
                            process.exit(0);

                        }, 5000);
                        
                    }

                }

            } else {

                console.log("Failed in trying to get row count, no rows");

            }

        }

    });

}

function deleteSession() {

    const current_date = new Date();

    // This deletes the session after an amount time
    const query = `DELETE FROM session WHERE ? - DATE > ?`;
    db.run(query, [current_date, session_inactive_time], (error) => {

        if (error) {

            console.error("Cannot delete row in table session:", error.message);

        }

    });

}

function autoKey(newKey) {

    Key = newKey;
    const query = `UPDATE admin_table SET KEY = ?`;
    dbOne.run(query, [newKey], (error) => {

        if (error) {

            console.error("Cannot update key in table_admin:", error.message);

        }

    });

}

function deleteAppIp() {

    const query = `DELETE FROM ip_table`;
    dbTwo.run(query, (error) => {

        if (error) {

            console.error("Cannot delete rows in table ip:", error.message);

        } else {

            console.log("Rows from table ip successfully deleted.");
                 
        }

    });

}

function vacuumDb() { 

    db.run("VACUUM", (error) => {

        if (error) {

            console.error("Error during VACUUM operation:", error.message);

        } else {

            console.log("Database vacuumed successfully.");

        }

    });

}

function vacuumDbTwo() {

    dbTwo.run("VACUUM", (error) => {

        if (error) {

            console.error("Error during VACUUM operation on ip_list:", error.message);

        } else {

            console.log("ip_list vacuumed successfully.");

        }

    });

}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function main() {

    autoKey(keyGenerator());
    deleteAppIp();
    let date_on_start = new Date();

    while (true) {   

        // Delay for 5 seconds before the next iteration, so all functions finish the job;
        await sleep(7000);
        let current_date = new Date();

        if((date_on_start - current_date) > 1440 * 60 * 1000) {

            // Erase all from ip_table, vacuum db and change key every 24 hours;
            deleteAppIp();
            date_on_start = new Date();
            vacuumDb();
            vacuumDbTwo();
            autoKey(keyGenerator());
            console.log("Database vacuumed, ip_table cleared and key changed every 24 hours.");

        }
        
        // Perform tasks
        ifSessionBlockExpired();
        ip_max_check();
        deleteSession();
        
    }

}

main();

// 
