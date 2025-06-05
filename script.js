function navigate(page) {
  const content = document.getElementById("content");

  if (page === "home") {
    content.innerHTML = `
      <div class="bg-gradient-to-r from-blue-400 to-blue-600 py-6 px-4 text-center">
        <img src="images/banner.jpg" alt="Banner" class="w-full max-h-60 object-cover rounded-xl" />
        <div class="flex justify-center mt-4">
          <img src="images/profile.jpg" alt="Profile" class="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
        </div>
        <h1 class="text-3xl font-bold text-white mt-2">Rohit's Life Unfiltered</h1>
        <p class="text-white">Raw & Real Fun • Study Motivation • Personal Growth</p>
      </div>
      <div class="text-center my-10">
        <h2 class="text-2xl font-semibold mb-4">🎥 Introduction Videos</h2>
        <p class="text-gray-600">Videos coming soon! Stay tuned.</p>
      </div>
    `;
  } else if (page === "resources") {
    content.innerHTML = `
      <h1 class="text-3xl font-bold mb-6 text-center">📚 Study Resources</h1>
      <ul class="list-disc px-6 text-lg text-gray-700">
        <li>Short Notes (PDF uploads coming soon)</li>
        <li>Study Schedules (Daily/Weekly)</li>
        <li>Study Strategies for consistency</li>
      </ul>
    `;
  } else if (page === "posts") {
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
}

// Load homepage by default
window.onload = () => navigate("home");
