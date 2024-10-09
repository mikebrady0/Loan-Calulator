import express from 'express';

const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('App running, listening on port 3000!')
});

app.get('/', (req, res) => {
    res.send('Get request successful')
});
