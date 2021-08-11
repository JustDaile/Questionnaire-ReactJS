export function getQuestionnaireIds() {
  return JSON.parse(localStorage.getItem("questionnaires")) || [];
}

// get questionnaire from local storage by it's ID.
export function getQuestionnaire(id) {
  return JSON.parse(localStorage.getItem(id)) || undefined; // don't return null, return undefined instead.
}

export function saveQuestionnaire(id, questionnaire) {
  localStorage.setItem(id, JSON.stringify(questionnaire));
  let cache = getQuestionnaireIds();
  if (!cache.includes(id)) {
    cache.push(id);
    localStorage.setItem("questionnaires", JSON.stringify(cache));
  }
}

export function deleteQuestionnaire(id) {
  if (id === "none") {
    return;
  }
  let cache = getQuestionnaireIds();

  if (cache.includes(id)) {
    cache = cache.filter((i) => i !== id);
    localStorage.setItem("questionnaires", JSON.stringify(cache));
  }
  localStorage.removeItem(id);
}
