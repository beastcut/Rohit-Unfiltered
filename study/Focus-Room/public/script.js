// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4Zj1Rm7tlR-kHrLB-Uha5TJHbzZbfeRc",
  authDomain: "videocall-3560d.firebaseapp.com",
  databaseURL: "https://videocall-3560d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "videocall-3560d",
  storageBucket: "videocall-3560d.firebasestorage.app",
  messagingSenderId: "292442129307",
  appId: "1:292442129307:web:d52494cfb431bb01fe173e"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const ROOM_ID = "mainRoom";
let localStream;
let isVideoOn = true;
let userName = "";

const peers = {};
const videosContainer = document.getElementById("videos");
const namePopup = document.getElementById("namePopup");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");

// Show popup
function askName() {
  namePopup.classList.add("show");
}
askName();

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter your name.");
  userName = name;
  localStorage.setItem("videoChatUserName", userName);
  namePopup.classList.remove("show");
  initVideoChat();
});

function initVideoChat() {
  const peer = new Peer();
  userName = localStorage.getItem("videoChatUserName") || "Anonymous";

  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
    localStream = stream;
    addVideoStream(peer.id, stream, userName);

    peer.on("call", call => {
      call.answer(stream);
      call.on("stream", remoteStream => {
        if (!peers[call.peer]) {
          addVideoStream(call.peer, remoteStream, "Loading...");
          peers[call.peer] = call;
        }
      });
    });

    peer.on("open", id => {
      const userRef = db.ref(`rooms/${ROOM_ID}/users/${id}`);
      userRef.set({ name: userName });
      userRef.onDisconnect().remove();

      db.ref(`rooms/${ROOM_ID}/users`).on("value", snapshot => {
        const users = snapshot.val() || {};
        Object.entries(users).forEach(([userId, user]) => {
          if (userId !== id && !peers[userId]) {
            const call = peer.call(userId, stream);
            call.on("stream", remoteStream => {
              addVideoStream(userId, remoteStream, user.name || "Anonymous");
            });
            peers[userId] = call;
          }
        });
      });
    });
  });
}

// Toggle video
document.getElementById("toggleVideo").addEventListener("click", () => {
  if (!localStream) return;
  isVideoOn = !isVideoOn;
  localStream.getVideoTracks()[0].enabled = isVideoOn;
  document.getElementById("toggleVideo").textContent = isVideoOn ? "Video Off" : "Video On";
});

// Add video stream to DOM
function addVideoStream(id, stream, name) {
  if (document.getElementById(`video-${id}`)) return;

  const videoWrapper = document.createElement("div");
  videoWrapper.className = "relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl w-72 h-48 ring-2 ring-blue-400";
  videoWrapper.id = `video-${id}`;

  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.className = "w-full h-full object-cover rounded-xl";

  const label = document.createElement("div");
  label.className = "absolute bottom-0 bg-gray-700 bg-opacity-70 text-white text-sm text-center w-full py-1 rounded-b-xl";
  label.textContent = name;

  videoWrapper.appendChild(video);
  videoWrapper.appendChild(label);
  videosContainer.appendChild(videoWrapper);
}
// Chat logic
const chatBox = document.getElementById("chatBox");
const chatToggle = document.getElementById("chatToggle");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

// Toggle chat box
chatToggle.addEventListener("click", () => {
  chatBox.classList.toggle("hidden");
});

// Send chat
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  const msgRef = db.ref(`rooms/${ROOM_ID}/chat`).push();
  msgRef.set({
    name: userName,
    message: text,
    timestamp: Date.now()
  });
  chatInput.value = "";
}

// Listen for chat messages
db.ref(`rooms/${ROOM_ID}/chat`).on("child_added", snapshot => {
  const { name, message } = snapshot.val();
  const msg = document.createElement("div");
  msg.innerHTML = `<strong class="text-yellow-400">${name}:</strong> <span>${message}</span>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
