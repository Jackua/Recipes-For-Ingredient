let ingredients = null;
let ingredientsDataList = document.querySelector("datalist#ingredients");
let enterIngredients = document.querySelector("#enter-ingredients");

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
