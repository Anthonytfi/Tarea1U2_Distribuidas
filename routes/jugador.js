const express = require('express');
const router = express.Router();
const { pool } = require("../database/database");

// GET: Ver todos los jugadores
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM jugador");
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// GET: Ver jugador por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM jugador WHERE id = ?", [id]);
        res.json(rows);
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error interno" });
    }
});

// POST: Crear jugador 
router.post("/", async (req, res) => {
    try {
        const { nombre, camiseta, equipo_id, posicion_id } = req.body;
        
        const [result] = await pool.query(
            "INSERT INTO jugador (nombre, camiseta, equipo_id, posicion_id) VALUES (?, ?, ?, ?)", 
            [nombre, camiseta, equipo_id, posicion_id]
        );
        
        res.status(201).json({
            id: result.insertId,
            nombre,
            camiseta,
            equipo_id,
            posicion_id
        });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al registrar" });
    }
});

// PUT: Actualizar jugador
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, camiseta, equipo_id, posicion_id } = req.body;

        const [result] = await pool.query(
            "UPDATE jugador SET nombre = ?, camiseta = ?, equipo_id = ?, posicion_id = ? WHERE id = ?",
            [nombre, camiseta, equipo_id, posicion_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ "mensaje": "No existe jugador con ese ID" });
        }

        res.status(200).json({ id, nombre, camiseta, equipo_id, posicion_id });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al actualizar" });
    }
});

// DELETE: Eliminar jugador
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM jugador WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
             return res.status(404).json({ "mensaje": "No existe un jugador con ese ID" });
        }
        
        res.status(200).json({ "mensaje": "Eliminado correctamente" });
    } catch (error) {
        console.log("Error " + error);
        res.status(500).json({ "mensaje": "Error al eliminar" });
    }
});

// Buscar todos los jugadores de un Equipo específico
router.get("/equipo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aquí filtramos por la columna 'equipo_id'
        const [rows] = await pool.query("SELECT * FROM jugador WHERE equipo_id = ?", [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ "mensaje": "Error de obtención de datos." });
    }
});

// Buscar todos los jugadores de una Posición específica
router.get("/posicion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aquí filtramos por la columna 'posicion_id'
        const [rows] = await pool.query("SELECT * FROM jugador WHERE posicion_id = ?", [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ "mensaje": "Error de obtención de datos." });
    }
});

module.exports = router;