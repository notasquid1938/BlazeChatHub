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
const key = "a2db4b9fff4da34b52fdad51b57493d0230df3f3e50022da2794b60cc6af2a15";

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const username = `Anonymous${Math.floor(Math.random() * 900000) + 100000}`;
let lastMessageTimestamp = 0;

const sendMessage = () => {
  const currentTimestamp = Date.now();
  if (currentTimestamp - lastMessageTimestamp < 2000) {
    return;
  }
  const timestamp = Date.now();
  const message = document.getElementById("chat-input").value;
  lastMessageTimestamp = currentTimestamp;
  //0.0014Mb max per encrypted message at 1000 characters
  //2500 messages a day if all 100 connected
  //can store 600,000 messages safely
  if (message.length > 1000 || message.length === 0) {
    return;
  }

  const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString();

  db.ref("messages/" + timestamp).set({
    username: username,
    message: encryptedMessage,
    timestamp: timestamp
  });

  document.getElementById("chat-input").value = "";
  document.getElementById("chat-input").dispatchEvent(new Event("input", {bubbles: true}));
  
  const messagesElement = document.getElementById("messages");
  const scrolledToBottom = Math.abs(messagesElement.scrollHeight - messagesElement.scrollTop - messagesElement.clientHeight) < 30;
  
  if (!scrolledToBottom) {
    document.getElementById("new-message").style.display = "block";
  } else {
    messagesElement.lastChild.scrollIntoView(true);
  }
};

document.getElementById("chat-input").addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    sendMessage();
  }
});

document.getElementById("chat-input").addEventListener("input", (event) => {
  const length = document.getElementById("chat-input").value.length;
  const remainingLength = 1000 - length;
  document.getElementById("chat-input-counter").innerText = remainingLength;
})

document.getElementById("chat-submit").addEventListener("click", sendMessage);

db.ref("messages/").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const decryptedMessage = CryptoJS.AES.decrypt(data.message, key).toString(CryptoJS.enc.Utf8);
  const containerElement = document.createElement("div");
  containerElement.className = "message";

  const sameUser = username !== undefined
    && username.trim() !== ""
    && username === data.username;

  if (sameUser) {
    containerElement.classList.add("sent");
  }

  const usernameElement = document.createElement("div");
  usernameElement.className = "message-username";

  function numberToColorHex(number) {
    var hex = number.toString(16);
    while (hex.length < 6) {
      hex = "0" + hex;
    }
    var foregroundColor = "#" + hex;
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    var backgroundColor = (yiq >= 128) ? "#000000" : "#ffffff";
    // Return an object containing both the foreground and background colors
    return {foreground: foregroundColor, background: backgroundColor};
  }    
  const usernumber = data.username.split("s");
  const colors = numberToColorHex(usernumber[1]);
  usernameElement.innerText = data.username;
  usernameElement.style.color = colors.foreground;
  usernameElement.style.backgroundColor = colors.background;

  const messageElement = document.createElement("div");
  messageElement.className = "message-content";
  messageElement.innerText = decryptedMessage;

  const timestampElement = document.createElement("div");
  timestampElement.className = "message-timestamp";
  timestampElement.innerText = (new Date(data.timestamp)).toLocaleString();

  containerElement.appendChild(usernameElement);
  containerElement.appendChild(messageElement);
  containerElement.appendChild(timestampElement);

  const scrollTop = document.getElementById("messages").scrollTop;
  const scrollHeight = document.getElementById("messages").scrollHeight;
  const clientHeight = document.getElementById("messages").clientHeight;
  const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 30;

  document.getElementById("messages").appendChild(containerElement);

  if (scrolledToBottom) {
    document.getElementById("messages").lastChild.scrollIntoView(true);
  }
});

let usersOnlineRef = firebase.database().ref(".info/connected");
let usersOnline = 10;

usersOnlineRef.on("value", (snapshot) => {
  if (snapshot.val()) {
    usersOnline++;
  } else {
    usersOnline--;
  }
  document.getElementById("users-online").innerText = usersOnline;
  console.log("Number of online users: " + usersOnline);
});