const firebaseConfig = {
  apiKey: "AIzaSyAhIYskdZDrW2lfjGKnflGIbHNlTojoXho",
  authDomain: "videochat-1f348.firebaseapp.com",
  projectId: "videochat-1f348",
  storageBucket: "videochat-1f348.firebasestorage.app",
  messagingSenderId: "1054111027678",
  appId: "1:1054111027678:web:99f547f3fda3bc8d7c4d4f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ROOM_ID = "main-room";
let userName = localStorage.getItem("name") || prompt("Enter your name:");
localStorage.setItem("name", userName);
let localStream, videoEnabled = true;

// Join room
const roomRef = db.collection("room").doc(ROOM_ID);
const peers = {};
const videoContainer = document.getElementById("videoContainer");

async function init() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

  const myVideo = document.createElement("video");
  myVideo.autoplay = true;
  myVideo.muted = true;
  myVideo.className = "rounded-xl w-60 h-40 object-cover";
  myVideo.srcObject = localStream;

  const label = document.createElement("div");
  label.innerText = userName;
  label.className = "text-center text-sm mt-1";

  const wrapper = document.createElement("div");
  wrapper.appendChild(myVideo);
  wrapper.appendChild(label);
  wrapper.id = "myVideoWrapper";

  videoContainer.appendChild(wrapper);

  await roomRef.collection("peers").doc(userName).set({ name: userName, joined: Date.now() });

  // Auto-cleanup when tab closed
  window.addEventListener("beforeunload", () => {
    roomRef.collection("peers").doc(userName).delete();
  });

  // Listen for other peers
  roomRef.collection("peers").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const peerName = change.doc.id;
      if (peerName === userName) return;

      if (change.type === "added" && !peers[peerName]) {
        const video = document.createElement("video");
        video.autoplay = true;
        video.className = "rounded-xl w-60 h-40 object-cover";
        video.srcObject = new MediaStream(); // placeholder
        video.poster = "https://via.placeholder.com/150?text=" + peerName;

        const label = document.createElement("div");
        label.innerText = peerName;
        label.className = "text-center text-sm mt-1";

        const wrapper = document.createElement("div");
        wrapper.appendChild(video);
        wrapper.appendChild(label);
        wrapper.id = `peer-${peerName}`;

        videoContainer.appendChild(wrapper);
        peers[peerName] = wrapper;

        document.getElementById("joinSound").play();
      }

      if (change.type === "removed" && peers[peerName]) {
        document.getElementById(`peer-${peerName}`).remove();
        delete peers[peerName];
        document.getElementById("leaveSound").play();
      }
    });
  });

  // Chat listener
  db.collection("chats").orderBy("timestamp").onSnapshot(snapshot => {
    const messages = document.getElementById("messages");
    messages.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `<strong>${data.name}</strong>: ${filterBadWords(data.text)}<br/><small>${new Date(data.timestamp?.toDate()).toLocaleTimeString()}</small>`;
      div.className = "p-2 bg-gray-700 rounded";
      messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
  });

  // Emoji picker
  document.querySelector("emoji-picker").addEventListener("emoji-click", event => {
    document.getElementById("messageInput").value += event.detail.unicode;
  });
}

init();

// Chat Functions
function sendMessage() {
  const text = document.getElementById("messageInput").value.trim();
  if (!text) return;
  db.collection("chats").add({
    name: userName,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  document.getElementById("messageInput").value = "";
}

function toggleChat() {
  const chat = document.getElementById("chatBox");
  chat.classList.toggle("hidden");
}

// Video toggle
function toggleVideo() {
  videoEnabled = !videoEnabled;
  localStream.getVideoTracks()[0].enabled = videoEnabled;
}

// Disconnect
function disconnect() {
  localStream.getTracks().forEach(track => track.stop());
  roomRef.collection("peers").doc(userName).delete().then(() => {
    location.reload();
  });
}

// Abusive word filter
function filterBadWords(text) {
  const badWords = ["badword1", "badword2", "uglyword"]; // Add more
  let clean = text;
  badWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, '****');
  });
  return clean;
}