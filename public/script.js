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
  submitContainer.removeAttribute("class");
  if (enterIngredient.value === "") {
    submitContainer.classList.add("error", "empty");
  } else if (!ingredients.includes(enterIngredient.value)) {
    submitContainer.classList.add("error", "invalid");
  } else {
    recipesContainer.replaceChildren();
    fetchRecipes(enterIngredient.value.toLowerCase().replaceAll(" ", "_"));
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
  mainContainer.replaceChildren(createReturnLink(), recipeDiv);

  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => {
      response.json().then((data) => {
        mainContainer.appendChild(createRecipeInfoDiv(data.meals[0]));
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
  enterNewIngredient.addEventListener("click", () => {
    mainContainer.replaceChildren(submitContainer, recipesContainer);
  });

  return enterNewIngredient;
}

function createIngredientsDiv(recipeInfo) {
  const recipeInfoList = Object.keys(recipeInfo);
  const ingredients = createList("ingredient", recipeInfoList, recipeInfo);
  const measurements = createList("measurement", recipeInfoList, recipeInfo);
  const ingredientsDiv = document.createElement("ul");

  addListItems(ingredientsDiv, ingredients, measurements, recipeInfo);

  ingredientsDiv.classList.add("ingredient-list");

  return ingredientsDiv;
}

function createList(item, list, obj) {
  const firstIndex = list.indexOf(
    item === "ingredient" ? "strIngredient1" : "strMeasure1"
  );
  const lastIndex = list.indexOf(
    item === "ingredient" ? "strIngredient20" : "strMeasure20"
  );
  return list.slice(firstIndex, lastIndex).filter((item) => obj[item] !== "");
}

function addListItems(div, ingredients, measurements, recipeInfo) {
  for (let index = 0; index < ingredients.length; index++) {
    const ingredient = recipeInfo[ingredients[index]];
    const measurement = recipeInfo[measurements[index]];
    const ingredientMeasurement = document.createElement("li");
    ingredientMeasurement.innerText = `${ingredient} (${measurement})`;
    div.appendChild(ingredientMeasurement);
  }

  return div;
}

function createInstructionDiv(recipeInfo) {
  const instruction = document.createElement("div");
  const instructionTitle = document.createElement("p");
  const recipeInstruction = document.createElement("p");

  instructionTitle.innerText = "Instructions: ";
  recipeInstruction.innerText = recipeInfo.strInstructions;

  instruction.appendChild(instructionTitle);
  instruction.appendChild(recipeInstruction);
  instruction.classList.add("instruction");

  return instruction;
}

function createRecipeInfoDiv(recipeInfo) {
  const ingredientsDiv = createIngredientsDiv(recipeInfo);
  const instruction = createInstructionDiv(recipeInfo);
  const recipeInfoDiv = document.createElement("div");

  recipeInfoDiv.classList.add("recipe-info");

  recipeInfoDiv.appendChild(ingredientsDiv);
  recipeInfoDiv.appendChild(instruction);

  return recipeInfoDiv;
}
