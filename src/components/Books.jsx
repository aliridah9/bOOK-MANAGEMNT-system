import { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { db, storage } from "../firebase-config";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./book.css"

export default function Books() {
  const [rows, setRows] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: { name: "", birthdate: "", biography: "" },
    brief: "",
    quantity: "",
    status: "",
    publishDate: "",
    imageUrl: "",
  });
 
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

const getBooks = () => {
  let q = query(collection(db, "books"));

  if (searchQuery) {
    q = query(collection(db, "books"), where("author.name", "==", searchQuery));
  }

  onSnapshot(q, (querySnapshot) => {
    const rows = [];
    querySnapshot.forEach((doc) => {
      rows.push({ id: doc.id, ...doc.data() });
    });
    setRows(rows);
  });
};


  useEffect(() => {
    getBooks();
  }, [searchQuery]);

 const handleSearchInputChange = (event) => {
  setSearchQuery(event.target.value);
};



  const deleteBook = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      await deleteDoc(doc(db, "books", id));
      
      toast('Book has been successfully deleted.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          backgroundColor: "#47e34c" ,
          color: "white"
        },
        toastClassName: "custom-toast",
        progressClassName: "custom-progress" 
      });
    };
  };


const onImageChange = (event) => {
  const file = event.target.files[0];
  setImageFile(file);
  
};

useEffect(() => {
  console.log(imageFile);
}, [imageFile]);

 const onEdit = async (event) => {
  event.preventDefault();
  
  if (imageFile) {
   
    const bookRef = doc(db, "books", selectedBook.id);
        const storageRef = ref(storage, `images/${selectedBook.title}/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(snapshot.ref);
    
    await updateDoc(bookRef, {
    title: editForm.title,
    author: {
      name: editForm.author.name,
      birthdate: editForm.author.birthdate,
      biography: editForm.author.biography,
    },
    brief: editForm.brief,
    quantity: Number(editForm.quantity),
    status: editForm.status,
    publishDate: editForm.publishDate,
      imageUrl: downloadURL });
  } else {
   const bookRef = doc(db, "books", selectedBook.id);
      
  await updateDoc(bookRef, {
    title: editForm.title,
    author: {
      name: editForm.author.name,
      birthdate: editForm.author.birthdate,
      biography: editForm.author.biography,
    },
    brief: editForm.brief,
    quantity: Number(editForm.quantity),
    status: editForm.status,
    publishDate: editForm.publishDate, 
     imageUrl: editForm.imageUrl,
  });}
  setSelectedBook(null);
  setEditForm({
    title: "",
    author: { name: "", birthdate: "", biography: "" },
    brief: "",
    quantity: "",
    status: "",
    publishDate: "",
    imageUrl: "",
  });
  
  toast('Book has been successfully updated.', {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    style: {
      backgroundColor: "#47e34c" ,
      color: "white"
    },
    toastClassName: "custom-toast",
    progressClassName: "custom-progress" 
  });
};

 

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setEditForm((prevState) => ({
        ...prevState,
        [parentKey]: { ...prevState[parentKey], [childKey]: value },
      }));
    } else {
      setEditForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEditFormOpen = (book) => {
    setSelectedBook(book);
    setEditForm({
      title: book.title,
      author: { name: book.author.name, birthdate: book.author.birthdate, biography: book.author.biography },
      brief: book.brief,
      quantity: book.quantity,
      status: book.status,
    
      publishDate:book.publishDate,
      imageUrl: book.imageUrl,
    });
    setImageFile(null);
    setImageURL(book.imageURL);
  };

  const handleEditFormClose = () => {
    setSelectedBook(null);
    setEditForm({
      title: "",
      author: { name: "", birthdate: "", biography: "" },
      brief: "",
      quantity: "",
      status: "",
      publishDate: "",
      imageUrl: "",
    });
    setImageFile(null);
    setImageURL(null);
  };
// console.log(row.imageURL)
  return (
    <div>
      <h1>Books</h1>
      <TextField
  label="Search by author name"
  variant="outlined"
  value={searchQuery}
  onChange={handleSearchInputChange}
/>
      <Grid container spacing={2}>
        {rows.map((row) => (
          <Grid item key={row.id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
  component="img"
  height="140"
  image={row.imageUrl}
/>
              
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {row.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.brief}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.author.name} : {row.author.birthdate} , {row.author.biography}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.publishDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {row.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {row.status}
                </Typography>
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  onClick={() => deleteBook(row.id)}
                >
                  Delete
                </Button>
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  onClick={() => handleEditFormOpen(row)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="edit-form-container">
        {selectedBook && (
          <div className="edit-form">
            <h2>Edit Book</h2>
            <form onSubmit={onEdit}>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Author Name"
                name="author.name"
                value={editForm.author.name}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Author Birthdate"
                name="author.birthdate"
                value={editForm.author.birthdate}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Author Biography"
                name="author.biography"
                value={editForm.author.biography}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Brief"
                name="brief"
                value={editForm.brief}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                name="quantity"
                value={editForm.quantity}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Status"
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Publish Date"
                name="publishDate"
                type="date"
                value={editForm.publishDate}
                onChange={handleEditChange}
              />
              <div className="edit-form-image">
                <img src={editForm.imageUrl} alt={editForm.title} />
                <input type="file" onChange={onImageChange} />
              </div>
              <div className="edit-form-buttons">
                <Button variant="contained" onClick={handleEditFormClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}