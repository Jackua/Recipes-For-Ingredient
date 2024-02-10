let ingredients = null;
let ingredientsDataList = document.querySelector("datalist#ingredients");
let enterIngredients = document.querySelector("#enter-ingredients");
let addIngredients = document.querySelector("#add-ingredients");
let enteredIngredients = document.querySelector("#entered-ingredients");
let submittedIngredients = new Array();

async function getIngredients() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  )
    .then((response) => {
      response.json().then((data) => {
        ingredients = data.meals;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  getIngredients();
});

enterIngredients.addEventListener("input", (event) => {
  ingredientsDataList.replaceChildren();
  if (event.target.value !== "") {
    ingredients
      .filter((ingredient) =>
        ingredient.strIngredient
          .toUpperCase()
          .includes(event.target.value.toUpperCase())
      )
      .forEach((ingredient) => {
        const ingredientElement = document.createElement("option");
        ingredientElement.value = ingredient.strIngredient;
        ingredientsDataList.appendChild(ingredientElement);
      });
  }
});

addIngredients.addEventListener("click", (event) => {
  if (submittedIngredients.includes(enterIngredients.value)) {
    console.log("already exist");
  } else if (enterIngredients.value === "") {
    console.log("empty");
  } else if (!ingredients.includes(enterIngredients.value)) {
    console.log("does not exist");
  } else {
    submittedIngredients.push(enterIngredients.value);
    const addedIngredient = document.createElement("div");
    addedIngredient.classList.add("added-ingredient");

    const ingredientName = document.createElement("p");
    ingredientName.innerText = enterIngredients.value;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", () => {
      const parent = deleteButton.parentNode;
      parent.parentNode.removeChild(parent);
      submittedIngredients.filter(
        (submittedIngredient) =>
          submittedIngredient !== ingredientName.innerText
      );
    });

    addedIngredient.appendChild(ingredientName);
    addedIngredient.appendChild(deleteButton);
    enteredIngredients.appendChild(addedIngredient);
  }
});
