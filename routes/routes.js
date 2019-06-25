module.exports = (app, apiRoutes, jwt) => {
    const notes = require("../controllers/NoteController");
    const users =  require("../controllers/UserController");
    // const jwt = require("jsonwebtoken");

    // Create a new Note
    app.post("/notes", notes.create);

    // Retrieve all
    app.get("/notes", notes.fillAll);

    // Retrieve a single Note with noteId
    app.get("/notes/:noteId", notes.findOne);

    // update
    app.put("/notes/:noteId", notes.update);

    // delete
    app.delete("/notes/:noteId", notes.delete);

    // ========================================================================
    // create new user
    app.post("/setup", users.create);

    // User authenticate
    apiRoutes.post("/authenticate", users.authenticate);

    // Route middleware to authenticate and check token
    apiRoutes.use((req, res, next) => {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    // Retrieve all users
    apiRoutes.get("/users", users.fillAll);

    apiRoutes.get("/check", users.check);

    app.use('/api', apiRoutes);


};