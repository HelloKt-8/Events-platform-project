const app = require('./app');
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`WORKING!! Listening on ${PORT}...`, `SERVER IS RUNNING ON ${PORT}`));
