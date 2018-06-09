var deck;
var cardlist;
var DEBUG = true

function init() {
	deck = [];
	cardlist = [];
	
	$.get('cardlist.txt', function(data) {
		var lines = data.split('\n');
		var newChar = true;
		var cnum = -1;
		for (var l = 0; l < lines.length; l++) {
			if (newChar) {
				cnum++;
				cardlist[cnum] = {};
				cardlist[cnum].name = lines[l];
				cardlist[cnum].cards = [];
				newChar = false;
			} else if (lines[l].length === 0) {
				newChar = true;
			} else {
				cardlist[cnum].cards.push(lines[l]);
			}
		}
		if (DEBUG) {
			alert("Loaded!");
		}
	}, 'text');

	var cardlistFile = document.getElementById("cardlistFile");
	var fr = new FileReader();
	fr.onload = function() {
		
	}
	fr.readAsText(cardlistFile);
}

function changeCardCount(cardname,count) {
	var found = false;
	for (var c = 0; c < deck.length; c++) {
		if (deck[c].name === cardname) {
			found = true;
			deck[c].count = count;
		}
	}
}