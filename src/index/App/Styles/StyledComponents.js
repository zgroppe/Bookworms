import styled from 'styled-components';

export const Card = styled.div`
	background-color: white;
	padding: 2%;
	border-radius: 5%;
	box-shadow: 2px 2px grey;
`

export const TitleText = styled.h1`
	font-family: Bookman;
	font-size: 7vh;
	font-weight: bold;
	margin: 0;
	background: -webkit-linear-gradient(#1cd1a1, #235cb9);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`

export const SubtitleText = styled.span`
	font-size: 2.5vh;
	color: #8c8989;
`

export const TextInput = styled.input`
	padding: 0.5em;
	margin: 0.5em;
	color: ${props => props.inputColor || '#235CB9'};
	background: transparent;
	width: 20vw;
	height: 1.5em;
	border: none;
	border-bottom: 1px solid #235cb9;
	&:focus {
		border-bottom: 1px solid #1cd1a1; // <Thing> when hovered
	}
`

export const PrimaryButton = styled.button`
	background: -webkit-linear-gradient(left, #1cd1a1, #235cb9);
	margin: 1em;	
	border-radius: 3px;
	width: 10vw;
	height: 2em;
	color: white;
	font-size: 2.5vh;
	border: 0px;
`

export const Hyperlink = styled.a`
	font-size: 2vh;
	color: blue;
	text-decoration: underline;
`
