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

const ROOM_ID = "constantRoom";
const localVideo = document.createElement("video");
localVideo.autoplay = true;
localVideo.muted = true;
localVideo.className = "rounded-xl w-60 h-40 object-cover";
let localStream, name;
let peers = {};
const abusiveWords = ["badword", "abuse"]; // Add more

// Get DOM elements
const videoContainer = document.getElementById("videoContainer");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const chatBox = document.getElementById("chatBox");
const chatToggle = document.getElementById("chatToggle");
const emojiPicker = document.getElementById("emojiPicker");

chatToggle.onclick = () => chatBox.classList.toggle("hidden");
function openEmojiPicker() {
  emojiPicker.classList.toggle("hidden");
}
emojiPicker.addEventListener("emoji-click", e => {
  messageInput.value += e.detail.unicode;
  emojiPicker.classList.add("hidden");
});

// Clean message
function filterMessage(msg) {
  for (let word of abusiveWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    msg = msg.replace(regex, "*".repeat(word.length));
  }
  return msg;
}

// Chat System
function sendMessage() {
  const text = filterMessage(messageInput.value.trim());
  if (!text) return;
  db.collection("rooms").doc(ROOM_ID).collection("messages").add({
    name,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  messageInput.value = "";
}
db.collection("rooms").doc(ROOM_ID).collection("messages")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
    messages.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const time = msg.timestamp?.toDate().toLocaleTimeString() || "Now";
      const div = document.createElement("div");
      div.innerHTML = `<strong>${msg.name}</strong> <span class="text-xs text-gray-400">[${time}]</span><br>${msg.text}`;
      messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
  });

// Join Flow
async function joinCall() {
  name = document.getElementById("nameInput").value.trim();
  if (!name) return;
  document.getElementById("namePrompt").style.display = "none";

  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  localVideo.srcObject = localStream;
  videoContainer.appendChild(localVideo);

  const myDoc = db.collection("rooms").doc(ROOM_ID).collection("peers").doc(name);
  await myDoc.set({ joined: Date.now() });

  window.addEventListener("beforeunload", () => myDoc.delete());

  db.collection("rooms").doc(ROOM_ID).collection("peers")
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        const peerName = change.doc.id;
        if (peerName === name) return;

        if (change.type === "added" && !peers[peerName]) {
          const video = document.createElement("video");
          video.autoplay = true;
          video.className = "rounded-xl w-60 h-40 object-cover";
          video.dataset.name = peerName;
          videoContainer.appendChild(video);

          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          video.srcObject = stream;

          document.getElementById("joinSound").play();
          peers[peerName] = video;
        }

        if (change.type === "removed") {
          const video = videoContainer.querySelector(`[data-name="${peerName}"]`);
          if (video) video.remove();
          delete peers[peerName];
          document.getElementById("leaveSound").play();
        }
      });
    });
}

// Video toggle
let videoOn = true;
document.getElementById("toggleVideo").onclick = () => {
  videoOn = !videoOn;
  localStream.getVideoTracks()[0].enabled = videoOn;
  document.getElementById("toggleVideo").textContent = videoOn ? "Video Off" : "Video On";
};

// Disconnect
document.getElementById("disconnectBtn").onclick = () => {
  db.collection("rooms").doc(ROOM_ID).collection("peers").doc(name).delete().then(() => {
    window.location.reload();
  });
};
