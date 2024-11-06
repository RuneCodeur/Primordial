"use strict";

import CLASSgameplay from './source/CLASS-gameplay.js';

window.TABlargeur = 10;
window.TABhauteur = 10;
window.MAPlargeur = 3;
window.MAPhauteur = 3;


const URLscore = 'https://neo-tetris.alwaysdata.net/';

var gameplay = new CLASSgameplay(URLscore);

window.move = gameplay.move.bind(gameplay);
window.moveMaintenu = gameplay.moveMaintenu.bind(gameplay);
window.menu = gameplay.menu.bind(gameplay);
window.dialogChoice = gameplay.dialogChoice.bind(gameplay);