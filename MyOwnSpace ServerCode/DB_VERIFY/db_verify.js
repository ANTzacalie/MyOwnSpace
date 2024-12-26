const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");



function ifSessionBlockExpired(ip, callback) {

    const current_date = date();

    const query = `SELECT DATE FROM session WHERE IP = ?`;
    db.get(query, [ip] , (error, column) => {

        if(error) {

            console.log("Error in trying to verify session lock, database error: " + error.message);
            callback(-1);

        } else if(column.DATE != null) {

            if ((current_date - new Date(column.DATE)) > 15 * 60 * 1000) { // 15 minutes wait time for 3 tries wrong;

                callback(true);

            } else {

                console.log("Session still locked for ip: " + ip);
                callback(false);

            }

        } else {

            console.log("Error in trying to verify session lock, database error: no row" );
            callback(-2);

        }

    });

}

function resetTriesInternal(session_id, callback) {

    const query = `UPDATE session SET SESSION_TRIES = 3 WHERE SESSION_ID = ?`;
    db.run(query, [session_id] , (error) => {

        if(error) {

            callback(false);

        } else {

            callback(true);

        }

    });

}

function deleteSession(session_id, ip , callback) {

    // This deletes the session after some time

    const query = `DELETE FROM session WHERE SESSION_ID = ? AND IP = ?`;
    db.run(query, [session_id, ip], (error) => {

        if (error) {

            console.error("Cannot delete row in table session:", error.message);
            callback(false);

        } else {

            console.log("Row from table session successfully deleted.");
            callback(true);
                 
        }

    });

}



function main() {



}


// DB_VERIFY ver1.0a , dev M.C.A
/*
    --THIS SCRIPT WILL HAVE THE FOLLOWING:
        -- A FUNCTION THAT MONITORS EACH SESSION_TIME , SO AFTER SOME TIME , IF SESSION ITS INACTIVE, ITS GONNA BE REMOVED;
        -- DELETES ACCOUNTS AFTER AN AMMOUNT OF TIME , IF SET FROM THE SERVER APP;
        -- IF TOO MUCH TRAFIC IS RECORDED FROM IP ADDRESS INPUTS , A REPORT WILL BE MADE , AND THE ADMIN WILL BE NOTIFIED VIA EMAIL;
        -- USER CAN CHOOSE IN THE SERVER APP , IF TOO MANY IP REQUEST ARE MADE , SERVER WILL SHUTDOWN;
        -- MAKES THE SECURITY_CODE AND DATE NULL AFTER 30 MINUTES , IF USER DOSE NOT CONTINUE TO CONNECT;

*/