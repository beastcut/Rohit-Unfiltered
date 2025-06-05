function navigate(page) {
  const content = document.getElementById("content");

  
    if (page === "home") {
  content.innerHTML = `
    <div class="bg-gradient-to-r from-blue-400 to-blue-600 py-6 px-4 text-center rounded-xl">
      <img src="images/banner.jpg" alt="Banner" class="w-full max-h-60 object-cover rounded-xl" />
      <div class="flex justify-center mt-4">
        <img src="images/profile.jpg" alt="Profile" class="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
      </div>
      <h1 class="text-3xl font-bold text-white mt-2">Rohit's Life Unfiltered</h1>
      <p class="text-white">Raw & Real Fun • Study Motivation • Personal Growth</p>
    </div>

    <div class="my-10 space-y-10">
      <section>
        <h2 class="text-2xl font-semibold mb-4">🎬 Latest Videos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/tjLspQL7aO0" title="Latest Video 1" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/ndGwM6KD2Y8" title="Latest Video 2" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/k75vruVHlgw" title="Latest Video 3" frameborder="0" allowfullscreen></iframe>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">🔥 Popular Videos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/-ihIEsobPyk" title="Popular Video 1" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/-caM0v_ITVs" title="Popular Video 2" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/tMOCvC0gbHk" title="Popular Video 3" frameborder="0" allowfullscreen></iframe>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">⚡ Shorts</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/T1QGbUxSwp0" title="Shorts 1" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/QCkZC_zFLBE" title="Shorts 2" frameborder="0" allowfullscreen></iframe>
          <iframe class="w-full h-48 rounded-lg" src="https://www.youtube.com/embed/TpqqTJhG4SU" title="Shorts 3" frameborder="0" allowfullscreen></iframe>
        </div>
      </section>
    </div>
  `;
}

else if (page === "resources") {
  content.innerHTML = `
    

 <h1 class="text-3xl font-bold mb-6 text-center">📚 Study Resources</h1>
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <a href="#" onclick="navigate('class11') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">Class - 11th</h3> </button>
        </a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">Class - 12th</h3> </button>
        </a>
      </div>
    </div>

    <h1 class="text-3xl font-bold mb-6 text-center " style="margin-top: 5%;">📚 Study Schedules</h1>
    <div class="flex justify-center">
      <img id="scheduleImg" src="images/212.png" alt="Study Schedule draggable="false"" 
           class="max-w-sm rounded-lg cursor-pointer shadow-lg hover:shadow-2xl transition transform hover:scale-105" />
    </div>

    <!-- Modal -->
    <div id="modal" 
         class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 z-50">
      <div class="relative bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto transform scale-90 transition-transform duration-300">
        <button id="closeModal" 
                class="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold focus:outline-none">&times;</button>
        <img src="images/SHEDULE.gif" alt="Study Schedule Large draggable="false"" 
             class="max-w-full max-h-[80vh] rounded" />
      </div>
    </div>

  `;
const scheduleImg = document.getElementById("scheduleImg");
  const modal = document.getElementById("modal");
  const modalContent = modal.querySelector("div");
  const closeModal = document.getElementById("closeModal");

  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100");
    modalContent.classList.remove("scale-90");
    modalContent.classList.add("scale-100");
  }

  function closeModalFunc() {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
    modalContent.classList.remove("scale-100");
    modalContent.classList.add("scale-90");
    // Wait for animation to finish before disabling pointer events
    setTimeout(() => {
      modal.classList.add("pointer-events-none");
    }, 300);
  }

  scheduleImg.onclick = openModal;
  closeModal.onclick = closeModalFunc;

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModalFunc();
    }
  };

  // Close modal on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("pointer-events-none")) {
      closeModalFunc();
    }
  });
}
else if (page === "store") {
    content.innerHTML = `
      <h1 class="text-3xl font-bold mb-6 text-center">STORE</h1>
      <p class="text-center text-gray-600 mb-4">Creating</p>
      <p class="text-center text-gray-400">wait</p>
    `;
  }
else if (page === "posts") {
    content.innerHTML = `
      <h1 class="text-3xl font-bold mb-6 text-center">📸 Community Posts</h1>
      <p class="text-center text-gray-600 mb-4">Updates, thoughts, mini-blogs and photos from Rohit.</p>
      <p class="text-center text-gray-400">No posts yet. Stay tuned!</p>
    `;
  } else if (page === "premium") {
    content.innerHTML = `
      <h1 class="text-3xl font-bold text-center mb-4">💰 Premium Mentorship</h1>
      <p class="text-center text-gray-700 max-w-xl mx-auto mb-6">
        Want to learn how to earn money online by mastering freelancing and content creation? Book a 1-on-1 session with Rohit for just ₹99!
      </p>
      <div class="flex justify-center">
        <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded">Book Now for ₹99</button>
      </div>
      <p class="text-center text-sm text-gray-500 mt-4">(Payment gateway integration coming soon)</p>
    `;
  }




else if (page === "class12") {
  content.innerHTML = `

 <h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">⚛ PHYSICS (notes)</h3> </button>
        </a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">🧪 CHEMISTRY (notes)</h3> </button>
        </a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">🧠 MATHS (notes)</h3> </button>
        </a>
      </div>
    </div>
</div>

  `;
}



else if (page === "class11") {
  content.innerHTML = `

 <h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">⚛ PHYSICS (notes)</h3> </button>
        </a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">🧪 CHEMISTRY (notes)</h3> </button>
        </a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <a href="#" onclick="navigate('class12') " download class="text-black-600 ">
       <button> <h3 class="font-semibold mb-2">🧠 MATHS (notes)</h3> </button>
        </a>
      </div>
    </div>
</div>

  `;
}














}






// Load homepage by default
window.onload = () => navigate("home");
