const express = require('express');
const app = express();
const PORT = 3123;

app.use(express.static(__dirname + '/client/dist'));
app.get('*', (req, res) => {
	res.send('Please return to root directory ("https://localhost:3123/").');
})

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
})