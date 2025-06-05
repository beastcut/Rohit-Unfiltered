let currentPage = "home";
let historyStack = [];
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);


localStorage.setItem("visitedPosts", JSON.stringify(["post1", "post2"]));

function navigate(page) {
  const content = document.getElementById("content");
  const loader = document.getElementById("loader");

  if (page !== currentPage) {
    historyStack.push(currentPage);
  }

  currentPage = page;

  // Show loader
  loader.classList.remove("hidden");
  content.classList.add("opacity-0");

  setTimeout(() => {
    // Load content
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
         <button onclick="navigate('class11') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">1️⃣ Class-11th</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
         <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">2️⃣ Class-12th</h3> 
        </button>
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
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">⚛ PHYSICS (notes)</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">🧪 CHEMISTRY (notes)</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">🧠 MATHS (notes)</h3> 
        </button>
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
        <button onclick="navigate('phy11') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">⚛ PHYSICS (notes)</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('chem11') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">🧪 CHEMISTRY (notes)</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('math11') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">🧠 MATHS (notes)</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}

else if (page === "phy11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Chapters</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('notes') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-1 : Units and Measurements</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-2 : Mathematical Tools</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-3 : Motion in a Straight Line</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-4 : Motion in a Plane</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-5 : Laws of Motion</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-6 : Circular Motion</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-7 : Work, Energy and Power</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-08 : Centre of Mass & Sys...</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-09 : Rotational Motion</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-10 : Mechanical Properties of Fluids</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch-11 : Gravitation</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 12 : Mechanical Properties of Solids</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 13 : Thermal Properties...</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 14 : KTG & Thermodynamics</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 15 : Oscillations</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 16 : Waves</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">Ch - 17 : Instruments</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}else if (page === "chem11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">⚗️ PHYSICAL CHEMISTRY</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">⚗️ INORGANIC CHEMISTRY</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">⚗️ ORGANIC CHEMISTRY</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}
else if (page === "chem11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-1</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-2</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-3</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-4</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-5</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-6</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-7</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-8</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-9</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-10</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-11</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-12</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-13</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-14</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-15</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-16</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-17</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}else if (page === "chem11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-1</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-2</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-3</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-4</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-5</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-6</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-7</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-8</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-9</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-10</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-11</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-12</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-13</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-14</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-15</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-16</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-17</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}else if (page === "chem11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-1</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-2</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-3</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-4</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-5</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-6</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-7</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-8</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-9</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-10</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-11</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-12</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-13</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-14</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-15</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-16</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-17</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}
else if (page === "math11") {
  content.innerHTML = `

<h1 class="text-3xl font-bold mb-6 text-left">📖 Subjects</h1>
 <p class="text-center text-gray-400" style="text-align: left;">Select your subjects & start learning</p>
 <div class="subject">
   <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-1</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-2</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-3</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-4</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-5</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-6</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-7</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-8</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-9</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-10</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-11</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-12</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-13</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-14</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-15</h3> 
        </button>
      </div>
       <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-16</h3> 
        </button>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <button onclick="navigate('class12') "class="text-black-600 ">
       <h3 class="font-semibold mb-2">CH-17</h3> 
        </button>
      </div>
    </div>
</div>
  `;
}




else if (page === "notesp111") {
  content.innerHTML = `
    <h1 class="text-3xl font-bold mb-6 text-center">📚 Study Resources</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 1</h3>
        <a href="pdfs/short-notes-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 2</h3>
        <a href="pdfs/short-notes-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 3</h3>
        <a href="pdfs/short-notes-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Weekly</h3>
        <a href="pdfs/study-schedule-weekly.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Daily</h3>
        <a href="pdfs/study-schedule-daily.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Strategy Guide</h3>
        <a href="pdfs/study-strategy-guide.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <!-- Add 3 more if you want to fill 3x3 grid -->
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 1</h3>
        <a href="pdfs/extra-resource-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 2</h3>
        <a href="pdfs/extra-resource-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 3</h3>
        <a href="pdfs/extra-resource-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
    </div>
  `;
}

else if (page === "notesp112") {
  content.innerHTML = `
    <h1 class="text-3xl font-bold mb-6 text-center">📚 Study Resources</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 1</h3>
        <a href="pdfs/short-notes-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 2</h3>
        <a href="pdfs/short-notes-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 3</h3>
        <a href="pdfs/short-notes-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Weekly</h3>
        <a href="pdfs/study-schedule-weekly.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Daily</h3>
        <a href="pdfs/study-schedule-daily.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Strategy Guide</h3>
        <a href="pdfs/study-strategy-guide.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <!-- Add 3 more if you want to fill 3x3 grid -->
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 1</h3>
        <a href="pdfs/extra-resource-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 2</h3>
        <a href="pdfs/extra-resource-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 3</h3>
        <a href="pdfs/extra-resource-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
    </div>
  `;
}else if (page === "notesp113") {
  content.innerHTML = `
    <h1 class="text-3xl font-bold mb-6 text-center">📚 Study Resources</h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 1</h3>
        <a href="pdfs/short-notes-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 2</h3>
        <a href="pdfs/short-notes-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Short Notes PDF 3</h3>
        <a href="pdfs/short-notes-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Weekly</h3>
        <a href="pdfs/study-schedule-weekly.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Schedule Daily</h3>
        <a href="pdfs/study-schedule-daily.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Study Strategy Guide</h3>
        <a href="pdfs/study-strategy-guide.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <!-- Add 3 more if you want to fill 3x3 grid -->
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 1</h3>
        <a href="pdfs/extra-resource-1.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 2</h3>
        <a href="pdfs/extra-resource-2.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-2">Extra Resource 3</h3>
        <a href="pdfs/extra-resource-3.pdf" download class="text-blue-600 hover:underline">Download PDF</a>
      </div>
    </div>
  `;
}



// Hide loader & show content
    loader.classList.add("hidden");
    content.classList.remove("opacity-0");
  }, 600); // loading delay (can be adjusted)
}








function goBack() {
  if (historyStack.length > 0) {
    const lastPage = historyStack.pop();
    currentPage = lastPage; // important to update current
    navigate(lastPage);
  }
}


function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("hidden");
}

window.onload = () => navigate("home");

// === AUTH MODAL CONTROL ===
function openAuthModal() {
  document.getElementById("authModal").classList.remove("hidden");
  showAuthTab("login");
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function showAuthTab(tab) {
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("signupForm").classList.toggle("hidden", tab !== "signup");
}

// === AUTH FUNCTIONS ===
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signup successful!");
      closeAuthModal();
    })
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      closeAuthModal();
    })
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut();
}

// === AUTH STATE LISTENER ===
firebase.auth().onAuthStateChanged(user => {
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    userEmail.textContent = user.email;
    userEmail.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    userEmail.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
});