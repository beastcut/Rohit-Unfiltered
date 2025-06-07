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

    const uploadForm = document.getElementById("uploadForm");
    const imageInput = document.getElementById("imageInput");
    const captionInput = document.getElementById("captionInput");
    const statusMsg = document.getElementById("statusMsg");

    // Redirect to login if not logged in
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = "login.html";
      }
    });

    uploadForm.addEventListener("submit", async e => {
      e.preventDefault();
      statusMsg.textContent = "";

      const file = imageInput.files[0];
      if (!file) {
        statusMsg.textContent = "Please select an image file.";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        statusMsg.textContent = "Image size must be under 5MB.";
        return;
      }

      const caption = captionInput.value.trim();

      // Disable form during upload
      imageInput.disabled = true;
      captionInput.disabled = true;
      uploadForm.querySelector("button").disabled = true;
      statusMsg.textContent = "Uploading image...";

      try {
        // Upload to ImgBB
        const formData = new FormData();
        formData.append("image", await toBase64(file).then(b64 => b64.split(",")[1])); // base64 without prefix
        formData.append("key", "6f06b01143a03ba27c8eecc7ca20ac38");

        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!json.success) throw new Error("ImgBB upload failed");

        const imageUrl = json.data.url;

        // Save post to Firestore
        await db.collection("posts").add({
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName || auth.currentUser.email,
          caption,
          imageUrl,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          likesCount: 0,
          commentsCount: 0,
        });

        statusMsg.classList.remove("text-red-600");
        statusMsg.classList.add("text-green-600");
        statusMsg.textContent = "Post uploaded successfully! Redirecting...";

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);

      } catch (err) {
        statusMsg.classList.remove("text-green-600");
        statusMsg.classList.add("text-red-600");
        statusMsg.textContent = "Upload failed: " + err.message;
      } finally {
        imageInput.disabled = false;
        captionInput.disabled = false;
        uploadForm.querySelector("button").disabled = false;
      }
    });

    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

