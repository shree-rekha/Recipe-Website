document.addEventListener('DOMContentLoaded', function () {
    const isHome = document.getElementById('recipeOfTheDayCard') && document.getElementById('recipeCarousel');
    
    if (isHome) {
        displayRecipes();
    }

    // Start Cooking Button Scroll
    document.getElementById("startCookingBtn")?.addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("startCookingSection").scrollIntoView({ behavior: "smooth" });
    });

    // Close search results when clicking outside
    document.addEventListener('click', function (event) {
        const searchContainer = document.querySelector('.header-search-container');
        const resultsContainer = document.getElementById('results-container');

        if (searchContainer && resultsContainer && !searchContainer.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });

    console.log("Page loaded successfully.");
});

// ───────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────

function getPartOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

function getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
}

function checkImageExists(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
}

// ───────────────────────────────────────────────────────
// RECIPE DATA
// ───────────────────────────────────────────────────────

const recipes = {
    morning: [
        { id: 'pancakes', title: 'Pancakes', image: './images/pancakes.jpg', link: './desserts/pancakes.html' },
        { id: 'omelette', title: 'Omelette', image: './images/omelette.jpg', link: './breakfast/omelette.html' },
    ],
    afternoon: [
        { id: 'grilled-cheese', title: 'Grilled Cheese Sandwich', image: './images/grilled-cheese.jpg', link: './lunch/grilled-cheese.html' },
        { id: 'caesar-salad', title: 'Caesar Salad', image: './images/caesar-salad.jpg', link: './dinner/caesar-salad.html' },
    ],
    evening: [
        { id: 'spaghetti', title: 'Spaghetti Bolognese', image: './images/spaghetti-bolognese.jpg', link: './dinner/spaghetti.html' },
        { id: 'chocolate-cake', title: 'Chocolate Cake', image: './images/chocolate-cake.jpg', link: './desserts/chocolate-cake.html' },
    ]
};

const seasonalRecipes = {
    spring: [
        { id: 'strawberry-smoothie', title: 'Strawberry Smoothie', image: './images/strawberry-smoothie.jpg', link: './desserts/strawberry-smoothie.html' },
        { id: 'spring-salad', title: 'Spring Salad', image: './images/spring-salad.jpg', link: './lunch/spring-salad.html' },
    ],
    summer: [
        { id: 'iced-tea', title: 'Iced Tea', image: './images/iced-tea.jpg', link: './lunch/iced-tea.html' },
        { id: 'grilled-vegetables', title: 'Grilled Vegetables', image: './images/grilled-vegetables.jpg', link: './lunch/grilled-veggies.html' },
    ],
    fall: [
        { id: 'pumpkin-soup', title: 'Pumpkin Soup', image: './images/pumpkin-soup.jpg', link: './lunch/pumpkin-soup.html' },
        { id: 'apple-pie', title: 'Apple Pie', image: './images/apple-pie.jpg', link: './desserts/apple-pie.html' },
    ],
    winter: [
        { id: 'hot-chocolate', title: 'Hot Chocolate', image: './images/hot-chocolate.jpg', link: './desserts/hot-chocolate.html' },
        { id: 'beef-stew', title: 'Beef Stew', image: './images/beef-stew.jpg', link: './dinner/beef-stew.html' },
    ]
};

// ───────────────────────────────────────────────────────
// RECIPE DISPLAY FUNCTIONS
// ───────────────────────────────────────────────────────

function displayRecipes() {
    const partOfDay = getPartOfDay();
    const season = getSeason();

    const recipeOfTheDay = selectRecipeOfTheDay(partOfDay, season);
    const remainingRecipes = getRemainingRecipes(partOfDay, season, recipeOfTheDay);

    displayRecipeOfTheDay(recipeOfTheDay);
    displayTrendingRecipes(remainingRecipes);
}

function selectRecipeOfTheDay(partOfDay, season) {
    const allRecipes = [...recipes[partOfDay], ...seasonalRecipes[season]];
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    return allRecipes[randomIndex];
}

function getRemainingRecipes(partOfDay, season, recipeOfTheDay) {
    const allRecipes = [...recipes[partOfDay], ...seasonalRecipes[season]];
    return allRecipes.filter(recipe => recipe.id !== recipeOfTheDay.id);
}

function displayRecipeOfTheDay(recipe) {
    const recipeCard = document.getElementById('recipeOfTheDayCard');
    if (!recipeCard) return;

    recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='images/default.jpg'">
        <h3>${recipe.title}</h3>
        <p>This recipe is trending today, don't miss out!</p>
        <a href="${recipe.link}">Try This Recipe</a>
    `;
}

function displayTrendingRecipes(recipesList) {
    const carousel = document.getElementById('recipeCarousel');
    if (!carousel) return;

    carousel.innerHTML = '';

    recipesList.forEach(recipe => {
        checkImageExists(recipe.image, (exists) => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.id = recipe.id;

            recipeCard.innerHTML = `
                <img src="${exists ? recipe.image : './images/default.jpg'}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <a href="${recipe.link}">See Recipe</a>
            `;
            carousel.appendChild(recipeCard);
        });
    });
}

// ───────────────────────────────────────────────────────
// SEARCH FUNCTIONALITY
// ───────────────────────────────────────────────────────

function searchRecipes() {
    let input = document.getElementById("header-search-input").value.toLowerCase();
    let recipes = document.querySelectorAll(".recipe, .category");

    let matchFound = false;

    recipes.forEach(recipe => {
        let recipeName = recipe.querySelector("h3, h4")?.innerText.toLowerCase() || "";
        if (recipeName.includes(input)) {
            recipe.style.display = "block";
            matchFound = true;
        } else {
            recipe.style.display = "none";
        }
    });

    if (!matchFound) {
        console.warn("No matching recipes found.");
    }
}

// Scroll to a specific recipe
function searchRecipe(recipeName) {
    let formattedName = recipeName.toLowerCase().replace(/\s+/g, "-");
    let recipeElement = document.getElementById(formattedName);

    if (recipeElement) {
        recipeElement.scrollIntoView({ behavior: "smooth" });
    } else {
        alert(`Recipe "${recipeName}" not found.`);
    }
}
