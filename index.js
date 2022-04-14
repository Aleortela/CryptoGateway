const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('cryptoEncryptionKey');
const fetch = require("node-fetch");
const app = express();
const pool = dbConnection();
const saltRounds = 10;

var sessID;
var sessUsername;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: true,  //controls whether session is resaved if no changes are made.
  saveUninitialized: true, //creates a session for every connection regardless of logIn.  
  secret: 'cryptoExSekret'
}));
//redirects to login page
const reDirectLogin = (req, res, next) => {       //middleware to check for login
  if (!req.session.authenticated) {
    res.redirect('/logInPage')
  } else {
    next()
  }
}
//redirects to home page
const reDirectHome = (req, res, next) => {
  if (req.session.authenticated) {
    res.redirect('/signedInHome')
  } else {
    next()
  }
}

//routes
app.get('/', async (req, res) => {
  let sql = "SELECT coin_id FROM coinInfo ORDER BY rand() LIMIT 1";
  let rows = await executeSQL(sql);
  let sql2 = "SELECT coin_id FROM coinInfo ORDER BY rand() LIMIT 1";
  let rows2 = await executeSQL(sql);
  res.render('home', { "coin": rows, "coin2": rows2 })
});

app.get('/signUpPage', reDirectHome, async (req, res) => {
  res.render('signUpPage')
})

//Live chart graph widget that is dependemt on the dropdown box that is autofilled with coin names and values from our popular coins table in DB
app.get('/homeSearch', async (req, res) => {
  let sql = "SELECT * FROM popularCoins";
  let rows = await executeSQL(sql);
  let selectedCoin = req.query.search;
  //console.log(selectedCoin);
  res.render('homeSearch', { "coinsList": rows, "JScoinSelected": selectedCoin })
})


//adds a new user to the database after registering an account and then sends them to the signed in homepage
app.post('/user/new', reDirectHome, async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let userName = req.body.userName;
  let password = req.body.password;
  let password2 = req.body.password2;
  const saltRounds = 10;
  if (email && userName) {
    let encryptedPassword = cryptr.encrypt(password);
    let sql2 = `SELECT * FROM userInfo WHERE userName = ?`
    let params2 = [userName];
    let rows2 = await executeSQL(sql2, params2);
    if (rows2.length > 0) {
      res.render('signUpPage', { "error": "Username is taken!" })
    } else {
      let sql = `INSERT INTO userInfo (firstName, lastName, email, userName, password) 
                  VALUES (?,?,?,?,?)`;
      let params = [firstName, lastName, email, userName, encryptedPassword];
      let rows = await executeSQL(sql, params)
      res.redirect('/logInPage')
    }
  } else {
    res.render({ "error": "No username or password." })
    
  }
});//Adding new users to userInfo DB table and hashes password from userinput 

//updates user infromation on profilePage and autofills information
app.get('/user/edit', async (req, res) => {    //populates user information from DB through creds
  let sql = `SELECT *
           FROM userInfo
           WHERE userId="${sessID}"`;
  let rows = await executeSQL(sql);
  console.log(rows)
  let decryptedPassword = cryptr.decrypt(rows[0].password);
  rows[0].password = decryptedPassword;
  res.render('profilePage', { "userInfo": rows })
});
//posting updated list of author info  to db
app.post('/user/edit', reDirectLogin, async (req, res) => {
  let sql = `UPDATE userInfo
            SET firstName=?,
            lastName=?,
             email=?,
             userName=?,
             password=?
            WHERE userId=${sessID}`;

  let encryptedPassword = cryptr.encrypt(req.body.password);
  let params = [req.body.firstName, req.body.lastName, req.body.email, req.body.userName, encryptedPassword];
  let rows2 = await executeSQL(sql, params);
  let sql2 = `SELECT *
           FROM userInfo
           WHERE userId=${sessID}`;
  let rows = await executeSQL(sql2);
  let decryptedPassword = cryptr.decrypt(rows[0].password);
  rows[0].password = decryptedPassword;

  res.render('profilePage', { "userInfo": rows, "message": "User Updated!" });
});

app.get('/logInPage', reDirectHome, async (req, res) => {
  res.render('logInPage')
})

//login 
app.post('/logIn', reDirectHome, async (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let sql = `SELECT * FROM userInfo WHERE userName = ?`;
  let params = [userName];
  let rows = await executeSQL(sql, params);
  if (rows.length > 0) {
    decryptedPassword = cryptr.decrypt(rows[0].password);
    if (decryptedPassword == password) {
      req.session.authenticated = true;
      sessID = rows[0].userId
      sessUsername = rows[0].userName;
      res.redirect('/signedInHome')
    } else {
      res.render('logInPage', { "error": "Invalid Password!" })
    }
  } else {
    res.render('logInPage', { "error": "Invalid Username!" })
  }
});
//logout
app.get('/logOut', (req, res) => {
  res.redirect('/')
  sessID = "";
  sessUsername = "";
  req.session.destroy()

})

//This takes the userinfo with the sessID as the userID and then also takes 2 random coins_Id 's from the data base to them populate the 2 mini widgets.
app.get('/signedInHome', reDirectLogin, async (req, res) => {
  let sql = `SELECT *
  FROM userInfo
  WHERE userId ="${sessID}"`;
  let rows = await executeSQL(sql);

  let sql2 = "SELECT coin_id FROM coinInfo ORDER BY rand() LIMIT 1";
  let rows2 = await executeSQL(sql2);
  console.log(rows2)
  let sql3 = "SELECT coin_id FROM coinInfo ORDER BY rand() LIMIT 1";
  let rows3 = await executeSQL(sql3);
  console.log(rows3)
  res.render('signedInHome', { "takingId": rows });
})

//This page first is populated with all of the coins from our data base. Then checks the search bar for any words that are LIKE other names of coins in the data base. 
app.get('/searchPage', async (req, res) => {
  let sql = `SELECT *
             FROM coinInfo` //no orderby command atm
  let rows = await executeSQL(sql);
  //console.log(rows)
  res.render('searchPage', { "crypto": rows });
})
app.get('/search', async (req, res) => {
  var sea = req.query.sea;
  //use JOIN after from when using the favorites db
  let sql = `SELECT *
             FROM coinInfo
             WHERE coinName LIKE '%${sea}%'`;
  let rows = await executeSQL(sql);
  //console.log(sea);
  res.render('searchResults', { "result": rows });
})

//favorite
app.get('/favorites', async (req, res) => {
  res.render('favorites')
})

//This post adds the selected coins to that users favrote list. The ${comma} was used to just get a comma to show up and seperate each coin in the string of favorites
app.post('/searchPage', async (req, res) => {
  let f = req.body.favButton;
  let comma = ",";
  let sql = `UPDATE userInfo
            SET favorites= CONCAT(favorites,"${comma}"?)
            WHERE userId=${sessID}`;
  let params = [f];
  let rows = await executeSQL(sql, params);
  res.redirect('/searchPage');
});


//making localAPI for all of the coin info
app.get('/api/coinInfo', async (req, res) => {
  //id must query
  let coinInfoid = req.query.coin_Id;
  let sql = `SELECT *
              FROM coinInfo
              WHERE coin_Id = ${coinInfoid}`;
  let rows = await executeSQL(sql);
  res.send(rows);
});///api/coinInfo?id=1

//local API for to get all of the users favorites by taking the sessID as their userID
app.get('/api/favsInfo', async (req, res) => {
  //id must query

  console.log(sessID);
  let sql = `SELECT favorites
              FROM userInfo
              WHERE userId = ${sessID}`;
  let rows = await executeSQL(sql);
  res.send(rows);
});

//database test
app.get("/dbTest", async (req, res) => {
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);
  res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL
//values in red must be updated
function dbConnection() {

  const pool = mysql.createPool({
    connectionLimit: 10,
    host: "td5l74lo6615qq42.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "adlzg9zhbgw7s1ds",
    password: "c20ujeke44dp2xfz",
    database: "hwb9abhdn9awsla2"
  });
  return pool;
} //dbConnection


//start server
app.listen(3000, () => {
  console.log("Expresss server running...")
})