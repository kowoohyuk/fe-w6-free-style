import express from 'express';
import bodyParser from 'body-parser';
import Memotree from './memotree.js';
import db from './db.js';

const router = express.Router();
router.use(bodyParser.json());

router.get('/:id', (req, res) => {
  Memotree.findById(req.params.id, function (err, memotree) {
    if (err) return res.status(500).send("memotree를 못찾았어요.");
    if (!memotree) return res.status(404).send("memotree가 없어요!");
    res.status(200).send(memotree);
  });
});

router.post('/', (req, res) => {
  const memotree = new Memotree(req.body);
  memotree.save(function(err, item) {
    if (err) return res.status(500).send("memotree 생성 완료.");
    res.status(200).send(item._id);
  })
});

export default router;