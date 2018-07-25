import { Point } from 'pixi.js';

/**
 * Extends the PIXI.Point
 * A shortest vector2D class that is intented to support the concept the direction as well.
 * 
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 */
export class Vector2D extends Point{
	constructor(x = 0 , y = 0){
		super(x , y);
	}

	/**
     * Returns the distance between two vector2D points
     * @param {Vector2D} v1 First vector2D
     * @param {Vector2D} v2 Second vector2D
     */
	static Distance(v1 , v2){
		return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
	}

	/**
     * Subracts from the vector
     * @param {Vector2D} target Vector2D to be subracted
     */
	subtract(target){
		this.x -= target.x;
		this.y -= target.y;
	}

	/**
     * Adds to the vectors
     * @param {Vector2D} target Vector2D to be added
     */
	add(target){
		this.x += target.x;
		this.y += target.y;
	}

	/**
     * Returns the magnitude of the Vector2D
     */
	getMagnitude(){
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
}