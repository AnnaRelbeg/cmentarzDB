// ---------------------------
// Mobile Navbar Toggle
// ---------------------------
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-button");
    const navMenu = document.querySelector(".navbar ul");
    const navLinks = document.querySelectorAll(".navbar ul li a");
  
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
  
      navLinks.forEach(link => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("active");
        });
      });
    } else {
      console.error("Menu button or navMenu not found");
    }
  });
  
  // ---------------------------
  // Firebase Firestore Search
  // ---------------------------
  
  import { db } from './firebase.js';
  import { collection, getDocs } from 'firebase/firestore';
  


  // Make sure Firebase is initialized and `db` is defined before this code runs
  const searchInput = document.querySelector("search-input");

  searchInput.addEventListener("input", async function() {
    const query = searchInput.value.trim().toLowerCase();
  
    if (query.length === 0) {
      document.getElementById("results-container").innerHTML = "";
      return;
    }
  
    const snapshot = await getDocs(collection(db, "zmarli"));
  
    const results = [];
  
    snapshot.forEach(doc => {
      const data = doc.data();
      if (
        data.fullName?.toLowerCase().includes(query) ||
        data.id?.toLowerCase().includes(query)
      )
       {
        results.push(data);
      }
    });
  
    displayResults(results);
  });
  
  
  // ---------------------------
  // Display Soft Card Results
  // ---------------------------
  
  function displayResults(results) {
    const container = document.getElementById("results-container");
    container.innerHTML = "";
  
    results.forEach(person => {
      const card = document.createElement("div");
      card.classList.add("person-card");
      card.innerHTML = `
        <img src="${person.photoURL}" alt="${person.fullName}" referrerpolicy="no-referrer">
        <h3>${person.fullName}</h3>
        <p>Rok urodzenia: ${person.birthDate.split("-")[0]}</p>
        <p>Rok śmierci: ${person.deathDate.split("-")[0]}</p>
        <button class="view-profile-btn" data-id="${person.id}">Zobacz profil</button>
      `;
      container.appendChild(card);
    });
  
    // Attach click handlers AFTER the cards are created
    document.querySelectorAll(".view-profile-btn").forEach(button => {
      button.addEventListener("click", () => {
        const person = results.find(p => p.id === button.dataset.id);
        openModal(person);
      });
    });
  }
  
  // ---------------------------
  // Modal Logic
  // ---------------------------
  
  function openModal(person) {
    document.getElementById("modal-photo").src = person.photoURL;
    document.getElementById("modal-name").textContent = person.fullName;
    document.getElementById("modal-id").textContent = person.id;
    document.getElementById("modal-birth").textContent = person.birthDate;
    document.getElementById("modal-death").textContent = person.deathDate;
    document.getElementById("modal-age").textContent = person.age;
    document.getElementById("modal-description").textContent = person.description;
  
    document.getElementById("person-modal").classList.add("show");
  }
  
  function closeModal() {
    document.getElementById("person-modal").classList.remove("show");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".modal-close");
    const modal = document.getElementById("person-modal");
  
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", closeModal);
      window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    } else {
      console.error("Modal close button or modal not found.");
    }
  });
  