import express, { Router } from 'express';
import Pet from '../models/Pet';
import User from '../models/User';

const router = Router();

// GET all pets
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// GET single pet by ID
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findOne({ pet_id: req.params.id });
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// POST new pet
router.post('/', async (req, res) => {
    const pet = new Pet({
        pet_id: req.body.pet_id,
        name: req.body.name,
        health: req.body.health || 100,
        level: req.body.level || 1,
        exp: req.body.exp || 0
    });

    try {
        const newPet = await pet.save();
        res.status(201).json(newPet);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
 });

//PUT update expereince 
router.put('/:id/gain-exp', async (req, res) => {
    try {
        const {exp} = req.body
        const pet = await Pet.findOne({ pet_id: req.params.id });

        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        await pet.gainExp(exp);
        res.json({ message: 'XP Updated', pet });
    } catch(error) {
        res.status(500).json({ message: 'Error updating XP' });
    }
});

export default router;