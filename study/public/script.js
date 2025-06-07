const firebaseConfig = {
  apiKey: "AIzaSyBbSZ1cFjCU4gbE8vktUdjc5vuevkD07S4",
  authDomain: "videochat-80e75.firebaseapp.com",
  projectId: "videochat-80e75",
  storageBucket: "videochat-80e75.firebasestorage.app",
  messagingSenderId: "375111220632",
  appId: "1:375111220632:web:d71f495f6d4246aeb63fed"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const peer = new Peer();
const videoGrid = document.getElementById("video-grid");
const chatSidebar = document.getElementById("chatSidebar");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const timerEl = document.getElementById("timer");
const joinSound = document.getElementById("joinSound");
const leaveSound = document.getElementById("leaveSound");

let localStream;
let currentCall;
let username = localStorage.getItem("username") || "";
let startTime;

function startApp() {
  const input = document.getElementById("usernameInput");
  username = input.value.trim();
  if (!username) return;
  localStorage.setItem("username", username);
  document.getElementById("overlay").style.display = "none";
  initialize();
}

async function initialize() {
  startTime = Date.now();
  updateTimer();
  setInterval(updateTimer, 1000);

  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  const myVideo = createVideoElement(peer.id, localStream, username);
  videoGrid.appendChild(myVideo.container);

  peer.on("open", (id) => {
    db.collection("calls").doc("room").collection("peers").doc(id).set({ username, joined: firebase.firestore.FieldValue.serverTimestamp() });
  });

  peer.on("call", (call) => {
    call.answer(localStream);
    call.on("stream", (remoteStream) => {
      if (!document.getElementById(call.peer)) {
        const vid = createVideoElement(call.peer, remoteStream);
        videoGrid.appendChild(vid.container);
        joinSound.play();
      }
    });
    call.on("close", () => {
      removePeer(call.peer);
      leaveSound.play();
    });
  });

  db.collection("calls").doc("room").collection("peers").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const peerId = change.doc.id;
      const data = change.doc.data();
      if (peerId !== peer.id && change.type === "added") {
        const call = peer.call(peerId, localStream);
        call.on("stream", (remoteStream) => {
          if (!document.getElementById(call.peer)) {
            const vid = createVideoElement(call.peer, remoteStream, data.username);
            videoGrid.appendChild(vid.container);
            joinSound.play();
          }
        });
        call.on("close", () => {
          removePeer(call.peer);
          leaveSound.play();
        });
      }
    });
  });

  window.addEventListener("beforeunload", disconnectCall);
}

function createVideoElement(id, stream, name = "") {
  const container = document.createElement("div");
  container.className = "relative";

  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.className = "rounded-xl max-w-[300px] max-h-[200px] cursor-pointer";
  video.id = id;

  const label = document.createElement("div");
  label.textContent = name;
  label.className = "text-center mt-2 text-sm text-white";

  video.addEventListener("click", () => {
    video.classList.toggle("w-full");
    video.classList.toggle("h-full");
    video.classList.toggle("z-50");
  });

  container.appendChild(video);
  container.appendChild(label);
  return { video, container };
}

function removePeer(id) {
  const vid = document.getElementById(id);
  if (vid && vid.parentElement) {
    vid.parentElement.remove();
  }
}

function toggleVideo() {
  const enabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !enabled;
}

function disconnectCall() {
  if (peer.id) {
    db.collection("calls").doc("room").collection("peers").doc(peer.id).delete();
  }
  peer.destroy();
  window.location.reload();
}

function toggleChat() {
  chatSidebar.classList.toggle("translate-x-full");
}

function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  const timestamp = new Date().toLocaleTimeString();
  const messageEl = document.createElement("div");
  messageEl.innerHTML = `<strong>${username}</strong> <span class='text-xs text-gray-400'>[${timestamp}]</span><br>${msg}`;
  chatMessages.appendChild(messageEl);
  chatInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateTimer() {
  const now = Date.now();
  const diff = Math.floor((now - startTime) / 1000);
  timerEl.textContent = `Connected: ${diff}s`;
}