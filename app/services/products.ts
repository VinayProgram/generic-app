"use client";
import { db, storage } from "@/app/firebase/fb";
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const POSTS_LIMIT = 10 

export const getAndDisplayPosts = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
) => {
  try {
    let postsQuery;

    // Build the query to fetch posts
    if (lastVisible) {
      postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"), // Order posts by timestamp
        startAfter(lastVisible), // Start after the last document from the previous batch
        limit(POSTS_LIMIT) // Limit the number of posts to fetch
      );
    } else {
      postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        limit(POSTS_LIMIT)
      );
    }

    // Get the post documents
    const querySnapshot = await getDocs(postsQuery);

    // Fetch posts and their like counts
    const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Query the likes subcollection to get the number of likes
        const likesSnapshot = await getDocs(collection(db, "posts", doc.id, "likes"));
        const likeCount = likesSnapshot.size; // Get the number of likes

        return {
          postId: doc.id,   // Unique post ID
          id: data.id,
          title: data.title,        
          content: data.content,
          author: data.author,
          timestamp: data.timestamp.toDate(),
          tags: data.tags,
          image: data.image,
          likes: likeCount, // Return the number of likes
          authorId: data.authorId
        };
      })
    );

    // Get the last visible document for pagination
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { posts, lastVisibleDoc };
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return { posts: [], lastVisibleDoc: null };
  }
};

export const getAndDisplayPersonalPosts = async (
  authorId?: string,
) => {
  try {
    const postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", authorId),
      );
    const querySnapshot = await getDocs(postsQuery);
    const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const likesSnapshot = await getDocs(collection(db, "posts", doc.id, "likes"));
        const likeCount = likesSnapshot.size;
        return {
          postId: doc.id,
          id: data.id,
          title: data.title,
          content: data.content,
          author: data.author,
          timestamp: data.timestamp.toDate(),
          tags: data.tags,
          image: data.image,
          likes: likeCount,
          authorId: data.authorId,
        };
      })
    );
    return { posts };
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return { posts: [], lastVisibleDoc: null };
  }
};


export const getPostById = async (postId: string) => {
  try {
    const postRefQuery = query(
      collection(db, "posts"),
      where('id', '==', postId),
      limit(1)
    );

    // Fetch the documents
    const postSnap = await getDocs(postRefQuery);

    // Check if the document exists
    if (!postSnap.empty) {
      // Get the first document from the snapshot
      const doc = postSnap.docs[0];
      const data = doc.data();

      return {
        id: doc.id, // Using the document ID from Firestore
        title: data.title,
        content: data.content,
        author: data.author,
        timestamp: data.timestamp.toDate(),
        tags: data.tags,
        image: data.image,
        likes: data.likes,
        authorId:data.authorId
      };
    } else {
      console.log("No such post!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    throw error;
  }
};

export const likePost = async (likeDTO: any) => {
  const { liked, byUser, Postid, authorId } = likeDTO;

  try {
    const likeRef = doc(db, `posts/${Postid}/likes/${byUser}`);

    if (liked) {
      // Add like
      await setDoc(likeRef, {
        byUser,
        Postid,
        authorId,
        liked: true
      });
      console.log(`Post ${Postid} liked by user ${byUser}`);
    } else {
      // Remove like
      console.log(`Like removed for post ${Postid} by user ${byUser}`);
    }
  } catch (error) {
    console.error("Error liking post: ", error);
    throw error;
  }
};


export const getLikesForPost = async (postId: string) => {
  try {
    const likesQuery = query(collection(db, `posts/${postId}/likes`));
    const querySnapshot = await getDocs(likesQuery);

    const likes = querySnapshot.docs.map(doc => doc.data());
    return likes;
  } catch (error) {
    console.error("Error fetching likes: ", error);
    throw error;
  }
};


export const addComment = async (commentDTO: any) => {
  const { comment, byUser, Postid,userName } = commentDTO;
  try {
    // Create a reference to the comments collection inside the post document
    const commentsCollectionRef = collection(db, `posts/${Postid}/comments`);

    // Add a new document with auto-generated ID
    await addDoc(commentsCollectionRef, {
      comment,
      Commentlikes: 0, // Default likes to 0
      byUser,
      Postid,
      userName,
      timestamp: new Date() // Add timestamp for when the comment was created
    });

    console.log(`Comment added by ${byUser} on post ${Postid}`);
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};


export const getCommentsForPost = async (postId: string): Promise<any[]> => {
  try {
    const commentsQuery = query(collection(db, `posts/${postId}/comments`));
    const querySnapshot = await getDocs(commentsQuery);

    const comments: any[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        comment: data.comment,
        Commentlikes: data.Commentlikes || 0,
        byUser: data.byUser,
        Postid: data.Postid,
        authorId: data.authorId,
        userName:data.userName,
        shared: data.shared || false, // If shared is optional, default to false
        // You could also add a timestamp if needed:
        // timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
      };
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw error;
  }
};


export const getLikeCountForPost = async (postId: string) => {
  try {
    // Reference to the 'likes' subcollection of the specific post
    const likesCollection = collection(db, `posts/${postId}/likes`);
    
    // Create a query and count the documents in the collection
    const likesQuery = query(likesCollection);
    const aggregateSnapshot = await getCountFromServer(likesQuery);
    console.log(aggregateSnapshot.data())
    // Return the count of documents (likes)
    return aggregateSnapshot.data().count;
  } catch (error) {
    console.error("Error fetching like count: ", error);
    throw error;
  }
};