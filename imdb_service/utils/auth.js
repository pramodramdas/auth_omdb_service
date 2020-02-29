let jwt = require('jsonwebtoken');

const checkUser = (req, res, next) => {
    if(process.env.JWT_VALIDATION === "true") {
        let token = req.get('token') || req.query.token
        if(!token)
            return res.status(401).json({msg:"unauthorized"})
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                console.log(err)
                return res.status(401).json({msg:"unauthorized"})
            }
            if(decoded.Email)
                req.headers['email'] = decoded.Email
            else
                return res.status(401).json({msg:"unauthorized"})
        })
    }
    else if(!req.get("email") || !req.get("role"))
        return res.status(401).json({msg:"unauthorized"})
    
    next()
}

module.exports = {
    checkUser
}