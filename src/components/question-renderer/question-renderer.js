import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { getHTMLInputTypeForQuestionType } from "../../constants/option-types";
// import { ReactComponent as Tick } from "../../../assets/tick.svg";
// import { ReactComponent as Cross } from "../../../assets/cross.svg";
import "./question-renderer.css";

// Question - Only responsible for rendering
// Should be extended and override methods to deal with anything else.
class QuestionRenderer extends React.Component {
  // Render title
  renderHeader() {
    return <h3>{this.props.title}</h3>;
  }
  // Render details
  renderDetails() {
    return this.props.details;
  }
  // Render the container, that contains the rendered options.
  // If overrided you'll have to call super.renderOptions or render options yourself.
  renderOptionsContainer() {
    return <Form className={"question-options"}>{this.renderOptions()}</Form>;
  }
  // Render a question.
  renderOptions() {
    const inputType = getHTMLInputTypeForQuestionType(this.props.type);

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

    return (this.props.options || []).map((option, o) => {
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
        {this.props.options[index].text}
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
      >
        {this.renderDefaultSelectOption()}
        {this.props.options.map((o, index) => {
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
          label={label}
          type={type}
          name={name}
          value={value}
          data-o-index={index}
          className={`option`}
        />
      </Col>
    );
  }
  // Render an option type input element.
  renderInputOption(type, index) {
    if (!this.props.options[index]) {
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
          this.props.options[index].correct,
          this.props.options[index].text,
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
          <Card.Text className={"question-details p-3 mb-0"} as="div">
            {this.renderDetails()}
          </Card.Text>
          <Card.Footer>{this.renderOptionsContainer()}</Card.Footer>
        </Card>
      </Col>
    );
  }
}

export default QuestionRenderer;
