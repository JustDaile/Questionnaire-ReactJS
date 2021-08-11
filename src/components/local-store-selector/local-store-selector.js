import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {
  getQuestionnaireIds,
  getQuestionnaire,
  saveQuestionnaire,
} from "../../store/local-store";
import "./local-store-selector.css";
import cuid from "cuid";

class LocalStoreSelector extends React.Component {
  constructor(props) {
    super(props);
    let questionnaires = getQuestionnaireIds();
    this.state = {
      onChange: props.onChange ? props.onChange : () => {},
      defaultItem: questionnaires.length > 0 ? questionnaires[0] : "none",
    };
    if (!this.props.id) {
      this.state.onChange(this.state.defaultItem, 0);
    }
  }
  async updateSelection() {
    const select = document.querySelector("#questionnaire_select");
    const selectedIndex = select.selectedIndex;
    const selectedValue = select.options[selectedIndex].value;
    await this.state.onChange(selectedValue, selectedIndex);
  }
  render() {
    const questionaires = getQuestionnaireIds();
    console.log(`render selector with selected: ${this.props.id}`);

    return (
      <Col sm="12" md="5" lg="3" className="m-2 pl-4">
        <FloatingLabel controlId="floatingSelectGrid" label="Questionnaire">
          <Form.Select
            size="sm"
            aria-label="Questionnaire selector"
            id={"questionnaire_select"}
            onChange={() => {
              this.updateSelection();
            }}
            value={this.props.id}
          >
            {questionaires.map((id, i) => {
              const loaded = getQuestionnaire(id);
              if (!loaded) {
                return <option>Deleted {id}</option>;
              }
              return (
                <option key={i} value={id}>
                  {loaded.title ? loaded.title : "untitled questionnaire"}
                </option>
              );
            })}
          </Form.Select>
        </FloatingLabel>
      </Col>
    );
  }
}

export default LocalStoreSelector;
