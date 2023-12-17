const notes = require('express').Router();
// const path = require('path'); do i need?
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');


// GET Route for retrieving all the notes  
notes.get('/api/notes', (req, res) => {
    readFromFile('./db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:notes_id', (req, res) => {
    const notesId = req.params.notes_id;
    readFromFile('./db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.notes_id === notesId);
            return result.length > 0
                ? res.json(result)
                : res.json('No note with that ID');
        });
});


// DELETE Route for a specific note
notes.delete('/:notes_id', (req, res) => {
    const notesId = req.params.notes_id;
    readFromFile('./db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {

            const result = json.filter((note) => note.notes_id !== notesId);

            // Save that array to the filesystem
            writeToFile('./db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${notesId} has been deleted 🗑️`);
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
        tip_id: uuidv4(),
      };
  

    readAndAppend(newNote, './db.json');
    res.json(`Note added successfully`);
} else {
    res.error('Error in adding note');
});


module.exports = notes;