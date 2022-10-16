const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const PORT = 3001

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public')) 

// route to index
// app.get('/', (req, res) =>
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// );

// route to notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// wildcard route
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/db/db.json'))
);

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
        const newNote = {
        title,
        text,
        note_id: randomUUID(),
        };
  
      // Add note to database
        let db = fs.readFileSync('./db/db.json');
        let dbarray = JSON.parse(db);
        dbarray.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(dbarray), (err) =>
        err ? console.error(err) : console.log('New note logged!'));

        const response = {
            status: 'success',
            body: newNote,
        };
  
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.get('/api/notes/:note_id', (req, res) => {
    if(req.params.note_id) {
        const id = req.params.note_id;
        let db = JSON.parse(fs.readFileSync('./db/db.json'))
        for (let i = 0; i < db.length; i++) {
            const currentReview = db[i];
            if (currentReview.note_id === id) {
              res.json(currentReview);
              return;
            }
          }
          res.status(404).send('Note not found');
    } else {
        res.status(400).send('Note ID not provided');
    }
})

app.delete('/api/notes/:note_id', (req,res) => {npm 
    let id = req.params.note_id;
    if (id) {
        let db = fs.readFileSync('./db/db.json');
        let dbarray = JSON.parse(db);

        for(var i = 0; i < dbarray.length; i++) {
            if(dbarray[i].note_id == id) {
            dbarray.splice(i, 1);
            break;
            }
        }

        fs.writeFile('./db/db.json', JSON.stringify(dbarray), (err) =>
        err? console.error(err): console.log('Note deleted'));

        const response = {
            status: 'success',
        }

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in deleting note');
    }
});

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
