import { Recipe } from "./recipe";

const manaSumHTML = document.getElementById("manaSum")!;
const resourceSumHTML = document.getElementById("resSum")!;

const goldHTML = document.getElementById("gold")!;
const silverHTML = document.getElementById("silver")!;
const bronzeHTML = document.getElementById("bronze")!;

let manaSum = 0;
let resourcesSum = 0;

let manaCost = 30;
let resourcesCost = 3;

let gold = 0;
let silver = 0;
let bronze = 0;

export function updatateSum(recipesData: Recipe[]): void{
    manaSum = 0;
    resourcesSum = 0;
    recipesData.forEach(recipe => {
        manaSum += recipe.mana * recipe.quantity;
        resourcesSum += recipe.resources * recipe.quantity;
    })

    manaSumHTML.textContent = manaSum.toString();
    resourceSumHTML.textContent = resourcesSum.toString();

    bronze = manaCost * manaSum + resourcesCost * resourcesSum;
    silver = Math.floor(bronze / 10);
    bronze %= 10;
    gold = Math.floor(silver / 10);
    silver %= 10;

    goldHTML.textContent = gold.toString() + " zl";
    silverHTML.textContent = silver.toString() + " st";
    bronzeHTML.textContent = bronze.toString() + " md";
}