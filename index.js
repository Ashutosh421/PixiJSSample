import { CardLevel } from './src/JS/Levels/CardLevel';
import { App } from './src/JS/App';
import { ARTween } from './src/JS/ARTween';

const Stats = require('stats.js');
const statsHolder = document.createElement('div');
statsHolder.setAttribute('id', 'StatsHolder');
document.body.appendChild(statsHolder);

const statistics = [createNewStat(0), createNewStat(1), createNewStat(2)];

function createNewStat(statIndex) {
	const stats = new Stats();
	stats.showPanel(statIndex);
	stats.dom.style.position = 'relative';
	stats.dom.style.top = 'auto';
	stats.dom.style.left = 'auto';
	statsHolder.appendChild(stats.dom);
	return stats;
}

statistics.forEach(stat => stat.begin());

const app = new App({
	width: window.innerWidth,
	height: window.innerHeight,
	antialias: true,
	transparent: false,
	resolution: 1,
	backgroundColor: 0x6e6e6e
});   //Creating the App
app.trackWindow();

app.ticker.add(() => {
	statistics.forEach(stat => stat.update());
	ARTween.Update();
});

document.body.appendChild(app.view);

const cardLevel = new CardLevel('CardLevel', app);
app.addLevel(cardLevel).renderLevel(cardLevel);

statistics.forEach(stat => stat.end());

