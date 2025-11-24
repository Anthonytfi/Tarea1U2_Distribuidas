const express = require('express');
const router = express.Router();
const { pool } = require("../database/database");

// GET: Ver todos los equipos
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM equipo");
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// GET: Ver un equipo por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM equipo WHERE id = ?", [id]);
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// POST: Crear equipo
router.post("/", async (req, res) => {
    try {
        const { nombre, estadio } = req.body;
        const [result] = await pool.query(
            "INSERT INTO equipo (nombre, estadio) VALUES (?, ?)", 
            [nombre, estadio]
        );
        res.status(201).json({ id: result.insertId, nombre, estadio });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al registrar" });
    }
});

// PUT: Actualizar equipo
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estadio } = req.body;
        
        const [result] = await pool.query(
            "UPDATE equipo SET nombre = ?, estadio = ? WHERE id = ?", 
            [nombre, estadio, id]
        );

        if (result.affectedRows === 0) {
             return res.status(404).json({ "mensaje": "No existe ese equipo" });
        }
        res.status(200).json({ id, nombre, estadio });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al actualizar" });
    }
});

// DELETE: Eliminar equipo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM equipo WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
             return res.status(404).json({ "mensaje": "No existe ese equipo" });
        }
        res.status(200).json({ "mensaje": "Equipo eliminado" });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al eliminar" });
    }
});

module.exports = router;