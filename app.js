const express = require('express');
const mongoose = require('mongoose');
const MONGO_URI = require('./env.js');
const Person = require('./person.js')
const app = express();
const port = 3000;
 
//connection to the database
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected ');
});


// create model
var person = new Person(
    {
      name: "john",
      age:25,
      favoriteFoods:["Pizza Margherita","chiken"]              
    }
);
// Save model
person.save((err, data) => {
    if (err){
        console.log("error")
    };
  });
  //Create Many Records with model.create()
  Person.insertMany([
    {name: "Garry", age: 35, favoriteFoods: ["fried chicken", "chicken wings"]},
    {name: "hannah", age: 20, favoriteFoods: ["fried chicken", "chicken wings"]},
    {name: "marie", age: 18, favoriteFoods: ["fried chicken", "chicken wings"]}
]).then(function(){
    console.log("Data inserted")  // Success
}).catch(function(error){
    console.log(error)      // Failure
});
// model.find() to Search Your Database
Person.find({ name: 'marie'}, function (err, data) {
    if (err){
        console.log(err);
    }
    else{
        console.log("First function call : ", data);
    }
});          
//Use model.findOne() to Return a Single Matching Document from Your Database
Person.findOne({favoriteFoods: ["fried chicken", "chicken wings"] }, function (err, data) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Result : ", data);
    }
});
//Use model.findById() to Search Your Database By _id
var id = '61b7a79d3da34f4159119931';
Person.findById(id, function (err, data) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Result : ", data);
    }
});
//
var personId = '61b7a79d3da34f4159119930';
Person.findByIdAndUpdate(personId, { favoriteFoods: ['hamburger']},{new: true},
     function (err, data) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated User : ", data);
    }
});
//
Person.findOneAndUpdate({name: 'john'}, 
    {age: 20}, {new: true}, function (err, data) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Original Doc : ",data);
    }
});
//

Person.findByIdAndDelete({name: 'marie'} , function (err, data) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Removed User : ", data);
    }
});
//

/*Person.deleteOne({ name:'marie' }).then(function(){
    console.log("Data deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});*/
//
Person.find({}, function(err,data){}).sort({name: 'john'}).limit(2);



app.get('/',(req,res) => {
    res.send("hello")
});

app.listen(port, () => 
console.log('notre application est démarée '))