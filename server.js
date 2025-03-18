require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path'); // Agregado para manejar las rutas

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admingta5', 
    database: 'tienda'
});

db.connect(err => {
    if (err) throw err;
    console.log('📦 Conectado a MySQL');
});

// Ruta para obtener productos en formato JSON
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error en la consulta MySQL:', err);
            return res.send('Error en la consulta a la base de datos');
        }

        console.log('Productos obtenidos:', result); // Ver en la consola

        let productosHtml = result.map(product => {
            return `
                <div class="product">
                    <img src="/images/${product.imagen}" alt="${product.nombre}" width="200" height="200" />
                    <h3>${product.nombre}</h3>
                    <p>${product.precio} $</p>
                </div>
            `;
        }).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Tienda Online</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <h1>Bienvenido a la Tienda Online</h1>
                    <div id="productos-container">
                        ${productosHtml}
                    </div>
                </body>
            </html>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
