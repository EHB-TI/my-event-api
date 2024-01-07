const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(express.json()); // Voor JSON requests
app.use(express.urlencoded({ extended: true })); // Voor URL encoded requests


  // verbinding met de database
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

  
// Haal alle evenementen 
app.get('/evenementen', (req, res) => {
    const query = 'SELECT * FROM evenementen';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send('Fout bij het ophalen van evenementen.');
      } else {
        res.status(200).json(results);
      }
    });
  });
  
 
  // Werk een evenement bij
  app.put('/evenementen/:id', (req, res) => {
    const { naam, beschrijving, locatie, start_tijd, eind_tijd } = req.body;
    const query = 'UPDATE evenementen SET naam = ?, beschrijving = ?, locatie = ?, start_tijd = ?, eind_tijd = ? WHERE id = ?';
    db.query(query, [naam, beschrijving, locatie, start_tijd, eind_tijd, req.params.id], (err, results) => {
      if (err) {
        res.status(500).send('Fout bij het bijwerken van het evenement.');
      } else {
        res.status(200).send(`Evenement bijgewerkt met ID: ${req.params.id}`);
      }
    });
  });

  app.post('/evenementen', (req, res) => {
  const { naam, beschrijving, locatie, start_tijd, eind_tijd } = req.body;

  // Eenvoudige validatie
  if (!naam || !locatie || !start_tijd || !eind_tijd) {
    return res.status(400).send('Alle velden zijn vereist.');
  }

  const query = 'INSERT INTO evenementen (naam, beschrijving, locatie, start_tijd, eind_tijd) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [naam, beschrijving, locatie, start_tijd, eind_tijd], (err, results) => {
    if (err) {
      console.error(err); // Voeg dit toe om de fout te loggen
      res.status(500).send('Fout bij het aanmaken van het evenement.');
    } else {
      res.status(201).send(`Evenement aangemaakt met ID: ${results.insertId}`);
    }
  });

});
  
  // Verwijder een evenement
  app.delete('/evenementen/:id', (req, res) => {
    const query = 'DELETE FROM evenementen WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        res.status(500).send('Fout bij het verwijderen van het evenement.');
      } else {
        res.status(200).send(`Evenement verwijderd met ID: ${req.params.id}`);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server luistert op poort ${port}`);
  });


