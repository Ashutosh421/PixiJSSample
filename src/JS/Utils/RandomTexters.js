
//Feel free to add any sentence here :)
export const RandomTextList = [      
	'YOU WIN :)',
	'COINS 25$',
	'YOU LOOSE :( YOU LOST 25$',
	':D :) GREAT MOVE :) :D',
	'BONUS  :D 25$'
];

/**
 * Returns and integer in range start - end
 * @param {number} start 
 * @param {number} end 
 */
export const RandomRangeInt = (start , end) => {
	return Math.floor(Math.random() * (end - start + 1)) + start;
};

export const RandomTextStyles = [
	{
		'fill': [
			'#e0e067',
			'#211cf2'
		],
		'fontSize': 20,
		'fontStyle': 'italic',
		'letterSpacing': 2,
		'lineJoin': 'round',
		'strokeThickness': 2
	},
	{
		'fill': '#dcbe32',
		'fontFamily': 'Georgia',
		'fontSize': 25,
		'fontVariant': 'small-caps',
		'letterSpacing': 2,
		'strokeThickness': 1
	},
	{
		'fill': '#1b15f9',
		'fontFamily': 'Tahoma',
		'fontSize': 27,
		'fontVariant': 'small-caps',
		'letterSpacing': 2,
		'strokeThickness': 1
	},
	{
		'fill': '#4af457',
		'fontSize': 24,
		'fontVariant': 'small-caps',
		'letterSpacing': 2,
		'strokeThickness': 2
	},
	{
		'fill': '#4af457',
		'fontFamily': 'Comic Sans MS',
		'fontSize': 32,
		'fontVariant': 'small-caps',
		'letterSpacing': 2,
		'strokeThickness': 1
	}
];
