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
let peer = new Peer();
let userName = localStorage.getItem("videoChatUserName") || prompt("Enter your name");
if (!userName) userName = "Anonymous";
localStorage.setItem("videoChatUserName", userName);

const peers = {};
const videosContainer = document.getElementById("videos");
const disconnectBtn = document.getElementById("disconnectBtn");

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

function addVideoStream(id, stream, name) {
  if (document.getElementById(`video-${id}`)) return;

  const videoWrapper = document.createElement("div");
  videoWrapper.className = "relative bg-gray-800 rounded-lg overflow-hidden shadow-lg w-72 h-48";
  videoWrapper.id = `video-${id}`;

  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.className = "w-full h-full object-cover";

  const label = document.createElement("div");
  label.className = "absolute bottom-0 bg-black bg-opacity-60 text-white text-sm text-center w-full py-1";
  label.textContent = name;

  videoWrapper.appendChild(video);
  videoWrapper.appendChild(label);
  videosContainer.appendChild(videoWrapper);
}

