const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hallo Wereld!');
});

  // Maak een verbinding met de database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser', 
    password: 'myuser123', 
    database: 'mijn_evenementen', 
  });
  
  // Verbind met de database
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Verbonden met de database');
  });
  
  // Middleware voor het verwerken van JSON en urlencoded formuliergegevens
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(port, () => {
    console.log(`Server luistert op poort ${port}`);
  });


