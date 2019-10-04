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

router.post("/", (req, res) => {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "missing name or description" });
  } else {
    projectModel
      .insert(req.body)
      .then(res.status(201).json(req.body))
      .catch({
        error: "There was an error while saving the project to the database"
      });
  }
});

router.delete("/:id", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.get('/:id/project-actions', (req, res) => {
    projectModel
      .getProjectActions(req.params.id)
      .then(action => {
        res.send(action);
      })
      .catch({
        error: "The actions for this project could not be retrieved."
      });
})
module.exports = router;
