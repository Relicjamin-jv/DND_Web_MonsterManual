document.addEventListener("DOMContentLoaded", async () => {
    loadMonsters();
});

async function loadMonsters() {
    const monsterIndexURL = "https://www.dnd5eapi.co/api/monsters/";
    /* TODO:
        1. call fetch to get the index of all monsters from this URL
        2. validate the response and get its JSON object
        3. for each stub in the index . . .
            a. create a div to hold this monster's data
            b. fetch that monster then insert it using insertMonster
        
        HINT: you can use .slice(0, 4) on your list of results to only 
              process the first 4 results and save time and API hits
    */
  
  const monsterPromise = await fetch(monsterIndexURL)
    .then(validateJSON)
    .catch(error => {
      console.log("Fetching monsters failed");
    });
  
  return Promise.all([monsterPromise])
    .then(data => {
      const monsterContainer = document.getElementById("monster-container")
      const monsters = data[0].results;
      for (const monster of monsters){
        const monsterDiv = document.createElement("div");
        monsterDiv.classList.add("monster");
        monsterDiv.setAttribute("id", monster["name"]);
        monsterContainer.appendChild(monsterDiv);
        const monsterURL = `https://www.dnd5eapi.co${monster["url"]}`;
        fetch(monsterURL)
          .then(validateJSON)
          .then(insertMonster)
          .catch(error => {
            console.log("Failed to load indiv monster" + " " + error);
          });
      }

    });
}

/**
 * 
 * @param {APIMonster} monster a monster object from the D&D 5e API
 */
async function insertMonster(monster) {
    /* TODO
        1. get a reference to the monster div where data will be inserted
        2. construct the header div piece by piece and add it to the monster div
        3. construct the stats div piece by piece and add it to the monster div
            HINT: the included getStatModifier function will compute the 
                  modifier shown in parentheses from the stat value for you
        4. construct the Special Abilities div in a loop and add it to the monster div
            NOTE: if the list is empty, just include the header and the word None
        5. construct the Actions div in a loop and add it to the monster div
            NOTE: if the list is empty, just include the header and the word None
        6. construct the Legendary Actions div in a loop and add it to the monster div
            NOTE: if the list is empty, just include the header and the word None

        HINT: I wrote a separete function for creating each of the major 
              sections of the monster div just to help logically break down 
              the process. It also creates natural points to check that what 
              has been written so far is working before proceeding.
    */
  const divElement = document.getElementById(monster["name"]);
  
  const divHeader = document.createElement("div");
  divElement.appendChild(divHeader);

  const monsterName = document.createElement("h2");
  monsterName.classList.add("monster-name")
  monsterName.innerText = monster["name"];
  divHeader.appendChild(monsterName);

  const monsterSize = document.createElement("p");
  monsterSize.innerText = `${monster["size"]} ${monster["type"]}, ${monster["alignment"]}`;
  divHeader.appendChild(monsterSize);
  const challengeRating = monster["challenge_rating"]
  const xp = monster["xp"]

  const challenge_xp = document.createElement("p");
  challenge_xp.innerText = `Challenge Rating: ${challengeRating} (${xp})`;
  divHeader.appendChild(challenge_xp);
  
  divHeader.classList.add("monster-header");

  const divStats = document.createElement("div");
  divElement.appendChild(document.createElement("hr"));
  divElement.appendChild(divStats);

  const str = monster["strength"];
  const dex = monster["dexterity"];
  const con = monster["constitution"];
  const intel = monster["intelligence"];
  const wis = monster["wisdom"];
  const cha = monster["charisma"];
  
  const stats = document.createElement("p");
  stats.classList.add("monster-stats");
  stats.innerText = `STR: ${str} (${getStatModifier(str)}) DEX: ${dex} (${getStatModifier(dex)}) CON: ${con} (${getStatModifier(con)}) INT: ${intel} (${getStatModifier(intel)}) WIS: ${wis} (${getStatModifier(wis)}) CHA: ${cha} (${getStatModifier(cha)})`;
  divStats.appendChild(stats);
  divElement.appendChild(document.createElement("hr"));
 
  const specialAbilitiesDiv = document.createElement("div");
  divElement.appendChild(specialAbilitiesDiv);

  const special_abilities = monster["special_abilities"];
  const special_abilities_p = document.createElement("p");
  const special_abilities_header = document.createElement("h3");

  special_abilities_header.innerText = "Special Abilities";
  specialAbilitiesDiv.appendChild(special_abilities_header);

  if(special_abilities["length"] == 0){
    const emptySpan = document.createElement("span");
    emptySpan.textContent = "None";
    specialAbilitiesDiv.appendChild(emptySpan);
  }else{
    for (let i = 0; i < special_abilities["length"]; i++){
      const spName = special_abilities[i]["name"];
      const spDesc = special_abilities[i]["desc"];
      const span = document.createElement("span");
      span.classList.add("attribute-name");
      span.textContent = `${spName}`;
      const desc = document.createElement("p");
      desc.classList.add("attribute-description");
      desc.innerText = `${spDesc}`;
      specialAbilitiesDiv.appendChild(span);
      specialAbilitiesDiv.appendChild(desc);
    }
  }

  const divActions = document.createElement("div");
  divElement.appendChild(divActions);

  const actionHeader = document.createElement("h3");
  actionHeader.innerText = "Actions";
  divActions.appendChild(actionHeader);

  const actions = monster["actions"];

  if(actions["length"] == 0){
    const emptySpan = document.createElement("span");
    emptySpan.textContent = "None";
    divActions.appendChild(emptySpan);
  }else{
    for(let i = 0; i < actions["length"]; i++){
      const actionName = actions[i]["name"];
      const actionDesc = actions[i]["desc"];
      const span = document.createElement("span");
      span.classList.add("attribute-name");
      span.textContent = `${actionName}`;
      const desc = document.createElement("p");
      desc.classList.add("attribute-description");
      desc.innerText = `${actionDesc}`;
      divActions.appendChild(span);
      divActions.appendChild(desc);
    }
  }

  const divLengendary = document.createElement("div");
  divElement.appendChild(divLengendary);

  const lengendHeader = document.createElement("h3");
  lengendHeader.innerText = "Legendary Actions";
  divActions.appendChild(lengendHeader);

  const lActions = monster["legendary_actions"];

  if(lActions["length"] == 0){
    const emptySpan = document.createElement("span");
    emptySpan.textContent = "None";
    divActions.appendChild(emptySpan);
  }else{
    for(let i = 0; i < lActions["length"]; i++){
      const actionName = lActions[i]["name"];
      const actionDesc = lActions[i]["desc"];
      const span = document.createElement("span");
      span.classList.add("attribute-name");
      span.textContent = `${actionName}`;
      const desc = document.createElement("p");
      desc.classList.add("attribute-description");
      desc.innerText = `${actionDesc}`;
      divActions.appendChild(span);
      divActions.appendChild(desc);
    }
  }
}



/**
 * @param {int} stat -- an attribute stat e.g. 18
 * @returns {string} -- the modifier computed from that stat e.g. +4
 */
function getStatModifier(stat) {
    const mod = Math.floor((stat - 10) / 2);
    if (mod >= 0) {
        return `+${mod}`;
    } else {
        return `-${Math.abs(mod)}`;
    }
}

/**
 * Validate a response to ensure the HTTP status code indcates success.
 * 
 * @param {Response} response HTTP response to be checked
 * @returns {object} object encoded by JSON in the response
 */
 function validateJSON(response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}
