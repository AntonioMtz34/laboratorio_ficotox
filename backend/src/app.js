const express = require("express");
const cors = require("cors");
const app = express();
// settings
app.set('port', process.env.PORT || 4000); 
// middlewares
app.use(cors({
    origin: '*'
}));
app.use(express.json());
// routes
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/lotes', require('./routes/lotes'));
app.use('/api/muestras', require('./routes/muestras'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/user', require('./routes/users'));
app.use('/api/contador', require('./routes/contador'));
app.use('/api/print', require('./routes/print'));
module.exports = app;