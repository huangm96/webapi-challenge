const express = require("express");
const actionModel = require('../data/helpers/actionModel.js')
const projectModel = require('../data/helpers/projectModel.js')

const router = express.Router();

router.get('/', (req, res) => {
    actionModel
      .get()
      .then(action => {
        res.send(action);
      })
      .catch(() => {
        res.status(500).json({
          error: "The action information could not be retrieved."
        });
      });
})

router.get("/:id", validateActionId,(req, res) => {
  actionModel
    .get(req.params.id)
    .then(action => {
      res.send(action)
      
    })
    .catch(() => {
      res.status(500).json({
        error: "The action information could not be retrieved."
      });
    });
});

router.post("/:id/actions", validateAction, validateProjectId,(req, res) => {
  actionModel
    .insert(req.body)
    .then(res.status(201).json(req.body))
    .catch(() => {
      res.status(500).json({
        error: "There was an error while saving the action to the database"
      });
    });
});

router.delete("/:id",  validateActionId,(req, res) => {
  actionModel
    .remove(req.params.id)
    .then(
      res.status(200).json({
        message: `The action with id: ${req.params.id} was removed `
      })
    )
    .catch(() => {
      res.status(500).json({
        error: "The action could not be removed"
      });
    });
});

router.put("/:id", validateAction, validateActionId, (req, res) => {
  actionModel
    .update(req.params.id, req.body)
    .then(
      res.status(200).json({
        message: `The action with id:${req.params.id} was updated`,
        newData: req.body
      })
    )
    .catch(() => {
      res.status(500).json({
        error: "The action information could not be modified."
      });
    });
});

// middleware

function validateAction(req, res, next) {
    if (!req.body) {
        res.status(400).json({error:"missing action data"})
    } else if (!req.body.notes || !req.body.description||!req.body.project_id) {
         res.status(400).json({ error: "missing note or description or project_id for this action" });
    }else if (req.body.description.length > 128) {
         res.status(400).json({ error: "Description for this action is too long" });
    }
    else {
        next();
    }
}

function validateProjectId(req, res, next) {
  projectModel
    .get(req.params.id)
    .then(project => {
      if (!project) {
        res.status(404).json({
          error: "invalid project id"
        });
      } else {
        next();
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "The projects information could not be retrieved."
      });
    });
}

function validateActionId(req, res, next) {
 actionModel
    .get(req.params.id)
    .then(action => {
      if (!action) {
        res.status(404).json({
          error: "invalid action id"
        });
      } else {
        next();
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "The action information could not be retrieved."
      });
    });
}
module.exports = router;