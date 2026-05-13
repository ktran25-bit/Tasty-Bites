/* 
   Tasty Bites JavaScript Code handles greetings with localStorage, randomly
   generates a food image, creates a popup window for cooking tips, includes a
   last modified date, and updates the spice slider
*/

// ====================================
// PROJECT 1 HTML5, CSS, and Bootstrap
// ====================================

// Run all page setup functions after the window fully loads
window.onload = function () {
    // Retrieve greeting text area and reset button from the page
    const greeting = document.getElementById("greeting");
    const resetButton = document.getElementById("resetName");
    updateImage();

    // Load saved username from localStorage or prompt the user for a name
    function loadGreeting() {
        if (!greeting) return;

        let username = localStorage.getItem("username");

        // If username already exists, display a welcome back message
        if (username) {
            greeting.textContent = "Welcome back, " + username + "!";
        
        // If no username is stored, ask the user to enter a name
        } else {
            username = prompt("Please enter your name:");

            if (username && username.trim() !== "") {
                localStorage.setItem("username", username);
                greeting.textContent = "Welcome, " + username + "!";
            } else {
                greeting.textContent = "Welcome, Guest!";
            }
        }
    }
    // Reset saved username and prompt the user when they click the button
    if (resetButton) {
        resetButton.addEventListener("click", function () {
        localStorage.removeItem("username");
        loadGreeting();
        });
    }
    // Display the default greeting when the page first loads
    loadGreeting();
};

// ====================
// PROJECT 2 JavaScript
// ====================

// Randomly display one of the featured food images
function updateImage() {
    // Array of available food images
    const foodImages = ['images/Soba.jpg', 'images/Curry.jpg', 'images/Nachos.jpg'];
    const foodIcon = document.getElementById("foodDisplay");

    if (!foodIcon) return;

    // Generate a random index to select an image
    const randomIndex = Math.floor(Math.random() * foodImages.length);
    
    foodIcon.src = foodImages[randomIndex];
}

// Open a separate popup window for the recipes page
function openTips() {
    const url = "https://mason.gmu.edu/~ktran51/ProjectIT331/tips.html";

    const windowName = "CookingTipsWindow";

    const features = "width=600, height=400, scrollbars=yes, resizable=yes";
    
    window.open(url, windowName, features);
}

// Displays the date and time the sources page was last modified
let modifiedText = document.getElementById("lastModified");

if (modifiedText) {
    modifiedText.textContent = "Last updated: " + document.lastModified;
}

// Retrieve the spice level slider from the submit page
let slider = document.getElementById("spice");
let result = document.getElementById("spiceValue");

// Update the displayed spice level text when the slider value changes
function updateSpiceLevel() {
    let value = Number(slider.value);

    if (value <= 2) {
        result.textContent = "Mild";
    } else if (value === 3) {
        result.textContent = "Medium";
    } else {
        result.textContent = "Hot";
    }
}

// Update the spice level text when the slider is moved
if (slider && result) {
    slider.addEventListener("input", updateSpiceLevel);
    updateSpiceLevel();
}

// ==============================
// PROJECT 3 JavaScript Functions
// ==============================

// Array storing available meals for weekly planner and random meal suggestions
const meals = ["Curry", "Nachos", "Pizza", "Ramen", "Sushi", "Tacos"];

// Select random meal from array and display it
function suggestMeal() {
    const result = document.getElementById("mealResult");
    if (!result) return;
    
    let randomIndex = Math.floor(Math.random() * meals.length);
    result.textContent = meals[randomIndex];
}

// Assigns random meals to each weekday using a loop
function generateWeek() {
    const days = ["mon", "tue", "wed", "thu", "fri"];

    for (let i = 0; i < days.length; i++) {
        let randomIndex = Math.floor(Math.random() * meals.length);
        document.getElementById(days[i]).textContent = meals[randomIndex];
    }
}

// Clear weekly planner table
function clearWeek() {
    const days = ["mon", "tue", "wed", "thu", "fri"];

    for (let i = 0; i < days.length; i++) {
        document.getElementById(days[i]).textContent = "";
    }
}

// Add a new meal to the array from the user input field
function addMeal() {
    let newMeal = document.getElementById("newMeal").value;

    if (newMeal !== "") {
        // Add to array
        meals.push(newMeal);

        // CREATE a new <li> element
        let li = document.createElement("li");

        // Add text to it
        li.textContent = newMeal;

        // Append it to the list
        document.getElementById("mealList").appendChild(li);

        // Clear input
        document.getElementById("newMeal").value = "";

        // Feedback
        document.getElementById("mealResult").textContent = newMeal + " added!";
    }
}

// Variables controlling animation state
let animationRunning = false;
let animationInterval;

// Initiates automatic meal suggestions using setInterval
function startAnimation() {
    if (animationRunning) return;

    animationRunning = true;

    animationInterval = setInterval(function() {
        suggestMeal();
    }, 2000);
}

// Stops automatic meal suggestions
function stopAnimation() {
    if (animationRunning) return;

    clearInterval(animationInterval);
    animationRunning = false;

    const result = document.getElementById("mealResult")
    if (result) {
        result.textContent = "Auto suggestion stopped.";
    }
}

// Array storing cooking tips
const tips = ["Let meat rest before slicing.", "Season your food properly.", "Use sharp knives for safety.", "Clean as you cook."];

// Display random cooking tip on Tips page
function showTip() {
    const displayTip = document.getElementById("tipDisplay");
    
    if (!displayTip) return;

    let randomIndex = Math.floor(Math.random() * tips.length);
    displayTip.textContent = tips[randomIndex];
}

// Text dynamically changes style when user hovers over list items
function highlight(element) {
    element.style.color = "red";
    element.style.fontWeight = "bold";
}

// Restores text to original style when mouse leaves element
function reset(element) {
    element.style.color = "";
    element.style.fontWeight = "";
}

// ====================================
// PROJECT 4 - JSON, AJAX, and REST API
// ====================================

// Event listeners attached after the HTML document is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Attach event listener to JSON (local file) fetch button
    const jsonBtn = document.getElementById("loadJSONBtn");
    if (jsonBtn) {
        jsonBtn.addEventListener("click", loadData);
    }

    // Attach event listener to REST API fetch button
    const apiBtn = document.getElementById("loadAPIBtn");
    if (apiBtn) {
        apiBtn.addEventListener("click", loadAPIData);
    }
});

// This function retrieves ingredient data from a local JSON file using the Fetch API.
function loadData() {
    fetch("recipes.json")
        
        // Validate response before parsing JSON
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load JSON file.");
            }
            return response.json();
        })

        // Locate table body where data will be inserted
        .then(data => {
            let tableBody = document.querySelector("#ingredientTable tbody");

            // Clear existing rows to prevent duplication
            tableBody.innerHTML = "";

            // Loop through each item in JSON data
            data.forEach(item => {

                // Create a new table row
                let row = document.createElement("tr");

                // Insert ingredient data into table cells
                row.innerHTML = `
                    <td>${item.Ingredient}</td>
                    <td>${item.Portion}</td>
                    <td>${item.Cuisine}</td>
                    <td>${item.Dish}</td>
                `;

                // Append row to table body
                tableBody.appendChild(row);
            });
        })

        // Display user-friendly error message on the page
        .catch(error => {
            let tableBody = document.querySelector("#ingredientTable tbody");
            tableBody.innerHTML = `<tr><td colspan="4">Error loading data. Please try again later.</td></tr>`;

            // Log technical error for debugging
            console.error("JSON Load Error:", error);
        });
}

// This function retrieves live recipe data from TheMealDB API using the Fetch API.
function loadAPIData() {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")
        
        // Validate API response
        .then(response => {
            if (!response.ok) {
                throw new Error("API request failed.");
            }
            return response.json();
        })

        .then(data => {
            let output = "<h3>Live Recipe Results</h3>";

            // Validate if meals exist in API response
            if (!data.meals) {
                document.getElementById("apiResult").innerHTML =
                    "<p>No recipes found.</p>";
                return;
            }

            // Loop through API results
            data.meals.forEach(meal => {
                output += `
                    <div style="margin-bottom: 15px;">
                        <strong>${meal.strMeal}</strong><br>
                        Cuisine: ${meal.strArea}<br>
                        Category: ${meal.strCategory}
                    </div>
                `;
            });

            // Display results on page
            document.getElementById("apiResult").innerHTML = output;
        })

        // Display user-friendly error message
        .catch(error => {
            document.getElementById("apiResult").innerHTML =
                "<p>Error loading API data. Please try again later.</p>";

            // Log error for debugging
            console.error("API Error:", error);
        });
}