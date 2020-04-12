import styled from 'styled-components';

export const Card = styled.div`
	background-color: white;
	padding: 2%;
	border: 3px solid rgba(133, 133, 133, 0.14);
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.45);
	border-radius: 25px;
`;

export const TitleText = styled.h1`
	font-family: 'Poppins';
	font-size: 72px;
	font-weight: bold;
	padding: 1%;
	margin: 0;
	background: linear-gradient(#1cd1a1, #235cb9);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`;

export const SubtitleText = styled.span`
	font-family: Poppins;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 30px;
	position: relative;
	//top: 277px;
	color: #8c8989;
`;

export const TextInput = styled.input`
	font-family: Poppins;
	font-style: normal;
	font-weight: normal;
	font-size: 18px;
	padding: 0.5em;
	padding-left: 3em;
	margin: 1em;
	color: ${props => props.inputColor || '#235CB9'};
	background: transparent;
	width: 20vw;
	height: 2.3em;
	border: none;
	border-bottom: 1px solid;
	&:focus {
		border-bottom: 1px solid #1cd1a1; // <Thing> when hovered
	};
	border-color:${props => props.borderColor || '#C7C7C7'};
`;

export const PrimaryButton = styled.button`
	background: linear-gradient(90deg, #1CD1A1 0%, #235CB9 100%);
	border-radius: 10px;
	margin: 1em;	
	width: 247px;
	height: 39px;
	color: white;
	font-size: 16px;
	border: 0px;
	text-align:center;
`;

export const Hyperlink = styled.a`
	font-family: Poppins;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	color: #3385FF;
	text-decoration: underline;
`;

export const Swatch = styled.div`
	padding: 5px;
	background: #fff;
	border-radius: 1px;
	boxShadow: '0 0 0 1px rgba(0,0,0,.1)';
	display: inline-block;
	cursor: pointer;
`;

export const Color = styled.div`
	width: 36px;
	height: 14px;
	border-radius: 2px;
	margin: 2px;
	background: ${(props) => (props.color ? props.color : 'black')};
`;
export const Navlink = styled.button`
	background: linear-gradient(179.63deg, #1CD1A1 -13.56%, #281AC8 158.3%);
	width: 350px;
	height: 50px;
	color: white;
	font-family: Poppins;
	font-size: 18px;
	border-radius: 90px;
	position: absolute;	
	left: -100px;

`;