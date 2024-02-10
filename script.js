let ingredients = null;
let recipes = null;
let ingredientsDataList = document.querySelector("datalist#ingredient");
let enterIngredients = document.querySelector("#enter-ingredient");
let enteredIngredients = document.querySelector("#entered-ingredient");
let getRecipes = document.querySelector("#get-recipes");
let recipesContainer = document.querySelector("#recipes-container");
let submitContainer = document.querySelector("#submit");
let mainContainer = document.querySelector("main");

async function fetchIngredients() {
  await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
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
  const converted = ingredient.toLowerCase().replaceAll(" ", "_");
  await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${converted}`
  )
    .then((response) => {
      response.json().then((data) => {
        recipes = data.meals;
        recipes.forEach((recipe) => {
          recipesContainer.appendChild(createRecipeDiv(recipe));
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchIngredients();
});

enterIngredients.addEventListener("input", (event) => {
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
  if (enterIngredients.value === "") {
    submitContainer.classList.add("error", "empty");
  } else if (!ingredients.includes(enterIngredients.value)) {
    submitContainer.classList.add("error", "invalid");
  } else {
    recipesContainer.replaceChildren();
    fetchRecipes(enterIngredients.value);
  }
});

function createRecipeDiv(recipe) {
  const recipeDiv = document.createElement("div");

  const recipeName = document.createElement("p");
  recipeName.innerText = recipe.strMeal;

  const recipeImage = document.createElement("img");
  recipeImage.src = recipe.strMealThumb;

  recipeDiv.appendChild(recipeName);
  recipeDiv.appendChild(recipeImage);

  recipeDiv.classList.add("recipe-container");
  recipeImage.classList.add("recipe-image");

  return recipeDiv;
}
