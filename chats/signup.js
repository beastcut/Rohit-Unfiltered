   const firebaseConfig = {
      apiKey: "AIzaSyAPhlmCS7t_NV7VqhRtOiFGp1QFhLzqMh4",
      authDomain: "chat-7b8fc.firebaseapp.com",
      projectId: "chat-7b8fc",
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const signupForm = document.getElementById("signupForm");
    const errorMsg = document.getElementById("errorMsg");

    signupForm.addEventListener("submit", async e => {
      e.preventDefault();
      errorMsg.textContent = "";
      const displayName = document.getElementById("displayName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!displayName) {
        errorMsg.textContent = "Please enter your full name.";
        return;
      }

      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName });
        window.location.href = "index.html";
      } catch (error) {
        errorMsg.textContent = error.message;
      }
    });
