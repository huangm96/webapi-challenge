const express = require("express");

const projectModel = require("../data/helpers/projectModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  projectModel.get().then(projects => {
    res.send(projects);
  }).catch(() => {
      res
        .status(500)
        .json({ error: "The projects information could not be retrieved." });
  }

  );
});

router.post("/", (req, res) => {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({message:"missing name or description"})
    } else {
        projectModel
          .insert(req.body)
          .then(res.status(201).json(req.body))
          .catch({
            error: "There was an error while saving the project to the database"
          });
    }
})

module.exports = router;
