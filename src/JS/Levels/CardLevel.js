import { Level } from './Level';
import { Vector2D } from '../Vector2D';
import { FireParticleEffect } from '../Components/FireParticleEffect';
import { Texter } from '../Components/Texter';
import { RandomTextList, RandomTextStyles, RandomRangeInt } from '../Utils/RandomTexters';
import { Sprite , particles , loader } from 'pixi.js';
import { EaseType, ARTween } from '../ARTween';

/**
 * Written By: Ashutosh Rautela(https://github.com/Ashutosh421)
 * CardLevel is a Level that loads the Cards Stacks , demo particle effect and the Texter
 */
export class CardLevel extends Level {
	constructor(levelName, app) {
		super(levelName, app);        
		this.cards1 = new Array();     //First Stack
		this.cards2 = new Array();     //Second Stack
		this.totalCards = 144;         //Total Cards

		//Used Particle Container for holding the cards as it always faster to hold large number of similar elements as particles irrespective of any rendering engine line Unity, Unreal etc.
		this.cardsCotainer = new particles.ParticleContainer();   
		this.addChild(this.cardsCotainer);

		//Loading up the Resources with a promise chain.
		this.loadAllImageResources()
			.then(() => this.loadParticleEffectDemo())
			.then(()=> this.setUPCardGrid())
			.then(() => this.swapCards(this.cards1 , this.cards2, -1));
		this.loadTexters();
	}

	/**
     * Swaps the cards
     * @param {*} sourceStack The source stack from which the card is to be popped out
     * @param {*} targetStack The target stack in the which the card is to be pushed in
     * @param {*} cardIndex Keeping record of the current index
     */
	swapCards(sourceStack , targetStack, cardIndex){
		let lastCard = sourceStack.pop();
		this.moveCardToDestination(sourceStack , targetStack, lastCard , cardIndex++);
		//If the source stack is not empty keep on popping after 1 second else swap the stacks and restart the process
		sourceStack.length > 0 ? setTimeout(this.swapCards.bind(this , sourceStack , targetStack , cardIndex) , 1000) : setTimeout(this.swapCards.bind(this , targetStack , sourceStack , -1) , 4500);
	}

	/**
     * Method resposible to move the card to the destination
     * @param {*} sourceStack The source stack from which the card is popped
     * @param {*} targetStack The target stack in the which the card is pushed
     * @param {*} cardToMove The popped card from the source stack that is to be moved
     * @param {*} cardIndex Record of it's index
     */
	moveCardToDestination(sourceStack , targetStack, cardToMove , cardIndex){
		setTimeout(()=> this.cardsCotainer.setChildIndex(cardToMove , (1 + cardIndex)) , 1000);  //After 1 second change the card's index in SceneGraph to update the Render Order
		targetStack.push(cardToMove); //Push the card into target stack
		const targetPosition = sourceStack === this.cards1 ? new Vector2D(700 , 5 * (1 + cardIndex)) : new Vector2D(100 , 5 * (1 + cardIndex)); //Destination position where the card is to be moved
		const cardTranslationTween = ARTween.Vector2D(new Vector2D(cardToMove.position.x , cardToMove.position.y) , targetPosition   , 4000 ,EaseType.EASEINCUBIC);  //Creating a tween object to move the card to the destination
		cardTranslationTween.on('update' , value => cardToMove.position.set(value[0].x , value[0].y));  //Update the card's position as per the tween's interpolated values
	}

	/**
     * Method that load's the particle images and create the ParticleEmitter.
     * Returns a Promise
     */
	loadParticleEffectDemo() {
		const paticleImages = ['./src/Images/Particles/particle.png'];   //All the images that need to be loaded by the PIXI.loader
		return new Promise((resolve , reject) => {      
			loader.add(paticleImages).load(() => {         //On particle images loaded
				this.fireParticleEffect = new FireParticleEffect(1000, {    //Create a FireParticleEffect
					scale: true,
					position: true,
					rotation: true,
					uvs: true,
					alpha: true
				}, paticleImages);
				this.fireParticleEffect.position.set(this.app.renderer.width/2, this.app.renderer.height/2);
				this.addChild(this.fireParticleEffect);
				this.setChildIndex(this.fireParticleEffect , 0);    //Update Fire Particle effect index in the scene graph to change rendering order 
				resolve();   //Resolve the promise
			}).on('error' , ()=> reject('Error loading resource'));
		});
	}

	/**
     * Load resources to be used by the Texter
     */
	loadAllImageResources() {
		return new Promise((resolve, reject) => {
			loader.load('Smile', './src/Emoticons/Smile.png')
				.on('error', () => reject('Error loading Image'))
				.load(() => resolve());
		});
	}

	/**
     * Generates a texter with a random text and a random style
     */
	loadTexters() {
		this.texter = new Texter(RandomTextList[RandomRangeInt(0, RandomTextList.length - 1)], RandomTextStyles[RandomRangeInt(0, RandomTextStyles.length - 1)]);
		this.texter.position.set(this.app.renderer.width/2 - this.texter.width/2, this.app.renderer.height - 100);
		this.addChild(this.texter);
		this.randomizeText();
	}

	/**
     * Replaces the texter's content and style randomly
     */
	randomizeText() {
		setTimeout(this.randomizeText.bind(this), 2000);
		this.texter.text = RandomTextList[RandomRangeInt(0, RandomTextList.length - 1)];
		this.texter.style = RandomTextStyles[RandomRangeInt(0, RandomTextStyles.length - 1)];
		this.texter.processText();
	}

	/**
     * Setups the initial card grid
     */
	setUPCardGrid() {
		const cardPath = './src/Images/CharacterStack/CS_71_100x150.png';
		return new Promise((resolve, reject) => {
			loader.add(cardPath)
				.on('error', error => reject(`Error loading texture: ${error}`))
				.load(() => spawnNewSprite(this.cards1.length < this.totalCards)); //Once loaded spawn a sprite if the cards length less than total number of cards

			const spawnNewSprite = (respawn) => {
				const newCard = new Sprite(loader.resources[cardPath].texture);   //Spawn a New Card
				this.cardsCotainer.addChild(newCard);  //Add the card into the Card ParticleContainer
				this.cards1.push(newCard);             //Push the card into the first stack
				//Spawn a sprite if the cards length less than total number of cards
				respawn ? setTimeout(spawnNewSprite.bind(this, this.cards1.length < this.totalCards), 5) : resolve();
				newCard.position.set(100, 5 * (this.cards1.length));   //Update the new card's position
			};
		});
	}
  
	/**
     * OnUpdate. To be called every tick by the app
     * @param {*} ticker ticker
     */
	onUpdate(ticker) {
		this.fireParticleEffect && this.fireParticleEffect.update(ticker);
	}

	/**
     * Destroys and cleans up all the resources occupied by the CardLevel class
     */
	destroy(){
		super.destroy();            //Call Super class destory
		this.cards1.splice(0 , this.cards1.length);         //Clean first stack
		this.cards2.splice(0 , this.cards2.length);         //Clean second stack
		this.cardsCotainer.destroy();           //Destroys the Particle Container
		this.fireParticleEffect.destroy();          //Destroys the Fire Particle Effect
		this.texter.destroy();              //Destroy the Texter
	}
}
