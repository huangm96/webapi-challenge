const express = require("express");

const projectModel = require("../data/helpers/projectModel.js");
const actionModel = require('../routers/actionRouter.js')

const router = express.Router();

router.get("/", (req, res) => {
  projectModel
    .get()
    .then(projects => {
      res.send(projects);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The projects information could not be retrieved." });
    });
});
router.get("/:id", validateProjectId, (req, res) => {
  projectModel
    .get(req.params.id)
    .then(project => {
        res.send({
            message: `Project Id: ${req.params.id}`,
            projectData: project
        });
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The projects information could not be retrieved." });
    });
});

router.post("/", validateProject,(req, res) => {
  
    projectModel
      .insert(req.body)
      .then(res.status(201).json(req.body))
      .catch({
        error: "There was an error while saving the project to the database"
      });
  
});

router.delete("/:id",  validateProjectId,(req, res) => {
  projectModel
    .remove(req.params.id)
    .then(
      res.status(200).json({
        message: `The project with id: ${req.params.id} was removed `
      })
    )
    .catch({
      error: "The project could not be removed"
    });
});

router.put("/:id",validateProject,  validateProjectId,(req, res) => {
  projectModel
    .update(req.params.id, req.body)
    .then(
      res.status(200).json({
        message: `The project with id:${req.params.id} was updated`,
        newData: req.body
      })
    )
    .catch({
      error: "The project information could not be modified."
    });
});

router.get('/:id/project-actions', validateProjectId, (req, res) => {
    projectModel
      .getProjectActions(req.params.id)
      .then(action => {
        res.send(action);
      })
      .catch({
        error: "The actions for this project could not be retrieved."
      });
})

// middleware

function validateProject(req, res, next) {
    if (!req.body) {
        res.status(400).json({error:"missing project data"})
    } else if (!req.body.name || !req.body.description) {
         res.status(400).json({ error: "missing name or description for this project" });
    } else {
        next();
    }
}

function validateProjectId(req, res, next) {
   projectModel.get(req.params.id).then(project => {
       if (!project) {
           res.status(404).json({
             error: "invalid project id"
           });
       } else {
           next();
        }
   }).catch({
       error: "The projects information could not be retrieved."
    })
}




module.exports = router;
