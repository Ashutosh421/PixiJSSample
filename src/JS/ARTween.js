import { EventEmitter } from './EventEmitter';
import { ticker } from 'pixi.js';

/**
 *  This is the most basic Tween Engine. Since this is at baby stage, I have added only four tween functions.
 *  1. Linear
 *  2. EaseInCubic
 *  3. EaseOutCubic
 *  4. EaseInBack
 *  5. EaseOutBack
 *  Credit for Tween Equations ofcourse goes to Robert Penner.
 *  
 *  Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 */
export class Tweener{
	constructor(start, end, duration, easeType){
		if(new.target === Tweener){
			throw new TypeError('Tweener is Abstract! You can\'t make an object of an Abstract class!');
		}
		this.eventEmitter = new EventEmitter();    //EventEmitter for the Tweener
		this.startValue = start;                   //Start Value of the Tween
		this.currentValue = start;                 //Current Vale of the Tween
		this.gapTime = 0;
		this.endValue = end;                       //End Value of the Tween
		this.duration = duration;                  //Duration of the Tween
		this.tweenFun = easeType;                  //Tween Function to be used
	}

	/**
     * OnTweenStart
     */
	start(){
		this.startTime = ARTween.status;        //Record the start time
		this.eventEmitter.trigger('start' , this.currentValue);        //Fire an event to the event listeners onstart
		this.started = true;                        
	}

	/**
     * Function to check of the tween is complete
     * @param {boolean} condition An annoymous or arrow function evluating the completeness
     */
	tweenerCompleteCheck(condition) {
		condition() && this.eventEmitter.trigger('complete', this.currentValue);
	}

	/**
     * Subscribe to an event on the Tweener
     * @param {'start'|'update'|'complete'} eventName Name of the event
     * @param {(value)=>void} callback Callback function
     */
	on(eventName , callback){
		this.eventEmitter.on(eventName , callback);
	}

	/**
     * Destroy the tweener and the resources occupied by it
     */
	flush(){
		this.eventEmitter.flush();
	}
}

/**
 * Value Tweener. Extends Tweener. Interpolates single digit as per the ease type provided
 */
export class ValueTweener extends Tweener{
	constructor(start, end, duration, easeType){
		super(start, end, duration, easeType);
	}

	/**
     * On Tweener update
     */
	update(){
		if(!this.started) return;
		this.eventEmitter.trigger('update', this.currentValue);
		this.currentTime = (ARTween.status) - this.startTime;
		this.currentValue = this.tweenFun(this.currentTime , this.currentValue , this.endValue - this.currentValue , this.duration);
		this.tweenerCompleteCheck(() => ARTween.status >= this.startTime + this.duration);
	}
}

/**
 * Value Tweener. Extends Tweener. Interpolates vector2D as per the ease type provided
 */
export class Vector2DTweener extends Tweener{
	constructor(start, end, duration, easeType){
		super(start, end, duration, easeType);
	}

	update(){
		if(!this.started) return;
		this.eventEmitter.trigger('update', this.currentValue);
		this.currentTime = ARTween.status - this.startTime;
		this.currentValue.x = this.tweenFun(this.currentTime , this.currentValue.x , this.endValue.x - this.currentValue.x , this.duration);
		this.currentValue.y = this.tweenFun(this.currentTime , this.currentValue.y , this.endValue.y - this.currentValue.y , this.duration);
		this.tweenerCompleteCheck(() => (ARTween.status >= this.startTime + this.duration));
	}
}

//All the existing tweeners
const tweeners = new Array(); 

export class ARTween{

	static init(ticker){
		ARTween.ticker = ticker;
		ARTween.status = 0;
	}
    
	/**
     * Interpolates number as per the ease type
     * @param {number} start Start value
     * @param {number} endValue Target Value
     * @param {number} duration Duration
     * @param {EaseType} easeType EaseType
     */
	static Value(start , endValue , duration , easeType = EaseType.LINEAR){
		const tweener = new ValueTweener(start , endValue, duration, easeType);
		tweeners.push(tweener);
		tweener.start(ARTween.ticker);
		tweener.on('complete' , () => {
			tweeners.splice(tweeners.indexOf(tweener) , 1);
			tweener.flush();
		});
		return tweener;
	}

	/**
     * Interpolates Vector2D as per the ease type
     * @param {Vector2D} start Start value
     * @param {Vector2D} endValue Target value
     * @param {number} duration Duration
     * @param {EaseType} easeType EaseType
     */
	static Vector2D(start , endValue , duration , easeType = EaseType.LINEAR){
		const tweener = new Vector2DTweener(start , endValue, duration, easeType);
		tweeners.push(tweener);
		tweener.start(ARTween.ticker);
		tweener.on('complete' , () => {
			tweeners.splice(tweeners.indexOf(tweener) , 1);
			tweener.flush();
		});
		return tweener;
	}

	/**
     * Updates the Tween Engine as per the tick
     * @param {PIXI.Application.ticker} ticker 
     */
	static Update(ticker){
		ARTween.status++;
		tweeners.forEach(tweener => tweener.update(ticker));
	}
    
	static VisibilityChange(hidden){
		hidden ? ticker.shared.stop() : ticker.shared.start();
	}

	/**
     * Clears the resources occupied
     */
	static flush(){
		tweeners.splice(0 , tweeners.length);
	}
}

class TweenEQ{
	static linear(time , start , change , duration){
		return (change * time / duration) + start;
	}

	static easeInCubic(time, start, change, duration) {
		return change*(time/=duration)*time*time + start;
	}
    
	static easeOutCubic(time, start, change, duration) {
		return change*((time=time/duration-1)*time*time + 1) + start;
	}

	static easeInBack(time, start, change, duration, s = 1.70158) {
		return change*(time/=duration)*time*((s+1)*time - s) + start;
	}
    
	static easeOutBack(time, start, change, duration, s = 2.70158) {
		return change*((time=time/duration-1)*time*((s+1)*time + s) + 1) + start;
	}
}

document.onvisibilitychange = () => ARTween.VisibilityChange(document.hidden);


export const EaseType = {
	LINEAR :  TweenEQ.linear,
	EASEINCUBIC : TweenEQ.easeInCubic,
	EASEOUTCUBIC : TweenEQ.easeOutCubic,
	EASEINBACK: TweenEQ.easeInBack,
	EASEOUTBACK: TweenEQ.easeOutBack
};
