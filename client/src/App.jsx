import { useEffect, useState } from "react";
import axios from "axios";

function App(){

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState(""); 
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () =>{
    const response = await axios.get(
      "http://localhost:5000/students"
    );
    setStudents(response.data);
  }

  // fetch students on load
  useEffect(() => { 
    fetchStudents();
  },[]);

  // send form data to db
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      course: course,
      age: Number(age),
    }

    // no students being edited null
    if (editingId){
      await axios.put(
        `http://localhost:5000/students/${editingId}`, data
      );
      setEditingId(null);
    }
    else { // student editing show data
      await axios.post("http://localhost:5000/students", data);
    }

    // clear fields
    setName("");
    setCourse("");
    setAge("");

    // fetch students again to update list real time
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await axios.delete( // send selected id to delete route
      `http://localhost:5000/students/${id}`)
      setStudents(students.filter((student) => student._id !== id)); // update list after deletion real time
  };

  const handleEdit = (student) => { // shows student data in fields editing mode
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditingId(student._id);
  }
  

  return (
    <div>
      <h1>Student Management System</h1>
      <h2>Add Students</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} 
          onKeyPress = {(e) => {
            const isLetter = /^[a-zA-Z\s]$/.test(e.key);
            if (!isLetter) {
              e.preventDefault();
            } 
          }}/>
        <input type="text" required placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} 
          onKeyPress = {(e) => {
            const isLetter = /^[a-zA-Z\s]$/.test(e.key);
            if (!isLetter) {
              e.preventDefault();
            } 
          }}/>
        <input type="number" required placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
      </form>

      <h2>Existing Students</h2>

      {/* display students w/ delete and edit btns */}
      {students.map((student) => (
        <div key={student.id}>
            <p>Name: {student.name}</p>
            <p>Course: {student.course}</p>
            <p>Age: {student.age}</p>

            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student._id)}>Delete</button>
            {/* pass selected student id to del func */}
        </div>
      ))}
      
    </div>
  );
}

export default App;