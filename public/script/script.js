"use strict";

import CLASSgameplay from './source/CLASS-gameplay.js';

window.TABlargeur = 10;
window.TABhauteur = 10;
window.MAPlargeur = 10;
window.MAPhauteur = 10;


const URLscore = 'https://neo-tetris.alwaysdata.net/';

var gameplay = new CLASSgameplay(URLscore);

window.move = gameplay.move.bind(gameplay);
window.moveMaintenu = gameplay.moveMaintenu.bind(gameplay);
window.menu = gameplay.menu.bind(gameplay);
window.dialogChoice = gameplay.dialogChoice.bind(gameplay);
window.showInventory = gameplay.showInventory.bind(gameplay);
window.showVendor = gameplay.showVendor.bind(gameplay);
window.actionItemInventory = gameplay.actionItemInventory.bind(gameplay);
window.actionItemVendor = gameplay.actionItemVendor.bind(gameplay);