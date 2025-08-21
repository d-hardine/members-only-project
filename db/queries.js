const pool = require('./pool')

async function getAllMessages() {
    const {rows} = await pool.query(`SELECT users.username, users.is_admin, messages.message_title, messages.message_content, messages.timestamp FROM messages
        INNER JOIN users ON messages.user_id = users.id;`
    )
    return rows
}

async function registerNewUser(firstname, lastname, username, hashedPassword, boolAdmin) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password, is_admin) VALUES ($1, $2, $3, $4, $5)",
        [firstname, lastname, username, hashedPassword, boolAdmin]
    )
}

async function postNewMessage(userId, messageTitle, messageContent, date) {
    await pool.query("INSERT INTO messages (user_id, message_title, message_content, timestamp) VALUES ($1, $2, $3, $4)",
        [userId, messageTitle, messageContent, date]
    )
}

module.exports = { getAllMessages, registerNewUser, postNewMessage }