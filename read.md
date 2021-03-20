# Continue Usesr Authentication and Authorization

## Update Register and Login

* Comment out the req.user object assignment in app.js where you're setting a user to always be logged in:
* Add a getRegister method to /controllers/index.js right before existing postRegister method
* Add getLgoin method to /controllers/index.js rigth before existing postLogin method
* Update postRegister method inside of /controllers/index.js
