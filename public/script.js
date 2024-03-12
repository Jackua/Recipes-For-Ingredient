let ingredients = null;
let ingredientsDataList = document.querySelector("datalist#ingredient");
let enterIngredient = document.querySelector("#enter-ingredient");
let getRecipes = document.querySelector("#get-recipes");
let recipesContainer = document.querySelector("#recipes-container");
let submitContainer = document.querySelector("#submit");
let mainContainer = document.querySelector("main");

document.addEventListener("DOMContentLoaded", () => {
  fetchIngredients();
});

enterIngredient.addEventListener("input", (event) => {
  ingredientsDataList.replaceChildren();
  if (event.target.value !== "") {
    ingredients
      .filter((ingredient) =>
        ingredient.toUpperCase().includes(event.target.value.toUpperCase())
      )
      .forEach((ingredient) => {
        const ingredientElement = document.createElement("option");
        ingredientElement.value = ingredient;
        ingredientsDataList.appendChild(ingredientElement);
      });
  }
});

getRecipes.addEventListener("click", (event) => {
  submitContainer.classList.remove("error", "empty", "invalid");
  if (enterIngredient.value === "") {
    submitContainer.classList.add("error", "empty");
  } else if (!ingredients.includes(enterIngredient.value)) {
    submitContainer.classList.add("error", "invalid");
  } else {
    recipesContainer.replaceChildren();
    const converted = enterIngredient.value.toLowerCase().replaceAll(" ", "_");
    fetchRecipes(converted);
  }
});

// Send the request to the backend to get data from my partner's microservice
async function fetchIngredients() {
  await fetch("/microservice/ingrediet")
    .then((response) => {
      response.json().then((data) => {
        ingredients = data.meals.map((meal) => meal.strIngredient);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

async function fetchRecipes(ingredient) {
  await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  )
    .then((response) => {
      response.json().then((data) => {
        if (checkForRecipes(data.meals)) {
          addRecipes(data.meals);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function checkForRecipes(recipes) {
  if (recipes === null) {
    submitContainer.classList.add("error", "null");
    return false;
  } else {
    submitContainer.classList.remove("error", "null");
    return true;
  }
}

function addRecipes(recipes) {
  recipes.forEach((recipe) => {
    recipesContainer.appendChild(createRecipeDiv(recipe));
  });
}

function createRecipeDiv(recipe) {
  const recipeDiv = document.createElement("div");
  recipeDiv.classList.add("recipe-container");
  recipeDiv.appendChild(createNameDiv(recipe));
  recipeDiv.appendChild(createImageDiv(recipe));

  return recipeDiv;
}

function createNameDiv(recipe) {
  const nameDiv = document.createElement("div");
  nameDiv.classList.add("name-container");
  nameDiv.appendChild(createRecipeTitle(recipe));

  nameDiv.addEventListener("click", function (event) {
    if (event.target.classList.contains("name-container")) {
      const imageDiv = event.target.nextElementSibling;
      imageDiv.style.display =
        imageDiv.style.display === "block" ? "none" : "block";
    }
  });

  return nameDiv;
}

function createRecipeTitle(recipe) {
  const recipeName = document.createElement("p");
  recipeName.classList.add("recipe-name");
  recipeName.innerText = recipe.strMeal;

  recipeName.addEventListener("click", function (event) {
    const recipeContainer = event.target.parentElement.parentElement;
    displayRecipe(event, recipe.idMeal, recipeContainer);
  });

  return recipeName;
}

function createImageDiv(recipe) {
  const imageDiv = document.createElement("img");
  imageDiv.src = recipe.strMealThumb;
  imageDiv.style.display = "block";
  imageDiv.classList.add("recipe-image");

  imageDiv.addEventListener("click", function (event) {
    const recipeContainer = event.target.parentElement;
    displayRecipe(event, recipe.idMeal, recipeContainer);
  });

  return imageDiv;
}

async function displayRecipe(event, mealID, recipeDiv) {
  mainContainer.replaceChildren();

  mainContainer.appendChild(createReturnLink());
  mainContainer.appendChild(recipeDiv);

  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => {
      response.json().then((data) => {
        const recipeInfo = data.meals[0];

        const firstIngredient = Object.keys(recipeInfo).findIndex(
          (str) => str === "strIngredient1"
        );
        const lastIngredient = Object.keys(recipeInfo).findIndex(
          (str) => str === "strIngredient20"
        );

        const ingredientList = Object.keys(recipeInfo)
          .slice(firstIngredient, lastIngredient)
          .filter((ingredient) => recipeInfo[ingredient] !== "");

        const firstMeasurement = Object.keys(recipeInfo).findIndex(
          (str) => str === "strMeasure1"
        );
        const lastMeasurement = Object.keys(recipeInfo).findIndex(
          (str) => str === "strMeasure20"
        );

        const measurementList = Object.keys(recipeInfo)
          .slice(firstMeasurement, lastMeasurement)
          .filter((measurement) => recipeInfo[measurement] !== "");

        const recipeIngredients = document.createElement("ul");

        for (let index = 0; index < ingredientList.length; index++) {
          const ingredient = recipeInfo[ingredientList[index]];
          const measurement = recipeInfo[measurementList[index]];
          const ingredientMeasurement = document.createElement("li");
          ingredientMeasurement.innerText = `${ingredient} (${measurement})`;
          recipeIngredients.appendChild(ingredientMeasurement);
        }

        const instruction = document.createElement("div");
        const instructionTitle = document.createElement("p");
        instructionTitle.innerText = "Instructions: ";
        const recipeInstruction = document.createElement("p");
        recipeInstruction.innerText = recipeInfo.strInstructions;
        instruction.appendChild(instructionTitle);
        instruction.appendChild(recipeInstruction);
        instruction.classList.add("instruction");

        const recipeInfoDiv = document.createElement("div");
        recipeInfoDiv.classList.add("recipe-info");
        recipeIngredients.classList.add("ingredient-list");
        recipeInfoDiv.appendChild(recipeIngredients);
        recipeInfoDiv.appendChild(instruction);
        mainContainer.appendChild(recipeInfoDiv);
        recipeDiv.children[1].style.display = "block";
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createReturnLink() {
  const enterNewIngredient = document.createElement("p");
  enterNewIngredient.innerText =
    "Click here to go back and enter a new ingredient.";
  enterNewIngredient.classList.add("return-to-ingredients");
  enterNewIngredient.addEventListener("click", returnToIngredients);

  return enterNewIngredient;
}

function returnToIngredients() {
  mainContainer.replaceChildren();
  mainContainer.appendChild(submitContainer);
  mainContainer.appendChild(recipesContainer);
}
