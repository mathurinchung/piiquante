const express = require('express');
const router = express.Router();

const { getAllSauces, getOneSauce, createSauce, updateSauce, deleteSauce, likeSauce } = require('../controllers/sauce.controller');
const { upload } = require('../middlewares');

router.get('/', getAllSauces);
router.get('/:id', getOneSauce);
router.post('/', upload, createSauce);
router.put('/:id', upload, updateSauce);
router.delete('/:id', deleteSauce);
router.post('/:id/like', likeSauce);

module.exports = router;
