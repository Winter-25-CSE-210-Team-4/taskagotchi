import express, { Router, Request } from 'express';
import Pet from '../models/Pet';
import { auth, AuthRequest } from '../middleware/auth';


const router = Router();


// GET all pets
router.get('/', auth, async (req: AuthRequest, res: express.Response) => {
    try {
        const pets = await Pet.find({ userId: req.user?.id });
        res.json({
            success: true,
            data: pets
        });
    } catch (error) {
        console.error('Error getting pets:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
});

// GET single pet by ID
router.get('/:id', auth, async (req: AuthRequest, res: express.Response) => {
    try {
        const pet = await Pet.findOne({ 
            _id: req.params.id,
            userId: req.user?.id 
        });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }
        
        res.json({
            success: true,
            data: pet
        });
    } catch (error) {
        console.error('Error getting pet:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
});

// POST new pet
router.post('/', auth, async (req: AuthRequest, res: express.Response) => {
    try {
        const existingPet = await Pet.findOne({ userId: req.user?.id });
        if (existingPet) {
            return res.status(400).json({
                success: false,
                message: 'User already has a pet'
            });
        }

        const pet = new Pet({
            userId: req.user?.id,
            name: req.body.name,
            health: 100,
            level: 1,
            exp: 0
        });

        const savedPet = await pet.save();
        res.status(201).json({
            success: true,
            data: savedPet
        });
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
 });

// //PUT update expereince 
// router.put('/:id/gain-exp', auth, async (req: AuthRequest, res: express.Response) => {
//     try {
//         const { exp } = req.body;
//         const pet = await Pet.findOne({ 
//             _id: req.params.id,
//             userId: req.user?.id 
//         });

//         if (!pet) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Pet not found'
//             });
//         }

//         await pet.gainExp(exp);
//         await pet.save(); // Make sure to save after gaining exp

//         res.json({
//             success: true,
//             data: pet,
//             message: 'Experience updated successfully'
//         });
//     } catch (error) {
//         console.error('Error updating pet experience:', error);
//         res.status(500).json({
//             success: false,
//             message: error instanceof Error ? error.message : 'An unknown error occurred'
//         });
//     }
// });

router.put('/gain-exp', auth, async (req: AuthRequest, res: express.Response) => {
    try {
        // Get userId from auth token instead of URL parameter
        const userId = req.user?.id;
        const exp = Number(req.body.exp);

        const pet = await Pet.findOne({ userId });

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        await pet.gainExp(exp);
        await pet.save();

        res.json({
            success: true,
            data: pet,
            message: 'Experience updated successfully'
        });
    } catch (error) {
        console.error('Error updating pet experience:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
});


router.get('/', auth, async (req: AuthRequest, res: express.Response) => {
    try {
        // Get userId from auth token
        const userId = req.user?.id;
        const pet = await Pet.findOne({ userId });
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        res.json({
            success: true,
            data: pet
        });
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
});


export default router;