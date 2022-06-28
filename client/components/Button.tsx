import React from 'react';

export interface ButtonProps {
    text: string;
    onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className='font-mono font-bold py-2 px-4 bg-indigo-200 hover:bg-indigo-100 border-x-8 border-x-indigo-300 hover:border-x-indigo-200 border-b-8 border-b-indigo-700 hover:border-b-indigo-500 rounded-t'
            onClick={() => onClick()}
        >
            {text}
        </button>
    );
};
