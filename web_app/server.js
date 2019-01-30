const express = require('express');
const app = express();
const PORT = 3123;
const path = require('path');
const resources = path.join(__dirname, '/client/src/components/resources/');

app.use(express.static(__dirname + '/client/dist'));

app.get('/', (req, res) => {
	res.send(`Please return to root directory ("https://localhost:${PORT}/").`);
})

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
})