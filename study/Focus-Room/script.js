const firebaseConfig = {
  apiKey: "AIzaSyAPhlmCS7t_NV7VqhRtOiFGp1QFhLzqMh4",
  authDomain: "chat-7b8fc.firebaseapp.com",
  databaseURL: "https://chat-7b8fc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-7b8fc",
  storageBucket: "chat-7b8fc.firebasestorage.app",
  messagingSenderId: "604456029175",
  appId: "1:604456029175:web:f61e014fe2113671a7bcf2"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const videos = document.getElementById('videos');
const toggleVideoBtn = document.getElementById('toggleVideoBtn');
const toggleChatBtn = document.getElementById('toggleChatBtn');
const chatBox = document.getElementById('chatBox');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

const ROOM_ID = "default_room";
let localStream = null;
let peers = {};
let peerNames = {};
let userId = null;
let userName = null;

const roomRef = db.collection('rooms').doc(ROOM_ID);
const usersRef = roomRef.collection('users');
const signalsRef = roomRef.collection('signals');

joinBtn.onclick = async () => {
  const val = nameInput.value.trim();
  if (!val) return alert("Please enter your name");
  userName = val;
  nameModal.style.display = 'none';
  await start();
};

async function start() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // mic removed
  } catch (e) {
    alert("Cannot access camera: " + e.message);
    return;
  }

  addVideoElement('local', localStream, userName + " (You)");
  userId = usersRef.doc().id;
  await usersRef.doc(userId).set({ name: userName, joinedAt: Date.now() });

  usersRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const doc = change.doc;
      const id = doc.id;
      if (id === userId) return;
      peerNames[id] = doc.data().name;
      if (change.type === 'added') createPeerConnection(id, peerNames[id], true);
      else if (change.type === 'removed') {
        removeVideoElement(id);
        if (peers[id]) { peers[id].close(); delete peers[id]; }
      }
    });
  });

  signalsRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      const data = change.doc.data();
      if (!data || data.to !== userId) return;
      const fromId = data.from;
      if (data.type === 'offer') await handleOffer(fromId, data.sdp);
      else if (data.type === 'answer') await handleAnswer(fromId, data.sdp);
      else if (data.type === 'candidate') await handleCandidate(fromId, data.candidate);
      signalsRef.doc(change.doc.id).delete();
    });
  });

  roomRef.collection('chat').orderBy('timestamp').onSnapshot(snapshot => {
    chatMessages.innerHTML = "";
    snapshot.docs.forEach(doc => {
      const msg = doc.data();
      const el = document.createElement('div');
      el.className = 'p-1 rounded ' + (msg.senderId === userId ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start');
      el.textContent = `${msg.senderName}: ${msg.text}`;
      chatMessages.appendChild(el);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  toggleVideoBtn.onclick = toggleVideo;
  toggleChatBtn.onclick = () => chatBox.classList.toggle('hidden');
  chatForm.onsubmit = sendMessage;
  window.onbeforeunload = cleanup;
}

function addVideoElement(id, stream, label) {
  if (document.getElementById('container-' + id)) return;
  const container = document.createElement('div');
  container.id = 'container-' + id;
  container.className = 'flex flex-col items-center';
  const video = document.createElement('video');
  video.id = 'video-' + id;
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.muted = (id === 'local');
  const nameLabel = document.createElement('div');
  nameLabel.textContent = label;
  nameLabel.className = 'mt-1 text-center text-sm text-gray-300';
  container.appendChild(video);
  container.appendChild(nameLabel);
  videos.appendChild(container);
}

function removeVideoElement(id) {
  const container = document.getElementById('container-' + id);
  if (container) container.remove();
}

async function createPeerConnection(peerId, peerName, isOfferer) {
  if (peers[peerId]) return;
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onicecandidate = e => {
    if (e.candidate) sendSignal({ type: 'candidate', candidate: e.candidate, from: userId, to: peerId });
  };

  pc.ontrack = e => {
    const [stream] = e.streams;
    addVideoElement(peerId, stream, peerName);
  };

  peers[peerId] = pc;

  if (isOfferer) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({ type: 'offer', sdp: offer, from: userId, to: peerId });
  }
}

async function handleOffer(fromId, sdp) {
  await createPeerConnection(fromId, peerNames[fromId] || "Peer", false);
  await peers[fromId].setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await peers[fromId].createAnswer();
  await peers[fromId].setLocalDescription(answer);
  sendSignal({ type: 'answer', sdp: answer, from: userId, to: fromId });
}

async function handleAnswer(fromId, sdp) {
  if (peers[fromId]) await peers[fromId].setRemoteDescription(new RTCSessionDescription(sdp));
}

async function handleCandidate(fromId, candidate) {
  if (peers[fromId]) await peers[fromId].addIceCandidate(new RTCIceCandidate(candidate));
}

function toggleVideo() {
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    toggleVideoBtn.textContent = videoTrack.enabled ? "Video Off" : "Video On";
  }
}

async function sendMessage(e) {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (text) {
    await roomRef.collection('chat').add({ senderId: userId, senderName: userName, text, timestamp: Date.now() });
    chatInput.value = '';
  }
}

async function cleanup() {
  if (userId) await usersRef.doc(userId).delete().catch(() => {});
  Object.values(peers).forEach(pc => pc.close());
  peers = {};
  if (localStream) localStream.getTracks().forEach(track => track.stop());
  removeVideoElement('local');
  nameModal.style.display = 'flex';
}

function sendSignal(data) {
  signalsRef.add(data);
}