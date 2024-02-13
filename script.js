let ingredients = null;
let recipes = null;
let ingredientsDataList = document.querySelector("datalist#ingredient");
let enterIngredients = document.querySelector("#enter-ingredient");
let enteredIngredients = document.querySelector("#entered-ingredient");
let getRecipes = document.querySelector("#get-recipes");
let recipesContainer = document.querySelector("#recipes-container");
let submitContainer = document.querySelector("#submit");
let mainContainer = document.querySelector("main");

// async function fetchIngredients() {
//   await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
//     .then((response) => {
//       response.json().then((data) => {
//         ingredients = data.meals.map((meal) => meal.strIngredient);
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   fetchIngredients();
// });
ingredients = [
  "Brown Sugar",
  "Caster Sugar",
  "Coco Sugar",
  "Dark Brown Sugar",
  "Dark Soft Brown Sugar",
  "Demerara Sugar",
  "Granulated Sugar",
  "Muscovado Sugar",
  "Sugar",
  "Icing Sugar",
  "Sugar Snap Peas",
  "Light Brown Soft Sugar",
  "Dark Brown Soft Sugar",
  "Powdered Sugar",
];

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
  const nameDiv = document.createElement("div");
  const recipeName = document.createElement("p");
  recipeName.innerText = recipe.strMeal;

  const recipeImage = document.createElement("img");
  recipeImage.src = recipe.strMealThumb;
  recipeImage.style.display = "block";

  recipeDiv.appendChild(nameDiv);
  nameDiv.appendChild(recipeName);
  recipeDiv.appendChild(recipeImage);

  recipeDiv.classList.add("recipe-container");
  nameDiv.classList.add("name-container");
  recipeName.classList.add("recipe-name");
  recipeImage.classList.add("recipe-image");

  nameDiv.addEventListener("click", function (event) {
    console.log(recipeImage.style.display);
    recipeImage.style.display =
      recipeImage.style.display === "block" ? "none" : "block";
  });

  recipeName.addEventListener("click", function (event) {
    displayRecipe(event, recipe.idMeal, recipeDiv);
  });
  recipeImage.addEventListener("click", function (event) {
    displayRecipe(event, recipe.idMeal, recipeDiv);
  });
  return recipeDiv;
}

async function displayRecipe(event, mealID, recipeDiv) {
  mainContainer.replaceChildren();

  const enterNewIngredient = document.createElement("p");
  enterNewIngredient.innerText =
    "Click here to go back and enter a new ingredient.";
  enterNewIngredient.classList.add("return-to-ingredients");
  enterNewIngredient.addEventListener("click", returnToIngredients);

  mainContainer.appendChild(enterNewIngredient);
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

function returnToIngredients() {
  mainContainer.replaceChildren();
  mainContainer.appendChild(submitContainer);
  mainContainer.appendChild(recipesContainer);
}
