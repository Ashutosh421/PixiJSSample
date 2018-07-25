// import { PIXI } from './Config';
import * as PIXI from 'pixi.js';

/**
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 * This is intended to be an abstract class. All the levels to be added to the application should be extended from Level.
 */
export class Level extends PIXI.Container{
	constructor(levelName , app){
		super();
		if (new.target === Level) {
			throw new TypeError('Level is an abstract class! You cannot directly create an object of it!!');
		}
		this.app = app;
		this.name = levelName || 'DefaultLevel';
	}

	/**
     * Callbacks that derived classes can override
     */
	//onLevelWasLoaded(){}

	/**
     * Callbacks that derived classes can override. Can be used to clean up the resources occuiped
     */
	//onLevelWasUnloaded(){}

	/**
     * Destroys the parent container and any additonal resources occupied by the level
     */
	destroy(){
		super.destroy();
	}

	get Name(){
		return this.name;
	}
}

