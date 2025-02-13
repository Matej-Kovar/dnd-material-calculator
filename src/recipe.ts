
export type Recipe = {
    ID: string;
    Name: string;
    Description: string;
    requiredKnowlegde: string;
    base: string[];
    mana: number
    resources: number;
    difficulty: number;
    duration: number;
    quantity: number;
}

const updatePage = new CustomEvent("updatePage");

export function parseRecipe(data: any): Recipe {
    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid recipe data: Must be an object.");
    }

    const { ID, Name, Description, requiredKnowlegde, base, mana, resources, difficulty, duration} = data;

    if (typeof ID !== "string") throw new Error("Invalid 'ID': Must be a string.");
    if (typeof Name !== "string") throw new Error("Invalid 'Name': Must be a string.");
    if (typeof Description !== "string") throw new Error("Invalid 'Description': Must be a string.");
    if (typeof requiredKnowlegde !== "string") throw new Error("Invalid 'requiredKnowlegde': Must be a string.");
    if (!Array.isArray(base) || !base.every(item => typeof item === "string")) {
        throw new Error("Invalid 'base': Must be an array of strings.");
    }
    if (typeof mana !== "number" || mana < 0) throw new Error("Invalid 'mana': Must be a non-negative number.");
    if (typeof resources !== "number" || resources < 0) throw new Error("Invalid 'resources': Must be a non-negative number.");
    if (typeof difficulty !== "number" || difficulty < 0) throw new Error("Invalid 'difficulty': Must be a non-negative number.");
    if (typeof duration !== "number" || duration < -1) throw new Error("Invalid 'duration': Must be a bigger than -1 number.");

    const loadedQuantity = localStorage.getItem(ID);
    let quantity = 0;
    if(loadedQuantity != null){
        quantity = Number.parseInt(loadedQuantity);
    }

    return { ID, Name, Description, requiredKnowlegde, base, mana, resources, difficulty, duration, quantity };
}

export function parseRecipes(data: any): Recipe[] {
    if (!Array.isArray(data)) {
        throw new Error("Invalid recipe data: Must be an array of recipes.");
    }

    return data.map((item, index) => {
        try {
            return parseRecipe(item);
        } catch (error: any) {
            throw new Error(`Error in recipe at index ${index}: ${error.message}`);
        }
    });
}

export function createRecipeElement(recipeData: Recipe): HTMLElement {
    const recipe = createElement("div", "recipe " + getRecipeColor(recipeData.requiredKnowlegde));
    recipe.appendChild(createRecipeHeader(recipeData))
    recipe.appendChild(createRecipeBody(recipeData))
    recipe.appendChild(createRecipeSum(recipeData))
    recipe.appendChild(createRecipeControl(recipeData))
    return recipe;
}

function createElement(tag: string, className: string, text?: string): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    if (text) {
        element.textContent = text;
    }
    return element;
}

function createRecipeHeader(recipeData: Recipe): HTMLElement {
    const header = createElement("div", "recipe__header");
    header.appendChild(createElement("h2", "recipe__name", recipeData.Name));
    const requiredKnowlegde = createElement("div", "parameter parameter--right parameter--tall");
    requiredKnowlegde.appendChild(createElement("p", "parameter__name name--large", "Obor"));
    requiredKnowlegde.appendChild(createElement("span", "value value--small", recipeData.requiredKnowlegde));
    header.appendChild(requiredKnowlegde);
    const description = createElement("div", "parameter parameter--wide")
    description.appendChild(createElement("p", "value value--small value--color value--description", recipeData.Description))
    header.appendChild(description); 
    return header;
}

function createRecipeBody(recipeData: Recipe): HTMLElement {
    const body = createElement("div", "recipe__body");
    const base = createElement("div", "parameter parameter--first parameter--tall");
    base.appendChild(createElement("p", "parameter__name name--large", "Základ"));
    const baseValue = createElement("span", "value", "")
    recipeData.base.forEach((material, index)  => {
        baseValue.textContent += material
        if(index < recipeData.base.length - 1){
            baseValue.textContent += ", "
        }
    })
    base.appendChild(baseValue);
    body.appendChild(base);

    body.appendChild(createParameter("Mana", recipeData.mana));
    body.appendChild(createParameter("Suroviny", recipeData.resources));
    body.appendChild(createParameter("Obtížnost", recipeData.difficulty));
    body.appendChild(createParameter("Trvání", recipeData.duration));

    return body;
}

function createParameter(name: string, value: string | number):HTMLElement {
    const paramDiv = createElement("div", "parameter");
    const paramP = createElement("p", "");
    paramP.appendChild(createElement("span", "parameter__name", name + ": "));
    paramP.appendChild(createElement("span", "value value--number", value.toString()));
    paramDiv.appendChild(paramP);
    return paramDiv
}

function createRecipeSum(recipeData: Recipe): HTMLElement {
    const sum = createElement("div", "recipe__sum");
    const manaRecipeSum = createParameter("Celkem Many", recipeData.mana * recipeData.quantity)
    const manaSumValue = <HTMLElement>manaRecipeSum.childNodes[0].childNodes[1];
    manaSumValue.classList.add("manaRecipeSum")
    sum.appendChild(manaRecipeSum);
    const resourcesRecipeSum = createParameter("Celkem Many", recipeData.resources * recipeData.quantity)
    const resourcesSumValue = <HTMLElement>manaRecipeSum.childNodes[0].childNodes[1];
    resourcesSumValue.classList.add("resourcesRecipeSum")
    sum.appendChild(resourcesRecipeSum);
    return sum;
}

function createRecipeControl(recipeData: Recipe): HTMLElement {
    const control = createElement("div", "recipe__control");
    const plusButton = createElement("button", "control__button", "+");
    const counterSpan = createElement("span", "value value--number counter", recipeData.quantity.toString());
    const minusButton = createElement("button", "control__button", "-");
    plusButton.addEventListener("click", () => {
        recipeData.quantity++;
        localStorage.setItem(recipeData.ID, recipeData.quantity.toString())
        counterSpan.textContent = recipeData.quantity.toString();
        document.dispatchEvent(updatePage)
    });
    
    minusButton.addEventListener("click", () => {
        if(recipeData.quantity - 1 >= 0){
            recipeData.quantity--;
            localStorage.setItem(recipeData.ID, recipeData.quantity.toString())
            counterSpan.textContent = recipeData.quantity.toString();
            document.dispatchEvent(updatePage)
        }
    });
    control.appendChild(plusButton);
    control.appendChild(counterSpan);
    control.appendChild(minusButton);
    return control;
}

function getRecipeColor(knowledge: string): string{
    switch (knowledge) {
        case "Základní":
            return "recipe--basic";
        case "Pokročilý":
            return "recipe--advanced";
        case "Lektvary a elixíry":
            return "recipe--potions";
        case "Nestabilní substance":
            return "recipe--explosives";
        case "Magické předměty":
            return "recipe--magic-items";
        case "Alchymistická anatomie":
            return "recipe--anatomy";
        case "Hvězdné sestavy":
            return "recipe--stars";
        case "Krystaly a energie":
            return "recipe--crystals";
        default:
            return "";
    }
}