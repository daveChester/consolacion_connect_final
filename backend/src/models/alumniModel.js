const db = require("../db/dbConfig");

class AlumniModel {
  static async getAllAlumni() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM alumni 
        ORDER BY graduation_year DESC, last_name ASC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching alumni: ${error.message}`);
    }
  }

  static async getAlumniById(id) {
    try {
      const [rows] = await db.query(`SELECT * FROM alumni WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching alumni by ID: ${error.message}`);
    }
  }

  static async createAlumni(alumniData) {
    try {
      const {
        first_name,
        last_name,
        graduation_year,
        degree_program,
        current_position,
        company,
        email,
        linkedin_url,
        profile_image,
        bio,
      } = alumniData;

      const [result] = await db.query(
        `INSERT INTO alumni (
          first_name, last_name, graduation_year, 
          degree_program, current_position, company,
          email, linkedin_url, profile_image, bio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          graduation_year,
          degree_program,
          current_position,
          company,
          email,
          linkedin_url,
          profile_image,
          bio,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating alumni: ${error.message}`);
    }
  }

  static async updateAlumni(id, alumniData) {
    try {
      const {
        first_name,
        last_name,
        graduation_year,
        degree_program,
        current_position,
        company,
        email,
        linkedin_url,
        profile_image,
        bio,
      } = alumniData;

      const [result] = await db.query(
        `UPDATE alumni SET 
          first_name = ?, last_name = ?, graduation_year = ?,
          degree_program = ?, current_position = ?, company = ?,
          email = ?, linkedin_url = ?, profile_image = ?, bio = ?
        WHERE id = ?`,
        [
          first_name,
          last_name,
          graduation_year,
          degree_program,
          current_position,
          company,
          email,
          linkedin_url,
          profile_image,
          bio,
          id,
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating alumni: ${error.message}`);
    }
  }

  static async deleteAlumni(id) {
    try {
      const [result] = await db.query(`DELETE FROM alumni WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting alumni: ${error.message}`);
    }
  }

  static async searchAlumni(searchParams) {
    try {
      let query = `SELECT * FROM alumni WHERE 1=1`;
      const params = [];

      if (searchParams.name) {
        query += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
        params.push(`%${searchParams.name}%`, `%${searchParams.name}%`);
      }

      if (searchParams.graduation_year) {
        query += ` AND graduation_year = ?`;
        params.push(searchParams.graduation_year);
      }

      if (searchParams.degree_program) {
        query += ` AND degree_program = ?`;
        params.push(searchParams.degree_program);
      }

      query += ` ORDER BY graduation_year DESC, last_name ASC`;

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error searching alumni: ${error.message}`);
    }
  }
}

module.exports = AlumniModel;
