const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection server:", error);
    })

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// create route
// receives name, course, age and save new student to db
app.post("/students", async (req, res) => {
    const {name, course, age} = req.body;

    const students = new Student({
        name,
        course,
        age
    });
    await students.save();
    res.json(students);
});

// read route
// get all display students
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// delete route
app.delete("/students/:id", async (req, res) => {
    const {id} = req.params; // obtain the selected student id
    await Student.findByIdAndDelete(id); // method finds the student by id and deletes it from db
    res.json({
        message: "Student is deleted"
    });
});

// update route
app.put("/students/:id", async (req, res) => {
    const {id} = req.params; // who should be updated
    const {name, course, age} = req.body; // what info should be updated
    const updatedStudent =
        await Student.findByIdAndUpdate(id, { // method finds the student by id and updates it
            name,
            course,
            age
        },
        {new: true} // new values returned
    );
    res.json(updatedStudent);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});