// Global Settings
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Initializing empty Array and Object
let resultsArray = [];
let favorites = {};

// Functions
function showContent() {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("d-none");
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  console.log("Current Array", page, currentArray);
  currentArray.forEach((result) => {
    // Card container
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("mb-4");
    const cardHeader = document.createElement("div");

    cardHeader.classList.add("card-header");
    cardHeader.classList.add("text-danger");
    cardHeader.textContent = "Service Version: v1";
    const cardTitle1 = document.createElement("h2");
    cardTitle1.classList.add("card-title");
    cardTitle1.classList.add("m-4");
    cardTitle1.textContent = result.title;

    // Image URL
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Card Title
    const cardTitle2 = document.createElement("h5");
    cardTitle2.classList.add("card-title");
    cardTitle2.textContent = result.title;

    // Image Credits
    const imageCredits = document.createElement("h6");
    imageCredits.textContent = `Image Credits: NASA`;

    // Image Crests Span
    const imageCreditsSpan = document.createElement("span");
    imageCreditsSpan.classList.add("text-muted");

    // Card Text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.classList.add("text-muted");
    cardText.classList.add("mt-4");
    cardText.textContent = result.explanation;

    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("btn");
    if (page === "results") {
      saveText.classList.add("btn-success");
      saveText.textContent = "Add to favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.classList.add("btn-danger");
      saveText.textContent = "Remove from favorites";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }

    //Card Footer
    const footer = document.createElement("div");
    footer.classList.add("card-footer");
    const cardDate = document.createElement("strong");
    cardDate.textContent = result.date;

    const copyrightResult =
      result.copyright === undefined ? "" : ` © ${result.copyright}`;
    const cardCopyright = document.createElement("span");
    cardCopyright.classList.add("text-muted");
    cardCopyright.textContent = `${copyrightResult}`;

    // Appending Card Content
    footer.append(cardDate, cardCopyright);
    cardBody.append(
      cardTitle2,
      imageCredits,
      imageCreditsSpan,
      cardText,
      saveText,
      footer
    );
    link.appendChild(image);
    card.append(cardHeader, cardTitle1, link, cardBody);

    imagesContainer.appendChild(card);
  });
}

// Creating the Cards
function updateDOM(page) {
  // get Favorites from localStorage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Getting the images from API
async function getNasaPictures() {
  // show loader
  loader.classList.remove("d-none");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // createDOMNodes()
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
  }
}

// Add results to favorite
function saveFavorite(itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      // Show confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Save to localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove from Favorite
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];

    // Delete from localStorage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On Load
getNasaPictures();
