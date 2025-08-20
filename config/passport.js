const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs") //password encryption, for safety
const pool = require('../db/pool')

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username])
            const user = rows[0]

            if (!user) { //check if username is even avalable in the database,
                return done(null, false, { message: "Incorrect username" }) //null means it's not an error, false means reject the auth (code 401)
            }
            const match = await bcrypt.compare(password, user.password)
            if (!match) { //check if password/username couple is match
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" }) //null means it's not an error, false means reject the auth (code 401)
            }
            return done(null, user); //return username, could be retrieved as req.user
        } catch(err) {
            return done(err)
        }
    })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0]

    done(null, user)
  } catch(err) {
    done(err)
  }
})