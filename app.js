const fs = require("fs")
const bodyParser = require("body-parser")

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://testuser:password@127.0.0.1/school')

/*db.one('SELECT * FROM students')
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
*/
// GET
// All movies and search
app.get('/students', (req, res) => {
    db.one('SELECT * FROM students')
        .then((data)=>{
            res.send(data)
        })
});

//POST
// Register a student in the database
/* 
Example Body:
{
    "name": "Test Student",
    "email": "test@school.edu"
}
*/ 
app.post('/register',(req,res)=>{
    console.log(req.body);
    if (req.body.name && req.body.email) {
        db.query("INSERT INTO students (name, email) VALUES ( $1, $2);",[req.body.name,req.body.email]).then(data=>{
            
            console.log(data);
            if (data.rowCount>0) { 
                res.send(`Successfully registered ${req.body.name}`);
            }else{
                res.send(`Unable to register ${req.body.name}`);
            }
        })
    }
})
app.listen(port, () => console.log(`Secure School System listening at http://localhost:${port}`))
