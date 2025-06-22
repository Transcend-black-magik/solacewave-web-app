import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../../data/questions';
import { getAllCountries, getFeaturedCountries } from '../../data/countries';
import AnimatedBackground from '../common/AnimatedBackground';
import ProgressBar from '../common/ProgressBar';
import RadioButton from '../common/RadioButton';
import Checkbox from '../common/Checkbox';
import Dropdown from '../common/Dropdown';
import '../../styles/components/questionnaire.css';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  
  const questions = questionsData.questions;
  const totalQuestions = questions.length;

  // Load countries data
  useEffect(() => {
    setFeaturedCountries(getFeaturedCountries());
    setAllCountries(getAllCountries());
  }, []);
  
  // Calculate progress
  useEffect(() => {
    setProgress((currentQuestionIndex / totalQuestions) * 100);
  }, [currentQuestionIndex, totalQuestions]);

  const handleSingleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleMultipleOptionSelect = (questionId, option, isChecked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (isChecked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(item => item !== option)
        };
      }
    });
  };

  const handleCountrySelect = (questionId, country) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: country
    }));
  };

  const isQuestionAnswered = (question) => {
    if (question.type === 'group') {
      return question.subQuestions.every(sq => answers[sq.id]);
    }
    
    return !!answers[question.id];
  };
  
  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Validate if question is answered
    if (!isQuestionAnswered(currentQuestion)) {
      // Show error or prompt
      return;
    }
    
    // Animate transition
    setIsAnimating(true);
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // If last question, navigate to account creation page
        navigate('/create-account', { state: { answers } });
      }
      setIsAnimating(false);
    }, 500);
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 500);
    }
  };
  
  const handleSkip = () => {
    // Skip logic - for questions that can be skipped
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const renderQuestionContent = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return null;
    
    if (currentQuestion.type === 'group') {
      return (
        <div className="question-group">
          <h3 className="question-main">{currentQuestion.question}</h3>
          {currentQuestion.subQuestions.map(subQuestion => (
            <div key={subQuestion.id} className="sub-question">
              <p className="question-text">{subQuestion.question}</p>
              <div className="options-container">
                {subQuestion.options.map(option => (
                  <RadioButton
                    key={option}
                    id={`${subQuestion.id}-${option}`}
                    name={subQuestion.id}
                    value={option}
                    label={option}
                    checked={answers[subQuestion.id] === option}
                    onChange={() => handleSingleOptionSelect(subQuestion.id, option)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (currentQuestion.type === 'multiple') {
      return (
        <div className="question-single">
          <h3 className="question-main">{currentQuestion.question}</h3>
          {currentQuestion.instruction && (
            <p className="question-instruction">{currentQuestion.instruction}</p>
          )}
          <div className="options-container checkbox-grid">
            {currentQuestion.options.map(option => (
              <Checkbox
                key={option}
                id={`${currentQuestion.id}-${option}`}
                name={currentQuestion.id}
                value={option}
                label={option}
                checked={(answers[currentQuestion.id] || []).includes(option)}
                onChange={(e) => handleMultipleOptionSelect(
                  currentQuestion.id,
                  option,
                  e.target.checked
                )}
              />
            ))}
          </div>
        </div>
      );
    }
    
    if (currentQuestion.type === 'country') {
      return (
        <div className="question-single">
          <h3 className="question-main">{currentQuestion.question}</h3>
          <div className="country-select-container">
            <Dropdown
              id={currentQuestion.id}
              name={currentQuestion.id}
              options={allCountries}
              value={answers[currentQuestion.id] || ''}
              defaultLabel={currentQuestion.defaultOption || "Select Country"}
              featuredOptions={featuredCountries}
              onChange={(value) => handleCountrySelect(currentQuestion.id, value)}
            />
          </div>
        </div>
      );
    }
    
    // Default single option question
    return (
      <div className="question-single">
        <h3 className="question-main">{currentQuestion.question}</h3>
        <div className="options-container">
          {currentQuestion.options.map(option => (
            <RadioButton
              key={option}
              id={`${currentQuestion.id}-${option}`}
              name={currentQuestion.id}
              value={option}
              label={option}
              checked={answers[currentQuestion.id] === option}
              onChange={() => handleSingleOptionSelect(currentQuestion.id, option)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="questionnaire-page">
      <AnimatedBackground variant="subtle" />
      
      <div className="questionnaire-header">
        <h2>Mental Health Assessment</h2>
        <ProgressBar progress={progress} />
      </div>
      
      <div className={`questionnaire-container ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="question-number">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        {renderQuestionContent()}
        
        <div className="navigation-buttons">
          <button 
            className="btn btn-outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          {questions[currentQuestionIndex]?.canSkip && (
            <button 
              className="btn btn-text"
              onClick={handleSkip}
            >
              Skip
            </button>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isQuestionAnswered(questions[currentQuestionIndex])}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
      
      <div className="questionnaire-footer">
        <p>Your privacy is important to us. All information shared will be kept confidential.</p>
      </div>
    </div>
  );
};

export default QuestionnairePage;