const express = require('express');
const app = express();
const { Pool } = require('pg');

app.use(express.urlencoded({ extended: true })); // Middleware para analizar los datos del formulario
app.use(express.json()); // Middleware para analizar JSON
app.set('view engine', 'ejs'); // Configurar EJS como motor de plantillas
app.set('views', './src/views'); // Establecer la ruta correcta para las vistas


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cachureando',
  password: 'javierpassword',
  port: 5432,
});

app.get('/', (req, res) => {
  res.render('index'); // Renderiza tu archivo EJS que contiene el formulario
});

app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query('INSERT INTO your_table (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    res.send('Datos guardados correctamente');
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).send('Error al guardar los datos');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});