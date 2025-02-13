import { Recipe, parseRecipes, createRecipeElement } from "./recipe";
import data from "../data/alchemist_recipes.json";
import { updatateSum } from "./sumManager";

const recipesData: Recipe[] = parseRecipes(data);
const recipesHTML: HTMLElement = document.getElementById("recipes")!;
const reset: HTMLElement = document.getElementById("reset")!;


window.onload = () => {
    createRecipeElements(recipesData);
    updatateSum(recipesData);
};

function createRecipeElements (recipesData: Recipe[]): void {
    recipesData.forEach(recipeData => {
        recipesHTML.appendChild(createRecipeElement(recipeData));
    });
}

document.addEventListener("updatePage", () => {
    updatateSum(recipesData);
    updatateRecipes();
});

reset.addEventListener("click", () => {
    const counters = document.getElementsByClassName("counter");
    recipesData.forEach((value, index) => {
        counters[index].textContent = "0";
        value.quantity = 0;
        localStorage.setItem(value.ID, value.quantity.toString())
    })
    updatateRecipes();
    updatateSum(recipesData);
})

function updatateRecipes (){
    const manaSums = document.getElementsByClassName("manaRecipeSum");
    const resourcesSums = document.getElementsByClassName("resourcesRecipeSum");
    recipesData.forEach((value, index) => {
        resourcesSums[index].textContent = (value.resources * value.quantity).toString();
        manaSums[index].textContent = (value.mana * value.quantity).toString();
    })
}