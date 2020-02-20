import React, { useState } from 'react';
import styled from 'styled-components';

export const Card = styled.div`
	background-color: white;
	padding: 2%;
	border-radius: 2%;
	box-shadow: 2px 2px grey;
`;

export const TitleText = styled.h1`
	font-family: Bookman;
	font-size: 7vh;
	margin: 0;
	color: #3385ff;
`;

export const SubtitleText = styled.span`font-size: 2.5vh;`;
// import './Card.css';
// export default function Card(props) {
// 	return <Card>{props.children}</Card>;
// }
