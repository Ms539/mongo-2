const Person = require("../models/person");
const express = require("express");
const router = express.Router();
const { success } = require("../helpers/success");

// http://localhost:5000/api/persons/new_add
// Add a new person
router.post("/new_add", async (req, res) => {
  const person = new Person(req.body);
  const message = "A new person has just been added.";

  try {
    const savePerson = await person.save();
    res.status(201).json(success(message, savePerson));
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:5000/api/persons/add_many
// Add more people.
router.post("/add_many", async (req, res) => {
    const arrayP = [
      { name: "hamza", age: 30, favoriteFoods: ["burritos"] },
      { name: "mohamed", age: 20, favoriteFoods: ["pate"] },
      { name: "yassine", age: 23, favoriteFoods: ["pizza", "thon"] },
    ];
    const message = "Multiple people have been added.";
  
    try {
      const saveAll = await Person.insertMany(arrayP);
      res.status(201).json(success(message, saveAll));
    } catch (err) {
      res.status(400).json(err);
    }
  });

// http://localhost:5000/api/persons
// List of all people
router.get("/", async (req, res) => {
    const message = "List of all people.";
  
    try {
      const persons = await Person.find({});
      if (!persons.length) {
        res
          .status(204)
          .send(console.info("There are no people in the database."));
      } else {
        res.json(success(message, persons));
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

// http://localhost:5000/api/persons/food/:favoriteFoods

// Find a person by their favoriteFoods
router.get("/food/:favoriteFoods", async (req, res) => {
    const food = req.params.favoriteFoods;
    const message = `Here is a person who loves a ${food}.`;
  
    try {
      const person = await Person.findOne({ favoriteFoods: { $in: [food] } });
      !person
        ? res.status(404).send(`No person who loves a ${food} has been found.`)
        : res.json(success(message, person));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // http://localhost:5000/api/persons/id/:id

// Find a person by their ID
router.get("/id/:id", async (req, res) => {
    const personId = req.params.id;
    const message = "Here is the person with the corresponding ID.";
  
    try {
      const person = await Person.findById(personId);
      !person
        ? res.status(404).send("No person with the matching ID was found.")
        : res.json(success(message, person));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // http://localhost:5000/api/persons/updateById/:id
// Update a person by their ID
router.put("/updateById/:id", async (req, res) => {
    const personId = req.params.id;
    const message = "The person has been updated.";
  
    try {
      const upPerson = await Person.findByIdAndUpdate(personId, req.body, {
        new: true,
      });
      !upPerson
        ? res.status(404).send("No person with the matching ID was found.")
        : res.json(success(message, upPerson));
    } catch (err) {
      res.status(500).json(err);
    }
  });

// http://localhost:5000/api/persons/updateByName/:name

// Update a person by name
router.put("/updateByName/:name", async (req, res) => {
    const { name } = req.params;
    const message = "The person has been updated.";
  
    try {
      const upPerson = await Person.findOneAndUpdate({ name }, req.body, {
        new: true,
      });
      !upPerson
        ? res.status(404).send("No person with the matching Name was found.")
        : res.json(success(message, upPerson));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // http://localhost:5000/api/persons/deleteById/:id

// Delete a person by their ID
router.delete("/deleteById/:id", async (req, res) => {
    const personId = req.params.id;
    const message = "This person has been deleted.";
  
    try {
      const delPerson = await Person.findByIdAndDelete(personId);
      !delPerson
        ? res.status(404).send("No person with the matching ID was found.")
        : res.json(success(message, delPerson));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //http://localhost:5000/api/persons/deleteManyByName/:name
  
// Delete people by name
  router.delete("/deleteManyByName/:name", async (req, res) => {
    const personsName = req.params.name;
    const message = "This person(s) have been deleted.";
  
    try {
      const delPersons = await Person.deleteMany({ name: personsName });
      !delPersons.deletedCount
        ? res.status(404).send("No person with the matching name was found.")
        : res.json(success(message, delPersons));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // http://localhost:5000/api/persons/special_search

// Find the first two people who like burritos, sort them and don't display their age.
router.get("/special_search", async (req, res) => {
    const message = "Here is the search result.";
  
    try {
      const people = await Person.find({ favoriteFoods: { $all: ["burritos"] } })
        .sort({ name: 1 })
        .limit(2)
        .select({ age: 0 })
        .exec(console.log("BURRITOS!!!"));
      people.length === 0
        ? res.status(404).send("Nobody likes burritos damage.")
        : res.json(success(message, people));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;