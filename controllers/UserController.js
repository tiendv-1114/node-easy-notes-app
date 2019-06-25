const User = require("../models/UserModel");
const app = express();

// Create a new User
exports.create = (req, res) => {
    if (!req.body.name || !req.body.password || !req.body.admin) {
        return res.status(400).send({
            message : "name, password, admin is not empty!"
        });
    }
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        admin: req.body.admin
    }) ;

    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
};

exports.fillAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
};

exports.authenticate = (req, res) => {
    // User.findOne({name: req.body.name})
    // .then(user => {
    //     if (!user) {
    //         return res.status(404).send({
    //             message: "User not found with name " + req.body.name
    //         });
    //     } else {
    //         if (user.password !== req.body.password) {
    //             return res.send({
    //                message: "Authentication failed. Wrong password."
    //             });
    //         } else {
    //             const payload = {admin: user.admin};
    //             const token = jwt.sign(payload, app.get("superSecret"), {
    //                 expiresInMinutes: 1440
    //             });
    //             return res.send({
    //                 message: "Enjoy your token : " + token
    //             });
    //         }
    //     }
    // }).catch(err => {
    //     if (err.kind === "ObjectId") {
    //         return res.status(404).send({
    //             message: "User not found with name " + req.body.name
    //         });
    //     }
    //     return  res.status(500).send({
    //         message: "Some error occurred"
    //     });
    // });

    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password !== req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    admin: user.admin     };
                const token = jwt.sign(payload, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }

    });
};

exports.check = (req, res) => {
    res.send(req.decoded)
};
