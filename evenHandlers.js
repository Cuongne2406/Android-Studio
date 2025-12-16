import { useState } from "react";

export const useEventHandlers = () => {
   const [inputValue, setInputValue] = useState(""); 
    
    const [textValue, setTextValue] = useState(""); 

    const handleButtonClick = () => {
        alert("Button clicked!");
    };

    const handleTextClick = () => {
        alert("Text clicked!");
    };

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleTextViewClick = () => {
        setTextValue(inputValue);
    };

    return {
        inputValue,
        textValue,
        handleButtonClick,
        handleTextClick,
        handleInputChange,
        handleTextViewClick,
    };
};