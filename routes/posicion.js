const express = require('express');
const router = express.Router();
const { pool } = require("../database/database");

// GET: Ver todas las posiciones
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM posicion");
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// GET: Ver posición por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM posicion WHERE id = ?", [id]);
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// POST: Crear posición
router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const [result] = await pool.query(
            "INSERT INTO posicion (nombre, descripcion) VALUES (?, ?)", 
            [nombre, descripcion]
        );
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al registrar" });
    }
});

// PUT: Actualizar posición
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        
        const [result] = await pool.query(
            "UPDATE posicion SET nombre = ?, descripcion = ? WHERE id = ?", 
            [nombre, descripcion, id]
        );

        if (result.affectedRows === 0) {
             return res.status(404).json({ "mensaje": "No existe esa posición" });
        }
        res.status(200).json({ id, nombre, descripcion });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al actualizar" });
    }
});

// DELETE: Eliminar posición
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM posicion WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
             return res.status(404).json({ "mensaje": "No existe esa posición" });
        }
        res.status(200).json({ "mensaje": "Posición eliminada" });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al eliminar" });
    }
});

module.exports = router;