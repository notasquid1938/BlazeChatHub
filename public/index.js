const firebaseConfig = {
  apiKey: "AIzaSyBHWq-XEkd83bo2AEhhcioyM7gTZuwQRPs",
  authDomain: "blazechathub.firebaseapp.com",
  databaseURL: "https://blazechathub-default-rtdb.firebaseio.com",
  projectId: "blazechathub",
  storageBucket: "blazechathub.appspot.com",
  messagingSenderId: "227346961795",
  appId: "1:227346961795:web:1c9b117adf212bb63dd2b6",
  measurementId: "G-J3PVVPX2BG"
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
    return;
  }

  db.ref("messages/" + timestamp).set({
    username: username,
    message: message,
    timestamp: timestamp
  });

  document.getElementById("chat-input").value = "";
  document.getElementById("messages").lastChild.scrollIntoView(true);
}

db.ref("messages/").on("child_added", (snapshot) => {
  const data = snapshot.val();

  const containerElement = document.createElement("div");
  containerElement.className = "message";

  if (username === data.username) {
    containerElement.classList.add("sent");
  }

  const usernameElement = document.createElement("div");
  usernameElement.className = "message-username";

  if (data.username.trim() === "") {
    usernameElement.innerText = "[anonymous]";
    usernameElement.classList.add("blank");
  } else {
    usernameElement.innerText = data.username;
  }

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