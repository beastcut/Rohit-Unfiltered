  // Firebase config
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
  const auth = firebase.auth();

  // Elements
  const nameModal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const joinBtn = document.getElementById('joinBtn');
  const videos = document.getElementById('videos');
  const toggleVideoBtn = document.getElementById('toggleVideoBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const toggleChatBtn = document.getElementById('toggleChatBtn');
  const chatBox = document.getElementById('chatBox');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const joinSound = document.getElementById('joinSound');
const leaveSound = document.getElementById('leaveSound');


  const ROOM_ID = "default_room";

  let localStream = null;
  let peers = {};  // peerId => RTCPeerConnection
  let userId = null;
  let userName = null;

  // Store chat unsubscribe function
  let chatUnsubscribe = null;
  // Store user docs unsubscribe
  let usersUnsubscribe = null;
  // Store signals unsubscribe
  let signalsUnsubscribe = null;

  // Signaling collections
  const roomRef = db.collection('rooms').doc(ROOM_ID);
  const usersRef = roomRef.collection('users');
  const signalsRef = roomRef.collection('signals');
  
  // Ask user name and join
  joinBtn.onclick = async () => {
    const val = nameInput.value.trim();
    if (!val) return alert("Please enter your name");
    userName = val;
    nameModal.style.display = 'none';
    await start();
  };

  async function start() {
    // Get local video stream (video only)
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (e) {
      alert("Cannot get camera: " + e.message);
      return;
    }

    // Create own video element
    addVideoElement('local', localStream, userName + " (You)");

    // Add self to Firestore users collection
    userId = usersRef.doc().id;
    await usersRef.doc(userId).set({
      name: userName,
      joinedAt: Date.now(),
    });

    // Listen to users collection
    usersUnsubscribe = usersRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        const id = doc.id;
        if (id === userId) return; // Skip self

if (change.type === 'added') {
  createPeerConnection(id, doc.data().name, true);
  if (joinSound) joinSound.play().catch(() => {}); // Play join sound
}
else if (change.type === 'removed') {
  removeVideoElement(id);
  if (peers[id]) {
    peers[id].close();
    delete peers[id];
  }
  if (leaveSound) leaveSound.play().catch(() => {}); // Play leave sound
}

      });
    });

    // Listen to signals collection
    signalsUnsubscribe = signalsRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        const data = change.doc.data();
        if (!data) return;
        if (data.to !== userId) return; // Signal not for me
        const fromId = data.from;
        const type = data.type;
        const sdp = data.sdp;
        const candidate = data.candidate;

        if (type === 'offer') {
          // Incoming offer
          await handleOffer(fromId, sdp);
        } else if (type === 'answer') {
          // Incoming answer
          await handleAnswer(fromId, sdp);
        } else if (type === 'candidate') {
          // Incoming ICE candidate
          await handleCandidate(fromId, candidate);
        }

        // Delete signal doc after handling to keep db clean
        signalsRef.doc(change.doc.id).delete();
      });
    });

    // Listen for chat messages
    chatUnsubscribe = roomRef.collection('chat').orderBy('timestamp')
      .onSnapshot(snapshot => {
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

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    cleanup();
  }
});


    // Buttons
    toggleVideoBtn.onclick = toggleVideo;
    toggleChatBtn.onclick = () => {
      chatBox.classList.toggle('hidden');
    };
    chatForm.onsubmit = sendMessage;
  }

  // Add video element for user
function addVideoElement(id, stream, label) {
  if (document.getElementById('container-' + id)) return;

  // Create container div
  const container = document.createElement('div');
  container.id = 'container-' + id;
  container.className = 'flex flex-col items-center';

  // Create video element
  const video = document.createElement('video');
  video.id = 'video-' + id;
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.muted = (id === 'local'); // mute self
  video.className = 'rounded-md object-cover w-60 h-44 bg-black'; // 240x180 approx

  // Create label element
  const nameLabel = document.createElement('div');
  nameLabel.textContent = label || '';
  nameLabel.className = 'mt-1 text-center text-sm text-gray-300 select-none';

  container.appendChild(video);
  container.appendChild(nameLabel);
  videos.appendChild(container);
}



  // Remove video element by id
function removeVideoElement(id) {
  const container = document.getElementById('container-' + id);
  if (container) {
    const video = container.querySelector('video');
    if (video) video.srcObject = null;
    container.remove();
  }
}


  // Create new RTCPeerConnection and handle signaling
  async function createPeerConnection(peerId, peerName, isOfferer) {
    if (peers[peerId]) return;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Add local tracks
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.onicecandidate = event => {
      if (event.candidate) {
        sendSignal({
          type: 'candidate',
          candidate: event.candidate,
          from: userId,
          to: peerId
        });
      }
    };

    pc.ontrack = event => {
      const [stream] = event.streams;
      addVideoElement(peerId, stream, peerName);
    };

    peers[peerId] = pc;

    if (isOfferer) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal({
        type: 'offer',
        sdp: offer,
        from: userId,
        to: peerId
      });
    }
  }

  // Handle incoming offer
  async function handleOffer(fromId, sdp) {
    if (!peers[fromId]) {
      // Create peer connection as answerer
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.onicecandidate = event => {
        if (event.candidate) {
          sendSignal({
            type: 'candidate',
            candidate: event.candidate,
            from: userId,
            to: fromId
          });
        }
      };

      pc.ontrack = event => {
        const [stream] = event.streams;
        addVideoElement(fromId, stream);
      };

      peers[fromId] = pc;
    }

    await peers[fromId].setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peers[fromId].createAnswer();
    await peers[fromId].setLocalDescription(answer);
    sendSignal({
      type: 'answer',
      sdp: answer,
      from: userId,
      to: fromId
    });
  }

  // Handle incoming answer
  async function handleAnswer(fromId, sdp) {
    if (!peers[fromId]) return;
    await peers[fromId].setRemoteDescription(new RTCSessionDescription(sdp));
  }

  // Handle incoming ICE candidate
  async function handleCandidate(fromId, candidate) {
    if (!peers[fromId]) return;
    try {
      await peers[fromId].addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error("Error adding received ICE candidate", e);
    }
  }

  // Send signaling message to Firestore
  async function sendSignal(data) {
    await signalsRef.add(data);
  }

  // Toggle local video on/off
  function toggleVideo() {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    toggleVideoBtn.textContent = videoTrack.enabled ? "Video Off" : "Video On";
  }

  // Send chat message
  async function sendMessage(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    await roomRef.collection('chat').add({
      senderId: userId,
      senderName: userName,
      text,
      timestamp: Date.now()
    });
    chatInput.value = '';
  }

  // Clean up on disconnect
  async function cleanup() {
    // Remove own user doc
    if (userId) {
      await usersRef.doc(userId).delete().catch(() => {});
    }
    // Close all peer connections
    Object.values(peers).forEach(pc => pc.close());
    peers = {};

    // Stop local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }

    // Remove local video element
    removeVideoElement('local');

    // Unsubscribe from listeners
    if (usersUnsubscribe) usersUnsubscribe();
    if (signalsUnsubscribe) signalsUnsubscribe();
    if (chatUnsubscribe) chatUnsubscribe();

    // Show name modal again
    nameModal.style.display = 'flex';
  }