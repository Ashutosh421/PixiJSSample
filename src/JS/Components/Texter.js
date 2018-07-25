import { Sprite, TextMetrics, Text , TextStyle} from 'pixi.js';

//Feel free to add any expression you want to be converted to an ICON.
const expressions = [
	/\s?\$\s?/g,           // \s? 0 or 1 space '\' is used before any special character
	/\s?!\s?/g,
	/\s?@\s?/g,
	/\s?;\)\s?/g,
	/\s?:\)\s?/g,
	/\s?:\D\s?/g,
	/\s?:V\s?/g,
	/\s?:\(\s?/g
];

//Sprites to be loaded once regular expressions matches are found in the Text
//Add the ICON Here!
const IconImageMap = {
	':)' : './src/Images/Emoticons/Smile_50x50.png',     
	'$'  : './src/Images/Emoticons/Dollar_50x50.png',
	'!'  : './src/Images/Emoticons/Dollar_50x50.png',
	'@'  : './src/Images/Emoticons/Dollar_50x50.png',
	';)'  : './src/Images/Emoticons/Smile_50x50.png',
	':D'  : './src/Images/Emoticons/Smile_50x50.png',
	':V'  : './src/Images/Emoticons/Smile_50x50.png',
	':('  : './src/Images/Emoticons/Smile_50x50.png',
};



/**
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 * A Texter is responsible to indentify suppied regular expressions in the string and replaces it will it's sprite.
 * Extends PIXI.Text
 */
export class Texter extends Text {

	constructor(text, textStyle = new TextStyle()) {
		super(text, textStyle);
		this.processText(text);
	}

	/**
     * Texter Engine parses the text, looks up for supplied regex matches and replaces them with sprites
     */
	processText() {
		this.children.splice(0, this.children.length);   //First clean up the childrens
		const allMatches = Texter.findMatchesInString(this.text, expressions);    //Find matches

		allMatches.forEach(match => {                       //For all matches found
			Array.from(Object.keys(IconImageMap))           //Array from the Icons available in IconImageMap
				.filter(icon => match.for == icon)          //Filter out the matching icons
				.forEach(icon => this.replaceCharWithImage(match, IconImageMap[`${icon}`]));      //Replace the matching character with the Icons
		});
	}

	/**
     * Replace the characters in the string with the sprites
     * @param {string} subMatch The match found in the text
     * @param {string} spritePath Path of the sprite to be loaded
     */
	replaceCharWithImage(subMatch, spritePath) {
		const tempText = this.text.replace(subMatch.regex, '{..}').toString();   //First create spots where Icon is to be replaced
		const newPositions = Texter.getAllIndexes(/\{\.{2}\}/g, tempText);       //Get indexes of all the spots
		this.text = this.text.replace(subMatch.regex, '    ').toString();        //Replace spots with empty spaces

		for (let i = 0; i < newPositions.length; i++) {                     //For all spots replace with sprites
			const newSprite = Sprite.from(spritePath);                   
			this.addChild(newSprite);
			const subset = this.text.substring(0, newPositions[i]);
			newSprite.anchor.set(0.61, 0);
			const textMetric = TextMetrics.measureText(subset, this.style , false);      //Using TextMetric to measure the width of the substring
			const letterMetric = TextMetrics.measureText('O', this.style, false);
			newSprite.width = newSprite.height = letterMetric.height;
			newSprite.position.set(textMetric.width + 20, 0);
		}
	}

	/**
     * Destroys the texter
     */
	destroy(){
		super.destroy();
		this.children.splice(0, this.children.length);   //Destroy all the sprites replaced in the text
	}

	/**
     * Static Function.
     * Return a structure of all the matches found in the string passed
     * @param {string} textToScan Text to be scanned
     */
	static findMatchesInString(textToScan, expressions) {
		let allMatches = [];
		for (let i = 0; i < expressions.length; i++) {
			const perfectMatch = textToScan.match(expressions[i]);   //Find all matched
			if (perfectMatch && !allMatches.some(match => match.for == perfectMatch[0])) {
				const newMatch = {};     //Create a match structure
				newMatch.for = perfectMatch[0].trim();
				newMatch.locations = Texter.getAllIndexes(expressions[i], textToScan);
				newMatch.regex = expressions[i];
				allMatches.push(newMatch);
			}
		}
		return allMatches;
	}

	/**
     * Static Function
     * Gets all the matched indexes of the supplied regular expression
     * @param {RegExp} regexToCheck Regular expression to execute
     * @param {string} textToScan Text to be scanned
     */
	static getAllIndexes(regexToCheck, textToScan) {
		let indexes = [];
		let match;
		while ((match = regexToCheck.exec(textToScan)) != null) {
			indexes.push(match.index);
		}
		return indexes;
	}
}

