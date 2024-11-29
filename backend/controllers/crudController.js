const db = require("../db/dbConfig");

exports.handleCrudOperations = async (req, res) => {
  const { entity } = req.params;
  const { id } = req.params;
  const userId = req.headers["user-id"];

  try {
    // used to check if table exists
    await db.query(`SELECT 1 FROM ${entity} LIMIT 1`);

    switch (req.method) {
      case "GET":
        if (id) {
          const [rows] = await db.query(
            `SELECT * FROM ${entity} WHERE id = ?`,
            [id]
          );
          if (!rows.length)
            return res.status(404).json({ message: `${entity} not found` });
          res.json(rows[0]);
        } else {
          const [rows] = await db.query(`SELECT * FROM ${entity}`);
          res.json(rows);
        }
        break;
      case "POST":
        let newItem = req.body;
        if (req.file) {
          newItem.image = `/uploads/${req.file.filename}`;
        }
        const [result] = await db.query(`INSERT INTO ${entity} SET ?`, [
          newItem,
        ]);
        res.status(201).json({ id: result.insertId, ...newItem });
        break;
      case "PUT":
        let updatedItem = req.body;
        if (req.file) {
          updatedItem.image = `/uploads/${req.file.filename}`;
        }
        const [updateResult] = await db.query(
          `UPDATE ${entity} SET ? WHERE id = ?`,
          [updatedItem, id]
        );
        if (updateResult.affectedRows === 0)
          return res.status(404).json({ message: `${entity} not found` });
        res.json({ message: `${entity} updated successfully` });
        break;
      case "DELETE":
        const [deleteResult] = await db.query(
          `DELETE FROM ${entity} WHERE id = ?`,
          [id]
        );
        if (deleteResult.affectedRows === 0)
          return res.status(404).json({ message: `${entity} not found` });
        res.json({ message: `${entity} deleted successfully` });
        break;
      default:
        res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(400).json({ message: "Invalid entity" });
    }
    console.error(`Error in CRUD operation for ${entity}:`, error);
    res.status(500).json({ message: "Database error" });
  }
};
