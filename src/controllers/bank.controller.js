import pool from "../config/db.js";

// render pagina Bank
// render pagina Bank
export const renderBankPage = async (req, res) => {
  const authenticated = req.session.userId ? true : false;
  try {
    const transacciones = await pool.query("SELECT id, descripcion, fecha::date, monto, cuenta_id FROM transacciones");
    const cuentas = await pool.query("SELECT id, saldo FROM cuentas");
    res.render("bank", { transacciones: transacciones.rows, cuentas: cuentas.rows, authenticated });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar la página");
  }
};

//render POST transaccion
export const postTransaccion = async (req, res) => {
  const { descripcion, fecha, monto, cuenta, tipo } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const saldoAnterior = await client.query(
      "SELECT saldo FROM cuentas WHERE id = $1 FOR UPDATE",
      [cuenta]
    );

    if (saldoAnterior.rows.length === 0) {
      throw new Error(`No existe una cuenta n° ${cuenta}`);
    }

    let saldoNuevo = parseFloat(saldoAnterior.rows[0].saldo);

    if (tipo === "retiro") {
      saldoNuevo -= parseFloat(monto);
    } else {
      saldoNuevo += parseFloat(monto);
    }    

    if (saldoNuevo < 0) {
      throw new Error(
        `La transacción genera saldo negativo en la cuenta n° ${cuenta}`
      );
    }

    await client.query(
      "INSERT INTO transacciones(descripcion, fecha, monto, cuenta_id) VALUES ($1, $2, $3, $4)",
      [descripcion, fecha, parseFloat(monto), cuenta]
    );

    await client.query("UPDATE cuentas SET saldo = $1 WHERE id = $2", [
      saldoNuevo.toFixed(2),
      cuenta,
    ]);

    await client.query("COMMIT");

    res.redirect("/bank");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.redirect("/bank");
  } finally {
    client.release();
  }
};

//render POST Cuenta
export const postCuenta = async (req, res) => {
  const { id, saldo } = req.body;

  const client = await pool.connect();

  try {
    await client.query("INSERT INTO cuentas(id, saldo) VALUES ($1, $2)", [
      id,
      saldo,
    ]);

    res.redirect("/bank");
  } catch (error) {
    console.error(error);
    res.redirect("/bank");
  } finally {
    client.release();
  }
};

