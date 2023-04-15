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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const username = prompt("Enter username:");

document.getElementById("chat-submit").addEventListener("click", () => sendMessage());
document.getElementById("chat-input").addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const timestamp = Date.now();
  const message = document.getElementById("chat-input").value;

  if (message.length > 1000) {
    alert("Your message is too long, please keep it under 1000 characters.")
    return;
  }

  db.ref("messages/" + timestamp).set({
    username: username,
    message: message,
    timestamp: timestamp
  });

  document.getElementById("chat-input").value = "";
  document.getElementById("messages").scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest"
  });
}

db.ref("messages/").on("child_added", (snapshot) => {
  const data = snapshot.val();

  const containerElement = document.createElement("div");
  containerElement.classList.add("message");

  if (username === data.username) {
    containerElement.classList.add("sent");
  }

  const usernameElement = document.createElement("div");
  usernameElement.className = "message-username";
  usernameElement.innerText = data.username;

  const messageElement = document.createElement("div");
  messageElement.className = "message-content";
  messageElement.innerText = data.message;

  const timestampElement = document.createElement("div");
  timestampElement.className = "message-timestamp";
  timestampElement.innerText = (new Date(data.timestamp)).toLocaleString();

  containerElement.appendChild(usernameElement);
  containerElement.appendChild(messageElement);
  containerElement.appendChild(timestampElement);

  document.getElementById("messages").appendChild(containerElement);
});