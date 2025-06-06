const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageInput");
let userName = "";

const bannedWords = ["fuck", "bhenchod", "idiot", "stupid", "maderchod", "madarchod", "mc", "bc", "bkl", "bsdk", "bhosdike", "chutiye", "chutiya", "gandu", "lund", "lauda", "racist", "rapist", "kutta", "kamina", "bhen ka launda"]; // Add more words as needed

function filterBadWords(text) {
  let filtered = text;
  bannedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi'); // match whole word, case-insensitive
    filtered = filtered.replace(regex, '****');
  });
  return filtered;
}

// On page load, check if userName is saved
window.onload = () => {
  const savedName = localStorage.getItem("chatUserName");
  if (savedName && savedName.trim() !== "") {
    userName = savedName;
    document.getElementById("namePopup").style.display = "none";
    enableChatInput();
  } else {
    // Show popup to enter name
    document.getElementById("namePopup").style.display = "flex";
  }

  // Delete old messages once on load
  deleteOldMessages();
};

// Save the entered name and hide popup, enable chat input
function saveUserName() {
  const input = document.getElementById("userNameInput").value.trim();
  if (input === "") {
    alert("Please enter your name");
    return;
  }

  userName = input;
  localStorage.setItem("chatUserName", userName);
  document.getElementById("namePopup").style.display = "none";

  enableChatInput();
}

// Enable chat input and focus
function enableChatInput() {
  messageInput.disabled = false;
  messageInput.nextElementSibling.disabled = false;
  messageInput.focus();
}

// Send a new message
function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;

  db.collection("messages").add({
    name: userName,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
}

// Format timestamp to HH:MM (24-hour)
function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
}

// Delete messages older than 24 hours on page load
function deleteOldMessages() {
  const cutoff = firebase.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  db.collection("messages")
    .where("timestamp", "<", cutoff)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .catch((error) => {
      console.error("Error deleting old messages:", error);
    });
}

// ------------------------
// CONTEXT MENU SETUP
// ------------------------

// Create context menu div and append it to body
const contextMenu = document.createElement("div");
contextMenu.id = "contextMenu";
contextMenu.style.position = "absolute";
contextMenu.style.background = "#1f2937"; // Tailwind gray-800
contextMenu.style.border = "1px solid #2563eb"; // Tailwind blue-600
contextMenu.style.borderRadius = "6px";
contextMenu.style.padding = "5px 0";
contextMenu.style.display = "none";
contextMenu.style.zIndex = "1000";
contextMenu.style.minWidth = "120px";
document.body.appendChild(contextMenu);

// Variables to store current message info
let currentMessageDocId = null;
let currentMessageText = "";
let currentMessageName = "";

// Helper to create menu item div with hover and click styles
function createMenuItem(text) {
  const item = document.createElement("div");
  item.textContent = text;
  item.style.padding = "8px 16px";
  item.style.cursor = "pointer";
  item.style.color = "#60a5fa"; // Tailwind blue-400
  item.addEventListener("mouseenter", () => item.style.background = "#2563eb");
  item.addEventListener("mouseleave", () => item.style.background = "transparent");
  return item;
}

// Function to show context menu with conditional Delete option
function showContextMenu(e, docId, text, name) {
  e.preventDefault();
  currentMessageDocId = docId;
  currentMessageText = text;
  currentMessageName = name;

  // Clear previous menu options
  contextMenu.innerHTML = "";

  // Always add Reply and Copy
  const replyOption = createMenuItem("Reply");
  const copyOption = createMenuItem("Copy");
  contextMenu.appendChild(replyOption);
  contextMenu.appendChild(copyOption);

  // Add Delete only if current user is sender
  if (userName === name) {
    const deleteOption = createMenuItem("Delete");
    contextMenu.appendChild(deleteOption);
  }

  // Position menu, but keep it inside viewport
  const clickX = e.pageX;
  const clickY = e.pageY;
  const menuWidth = 150;
  const menuHeight = contextMenu.childElementCount * 32;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let left = clickX;
  let top = clickY;

  if (clickX + menuWidth > windowWidth) {
    left = windowWidth - menuWidth - 10;
  }
  if (clickY + menuHeight > windowHeight) {
    top = windowHeight - menuHeight - 10;
  }

  contextMenu.style.left = left + "px";
  contextMenu.style.top = top + "px";
  contextMenu.style.display = "block";
}

// Hide context menu on clicking anywhere else
window.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

// Handle menu item clicks
contextMenu.addEventListener("click", (e) => {
  const action = e.target.textContent;

  if (!currentMessageDocId) {
    contextMenu.style.display = "none";
    return;
  }

  if (action === "Delete") {
    if (confirm("Are you sure you want to delete this message?")) {
      db.collection("messages").doc(currentMessageDocId).delete()
        .catch(err => alert("Failed to delete message: " + err.message));
    }
  } else if (action === "Copy") {
    navigator.clipboard.writeText(currentMessageText)
      .then(() => alert("Message copied to clipboard!"))
      .catch(() => alert("Failed to copy message."));
  } else if (action === "Reply") {
    messageInput.value = `@${currentMessageName} `;
    messageInput.focus();
  }

  contextMenu.style.display = "none";
});

// ------------------------
// LISTEN FOR NEW MESSAGES AND RENDER
// ------------------------

db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const timeStr = formatTime(msg.timestamp);
      const div = document.createElement("div");
      div.innerHTML = `<span class="text-gray-900 mr-2">${timeStr}</span><span class="font-semibold text-blue-600">${msg.name || "Anonymous"}:</span> ${msg.text}`;
      div.className = "bg-gray-200 p-2 rounded";

      // Add right click event listener on this message div
      div.addEventListener("contextmenu", (e) => {
        showContextMenu(e, doc.id, msg.text, msg.name || "Anonymous");
      });

      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
function sendMessage() {
  let text = messageInput.value.trim();
  if (text === "") return;

  text = filterBadWords(text); // Apply bad words filter

  db.collection("messages").add({
    name: userName,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = "";
}
