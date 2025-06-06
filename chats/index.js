     const firebaseConfig = {
      apiKey: "AIzaSyAPhlmCS7t_NV7VqhRtOiFGp1QFhLzqMh4",
      authDomain: "chat-7b8fc.firebaseapp.com",
      projectId: "chat-7b8fc",
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => auth.signOut());

    const postsContainer = document.getElementById("postsContainer");

    // Admin emails (hardcoded here, better to store in secure backend)
    const adminEmails = ["workwithrohitunfiltered@gmail.com","satyampatel.net@gmail.com"];

    let currentUser = null;

    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = "login.html";
        return;
      }
      currentUser = user;
      loadPosts();
    });

    async function loadPosts() {
      postsContainer.innerHTML = "<p class='text-center text-gray-500'>Loading posts...</p>";

      const postsSnapshot = await db.collection("posts").orderBy("timestamp", "desc").get();

      if (postsSnapshot.empty) {
        postsContainer.innerHTML = "<p class='text-center text-gray-500'>No posts yet.</p>";
        return;
      }

      postsContainer.innerHTML = "";

      postsSnapshot.forEach(doc => {
        const post = doc.data();
        const postId = doc.id;

        const postDiv = document.createElement("div");
        postDiv.className = "bg-white rounded-xl shadow-md p-4 flex flex-col";

        postDiv.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <p class="font-semibold text-indigo-600">${post.userName || "Anonymous"}</p>
            <p class="text-xs text-gray-400">${post.timestamp?.toDate().toLocaleString() || ""}</p>
          </div>
          <img src="${post.imageUrl}" alt="Post Image" class="rounded-lg max-h-96 object-cover mb-3" />
          <p class="mb-3">${escapeHtml(post.caption)}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button class="like-btn flex items-center gap-1 text-indigo-600 hover:text-indigo-800 focus:outline-none" data-postid="${postId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span class="likes-count">${post.likesCount || 0}</span>
              </button>
              <button class="comment-btn text-indigo-600 hover:text-indigo-800 focus:outline-none" data-postid="${postId}">
                💬 <span class="comments-count">${post.commentsCount || 0}</span>
              </button>
            </div>
            ${adminEmails.includes(currentUser.email) ? `<button class="delete-btn text-red-600 hover:text-red-800 focus:outline-none" data-postid="${postId}">Delete</button>` : ""}
          </div>
        `;

        postsContainer.appendChild(postDiv);
      });

      attachPostEvents();
    }

    // Sanitize text to prevent XSS
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Like logic: user can like once, tracked in subcollection "likes"
    function attachPostEvents() {
      const likeButtons = document.querySelectorAll(".like-btn");
      const commentButtons = document.querySelectorAll(".comment-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");

      likeButtons.forEach(button => {
        const postId = button.dataset.postid;
        const likesCountSpan = button.querySelector(".likes-count");

        // Check if current user already liked this post
        db.collection("posts").doc(postId).collection("likes").doc(currentUser.uid).get()
          .then(docSnap => {
            if (docSnap.exists) {
              button.classList.add("text-indigo-900");
            }
          });

        button.onclick = async () => {
          const likeDocRef = db.collection("posts").doc(postId).collection("likes").doc(currentUser.uid);
          const likeDoc = await likeDocRef.get();

          if (likeDoc.exists) {
            alert("You already liked this post.");
            return;
          }

          await likeDocRef.set({ likedAt: firebase.firestore.FieldValue.serverTimestamp() });
          await db.collection("posts").doc(postId).update({
            likesCount: firebase.firestore.FieldValue.increment(1)
          });

          // Update UI
          likesCountSpan.textContent = (parseInt(likesCountSpan.textContent) + 1);
          button.classList.add("text-indigo-900");
        };
      });

      commentButtons.forEach(button => {
        button.onclick = () => openCommentsModal(button.dataset.postid);
      });

      deleteButtons.forEach(button => {
        button.onclick = async () => {
          if (!confirm("Are you sure you want to delete this post?")) return;
          await db.collection("posts").doc(button.dataset.postid).delete();
          loadPosts();
        };
      });
    }

    // Comments modal with live updates
    function openCommentsModal(postId) {
      const modalOverlay = document.createElement("div");
      modalOverlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

      const modal = document.createElement("div");
      modal.className = "bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto p-4 flex flex-col";

      const header = document.createElement("h2");
      header.textContent = "Comments";
      header.className = "text-xl font-bold mb-4";

      const commentsContainer = document.createElement("div");
      commentsContainer.className = "flex-grow overflow-auto space-y-3 mb-4";

      const commentForm = document.createElement("form");
      commentForm.className = "flex gap-2";

      const commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.placeholder = "Write a comment...";
      commentInput.required = true;
      commentInput.className = "flex-grow border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.textContent = "Post";
      submitBtn.className = "bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 transition";

      commentForm.appendChild(commentInput);
      commentForm.appendChild(submitBtn);

      modal.appendChild(header);
      modal.appendChild(commentsContainer);
      modal.appendChild(commentForm);
      modalOverlay.appendChild(modal);
      document.body.appendChild(modalOverlay);

      // Load comments live
      const commentsRef = db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "asc");
      let unsubscribe = commentsRef.onSnapshot(snapshot => {
        commentsContainer.innerHTML = "";
        snapshot.forEach(doc => {
          const c = doc.data();
          const cDiv = document.createElement("div");
          cDiv.className = "border p-2 rounded-md bg-gray-50";
          cDiv.innerHTML = `<p class="font-semibold">${c.userName || "Anonymous"}</p><p>${escapeHtml(c.text)}</p><p class="text-xs text-gray-400">${c.timestamp?.toDate().toLocaleString() || ""}</p>`;
          commentsContainer.appendChild(cDiv);
        });
      });

      commentForm.onsubmit = async (e) => {
        e.preventDefault();
        const text = commentInput.value.trim();
        if (!text) return;
        commentInput.disabled = true;
        submitBtn.disabled = true;

        try {
          await db.collection("posts").doc(postId).collection("comments").add({
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email,
            text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

          // Increment comment count on post
          const postRef = db.collection("posts").doc(postId);
          await postRef.update({
            commentsCount: firebase.firestore.FieldValue.increment(1)
          });

          commentInput.value = "";
        } catch (err) {
          alert("Failed to post comment: " + err.message);
        } finally {
          commentInput.disabled = false;
          submitBtn.disabled = false;
        }
      };

      // Close modal on outside click
      modalOverlay.addEventListener("click", e => {
        if (e.target === modalOverlay) {
          unsubscribe();
          document.body.removeChild(modalOverlay);
        }
      });
    }
