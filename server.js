const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const PORT = 3001

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// route to index
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route to notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/db/db.json'))
)

app.post('api/notes', (req, res) => {
    console.info (`${req.method} request recieved to add a new note`)
    const {title, note} = req.body;

    if (title && note) {
        const newNote = {
            title,
            note,
            note_id: randomUUID(),
        }

        let current = fs.readFileSync('./db/db.json');
        let currentLib = JSON.parse(current);
        currentLib.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(currentLib), (err) =>
        err ? console.error(err) : console.log('New note logged!'));

        const response = {status: 'success', body: newNote};
        
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(400).json('Error in posting review')
    }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
