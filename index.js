
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

      // Controleer of de velden niet leeg zijn en valideer de naam
    if (!naam || typeof naam !== 'string' || /\d/.test(naam)) {
        return res.status(400).send('Naam mag niet leeg zijn en geen getallen bevatten.');
      }
      if (!locatie || typeof locatie !== 'string') {
        return res.status(400).send('Locatie mag niet leeg zijn.');
      }
      if (!start_tijd || new Date(start_tijd).toString() === 'Invalid Date') {
        return res.status(400).send('Ongeldige starttijd.');
      }
      if (!eind_tijd || new Date(eind_tijd).toString() === 'Invalid Date') {
        return res.status(400).send('Ongeldige eindtijd.');
      }
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
  
   
    if (!naam || typeof naam !== 'string' || /\d/.test(naam)) {
      return res.status(400).send('Naam mag niet leeg zijn en geen getallen bevatten.');
    }
    if (!locatie || typeof locatie !== 'string') {
      return res.status(400).send('Locatie mag niet leeg zijn.');
    }
    if (!start_tijd || new Date(start_tijd).toString() === 'Invalid Date') {
      return res.status(400).send('Ongeldige starttijd.');
    }
    if (!eind_tijd || new Date(eind_tijd).toString() === 'Invalid Date') {
      return res.status(400).send('Ongeldige eindtijd.');
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

  // Haal alle comments op
app.get('/comments', (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// Haal een enkele comment op
app.get('/comments/:id', (req, res) => {
    db.query('SELECT * FROM comments WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Maak een nieuwe comment aan
app.post('/comments', (req, res) => {
    const { evenement_id, gebruiker_id, tekst } = req.body;
    if (!evenement_id || !gebruiker_id || !tekst) {
        return res.status(400).json({ error: "Alle velden zijn vereist" });
    }

    const query = 'INSERT INTO comments (evenement_id, gebruiker_id, tekst) VALUES (?, ?, ?)';
    db.query(query, [evenement_id, gebruiker_id, tekst], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Comment aangemaakt', commentId: result.insertId });
        }
    });
});

// Werk een comment bij
app.put('/comments/:id', (req, res) => {
    const { tekst } = req.body;
    const query = 'UPDATE comments SET tekst = ? WHERE id = ?';

    db.query(query, [tekst, req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Comment bijgewerkt' });
        }
    });
});

// Haal alle comments op
app.get('/comments', (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// Haal een enkele comment op
app.get('/comments/:id', (req, res) => {
    db.query('SELECT * FROM comments WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Maak een nieuwe comment aan
app.post('/comments', (req, res) => {
    const { evenement_id, gebruiker_id, tekst } = req.body;
    if (!evenement_id || !gebruiker_id || !tekst) {
        return res.status(400).json({ error: "Alle velden zijn vereist" });
    }

    const query = 'INSERT INTO comments (evenement_id, gebruiker_id, tekst) VALUES (?, ?, ?)';
    db.query(query, [evenement_id, gebruiker_id, tekst], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Comment aangemaakt', commentId: result.insertId });
        }
    });
});

// Werk een comment bij
app.put('/comments/:id', (req, res) => {
    const { tekst } = req.body;
    const query = 'UPDATE comments SET tekst = ? WHERE id = ?';

    db.query(query, [tekst, req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Comment bijgewerkt' });
        }
    });
});
// Verwijder een comment
app.delete('/comments/:id', (req, res) => {
    db.query('DELETE FROM comments WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Comment verwijderd' });
        }
    });
});

  app.listen(port, () => {
    console.log(`Server luistert op poort ${port}`);
  });


