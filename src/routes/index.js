import express from 'express';
const router = express.Router();
import pool from "../config/db.js";

// Ruta para mostrar la página principal
router.get("/", async (req, res) => {
  try {
    const estudiantes = await pool.query("SELECT * FROM estudiantes");
    res.render("index", { estudiantes: estudiantes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar la página");
  }
});

//Ruta para mandar datos a postgres
router.post("/", async (req, res) => {
  try {
    const { name, rut, curso, nivel } = req.body;
    console.log(req.body);
    const newEstudiante = await pool.query(
      "INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, rut, curso, nivel]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor en POST");
  }
});


// Ruta GET para obtener ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await pool.query(
      "SELECT * FROM estudiantes WHERE id = $1 LIMIT 100",
      [id]
    );
    res.render("edit", { estudiante: estudiante.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar el estudiante");
  }
});

// Ruta para actualizar un estudiante
router.post("/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error("Invalid ID");
    }
    const { name, rut, curso, nivel } = req.body;
    await pool.query(
      "UPDATE estudiantes SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE id = $5",
      [name, rut, curso, nivel, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error al actualizar el estudiante: ${err.message}`);
  }
});

// Ruta para eliminar un estudiante
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM estudiantes WHERE id = $1", [id]);
    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar el estudiante");
  }
});

export default router;
