import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import QuestionRenderer from "../question-renderer/question-renderer";
import "./questionnaire-renderer.css";

// QuestionnaireRenderer - Only responsible for rendering
// Should be extended and override methods to deal with anything else.
class QuestionnaireRenderer extends React.Component {
  getTitle() {
    return this.props.questionnaire.title;
  }
  getQuestions() {
    return this.props.questionnaire.questions || [];
  }
  renderTitle() {
    return <h1>{this.getTitle()}</h1>;
  }
  renderQuestions() {
    return this.getQuestions().map((question, questionIndex) => {
      return (
        <Col
          xl="4"
          lg="6"
          sm="12"
          key={`question_column_${questionIndex}`}
          className={"question"}
          id={`question_${questionIndex}`}
        >
          {this.renderQuestion(question, questionIndex)}
        </Col>
      );
    });
  }
  renderQuestion(question, index) {
    return (
      <QuestionRenderer key={`question_${index}`} index={index} {...question} />
    );
  }
  render() {
    return (
      <Container fluid className={"questionnaire"}>
        <Row className={"header"}>
          <Col className={"text-center"}>{this.renderTitle()}</Col>
        </Row>
        <Row>{this.renderQuestions()}</Row>
      </Container>
    );
  }
}

export default QuestionnaireRenderer;
