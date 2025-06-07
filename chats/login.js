    const firebaseConfig = {
      apiKey: "AIzaSyAPhlmCS7t_NV7VqhRtOiFGp1QFhLzqMh4",
      authDomain: "chat-7b8fc.firebaseapp.com",
      projectId: "chat-7b8fc",
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const loginForm = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      errorMsg.textContent = "";
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "index.html";
      } catch (error) {
        errorMsg.textContent = error.message;
      }
    });
