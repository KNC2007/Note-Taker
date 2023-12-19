const notes = require('express').Router();
// const path = require('path'); do i need?

const uuid = require('../helpers/uuid');

// const { v4: uuidv4 } = require('../helpers/uuid');


const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');


// GET Route for retrieving all the notes  
notes.get('/api/notes', (req, res) => {
    console.log("inside get route")
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/api/notes/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id === noteId);
            return result.length > 0
                ? res.json(result)
                : res.json('No note with that ID');
        });
});


// DELETE Route for a specific note
notes.delete('/api/notes/:note_id', (req, res) => {
    console.log('inside delete route')
    const noteId = req.params.note_id;
    console.log(noteId)
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            console.log(json)

            const result = json.filter((note) => note.id !== noteId);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});




// POST Route for a new UX/UI tip
notes.post('/api/notes', (req, res) => {

    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };


        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});


module.exports = notes;