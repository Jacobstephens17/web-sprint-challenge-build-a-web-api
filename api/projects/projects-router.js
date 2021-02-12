const Projects = require('./projects-model')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: 'Could not find project information'})
    });
});



router.get('/:id', (req, res) => {
  const targetId = req.params.id
  Projects.get(targetId)
    .then((project) => {
        if(project){
            res.status(200).json(project)
        }else {
            res.status(404).json({message: `The project with the specified ID: ${targetId} does not exist`})
        }
    })
    .catch(() =>
      res.status(500).json({ message: 'The project information could not be retrieved' })
      )
})




router.post('/', (req, res) => {
  const { name, description } = req.body

  if (!name || !description) {
    res.status(400).json({message: 'Name and Description are required'})
  }else{
    Projects.insert(req.body)
      .then(({ id }) => {
        Projects.get(id).then((project) => res.status(201).json(project))
      })
      .catch(() => {
        res.status(500).json({ message: 'Could not find project information' })
      })
  }
})



router.put('/:id', (req, res) => {
  const targetId = req.params.id;

  try {
    Projects.update(targetId, req.body)
    .then((updates) => {
      updates ? Projects.get(targetId)
        .then((project) =>
      res.status(200).json(project)) : 
        res.status(404).json({message: 'The action with the specified ID does not exist'})
    })
  } catch (err) {
    res.status(500).json({ message: 'Could not edit project data' });
  }
})



router.delete('/:id', (req, res) => {
  const targetId = req.params.id;

  try {
    Projects.remove(targetId).then((changes) => {
        if(changes){
            res.status(200).json()
        }else{
            res.status(404).json({message: `The action with the specified ID ${targetId}does not exist`})
        }
    })
  }
  catch(err) {
    res.status(500).json({ message: 'Could not delete project' })
  }
});




router.get('/:id/actions', (req, res) => {
  const targetId = req.params.id;
  Projects.getProjectActions(targetId)
    .then((actions) => {
      res.status(200).json(actions)
    })
    .catch((err) => {
      res.status(500).json({message: `Server error: ${err}`})
    })
})

module.exports = router;