import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
} from 'semantic-ui-react';
import he from 'he';

import Countdown from '../Countdown';
import { getLetter } from '../../utils';

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  const handleItemClick = (e, { name }) => {
    setUserSlectedAns(name);
  };

  const handleNext = (skipped = false) => {
    let point = 0;
    if (!skipped && userSlectedAns === he.decode(data[questionIndex].correct_answer)) {
      point = 1;
    }

    const qna = [...questionsAndAnswers];
    qna[questionIndex] = {
      question: he.decode(data[questionIndex].question),
      user_answer: skipped ? "Skipped" : userSlectedAns,
      correct_answer: he.decode(data[questionIndex].correct_answer),
      point,
    };

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }

    setCorrectAnswers(correctAnswers + point);
    setQuestionIndex(questionIndex + 1);
    setUserSlectedAns(qna[questionIndex + 1]?.user_answer || null);
    setQuestionsAndAnswers(qna);
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setUserSlectedAns(questionsAndAnswers[questionIndex - 1]?.user_answer || null);
    }
  };

  const timeOver = (timeTaken) => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Content>
              <Item.Extra>
                <Header as="h1" block>
                  <Icon name="info circle" />
                  <Header.Content>
                    {`Question No.${questionIndex + 1} of ${data.length}`}
                  </Header.Content>
                </Header>
                <Countdown
                  countdownTime={countdownTime}
                  timeOver={timeOver}
                  setTimeTaken={setTimeTaken}
                />
              </Item.Extra>
              <Message size="huge" floating>
                <b>{`Q. ${he.decode(data[questionIndex].question)}`}</b>
              </Message>
              <h3>Please choose one of the following answers:</h3>
              <Divider />
              <Menu vertical fluid size="massive">
                {data[questionIndex].options.map((option, i) => {
                  const letter = getLetter(i);
                  const decodedOption = he.decode(option);

                  return (
                    <Menu.Item
                      key={decodedOption}
                      name={decodedOption}
                      active={userSlectedAns === decodedOption}
                      onClick={handleItemClick}
                    >
                      <b style={{ marginRight: '8px' }}>{letter}</b>
                      {decodedOption}
                    </Menu.Item>
                  );
                })}
              </Menu>
              <Divider />
              <Item.Extra>
                <Button
                  secondary
                  content="Previous"
                  onClick={handlePrevious}
                  floated="left"
                  size="big"
                  icon="left chevron"
                  labelPosition="left"
                  disabled={questionIndex === 0}
                />
                <Button
                  color="orange"
                  content="Skip"
                  onClick={() => handleNext(true)}
                  floated="right"
                  size="big"
                  icon="forward"
                  labelPosition="right"
                />
                <Button
                  primary
                  content="Next"
                  onClick={() => handleNext(false)}
                  floated="right"
                  size="big"
                  icon="right chevron"
                  labelPosition="right"
                  disabled={!userSlectedAns}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;