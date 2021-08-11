import React from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import QuestionnaireRenderer from "../questionnaire-renderer/questionnaire-renderer";
import QuestionDesigner from "../question-designer/question-designer";
import OptionTypes from "../../constants/option-types";
import "./questionnaire-designer.css";
import { Form } from "react-bootstrap";

// Designer to design questionnaires.
//
// Properties:
//   - questionnaire     object
//     - title:          string
//     - questions:      array
//       - title         string
//       - details       string
//       - options       array
//         - text        string
//         - correct     bool
//       - marks         integer
//
// Optional properties:
//   - titlePlaceholder  string
//
class QuestionnaireDesigner extends QuestionnaireRenderer {
  constructor(props) {
    super(props);
    this.state = {
      onChange: props.onChange ? props.onChange : () => {},
    };
    this.onTitleChange = this.onTitleChange.bind(this);
  }
  async onTitleChange(e) {
    let mutated = Object.assign({}, this.props);
    mutated.questionnaire.title = e.target.value;
    await this.state.onChange(mutated);
  }
  async onQuestionChange({ index, title, details, options, type, marks }) {
    let mutated = Object.assign({}, this.props);
    console.log({ index, title, details, options, type, marks });
    mutated.questionnaire.questions[index] = {
      title: title,
      details: details,
      options: options,
      type: type,
      marks: marks,
    };
    await this.state.onChange(mutated);
  }
  async addQuestion() {
    let mutated = Object.assign({}, this.props);
    if (!mutated.questionnaire.questions) {
      mutated.questionnaire.questions = [];
    }
    mutated.questionnaire.questions.push({
      type: OptionTypes.SINGLE_CHOICE_RADIO,
      marks: 5,
    });
    await this.state.onChange(mutated);
  }
  async deleteQuestion(index) {
    let mutated = Object.assign({}, this.props);
    mutated.questionnaire.questions = mutated.questionnaire.questions.filter(
      (_, i) => i !== index
    );
    await this.state.onChange(mutated);
  }
  renderTitle() {
    const placeholder = this.props.titlePlaceholder
      ? this.props.titlePlaceholder
      : "Enter a title";
    return (
      <FloatingLabel controlId={"title-input"} label="Questionnaire Title">
        <Form.Control
          id={"title-input"}
          className={"editable-text text-center my-5"}
          type="text"
          placeholder={placeholder}
          onChange={this.onTitleChange}
          autoComplete={"off"}
          value={
            this.props.questionnaire.title ? this.props.questionnaire.title : ""
          }
        />
      </FloatingLabel>
    );
  }
  renderQuestions() {
    return (
      <>
        {super.renderQuestions()}
        <Row className={"justify-content-md-center"}>
          <div id="controls">
            <Button onClick={async () => await this.addQuestion()}>
              Add new question
            </Button>
          </div>
        </Row>
      </>
    );
  }
  renderQuestion(question, index) {
    return (
      <QuestionDesigner
        key={index}
        index={index}
        {...question}
        onChanged={async (qstate) => await this.onQuestionChange(qstate)}
        onDelete={async () => await this.deleteQuestion(index)}
      />
    );
  }
}

export default QuestionnaireDesigner;
