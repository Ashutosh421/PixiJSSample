import * as PIXI from 'pixi.js';
import { Emitter } from 'pixi-particles';


/**
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 * Extends the ParticleContainer, setups the ParticleEmitter
 */
export class FireParticleEffect extends PIXI.particles.ParticleContainer{
	constructor(maxSize = 0, properties = {},  images, emitterConfig,){
		super(maxSize, properties);
		this.emitterConfig = emitterConfig || fireEmitter;
		const textures = images.map(value => PIXI.loader.resources[value].texture);
		this.elapsed = performance.now();
		this.emitter = new PIXI.particles.Emitter(this , textures , this.emitterConfig);
		this.emitter.emit = true;
	}

	update(){
		if(this.emitter){
			// console.log(`Updating Emitter`);
			this.now = performance.now();
			this.emitter.update((this.now - this.elapsed) * 0.001);
			this.emitter.resetPositionTracking();
			this.elapsed = performance.now();
		}
	}

	/**
	 * Destory the particle effect
	 */
	destroy(){
		super.destroy();		   //Call destroy function of super class
		this.emitter.destroy();    //destroy the emitter
	}
}

/**
 * Fire Emitter Settings
 */
const fireEmitter = {
	'alpha': {
		'start': 1,
		'end': 0
	},
	'scale': {
		'start': 1,
		'end': 3,
		'minimumScaleMultiplier': 1
	},
	'color': {
		'start': '#fcf646',
		'end': '#945900'
	},
	'speed': {
		'start': 200,
		'end': 50,
		'minimumSpeedMultiplier': 3
	},
	'acceleration': {
		'x': 0,
		'y': 0
	},
	'maxSpeed': 0,
	'startRotation': {
		'min': -90,
		'max': -90
	},
	'noRotation': true,
	'rotationSpeed': {
		'min': 10,
		'max': 10
	},
	'lifetime': {
		'min': 0.2,
		'max': 0.8
	},
	'blendMode': 'normal',
	'frequency': 0.001,
	'emitterLifetime': -1,
	'maxParticles': 500,
	'pos': {
		'x': 0,
		'y': 0
	},
	'addAtBack': false,
	'spawnType': 'circle',
	'spawnCircle': {
		'x': 0,
		'y': 70,
		'r': 30
	}
};
