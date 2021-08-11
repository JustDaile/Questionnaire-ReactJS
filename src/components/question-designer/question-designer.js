import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Popover from "react-bootstrap/Popover";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import QuestionRenderer from "../question-renderer/question-renderer";
import OptionTypes from "../../constants/option-types";
import { getHTMLInputTypeForQuestionType } from "../../constants/option-types";
import "./question-designer.css";

class QuestionDesigner extends QuestionRenderer {
  constructor(props) {
    super(props);
    this.state = {
      onChanged: props.onChanged ? props.onChanged : () => {},
      onDelete: props.onDelete ? props.onDelete : () => {},
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onMarksChange = this.onMarksChange.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.onSelectCorrectOption = this.onSelectCorrectOption.bind(this);
    this.onDetailsChange = this.onDetailsChange.bind(this);
    this.onOptionTypeChange = this.onOptionTypeChange.bind(this);
  }
  async update(fromElemById, itsProperty, toProperty, option = -1) {
    const updateValue = document.querySelector(`#${fromElemById}`)[itsProperty];
    console.log(
      `update option ${option}.${toProperty} from ${fromElemById} ${itsProperty} === ${updateValue}`
    );

    let mutated = Object.assign({}, this.props);
    if (option >= 0) {
      mutated.options[option][toProperty] = updateValue;
    } else {
      mutated[toProperty] = updateValue;
    }
    await this.state.onChanged(mutated);
  }
  populateInputWithValue(id) {
    const target = document.querySelector(`#${id}`);
    target.value = target.placeholder;
  }
  async addOption() {
    let mutated = Object.assign({}, this.props);
    if (!mutated.options) {
      mutated.options = [];
    }
    mutated.options.push({
      text: null,
      correct: false,
    });
    await this.state.onChanged(mutated);
  }
  async deleteOption(index) {
    let mutated = Object.assign({}, this.props);
    delete mutated.options[index];
    mutated.options = mutated.options.filter((o) => o !== null);
    await this.state.onChanged(mutated);
  }
  getCorrectOptionIndexes() {
    return (this.props.options || [])
      .map((o, i) => (o.correct ? i : false))
      .filter((i) => i !== false);
  }
  async onTitleChange(e) {
    let mutated = Object.assign({}, this.props);
    mutated.title = e.target.value;
    await this.state.onChanged(mutated);
  }
  async onMarksChange(e) {
    let mutated = Object.assign({}, this.props);
    mutated.marks = e.target.value;
    await this.state.onChanged(mutated);
  }
  async onOptionChange(e, index) {
    let mutated = Object.assign({}, this.props);
    mutated.options[index].text = e.target.value;
    await this.state.onChanged(mutated);
  }
  async onDetailsChange(e) {
    let mutated = Object.assign({}, this.props);
    mutated.details = e.target.value;
    await this.state.onChanged(mutated);
  }
  async onOptionSelect() {
    let mutated = Object.assign({}, this.props);
    mutated.options.forEach((option, optionIndex) => {
      const input = document.querySelector(
        `#question_${mutated.index}_option_${optionIndex}`
      );
      option.correct = false;
      if (input.checked) {
        option.correct = true;
      }
    });
    await this.state.onChanged(mutated);
  }
  async onSelectCorrectOption() {
    const options = document.querySelector(
      `#option_select_${this.props.index}`
    );
    const selected = options.options[options.selectedIndex].value;
    let mutated = Object.assign({}, this.props);
    mutated.options.forEach((option, index) => {
      option.correct = false;
      if (index === parseInt(selected)) {
        option.correct = true;
      }
    });
    await this.state.onChanged(mutated);
  }
  async updateCorrectInputOptions() {
    let mutated = Object.assign({}, this.props);
    mutated.options.forEach((option, optionIndex) => {
      const input = document.querySelector(
        `#question_${mutated.index}_option_${optionIndex}`
      );
      option.correct = false;
      if (input.checked) {
        option.correct = true;
      }
    });

    await this.state.onChanged(mutated);
  }
  async onOptionTypeChange(e) {
    let mutated = Object.assign({}, this.props);
    mutated.type = e.target.value;
    await this.state.onChanged(mutated);
  }
  renderHeader() {
    const id = `question_${this.props.index}_header`;
    const placeholder = "question title";
    const popover = (
      <Popover id={`${id}_popover`}>
        <Popover.Header as="h3">Delete this question?</Popover.Header>
        <Popover.Body>
          <Button
            variant="danger"
            className={"m-1"}
            onClick={async () => {
              await this.props.onDelete(this.props.index);
            }}
          >
            Accept
          </Button>
          <Button className={"m-1"} onClick={() => document.body.click()}>
            Cancel
          </Button>
        </Popover.Body>
      </Popover>
    );

    return (
      <Form.Group as={Row}>
        <Col md="11">
          <FloatingLabel label="Question Title">
            <Form.Control
              className={"questionTitle"}
              id={id}
              type="text"
              placeholder={placeholder}
              onChange={this.onTitleChange}
              value={this.props.title ? this.props.title : ""}
              autoComplete={"off"}
            />
          </FloatingLabel>
        </Col>
        <Col className={"align-self-center p-0"}>
          <OverlayTrigger
            trigger="click"
            placement="left"
            overlay={popover}
            rootClose={true}
          >
            <CloseButton />
          </OverlayTrigger>
        </Col>
      </Form.Group>
    );
  }
  renderDetails() {
    const id = `question_${this.props.index}_details`;
    const placeholder = "question details here..";
    return (
      <FloatingLabel label="Question Details">
        <Form.Control
          as="textarea"
          id={id}
          className={"question-details"}
          style={{ height: "100px" }}
          onChange={this.onDetailsChange}
          placeholder={placeholder}
          value={this.props.details ? this.props.details : ""}
        ></Form.Control>
      </FloatingLabel>
    );
  }
  renderOptions() {
    console.log(`rendering options of type ${this.props.type}`);
    const inputType = getHTMLInputTypeForQuestionType(this.props.type);
    const markInputId = `question_${this.props.index}_marks`;
    const selectorId = `question_${this.props.index}_type_selector`;
    console.log(`rendering options ${inputType}`);

    const jsx =
      inputType === "select" ? (
        <div className={"option"} data-q-index={this.props.index}>
          {this.renderSelect()}
        </div>
      ) : (
        (this.props.options || []).map((_, o) => {
          console.log(
            `rendering input option ${o} type ${inputType} for question ${this.props.index}`
          );
          return this.renderInputOption(inputType, o);
        })
      );

    return (
      <>
        <Form.Group id={"optionTypeSelector"} as={Row} className="mb-4">
          <Col md="12">
            <FloatingLabel label="Option Type">
              <Form.Select
                aria-label="Questionnaire type selector"
                size="sm"
                id={selectorId}
                value={this.props.type}
                onChange={this.onOptionTypeChange}
              >
                {Object.keys(OptionTypes).map((option, o) => {
                  return (
                    <option
                      key={`${selectorId}_option_${o}`}
                      value={OptionTypes[option]}
                    >
                      {option}
                    </option>
                  );
                })}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Form.Group>
        {jsx}
        <Form.Group as={Row} className="mb-2 mt-4 justify-content-between">
          <Col sm="12" md="6">
            <InputGroup>
              <InputGroup.Text>Marks</InputGroup.Text>
              <Form.Control
                className={"marks"}
                id={markInputId}
                type={"number"}
                placeholder={"total marks"}
                min={1}
                max={100}
                name={"marks"}
                autoComplete={"off"}
                onChange={this.onMarksChange}
                value={this.props.marks ? this.props.marks : ""}
              ></Form.Control>
            </InputGroup>
          </Col>
          <Col sm="12" md="5">
            <Button
              className="w-100"
              onClick={async () => await this.addOption()}
            >
              Add Option
            </Button>
          </Col>
        </Form.Group>
      </>
    );
  }
  // Render questionnaires inputs.
  // Typically these are either radio or checkbox.
  renderInput(type, name, value, label, index) {
    const id = `question_${this.props.index}_option_${index}`;
    const placeholder = "option..";

    const popover = (
      <Popover id={`${id}_popover`}>
        <Popover.Header as="h3">Delete this option?</Popover.Header>
        <Popover.Body>
          <Button
            className={"m-1"}
            onClick={async () => {
              await this.deleteOption(index);
            }}
          >
            Accept
          </Button>
          <Button className={"m-1"} onClick={() => document.body.click()}>
            Cancel
          </Button>
        </Popover.Body>
      </Popover>
    );

    return (
      <>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
                rootClose={true}
              >
                <CloseButton />
              </OverlayTrigger>
            </InputGroup.Text>
            <Form.Control
              className={"option_text"}
              type="text"
              placeholder={placeholder}
              onChange={(e) => {
                this.onOptionChange(e, index);
              }}
              autoComplete={"off"}
              value={
                this.props.options[index].text
                  ? this.props.options[index].text
                  : ""
              }
            />
          </InputGroup>
        </Col>
        <Col sm="4" className={"align-self-center"}>
          <Form.Check
            label={value === true ? "correct" : "incorrect"}
            id={id}
            onChange={this.onOptionSelect}
            type={type}
            name={name}
            checked={value === true}
            data-o-index={this.props.index}
          />
        </Col>
      </>
    );
  }
  renderSelect() {
    return (
      <Form.Select
        id={this.getSelectId()}
        onChange={this.onSelectCorrectOption}
        value={this.getCorrectOptionIndexes()[0]}
      >
        {super.renderDefaultSelectOption()}
        {(this.props.options || []).map((_, optionIndex) => {
          return super.renderSelectOption(optionIndex);
        })}
      </Form.Select>
    );
  }
}

export default QuestionDesigner;
