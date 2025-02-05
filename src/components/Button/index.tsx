import React, { MouseEventHandler } from 'react';

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    label: string;
}

export const Button = (props: ButtonProps) => {
    return <button className="dark:text-indigo-400 p-2" onClick={props.onClick}>{props.label}</button>
}
