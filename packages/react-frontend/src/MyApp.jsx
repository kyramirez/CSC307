// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const userId = String(characters[index]._id);
    fetch(`http://localhost:8000/users/${userId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          setCharacters((current) => current.filter((_, i) => i !== index));
        } else if (res.status === 404) {
          console.log("User not found.");
        } else {
          console.log("Failed to remove");
        }
      })
      .catch((error) => {
        console.error("Error deleting");
      });
  }

  function updateList(person) {
    postUser(person)
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error("Failed to create user");
      }
    });
    return promise;
  }
}

export default MyApp;
