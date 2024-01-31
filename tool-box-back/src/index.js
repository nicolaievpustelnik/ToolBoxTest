const express = require('express');
const { json } = require('express');

const app = require('./config/server');
const port = app.get('port');

app.use(json());

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to my ToolBox server!',
        date: new Date().toDateString()
    });
});

app.listen(port, () => {
    console.log(`Express Server listening on http://localhost:${port}`);
});
