import { Application } from 'pixi.js';

/**
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 * App is just a wrapper over the PIXIApplication to extend the functionality of the application.
 * Here I have introduced the concept of levels.
 * App can add/remove the levels. Ofcourse this can be configured on lot of detail, however this is in a baby stage as of now.
 */
export class App extends Application{
	constructor(options){
		super(options);
		this.currentLevel = this.stage;
		this.levels = new Array(this.currentLevel);
	}

	/**
     * Adds a new level to the levels list. This is in baby stage as of now.
     * @param {*} newLevel Name of the level to be added
     */
	addLevel(newLevel){
		this.levels.some(level => level.name === newLevel.name) ? console.error(`Level with name ${newLevel.name} already exists. Please assign a different name`) : this.levels.push(newLevel);
		return this;
	}

	/**
     * Updates the current loaded level as per the applications tick
     * @param {*} tick 
     */
	render(){
		this.renderer.render(this.currentLevel);
		this.currentLevel.onUpdate && (this.currentLevel.onUpdate(this.ticker));
	}

	/**
     * To change the level
     * @param {*} levelToBeLoaded Name of the level to be loaded
     */
	renderLevel(levelToBeLoaded){
		const newLevel = this.levels.find(level => level.name === levelToBeLoaded.name) || this.currentLevel;
		if(newLevel.name !== this.currentLevel.name){
			const oldLevel = this.currentLevel;
			this.currentLevel = newLevel;
			this.currentLevel.onLevelWasLoaded && this.currentLevel.onLevelWasLoaded();
			oldLevel.onLevelWasUnloaded && oldLevel.onLevelWasUnloaded();
			console.log(`Rendering: ${this.currentLevel.name}`);
		}
		return this;
	}

	/**
     * Resize the application as per the window size
     * @param {*} buffer A gap between the window dimensions and the app's renderer's dimensions
     */
	trackWindow(buffer = 0){
		this.renderer.autoResize = true;
		window.addEventListener('resize' , () => {
			this.renderer.resize(window.innerWidth - buffer , window.innerHeight - buffer);
		});
	}

	/**
     * Call this to destroy the Application. This cleans up the resources occupied
     */
	destroy(){
		super.destroy();
		this.levels.forEach(level => level.destroy());
		this.levels.splice(0, this.levels.length);
	}
}