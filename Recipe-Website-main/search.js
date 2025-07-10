// Search functionality for the recipe website
class RecipeSearch {
    constructor() {
        this.recipes = [
            // Breakfast recipes
            { name: "Croissants", category: "breakfast", page: "continental-breakfast.html", description: "Buttery and flaky French croissants" },
            { name: "Eggs Benedict", category: "breakfast", page: "continental-breakfast.html", description: "Classic eggs Benedict with hollandaise sauce" },
            { name: "Fruit Salad", category: "breakfast", page: "continental-breakfast.html", description: "Colorful fruit salad with fresh fruits" },
            { name: "Pancakes", category: "breakfast", page: "breakfast.html", description: "Fluffy breakfast pancakes" },
            { name: "Omelette", category: "breakfast", page: "breakfast.html", description: "Classic egg omelette" },
            
            // Lunch recipes
            { name: "Greek Salad", category: "lunch", page: "Mediterrian lunch.html", description: "Refreshing salad with tomatoes, cucumbers, olives, and feta cheese" },
            { name: "Hummus and Pita", category: "lunch", page: "Mediterrian lunch.html", description: "Classic hummus served with warm pita bread" },
            { name: "Grilled Mediterranean Vegetables", category: "lunch", page: "Mediterrian lunch.html", description: "Assorted vegetables grilled with olive oil and herbs" },
            { name: "Caesar Salad", category: "lunch", page: "lunch.html", description: "Classic Caesar salad with croutons" },
            { name: "Grilled Cheese Sandwich", category: "lunch", page: "lunch.html", description: "Perfect grilled cheese sandwich" },
            
            // Dinner recipes
            { name: "Spaghetti Bolognese", category: "dinner", page: "dinner.html", description: "Classic Italian pasta with meat sauce" },
            { name: "Beef Stew", category: "dinner", page: "dinner.html", description: "Hearty beef stew with vegetables" },
            { name: "Steaks", category: "dinner", page: "dinner.html", description: "Perfectly grilled steaks" },
            { name: "Pasta", category: "dinner", page: "dinner.html", description: "Various pasta dishes" },
            { name: "Seafood", category: "dinner", page: "dinner.html", description: "Fresh seafood dishes" },
            
            // Dessert recipes
            { name: "Chocolate Cake", category: "dessert", page: "desserts.html", description: "Rich and moist chocolate cake" },
            { name: "Apple Pie", category: "dessert", page: "desserts.html", description: "Classic American apple pie" },
            { name: "Hot Chocolate", category: "dessert", page: "desserts.html", description: "Warm and creamy hot chocolate" },
            { name: "Cupcakes", category: "dessert", page: "desserts.html", description: "Delicious cupcakes with frosting" },
            { name: "Cookies", category: "dessert", page: "desserts.html", description: "Fresh baked cookies" },
            { name: "Ice Cream", category: "dessert", page: "desserts.html", description: "Creamy homemade ice cream" },
            { name: "Pudding", category: "dessert", page: "desserts.html", description: "Smooth and creamy pudding" }
        ];

        this.categories = [
            { name: "Breakfast", page: "breakfast.html", description: "Start your day with delicious breakfast recipes" },
            { name: "Continental Breakfast", page: "continental-breakfast.html", description: "European-style breakfast options" },
            { name: "Lunch", page: "lunch.html", description: "Satisfying midday meals" },
            { name: "Mediterranean Lunch", page: "Mediterrian lunch.html", description: "Healthy Mediterranean lunch options" },
            { name: "Dinner", page: "dinner.html", description: "Hearty evening meals" },
            { name: "Desserts", page: "desserts.html", description: "Sweet treats and desserts" },
            { name: "Quick & Easy", page: "quick-easy.html", description: "Fast and simple recipes" },
            { name: "Vegan", page: "vegan.html", description: "Plant-based recipes" }
        ];

        this.initializeSearch();
    }

    initializeSearch() {
        // Initialize search on all pages
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSearchListeners();
            this.setupMobileSearch();
        });
    }

    setupSearchListeners() {
        // Header search input
        const headerSearchInput = document.getElementById('header-search-input');
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('results-container');

        // Header search functionality
        if (headerSearchInput) {
            headerSearchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value, resultsContainer);
            });

            headerSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.redirectToSearchResults(e.target.value);
                }
            });
        }

        // Submit recipe page search
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.redirectToSearchResults(searchInput.value);
            });
        }

        // Real-time search for recipe pages
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterPageContent(e.target.value);
            });
        }
    }

    setupMobileSearch() {
        // Add mobile-friendly search toggle
        const header = document.querySelector('header');
        if (header && window.innerWidth <= 768) {
            const searchToggle = document.createElement('button');
            searchToggle.innerHTML = '<i class="fas fa-search"></i>';
            searchToggle.className = 'mobile-search-toggle';
            searchToggle.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.2em;
                cursor: pointer;
                padding: 10px;
                margin-left: auto;
            `;
            
            const nav = header.querySelector('nav');
            if (nav) {
                header.insertBefore(searchToggle, nav);
            }

            searchToggle.addEventListener('click', () => {
                const searchInput = document.getElementById('header-search-input');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }

    performSearch(query, resultsContainer) {
        if (!query || query.length < 2) {
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
            }
            return;
        }

        const results = this.searchAll(query);
        this.displaySearchResults(results, resultsContainer, query);
    }

    searchAll(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];

        // Search recipes
        this.recipes.forEach(recipe => {
            const score = this.calculateRelevanceScore(recipe, normalizedQuery);
            if (score > 0) {
                results.push({ ...recipe, type: 'recipe', score });
            }
        });

        // Search categories
        this.categories.forEach(category => {
            const score = this.calculateRelevanceScore(category, normalizedQuery);
            if (score > 0) {
                results.push({ ...category, type: 'category', score });
            }
        });

        // Sort by relevance score
        return results.sort((a, b) => b.score - a.score).slice(0, 8);
    }

    calculateRelevanceScore(item, query) {
        let score = 0;
        const name = item.name.toLowerCase();
        const description = (item.description || '').toLowerCase();
        const category = (item.category || '').toLowerCase();

        // Exact match gets highest score
        if (name === query) score += 100;
        
        // Name starts with query
        if (name.startsWith(query)) score += 50;
        
        // Name contains query
        if (name.includes(query)) score += 25;
        
        // Description contains query
        if (description.includes(query)) score += 15;
        
        // Category matches
        if (category.includes(query)) score += 10;

        return score;
    }

    displaySearchResults(results, container, query) {
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-results-dropdown">
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No results found for "${query}"</p>
                        <small>Try searching for "breakfast", "pasta", or "chocolate"</small>
                    </div>
                </div>
            `;
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result-item" onclick="window.location.href='${result.page}'">
                    <div class="result-icon">
                        <i class="fas ${result.type === 'recipe' ? 'fa-utensils' : 'fa-th-large'}"></i>
                    </div>
                    <div class="result-content">
                        <h4>${this.highlightMatch(result.name, query)}</h4>
                        <p>${this.highlightMatch(result.description || '', query)}</p>
                        <span class="result-type">${result.type === 'recipe' ? 'Recipe' : 'Category'}</span>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="search-results-dropdown">
                    <div class="search-results-header">
                        <span>Search Results (${results.length})</span>
                        <button onclick="this.parentElement.parentElement.parentElement.style.display='none'">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ${resultsHTML}
                    <div class="search-results-footer">
                        <button onclick="recipeSearch.redirectToSearchResults('${query}')" class="view-all-btn">
                            View All Results
                        </button>
                    </div>
                </div>
            `;
        }

        container.style.display = 'block';
    }

    highlightMatch(text, query) {
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    filterPageContent(query) {
        if (!query || query.length < 2) {
            this.showAllContent();
            return;
        }

        const normalizedQuery = query.toLowerCase();
        
        // Filter recipes on current page
        const recipes = document.querySelectorAll('.recipe, .category');
        let visibleCount = 0;

        recipes.forEach(item => {
            const title = item.querySelector('h3, h4')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(normalizedQuery) || description.includes(normalizedQuery)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show no results message if needed
        this.toggleNoResultsMessage(visibleCount === 0, query);
    }

    showAllContent() {
        const items = document.querySelectorAll('.recipe, .category');
        items.forEach(item => {
            item.style.display = 'block';
        });
        this.toggleNoResultsMessage(false);
    }

    toggleNoResultsMessage(show, query = '') {
        let noResultsDiv = document.getElementById('no-results-message');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'no-results-message';
            noResultsDiv.className = 'no-results-page';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No results found for "${query}"</h3>
                    <p>Try searching for different keywords or browse our categories</p>
                    <div class="suggested-searches">
                        <span>Try: </span>
                        <button onclick="document.getElementById('header-search-input').value='breakfast'; recipeSearch.filterPageContent('breakfast')">breakfast</button>
                        <button onclick="document.getElementById('header-search-input').value='pasta'; recipeSearch.filterPageContent('pasta')">pasta</button>
                        <button onclick="document.getElementById('header-search-input').value='chocolate'; recipeSearch.filterPageContent('chocolate')">chocolate</button>
                    </div>
                </div>
            `;
            
            const mainContent = document.querySelector('.categories, .recipes');
            if (mainContent) {
                mainContent.appendChild(noResultsDiv);
            }
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    redirectToSearchResults(query) {
        if (query && query.trim()) {
            window.location.href = `search.html?query=${encodeURIComponent(query.trim())}`;
        }
    }

    // Method to handle search on dedicated search page
    handleSearchPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
        
        if (!query) {
            document.getElementById('results-container').innerHTML = `
                <div class="search-page-empty">
                    <i class="fas fa-search"></i>
                    <h3>Start searching for recipes</h3>
                    <p>Enter a recipe name, ingredient, or category to find what you're looking for</p>
                </div>
            `;
            return;
        }

        const results = this.searchAll(query);
        this.displaySearchPageResults(results, query);
    }

    displaySearchPageResults(results, query) {
        const container = document.getElementById('results-container');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-page-no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found for "${query}"</h3>
                    <p>Try different keywords or browse our recipe categories</p>
                    <div class="search-suggestions">
                        <h4>Popular searches:</h4>
                        <div class="suggestion-tags">
                            <a href="?query=breakfast" class="suggestion-tag">Breakfast</a>
                            <a href="?query=pasta" class="suggestion-tag">Pasta</a>
                            <a href="?query=chocolate" class="suggestion-tag">Chocolate</a>
                            <a href="?query=salad" class="suggestion-tag">Salad</a>
                            <a href="?query=dessert" class="suggestion-tag">Dessert</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-page-result" onclick="window.location.href='${result.page}'">
                    <div class="result-image">
                        <i class="fas ${result.type === 'recipe' ? 'fa-utensils' : 'fa-th-large'}"></i>
                    </div>
                    <div class="result-details">
                        <h3>${this.highlightMatch(result.name, query)}</h3>
                        <p>${this.highlightMatch(result.description || '', query)}</p>
                        <div class="result-meta">
                            <span class="result-type">${result.type === 'recipe' ? 'Recipe' : 'Category'}</span>
                            ${result.category ? `<span class="result-category">${result.category}</span>` : ''}
                        </div>
                    </div>
                    <div class="result-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="search-page-header">
                    <h2>Search Results for "${query}" (${results.length})</h2>
                </div>
                <div class="search-page-results">
                    ${resultsHTML}
                </div>
            `;
        }
    }
}

// Initialize search functionality
const recipeSearch = new RecipeSearch();

// Handle search page specifically
if (window.location.pathname.includes('search.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        recipeSearch.handleSearchPage();
    });
}