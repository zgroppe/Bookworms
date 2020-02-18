import React, { useState } from 'react';
import './Card.css';
export default function Card(props) {
	return <div className="CardContainer">{props.children}</div>;
}
