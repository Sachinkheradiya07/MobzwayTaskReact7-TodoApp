import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export const addListToFirestore = async (list) => {
  try {
    const docRef = await addDoc(collection(db, "todoLists"), list);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getListsFromFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, "todoLists"));
  const lists = [];
  querySnapshot.forEach((doc) => {
    lists.push({ id: doc.id, ...doc.data() });
  });
  return lists;
};

export const updateListInFirestore = async (listId, updatedList) => {
  try {
    const listRef = doc(db, "todoLists", listId);
    await updateDoc(listRef, updatedList);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};
