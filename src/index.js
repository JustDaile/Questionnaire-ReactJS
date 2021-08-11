import React from "react";
import ReactDOM from "react-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import reportWebVitals from "./reportWebVitals";
import LocalQuestionnaireSelector from "./components/local-store-selector/local-store-selector";
import QuestionnaireDesigner from "./components/questionnaire-designer/questionnaire-designer";
import Questionnaire from "./components/questionnaire/questionnaire";
// import Questionnaire from "./components/questionnaire/Questionnaire";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

/*
The dreaded design aspect is here.
Its time to actually put some thought into design principles. 

I don't need to be an artist, I just need some guidelines.

1. [ ] - Keep your design balanced.
2. [ ] - Compartmentalize your design by using grids.
3. [ ] - Pick two or three base colors at most for your design.
4. [ ] - Try to make the graphics go well together.
5. [ ] - Improve your website’s typography.
6. [ ] - Make elements stand out by adding white space around them.
7. [ ] - Have all elements connected.

*/

import cuid from "cuid";
import {
  getQuestionnaireIds,
  getQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
} from "./store/local-store";

const ExampleQuestionnaire = {
  title: "Example Questionnaire",
  questions: [
    {
      title: "1.",
      details: "What is the capital of England?",
      options: [
        { text: "London", correct: true },
        { text: "Birmingham", correct: false },
        { text: "Manchester", correct: false },
        { text: "Yorkshire", correct: false },
      ],
      type: "single-choice",
      marks: "8",
    },
    {
      title: "2.",
      details: "What came first? ",
      options: [
        { text: "Chicken", correct: false },
        { text: "Egg", correct: false },
        { text: "Proto-Chicken", correct: true },
      ],
      type: "single-choice",
      marks: "10",
    },
    {
      title: "3.",
      details: "Is climate change an issue?",
      options: [
        { text: "yes", correct: true },
        { text: "no", correct: false },
      ],
      type: "single-choice-select",
      marks: "15",
    },
    {
      title: "4.",
      details: "Dark is the absents of what?",
      options: [
        { text: "Light", correct: true },
        { text: "The sun", correct: false },
        { text: "Day", correct: false },
        { text: "Love", correct: false },
      ],
      type: "multiple-choice-check",
      marks: 5,
    },
    {
      title: "5.",
      details: "Yesterday is the past. Today is the present. Tomorrow is what?",
      options: [
        { text: "The future", correct: true },
        { text: "The end", correct: false },
        { text: "Tuesday", correct: false },
      ],
      type: "multiple-choice-check",
      marks: 5,
    },
  ],
};

const PageStates = {
  SELECT: "SELECT",
  EDIT: "EDIT",
  COMPLETE: "COMPLETE",
  OVERVIEW: "OVERVIEW",
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      pageState: PageStates.EDIT,
      questionnaire: {},
    };
    this.onQuestionnaireChange = this.onQuestionnaireChange.bind(this);
    this.onSelectedChange = this.onSelectedChange.bind(this);
    this.new = this.new.bind(this);
    this.download = this.download.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.delete = this.delete.bind(this);

    if (getQuestionnaireIds().length < 1) {
      this.addExample();
    }
  }
  async addExample() {
    const id = cuid();
    saveQuestionnaire(cuid(), ExampleQuestionnaire);
    await this.setState({
      id: id,
      questionnaire: ExampleQuestionnaire,
    });
  }
  async onQuestionnaireChange(mutation) {
    console.log(
      `changed questionnaire: ${JSON.stringify(mutation.questionnaire)}`
    );
    saveQuestionnaire(this.state.id, this.state.questionnaire);
    await this.setState({
      id: this.state.id,
      questionnaire: mutation.questionnaire,
    });
  }
  async onSelectedChange(selectedValue) {
    console.log(`selection changed: ${selectedValue}`);
    const itemSeleted = selectedValue !== "none";
    const id = itemSeleted ? selectedValue : cuid();
    await this.setState({
      id: id,
      questionnaire: itemSeleted
        ? getQuestionnaire(id)
        : {
            title: "",
            questions: [],
          },
    });
  }
  async new() {
    const id = cuid();
    const questionnaire = {};
    saveQuestionnaire(id, questionnaire);

    await this.setState(
      {
        id: id,
        questionnaire: questionnaire,
      },
      () => {
        console.log(this.state);
      }
    );
  }
  download() {
    const loaded = getQuestionnaire(this.state.id);
    if (!loaded.title) {
      alert(`unable to load questionnaire with id: ${this.state.id}`);
      return;
    }

    let link = document.querySelector("#download");
    if (!link) {
      return;
    }
    link.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(loaded)
      )}`
    );
    link.setAttribute("download", `${loaded.title.replaceAll(" ", "-")}.json`);
  }
  async toggleComplete() {
    if (this.state.pageState !== PageStates.COMPLETE) {
      return await this.setState({ pageState: PageStates.COMPLETE });
    }
    await this.setState({ pageState: PageStates.EDIT });
  }
  async delete() {
    if (this.state.id === "none") {
      return;
    }
    deleteQuestionnaire(this.state.id);

    let cache = getQuestionnaireIds();
    if (cache.length === 0) {
      return await this.addExample();
    }
    await this.setState({
      id: cache[0],
      questionnaire: getQuestionnaire(cache[0]),
    });
  }
  renderPageState() {
    console.log("render page state");
    let jsx;
    switch (this.state.pageState) {
      case PageStates.COMPLETE:
        jsx = <Questionnaire questionnaire={this.state.questionnaire} />;
        break;
      case PageStates.EDIT:
        jsx = (
          <>
            <Row className="justify-content-end">
              <LocalQuestionnaireSelector
                id={this.state.id}
                onChange={async (v) => await this.onSelectedChange(v)}
                selected={this.state.questionnaire.title}
              />
            </Row>
            <QuestionnaireDesigner
              questionnaire={this.state.questionnaire}
              onChange={async (v) => this.onQuestionnaireChange(v)}
            />
          </>
        );
        break;
      default:
        jsx = <h2>Unhandled state: {this.state.pageState}</h2>;
    }
    return jsx;
  }
  render() {
    console.log("render main");
    return (
      <>
        <Navbar expand="md" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>Questionnaires ReactJS</Navbar.Brand>
            <Navbar.Toggle aria-controls="collapse-nav" />
            <Navbar.Collapse id="collapse-nav">
              <Nav className="me-auto">
                <Nav.Link
                  onClick={async () => await this.new()}
                  disabled={this.state.pageState !== PageStates.EDIT}
                >
                  New
                </Nav.Link>
                <Nav.Link
                  onClick={this.toggleComplete}
                  className={
                    this.state.pageState === PageStates.COMPLETE ? "active" : ""
                  }
                  disabled={
                    !this.state.questionnaire.title ||
                    !this.state.questionnaire.questions
                  }
                >
                  {this.state.pageState === PageStates.COMPLETE
                    ? "Edit"
                    : "Complete"}
                </Nav.Link>
                <Nav.Link
                  href="download"
                  id={"download"}
                  className={"undecorated"}
                  onClick={(e) => this.download(e)}
                  disabled={this.state.pageState !== PageStates.EDIT}
                >
                  Download
                </Nav.Link>
                <Nav.Link
                  onClick={this.delete}
                  disabled={this.state.pageState !== PageStates.EDIT}
                >
                  Delete
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {this.renderPageState()}
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
