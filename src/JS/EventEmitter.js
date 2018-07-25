/**
 * A shortest EventEmitter that serves the purpose.
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 */
export class EventEmitter{
	constructor()
	{
		this.events = new Map();    //Events Map
	}

	/**
     * Listens to the suppied event name
     * @param {string} eventName Name of the event
     * @param {()=>void} callback Callback function
     */
	on(eventName , callback){
		//If eventName already exists in the eventMap the push the callback in the event array else create new entry in the eventmap
		this.events.has(eventName) ? (this.events.get(eventName)).push(callback) : this.events.set(eventName , new Array(callback));
	}

	/**
     * Triggers the event. All the listeners will get an update
     * @param {string} eventName Name of the event to trigger
     * @param {...rest} args List of any number of arguments to be the callbacks
     */
	trigger(eventName , ...args){
		this.events.has(eventName) && (this.events.get(eventName)).map(callback => callback(args));
	}

	/**
     * Clean up the resources occupied
     */
	flush(){
		this.events.clear();   //Clear the Events Map
	}
}