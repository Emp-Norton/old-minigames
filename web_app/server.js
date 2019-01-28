const express = require('express');
const app = express();
const PORT = 3123;

app.get('/', (req, res) => {
	res.send('ok');
})

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
})