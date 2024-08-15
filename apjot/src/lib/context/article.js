import { databases, ID} from "../appwrite";
import { Query,Permission ,Role} from "appwrite";
const collectionId = "65e837c03ab60c631376";
const databaseId = "65e834a1b7b3800eafe3";
const likeFunction = "65e994b0b1e2cb6c7bf5";
const CommentCollectionId = "65e9ba6eb44deadf0ac3";
const highlightCollectionId = "65e8c5f4910645b92ec5";
const NewsletterCollectionId = '661283290a261ea23278'


function getLastId (response){
  let lastId = null;
  if (response.documents.length > 0) {
    lastId = response.documents[response.documents.length - 1].$id;
  }
}

export async function getAllDocuments(last) {
  try {
    let query = [
      Query.equal("publish", true),
      Query.orderDesc("$createdAt"),
      Query.select(["slug", "image", "title", "$id"]),
    ];

    // If last cursor is provided, add it to the query
    if (last) {
      query.push(Query.cursorAfter(last));
    }

    const response = await databases.listDocuments(databaseId, collectionId, query);
    const lastId = getLastId(response)

    return { data: response.documents, lastId: lastId };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}


export async function getByFilter(filter) {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("publish", true),
      Query.equal("catergory", filter),
    ]);
    const lastId = getLastId(response)
    return { data: response.documents, lastId: lastId };  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getSearch(searchTerm) {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.search("title", searchTerm),
    ]);
    const lastId = getLastId(response)
    return { data: response.documents, lastId: lastId }; 
   } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getAllFeatured() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("publish", true),
      Query.select(["slug", "image", "title"]),
      Query.limit(3),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}



// Custom shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffledIndexes = [];

  // Generate three unique random indexes
  while (shuffledIndexes.length < 3) {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!shuffledIndexes.includes(randomIndex)) {
      shuffledIndexes.push(randomIndex);
    }
  }

  // Create a new array with the selected items
  const shuffledItems = shuffledIndexes.map(index => array[index]);

  return shuffledItems;
}



export async function getRelated() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("publish", true),
      Query.select(["slug", "image", "title"]),
    ]);
    let  shuffledArray  = response.documents;
    if (shuffledArray.length > 3){
      shuffledArray = shuffleArray(response.documents)
    }
    return shuffledArray;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}




export async function getAllComments(articleid) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      CommentCollectionId,
      [Query.equal("articles", articleid)],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}
export async function createComment(articleId, name, message, date,parentCommentId) {
  try {
    const response = await databases.createDocument(
      databaseId,
      CommentCollectionId,
      ID.unique(),
      { name: name, message: message, date: date, articles: articleId, parent: parentCommentId},
    );
    console.log("response created", response);
    return response;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}
// Function to get a single document by its ID
export async function getDocumentById(slug) {

  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("slug", slug),
      Query.limit(1),
    ]);
    return response.documents[0];
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    return null;
  }
}

// Function to add a new document to a collection
export async function executeFunction(documentId) {
  try {
    // Make GET request to the specified link with the document ID
    const response = await fetch(
      `https://65e8db8145e0ca93d318.appwrite.global/?documentId=${documentId}`,
      { mode: "no-cors" },
    );
    console.log("Response status:", response.status); // Will log
    return true;
  } catch (error) {
    console.error("An error occurred while processing the like action:", error);
    return false;
  }
}

// Function to update an existing document in a collection
export async function updateDocument(collectionId, documentId, data) {
  try {
    const response = await databases.updateDocument(
      collectionId,
      documentId,
      data,
    );
    return response;
  } catch (error) {
    console.error("Error updating document:", error);
    return null;
  }
}

export async function getAllHighlights(articleId, userId ) {
  console.log('Getting hightllights')
  try {
    const response = await databases.listDocuments(
      databaseId,
      highlightCollectionId,
      [
        Query.equal("articles", articleId),
      ],
    );

    // Filter documents based on user's permissions
    const filteredHighlights = response.documents

    console.log('hIghlights',filteredHighlights)
    return filteredHighlights;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}


export async function createHighlight(articleId, text,user) {
  console.log('User is ',user)
  try {
    const response = await databases.createDocument(
      databaseId,
      highlightCollectionId,
      ID.unique(),
      { text: text, articles: articleId },
      [
        Permission.read(Role.user(user)), 

        Permission.update(Role.user(user)), 
        Permission.delete(Role.user(user)), 
    ]
    );
    console.log("response created", response);
    return response;
  } catch (error) {
    console.error("Error creating highlight:", error);
    throw error; // Throw the error to indicate failure
  }
}

export async function deleteHighlight(highlightId) {
  try {
    const response = await databases.deleteDocument(
      databaseId,
      highlightCollectionId,
      highlightId
    );
    console.log("Highlight deleted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    throw error;
  }
}


export async function initiateSubscribe(email) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      NewsletterCollectionId,
      [
        Query.equal("email", email),
      ],
    );
    console.log('Got the Levels', response);
    if (response.documents && response.documents.length > 0) {
      return { message: "User already subscribed", subscription: response.documents ,color:'green' };
    } else {
      const subscription = await subscribeNewsletter(email);
      return { message: "Successfully subscribed", subscription ,color:'green'};
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { message: "Something went wrong", error,color:'red' };
  }
}


async function subscribeNewsletter(email) {
  try {
    const response = await databases.createDocument(
      databaseId,
      NewsletterCollectionId,
      ID.unique(),
      { email: email },
    );
    return response;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error; 
  }
}


// lib/context/article.js

export async function arrangeComments(articleId) {
  // Fetch comments for the article from your API or database
  const response = await fetch(`/api/comments?articleId=${articleId}`);
  const comments = await response.json();

  // Organize comments by parent-child relationships
  const commentMap = {};
  comments.forEach((comment) => {
    commentMap[comment.$id] = { ...comment, replies: [] };
  });

  const organizedComments = [];
  comments.forEach((comment) => {
    if (comment.parent) {
      commentMap[comment.parent].replies.push(commentMap[comment.$id]);
    } else {
      organizedComments.push(commentMap[comment.$id]);
    }
  });

  return organizedComments;
}
