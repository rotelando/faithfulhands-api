import express from 'express';

const staffRoutes = express.Router();

staffRoutes.get('/', (req, res) => {

    try {
        const { search, page, limit } = req.query;
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to get staff' });
    }
});

export default staffRoutes;
