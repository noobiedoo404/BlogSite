const jwt = require('jsonwebtoken')

module.exports.verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send({ message1: "Unauthorized" })
    } else {
        console.log(req.headers.authorization.split(' ')[1]);
        console.log('hello from else block');
        jwt.verify(req.headers.authorization.split(' ')[1], 'secretkey', function(err, decoded) {
            if (decoded) {
                console.log(decoded)
                req.user = decoded.data
                console.log('hello from success')
                next()
            } else {
                res.status(401).send({ MessageFromLastElseBlock: "Unauthorized" })
            }
        })
    }
}