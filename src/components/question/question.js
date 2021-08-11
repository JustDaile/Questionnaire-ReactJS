import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import QuestionRenderer from "../question-renderer/question-renderer";
import Shuffler from "../../helpers/shuffler";
import { getHTMLInputTypeForQuestionType } from "../../constants/option-types";
// import { ReactComponent as Tick } from "../../../assets/tick.svg";
// import { ReactComponent as Cross } from "../../../assets/cross.svg";
import "./question.css";

class Question extends QuestionRenderer {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options ? Shuffler(this.props.options) : [],
      onMarked: this.props.onMarked ? this.props.onMarked : async () => {},
    };
  }
  checkSelectValid() {
    try {
      const selectedIndex = document.querySelector(
        `#${this.getSelectId()}`
      ).value;
      const selectedOption = this.getOption(selectedIndex);
      return selectedOption.correct
        ? { isValid: true, disabled: "disabled" }
        : { isInvalid: true, disabled: "disabled" };
    } catch (_) {
      // No option selected
    }
    return { isInvalid: true, disabled: "disabled" };
  }
  checkInputValid(index) {
    const isChecked = document.querySelector(
      `#question_${this.props.index}_option_${index}_input`
    ).checked;
    const isCorrect = this.getOption(index).correct;

    return isChecked && isCorrect
      ? { isValid: true, disabled: true }
      : isChecked && !isCorrect
      ? { isInvalid: true, disabled: true }
      : { disabled: true };
  }
  calculateMarks(type) {
    console.log("calculating marks");
    let correct = true;
    if (type === "select") {
      try {
        const selectedIndex = document.querySelector(
          `#${this.getSelectId()}`
        ).value;
        this.state.onMarked(
          this.props.index,
          this.getOption(selectedIndex)
            ? this.getOption(selectedIndex).correct
            : false
        );
      } catch (_) {
        // No option selected.
      }
      return;
    }
    this.props.options.forEach((option, index) => {
      const elem = document.querySelector(
        `#question_${this.props.index}_option_${index}_input`
      );
      if (!elem) {
        correct = false;
        return;
      }
      const checked = elem.checked;
      if ((checked && !option.correct) || (!checked && option.correct)) {
        correct = false;
      }
    });
    this.state.onMarked(this.props.index, correct);
  }
  getOption(index) {
    return this.state.options[index];
  }
  // Render title
  renderHeader() {
    return <h5>{this.props.title ? this.props.title : "unnamed question"}</h5>;
  }
  // Render details
  renderDetails() {
    return this.props.details ? this.props.details : "no details specified";
  }
  // Render the container, that contains the rendered options.
  // If overrided you'll have to call super.renderOptions or render options yourself.
  renderOptionsContainer() {
    return <Form className={"question-options"}>{this.renderOptions()}</Form>;
  }
  // Render a question.
  renderOptions() {
    const inputType = getHTMLInputTypeForQuestionType(this.props.type);

    if (this.state.options.length < 1) {
      return <h5>no options</h5>;
    }

    if (inputType === "select") {
      return (
        <Form.Group
          as={Row}
          xs="auto"
          className={"question-option"}
          data-q-index={this.props.index}
        >
          {this.renderSelect("choose an option: ")}
        </Form.Group>
      );
    }

    return (this.state.options || []).map((option, o) => {
      return this.renderInputOption(inputType, o);
    });
  }
  renderDefaultSelectOption() {
    return <option value="none">select an option...</option>;
  }
  // Render an option to the current select element.
  renderSelectOption(index) {
    return (
      <option value={index} key={`select_option_${index}`}>
        {this.getOption(index).text}
      </option>
    );
  }
  getSelectId() {
    return `option_select_${this.props.index}`;
  }
  getSelectClassName() {
    return "option-select";
  }

  // Render a select element for the current question.
  renderSelect() {
    return (
      <Form.Select
        aria-label={"option"}
        id={this.getSelectId()}
        className={this.getSelectClassName()}
        {...(this.props.show ? this.checkSelectValid() : "")}
        onChange={() => this.calculateMarks("select")}
      >
        {this.renderDefaultSelectOption()}
        {this.state.options.map((o, index) => {
          return this.renderSelectOption(index);
        })}
      </Form.Select>
    );
  }
  // Render a input element.
  renderInput(type, name, value, label, index) {
    return (
      <Col sm="10">
        <Form.Check
          id={`question_${this.props.index}_option_${index}_input`}
          label={label}
          type={type}
          name={name}
          value={value}
          data-o-index={index}
          className={`option`}
          {...(this.props.show ? this.checkInputValid(index) : "")}
          onChange={() => this.calculateMarks()}
        />
      </Col>
    );
  }
  // Render an option type input element.
  renderInputOption(type, index) {
    if (!this.getOption(index)) {
      return;
    }
    return (
      <Form.Group
        className="my-1"
        as={Row}
        data-q-index={this.props.index}
        id={`option_inputs_${index}`}
        key={`option_inputs_${index}`}
      >
        {this.renderInput(
          type,
          type === "radio" ? this.props.index : `option_${index}`,
          this.getOption(index).correct,
          this.getOption(index).text,
          index
        )}
      </Form.Group>
    );
  }

  render() {
    return (
      <Col
        style={{ "--index": this.props.index }}
        key={`question_${this.props.index}`}
      >
        <Card className={"question-card mb-3"}>
          <Card.Header>{this.renderHeader()}</Card.Header>
          <Card.Text className={"question-details p-3 mb-0"}>
            {this.renderDetails()}
          </Card.Text>
          <Card.Footer>{this.renderOptionsContainer()}</Card.Footer>
        </Card>
      </Col>
    );
  }
}

export default Question;
