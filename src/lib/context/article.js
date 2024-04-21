import { databases, ID } from "../appwrite";
import { Query } from "appwrite";
const collectionId = "65e837c03ab60c631376";
const databaseId = "65e834a1b7b3800eafe3";
const likeFunction = "65e994b0b1e2cb6c7bf5";
const CommentCollectionId = "65e9ba6eb44deadf0ac3";
const highlightCollectionId = "65e8c5f4910645b92ec5";
const NewsletterCollectionId = '661283290a261ea23278'

export async function getAllDocuments(last) {
  try {
    let query = [
      Query.orderDesc("$createdAt"),
      Query.select(["slug", "image", "title", "$id"]),
      Query.limit(25),
    ];

    // If last cursor is provided, add it to the query
    if (last) {
      query.push(Query.cursorAfter(last));
    }

    const response = await databases.listDocuments(databaseId, collectionId, query);
    
    let lastId = null;
    if (response.documents.length > 0) {
      lastId = response.documents[response.documents.length - 1].$id;
    }

    return { data: response.documents, lastId: lastId };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}


export async function getByFilter(filter) {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("catergory", filter),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getSearch(searchTerm) {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.search("title", searchTerm),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getAllFeatured() {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
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
      Query.orderDesc("$createdAt"),
      Query.select(["slug", "image", "title"]),
    ]);
    console.log('Related articles gottent')
    const shuffledArray  = shuffleArray(response.documents)
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
export async function createComment(articleId, name, message, date) {
  try {
    const response = await databases.createDocument(
      databaseId,
      CommentCollectionId,
      ID.unique(),
      { name: name, message: message, date: date, articles: articleId },
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

export async function getAllHighlights(articleId) {
  console.log("Article", articleId);
  try {
    const response = await databases.listDocuments(
      databaseId,
      highlightCollectionId,
      [
        Query.equal("articles", articleId),
        // Query.equal("userId", "65e8a5550a8f4889c31d"), // Assuming "userId" is the field storing user ID in highlight documents
      ],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function createHighlight(articleId, text) {
  try {
    const response = await databases.createDocument(
      databaseId,
      highlightCollectionId,
      ID.unique(),
      { text: text, articles: articleId },
    );
    console.log("response created", response);
    return response;
  } catch (error) {
    console.error("Error creating highlight:", error);
    throw error; // Throw the error to indicate failure
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
