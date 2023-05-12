import "./App.css";
import Books from "./Books.jsx";
import { useState } from "react";
import { TextField, Button, Stack, Paper, Container } from "@mui/material";
import { db, storage } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import {useUserAuth} from "../context/UserAuthContext"
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorBirthdate, setAuthorBirthdate] = useState("");
  const [authorBiography, setAuthorBiography] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [image, setImage] = useState(null);


    const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

 

  const addBook = async () => {
    const missingFields = [];

    if (title === "") {
      missingFields.push("Title");
    }
    if (authorName === "") {
      missingFields.push("Author Name");
    }
    if (authorBirthdate === "") {
      missingFields.push("Author Birthdate");
    }
    if (authorBiography === "") {
      missingFields.push("Author Biography");
    }
    if (quantity === "") {
      missingFields.push("Quantity");
    }
    if (brief === "") {
      missingFields.push("Brief");
    }
    if (status === "") {
      missingFields.push("Status");
    }
    if (publishDate === "") {
      missingFields.push("Publish Date");
    }

    if (missingFields.length > 0) {
      toast(
        `Please fill in the following fields: ${missingFields.join(", ")}`,
        {
          position: "top-right",
          autoClose: 3000,
          delay: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            backgroundColor: "#ff4d4f",
          },
          toastClassName: "custom-toast",
          progressClassName: "custom-progress",
        }
      );
    } else if (image === null) {
      toast(`Please select an image.`, {
        position: "top-right",
        autoClose: 3000,
        delay: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          backgroundColor: "#ff4d4f",
        },
        toastClassName: "custom-toast",
        progressClassName: "custom-progress",
      });
    } else {
      try {
        const bookRef = doc(db, "books", title);
        const storageRef = ref(storage, `images/${title}/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);

        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log({
          title,
          author: {
            name: authorName,
            birthdate: authorBirthdate,
            biography: authorBiography,
          },
          brief,
          quantity,
          status,
          publishDate: publishDate,
          imageUrl: downloadURL,
        });
        
        await setDoc(bookRef, {
          title,
          author: {
            name: authorName,
            birthdate: authorBirthdate,
            biography: authorBiography,
          },
          brief,
          quantity,
          status,
          publishDate: publishDate,
          imageUrl: downloadURL,
        });

        setTitle("");
        setAuthorName("");
        setAuthorBirthdate("");
        setAuthorBiography("");
        setQuantity("");
        setBrief("");
        setStatus("");
        setPublishDate("");
        setImage(null);

        toast(
          "Book has been successfully added.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: {
              backgroundColor: "#47e34c",
              color: "white",
            },
            toastClassName: "custom-toast",
            progressClassName: "custom-progress",
          }
        );
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Firestore Library</h1>
      <div >
        Hello Welcome <br />
        {user && user.email}
      </div>
  <div >
        <button  onClick={handleLogout} className="logout-btn">
          Log out
        </button>
      </div>
      <Container
        component={Paper}
        sx={{ marginBottom: "20px", padding: "20px" }}
      >
        <h2 style={{ fontSize: "20px" }}>Add New Book</h2>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            label="Author Name"
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value);
            }}
          />
          <TextField
            label="Author Birthdate"
            value={authorBirthdate}
            type="date"
            onChange={(e) => {
              setAuthorBirthdate(e.target.value);
            }}
          />
          <TextField
            label="Author Biography"
            value={authorBiography}
            onChange={(e) => {
              setAuthorBiography(e.target.value);
            }}
          />
          <TextField
            label="Brief"
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value);
            }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            type="number"
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          <TextField
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          />
          <TextField
            label="Publish Date"
            value={publishDate}
            type="date"
            onChange={(e) => {
              setPublishDate(e.target.value);
            }}
          />
          <TextField type="file" onChange={handleImageChange} />
          <Button variant="contained" onClick={addBook}>
            Add Book
          </Button>
        </Stack>
      </Container>
      <Books />
    </div>
  );
}

export default Home;