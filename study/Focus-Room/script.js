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
const roomId = "global-room";

let localStream;
let peers = {};
let userName = "";

const videoContainer = document.getElementById("videoContainer");

// Elements
const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");
const toggleVideo = document.getElementById("toggleVideo");
const disconnectBtn = document.getElementById("disconnectBtn");
const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendMsg = document.getElementById("sendMsg");
const messages = document.getElementById("messages");

const abuseWords = ["badword", "abuse"]; // Add more

// Ask name
joinBtn.onclick = async () => {
  userName = nameInput.value.trim();
  if (!userName) return;
  nameModal.classList.add("hidden");

  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  addVideoStream("Me", localStream);

  const peerRef = db.collection("rooms").doc(roomId).collection("peers").doc();
  const peerId = peerRef.id;

  peerRef.set({ name: userName, created: Date.now() });

  db.collection("rooms").doc(roomId).collection("peers")
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        const id = change.doc.id;
        if (id === peerId) return;

        if (change.type === "added" && !peers[id]) {
          const peer = new SimplePeer({ initiator: true, trickle: false, stream: localStream });

          peer.on("signal", data => {
            db.collection("rooms").doc(roomId).collection("peers").doc(peerId).collection("signals").add({
              to: id,
              from: peerId,
              data: JSON.stringify(data)
            });
          });

          peer.on("stream", stream => {
            addVideoStream(change.doc.data().name, stream);
          });

          db.collection("rooms").doc(roomId).collection("peers").doc(id).collection("signals")
            .where("to", "==", peerId)
            .onSnapshot(signalSnap => {
              signalSnap.forEach(sig => {
                peer.signal(JSON.parse(sig.data().data));
              });
            });

          peers[id] = peer;
        }
      });
    });

  // Remove self on leave
  window.addEventListener("beforeunload", () => {
    db.collection("rooms").doc(roomId).collection("peers").doc(peerId).delete();
  });
};

// Add video
function addVideoStream(name, stream) {
  const container = document.createElement("div");
  container.className = "rounded overflow-hidden bg-gray-800";

  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.className = "w-full aspect-video object-cover";

  const label = document.createElement("div");
  label.textContent = name;
  label.className = "text-center text-sm p-1 bg-gray-900";

  container.appendChild(video);
  container.appendChild(label);
  videoContainer.appendChild(container);
}

// Toggle video
toggleVideo.onclick = () => {
  localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
  toggleVideo.textContent = localStream.getVideoTracks()[0].enabled ? "Video Off" : "Video On";
};

// Disconnect
disconnectBtn.onclick = () => location.reload();

// Chat toggle
chatToggle.onclick = () => {
  chatBox.classList.toggle("hidden");
};

// Send message
sendMsg.onclick = async () => {
  const text = chatInput.value.trim();
  if (!text) return;

  const isAbusive = abuseWords.some(w => text.toLowerCase().includes(w));
  if (isAbusive) {
    alert("Abusive word detected!");
    return;
  }

  await db.collection("rooms").doc(roomId).collection("messages").add({
    name: userName,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  chatInput.value = "";
};

// Load chat
db.collection("rooms").doc(roomId).collection("messages")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
    messages.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      const time = msg.timestamp?.toDate().toLocaleTimeString() ?? "⏳";
      div.innerHTML = `<b>${msg.name}</b> <span class="text-gray-400 text-xs">${time}</span><br>${msg.text}`;
      div.className = "bg-gray-700 p-2 rounded";
      messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
  });