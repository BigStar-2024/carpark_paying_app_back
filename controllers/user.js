const signin = (req, res) => {
    console.log(req);
    res.json('ok');
}
const signup = (req, res) => {
    console.log(req);
    res.json('ok');
}

module.exports = {
    signin: signin,
    signup: signup
}