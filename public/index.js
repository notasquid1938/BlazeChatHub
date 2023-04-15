// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyALApqz2g23REjgMNumyyWKyjFUO811XWk",
  authDomain: "newtrieranon.firebaseapp.com",
  projectId: "newtrieranon",
  storageBucket: "newtrieranon.appspot.com",
  messagingSenderId: "123637161555",
  appId: "1:123637161555:web:fe874b142bbc253c6c70a6",
  measurementId: "G-RVP6621Z33"
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


