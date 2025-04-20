// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp()
{
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const characterToDelete = characters[index]; // Get the character to delete
  
    // Check if the character has a valid ID
    if (!characterToDelete || !characterToDelete.id) {
      console.error("Invalid character or missing ID.");
      return;
    }
  
    const url = `http://localhost:8000/users/${characterToDelete.id}`; // Build the URL for deletion
  
    fetch(url, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          // If the deletion is successful, update the state
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else if (res.status === 404) {
          throw new Error("Resource not found.");
        } else {
          throw new Error("Failed to delete user.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
    
    function updateList(person){
      setCharacters([...characters, person]);
    }
    
    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function postUser(user) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      return promise;
    }

    function updateList(person) {
      postUser(person)
        .then((res) => {
          if (res.status === 201){
            return res.json();
          } else{
            throw new Error("Failed to create user");
          }
        })
        .then((newUser) => {
          setCharacters([...characters, newUser]);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  
    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((err) => {
          console.log(err);
        });
    }, []);  

  return (
      <div className="container">
      <Table 
      characterData={characters}
      removeCharacter = {removeOneCharacter} />
      <Form handleSubmit = {updateList}/>
      </div>
  );
}
export default MyApp;