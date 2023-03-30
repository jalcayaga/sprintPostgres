import express from "express";
import session from "express-session"
import { checkAuth } from '../controllers/user.controller.js';

import { renderIndexPage } from "../controllers/index.controller.js";
import {
  renderStudentsPage,
  postStudents,
  getId,
  studentUpdate,
  studentDelete,
} from "../controllers/student.controller.js";

import {
  renderBankPage,
  postTransaccion,
  postCuenta,
} from "../controllers/bank.controller.js";

import {
  renderUserPage,
  postUser,
  userDelete,
  userUpdate,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js"


const router = express.Router();


// Ruta para mostrar la página principal
router.get("/", renderIndexPage);
/* ---------------------------------- Users ---------------------------------- */
// Ruta para mostrar la página principal Users
router.get("/users", renderUserPage);
/* ---------------------------------- bank ---------------------------------- */
// Ruta para mostrar la página principal del banco
router.get("/bank", checkAuth, renderBankPage);
/* ---------------------------------- students ---------------------------------- */
// Ruta para students
router.get("/students", checkAuth, renderStudentsPage);

//Ruta para mandar datos a postgres
router.post("/students", checkAuth, postStudents);

// Ruta GET para obtener ID
router.get("/students/:id", checkAuth, getId);

// Ruta para actualizar un estudiante
router.post("/students/update/:id", checkAuth, studentUpdate);

// Ruta para eliminar un estudiante
router.post("/students/delete/:id", checkAuth, studentDelete);

/* ---------------------------------- bank ---------------------------------- */
// Escribir datos en TABLA Transacciones
router.post("/bank/transaccion", checkAuth, postTransaccion);
// Escribir datos en TABLA Cuenta
router.post("/bank/cuenta", checkAuth, postCuenta)

/
/* ---------------------------------- Users ---------------------------------- */
// Ruta para crear usuario
router.post("/users", postUser);

// Ruta para actualizar un usuario
router.post("/users/update/:id", userUpdate);

// Ruta para eliminar un usuario
router.post("/users/delete/:id", userDelete);

// Ruta para validar el inicio de sesión
router.post("/login", loginUser);

router.get('/logout', logoutUser);

export default router;
