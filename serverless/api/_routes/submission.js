const { Router, json } = require('express')
const router = Router()
router.use(json())

const mongoose = require('mongoose')
const Submission = mongoose.model('Submission')

const { verifyUser, verifyAdmin } = require('../_utils/restrict')
const { validateFields } = require('../_utils/validation')

router.get('*', verifyUser, async (req, res) => {
  const submissions = await Submission.find()
  return res.status(200).json({ submissions })
})

router.post('*', verifyUser, validateFields(["text"]), (req, res) => {
  const { text } = req.body
  const submission = new Submission()
  submission.text = text

  return submission.save()
    .then(result => res.status(200).json({ result }))
    .catch((err) => {
      res.status(400).json({ message: 'Error adding submission', error: err })
    })
})

router.delete('*', verifyAdmin, validateFields(["id"]), async (req, res) => {
  const { id } = req.body
  const result = await Submission.deleteOne({ id })
  return res.status(200).json({ result })
})

module.exports = router
