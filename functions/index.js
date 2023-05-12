// const functions = require("firebase-functions");

// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.updateStatus = functions.firestore
//   .document("books/{bookId}")
//   .onUpdate((change, context) => {
//     const bookData = change.after.data();
//     const previousBookData = change.before.data();

//     if (bookData.status === "published" && previousBookData.status !== "published") {
//       const bookId = context.params.bookId;
//       const bookRef = admin.firestore().doc(`books/${bookId}`);

//       return bookRef.update({
//         status: "published",
//         publishedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     }

//     return null;
//   });