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

const ROOM = 'main-room';
const peers = {};
let localStream, userName;
const videoContainer = document.getElementById('videoContainer');

// 🔐 Prompt for name
userName = localStorage.getItem('name') || prompt('Enter your name:');
localStorage.setItem('name', userName);

// ✅ UI setup
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
  document.getElementById('messageInput').value += e.detail.unicode;
});

// 🔄 Listen chat
db.collection('chats')
  .orderBy('timestamp')
  .onSnapshot(snapshot => {
    const msgs = document.getElementById('messages');
    msgs.innerHTML = '';
    snapshot.forEach(doc => {
      const d = doc.data();
      const div = document.createElement('div');
      div.className = 'p-2 bg-gray-700 rounded';
      const t = new Date(d.timestamp?.toDate() || Date.now()).toLocaleTimeString();
      div.innerHTML = `<strong>${d.name}</strong>: ${filter(d.text)}<br><small>${t}</small>`;
      msgs.appendChild(div);
    });
    msgs.scrollTop = msgs.scrollHeight;
  });

function sendMessage() {
  const txt = document.getElementById('messageInput').value.trim();
  if (!txt) return;
  db.collection('chats').add({
    name: userName, text: txt, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  document.getElementById('messageInput').value = '';
}

function toggleChat() {
  document.getElementById('chatBox').classList.toggle('hidden');
}

function filter(s) {
  return s.replace(/\b(badword1|badword2|idiot)\b/gi, '****');
}

// 🎥 WebRTC
(async function() {
  localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
  addVideo(userName, localStream, true);

  const uid = userName + '_' + Date.now();
  const colUsers = db.collection('rooms').doc(ROOM).collection('users');
  const udoc = colUsers.doc(uid);
  await udoc.set({name:userName, ts:firebase.firestore.FieldValue.serverTimestamp()});
  window.addEventListener('beforeunload', () => udoc.delete());

  colUsers.onSnapshot(snap => {
    snap.docChanges().forEach(c => {
      const id = c.doc.id;
      const data = c.doc.data();
      if (id === uid) return;

      if (c.type === 'added') {
        if (!peers[id]) {
          createPeer(id, data.name, true);
          document.getElementById('joinSound').play();
        }
      }
      if (c.type === 'removed' && peers[id]) {
        if (peers[id].video) peers[id].video.remove();
        if (peers[id].div) peers[id].div.remove();
        if (peers[id].peer) peers[id].peer.destroy();
        delete peers[id];
        document.getElementById('leaveSound').play();
      }
    });
  });

  // Listen for signals
  db.collection('rooms').doc(ROOM).collection('signals')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();

          // Ignore signals sent by self
          if (data.from === uid) return;

          // Signal is either for us or a broadcast (toId=null)
          if (data.toId === uid || data.toId === null) {
            let peerObj = peers[data.from];
            if (peerObj) {
              peerObj.peer.signal(data.signal);
            } else {
              // If no peer, create one as non-initiator
              createPeer(data.from, data.name, false).then(() => {
                if (peers[data.from]) {
                  peers[data.from].peer.signal(data.signal);
                }
              });
            }
          }

          // Clean up processed signal
          change.doc.ref.delete();
        }
      });
    });
})();

async function createPeer(id, name, initiator) {
  const peer = new SimplePeer({initiator, trickle:false, stream:localStream});

  peer.on('signal', data => {
    db.collection('rooms').doc(ROOM).collection('signals').add({
      from: id === userName ? id : id, // id is peer id string
      toId: initiator ? null : id,
      name: userName,
      signal: data
    });
  });

  peer.on('stream', stream => addVideo(name, stream, false));

  peer.on('close', () => {
    if (peers[id]) {
      if (peers[id].video) peers[id].video.remove();
      if (peers[id].div) peers[id].div.remove();
      delete peers[id];
    }
  });

  peers[id] = {peer};
  return peers[id];
}

// 🖼 Video render
function addVideo(name, stream, isLocal) {
  // Check if video already exists for this user and remove
  if (peers[name]?.video) {
    peers[name].video.srcObject = stream;
    return;
  }

  const dv = document.createElement('div');
  const vid = document.createElement('video');
  vid.autoplay = true;
  vid.playsInline = true;
  vid.className = 'rounded-xl w-60 h-40 object-cover';
  if (isLocal) vid.muted = true;
  vid.srcObject = stream;

  const lbl = document.createElement('div');
  lbl.className = 'text-center text-sm mt-1';
  lbl.innerText = name;

  dv.append(vid, lbl);
  videoContainer.appendChild(dv);

  if (!isLocal) {
    peers[name].video = vid;
    peers[name].div = dv;
  }
}

// 🎬 Toggle video
function toggleVideo() {
  const t = localStream.getVideoTracks()[0];
  t.enabled = !t.enabled;
}

// ❌ Disconnect
function disconnect() {
  localStream.getTracks().forEach(t => t.stop());
  db.collection('rooms').doc(ROOM).collection('users')
    .where('name','==',userName).get()
    .then(q => q.forEach(d => d.ref.delete()))
    .finally(() => window.location.reload());
}
