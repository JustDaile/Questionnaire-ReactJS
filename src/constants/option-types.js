const OptionTypes = {
  MULT_CHOICE_CHECK: "multiple-choice-check",
  SINGLE_CHOICE_RADIO: "single-choice",
  SINGLE_CHOICE_SELECT: "single-choice-select",
  // MATHMATICAL_INPUT: "mathematical",
  // GRAMMATICAL_INPUT: "grammatical",
};

export default OptionTypes;
export function getHTMLInputTypeForQuestionType(questionType) {
  const inputType =
    questionType === OptionTypes.MULT_CHOICE_CHECK
      ? "checkbox"
      : questionType === OptionTypes.SINGLE_CHOICE_RADIO
      ? "radio"
      : questionType === OptionTypes.SINGLE_CHOICE_SELECT
      ? "select"
      : questionType === OptionTypes.MATHMATICAL_INPUT
      ? "number"
      : questionType === OptionTypes.GRAMMATICAL_INPUT
      ? "text"
      : "error";
  if (inputType === "error") {
    throw new Error(
      `unknown question type '${questionType}' expected one of ${JSON.stringify(
        Object.keys(OptionTypes)
      )}`
    );
  }
  return inputType;
}
