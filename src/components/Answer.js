import React from "react";

export default function Answer(props) {
    console.log(props);

    const answerButtons = props;
    let buttonStyle;

    if (props.checking === false) {
        if (props.isSelected === true) {
            buttonStyle = "choice selected";
        } else {
            if (props.isSelected === false) {
                buttonStyle = ` choice transparent`;
            }
        }
    } else if (props.checking === true) {
        if (props.isSelected === true && props.isCorrect === true) {
            buttonStyle = "choice correct transparent";
        } else if (props.isSelected === true && props.isCorrect === false) {
            buttonStyle = "choice incorrect transparent";
        } else if (props.isSelected === false && props.isCorrect === true) {
            buttonStyle = "choice correct transparent";
        } else if (props.isSelected === false && props.isCorrect === false) {
            buttonStyle = "choice transparent";
        }
    }

    return (
        <div
            className={buttonStyle}
            onClick={() => props.select(props.answerId, props.questionId)}
            key={props.id}
        >
            {props.answer}
        </div>
    );
}
