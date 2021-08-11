import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import QuestionnaireRenderer from "../questionnaire-renderer/questionnaire-renderer";
import Question from "../question/question";
import "./questionnaire.css";

class QuestionnaireInteractive extends QuestionnaireRenderer {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // list of answered questions
      showResultModal: false, // show result modal
    };
    if (props.questionnaire.questions) {
      this.marked = new Array(props.questionnaire.questions.length).fill(0);
    }
    this.onComplete = this.onComplete.bind(this);
    this.onQuestionMarked = this.onQuestionMarked.bind(this);
  }
  async onComplete() {
    await this.setState({ show: true, showResultModal: true });
  }
  onQuestionMarked(index, correct) {
    this.marked[index] = correct
      ? parseInt(this.props.questionnaire.questions[index].marks)
      : 0;
    console.log(this.marked);
  }
  renderTitle() {
    return <h1 className="m-5">{this.props.questionnaire.title}</h1>;
  }
  renderQuestions() {
    return (this.props.questionnaire.questions || []).map(
      (question, questionIndex) => {
        return (
          <Col
            sm="12"
            key={`question_column_${questionIndex}`}
            className={"question"}
            id={`question_${questionIndex}`}
          >
            {this.renderQuestion(question, questionIndex)}
          </Col>
        );
      }
    );
  }
  renderQuestion(question, index) {
    return (
      <Question
        key={`question_${index}`}
        index={index}
        {...question}
        show={this.state.show}
        onMarked={this.onQuestionMarked}
      />
    );
  }
  renderModal() {
    return (
      <Modal
        show={this.state.showResultModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.getTitle()} Complete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Your results</h4>
          <p>
            You scored{" "}
            {this.marked.map((a) => (a ? a : 0)).reduce((a, c) => a + c)} out of{" "}
            {this.props.questionnaire.questions
              .map((q) => parseInt(q.marks))
              .reduce((a, c) => a + c)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.setState({ showResultModal: false })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  render() {
    return (
      <Container fluid className={"questionnaire"}>
        <Row className={"header"}>
          <Col className={"text-center"}>{this.renderTitle()}</Col>
        </Row>
        <Row>{this.renderQuestions()}</Row>
        <Row className="mt-1 mb-3">
          <Col md={{ offset: 10, span: 1 }}>
            <Button onClick={async () => await this.onComplete()}>
              {this.state.show ? "Results" : "Complete"}
            </Button>
            {this.renderModal(this.state.showResultModal)}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default QuestionnaireInteractive;
