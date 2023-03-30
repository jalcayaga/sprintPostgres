import pool from "../config/db.js";
import session from "express-session";



// constante para bloqueo de session
export const checkAuth = (req, res, next) => {
  console.log(req.session.userId);
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
};
// Ruta para obtener todos los usuarios
export const renderUserPage = async (req, res) => {
  const authenticated = req.session.userId ? true : false;
  if(req.session.userId){
  try {
    const usuarios = await pool.query("SELECT * FROM usuarios");
    res.render("users", { usuarios: usuarios.rows, authenticated });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener usuarios");
  }
} else {
   res.render("index");
}
};
// Ruta para crear un usuario
export const postUser = async (req, res) => {
  const { nombre, apellido, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    // Si las contraseñas no coinciden, redirigir a la página de creación de usuarios con un mensaje de error
    req.flash("error", "Las contraseñas no coinciden");
    res.redirect("/users");
    return;
  }

  try {
    await pool.query(
      "INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4)",
      [nombre, apellido, email, password]
    );
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear el usuario");
  }
};
// Ruta para validar el inicio de sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rowCount === 1) {
      req.session.userId = result.rows[0].id; // Establecer el id del usuario en la sesión
      res.locals.authenticated = true;
      res.redirect("/students"); // Redirigir al usuario a la página de estudiantes después del inicio de sesión exitoso
    } else {
      res.status(401).send("Correo o contraseña incorrectos");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al iniciar sesión");
  }
};
// Ruta para validar el logout de sesión
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.clearCookie('sid');
      res.locals.authenticated = false;
      res.redirect('/');
    }
  });
};
// Ruta para actualizar un usuario
export const userUpdate = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, apellido, email, password } = req.body;
    await pool.query(
      "UPDATE usuarios SET nombre = $1, apellido = $2, email = $3, password = $4 WHERE id = $5",
      [nombre, apellido, email, password, id]
    );
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error al actualizar el usuario: ${err.message}`);
  }
};
// Ruta para eliminar un usuario
export const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar el usuario");
  }
};
