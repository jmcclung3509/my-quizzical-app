import React from "react";

export default function Quiz(props) {
    // console.log(props);

    return (
        <div className="quizEL">
            <p className="question">{props.question}</p>
        </div>
    );
}
