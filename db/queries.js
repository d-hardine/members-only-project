const pool = require('./pool')

async function getAllMessages() {
    const {rows} = await pool.query(`SELECT messages.id, users.username, users.isAdmin, messages.message_title, messages.message_content, messages.timestamp FROM messages
        INNER JOIN users ON messages.user_id = users.id;`
    )
    return rows
}

async function registerNewUser(firstname, lastname, username, hashedPassword, boolAdmin) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password, isAdmin) VALUES ($1, $2, $3, $4, $5)",
        [firstname, lastname, username, hashedPassword, boolAdmin]
    )
}

async function postNewMessage(userId, messageTitle, messageContent, date) {
    await pool.query("INSERT INTO messages (user_id, message_title, message_content, timestamp) VALUES ($1, $2, $3, $4)",
        [userId, messageTitle, messageContent, date]
    )
}

async function deleteMessage(messageId) {
    await pool.query('DELETE FROM messages WHERE id = ($1);', [messageId])
}

module.exports = { getAllMessages, registerNewUser, postNewMessage, deleteMessage }