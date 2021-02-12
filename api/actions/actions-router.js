const Actions = require('./actions-model')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  Actions.get()
    .then((actions) => {
      res.status(200).json(actions)
    })
    .catch((err) => {
     
      res.status(500).json({ message: `Error: ${err}` })});
})



router.get('/:id', (req, res) => {
  const targetId = req.params.id;
  Actions.get(targetId)
    .then((action) => {
        if(action){
            res.status(200).json(action) 
        }else{
            res.status(404).json({ message: `The action with the specified ID ${targetId} does not exist`})
        }
    })
    .catch(() =>
      res.status(500).json({ message: 'The action information could not be retrieved' }))
})



router.post('/', (req, res) => {
  const { project_id, description, notes } = req.body;

  if (!project_id || !description || !notes || description.length > 128) {
    res.status(400).json({message:'ID, Description, and Notes are required. Descriptions are limited to 128 characters.'})
    }else {
    Actions.insert(req.body)
      .then(({ id }) => {
        Actions.get(id).then((action) => res.status(201).json(action))
      })
      .catch(() => {
        res.status(500).json({ message: `No project found with id ${project_id}` })
      })
  }
})



router.put('/:id', (req, res) => {
  const targetId = req.params.id;
  const { description } = req.body;

  try {
    if (description && description.length > 128) {
      res.status(400).json({message: 'Descriptions are limited to 128 characters.'})
    }else{
      Actions.update(targetId, req.body)
      .then((changes) => {
          if(changes){
            Actions.get(targetId).then((post) => res.status(200).json(post)) 
          }else{
            res.status(404).json({ message: `The action with the specified ID:${targetId} does not exist`})
          }
      })
    }
  } catch (err){
      res.status(500).json({ message: 'The action information could not be modified'})
  }
})



router.delete('/:id', (req, res) => {
  const targetId = req.params.id

  try {
    Actions.remove(targetId)
    .then((changes) => {
        if(changes){
            res.status(200).json()
        }else{
            res.status(404).json({message: `The action with the specified ID: ${targetId} does not exist`})
        }
    })
  } catch (err) {
    res.status(500).json({ message: 'The action could not be removed' })
  }
})

module.exports = router;