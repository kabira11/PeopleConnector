const jwt = require ('jsonwebtoken')
const config = require ('../config/default')

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token')

    // Check if not token
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    try {
        const decode = jwt.verify(token, config.jwtSecret)
        console.log(decode.user)
        req.user = decode.user
        next()
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid.'})
    }
}