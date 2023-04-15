// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize database
const db = firebase.database();

// get user's data
const username = prompt("Enter Your Name and then press enter to join the New Trier Chatroom");

// submit form
// listen for submit event on the form and call the postChat function
document.getElementById("message-form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  if (message.length > 1000) {
    // max character limit
    alert("Your message is too long, please keep it under 1000 characters.")
    return;
  }

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
    timestamp: timestamp
  });
}

// display the messages
const fetchChat = db.ref("messages/");
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const messageContainer = document.createElement("div");
  const messageElement = document.createElement("span");
  const messageContent = document.createTextNode(`${messages.username}: ${messages.message}`);
  const timestampElement = document.createElement("span");
  const timestampContent = document.createTextNode(new Date(messages.timestamp).toLocaleString());
  messageElement.appendChild(messageContent);
  timestampElement.appendChild(timestampContent);
  messageContainer.appendChild(messageElement);
  messageContainer.appendChild(timestampElement);
  messageContainer.classList.add(username === messages.username ? "sent-container" : "receive-container");
  messageElement.classList.add(username === messages.username ? "sent" : "receive");
  timestampElement.classList.add(username === messages.username ? "sent-timestamp" : "receive-timestamp");
  // append the message and timestamp on the page
  document.getElementById("messages").appendChild(messageContainer);
});


