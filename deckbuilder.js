var deck;
var cardlist;
var DEBUG = true
var MAX_CARD_COPIES = 3; //TODO not fully utilized

function init() {
	deck = [];
	cardlist = [];
	
	$.get('cardlist.txt', function(data) {
		var lines = data.split('\n');
		var newChar = true;
		var cnum = -1;
		for (var l = 0; l < lines.length; l++) {
			console.log(JSON.stringify(lines[l]));
			lines[l] = lines[l].replace(/[\r\n]/g, '');
			console.log(JSON.stringify(lines[l]));
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
		setCharacterDropdown();
	}, 'text');

}

function changeCardCount(cardname,count) {
	alert('changeCardCount');
	var found = false;
	for (var c = 0; c < deck.length; c++) {
		if (deck[c].name === cardname) {
			found = true;
			deck[c].count = count;
		}
	}
	if (!found) {
		deck.push({'name':cardname,'count':count});
	}
	
	//TODO update radio buttons in decklist
}

function setCharacterDropdown() {	
	var dropHTML = '<div class="btn-group">'+
			'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="character-dropdown-button">Select A Character<span class="caret"></span></button>'+
			'<ul class="dropdown-menu">';
	for (var c = 0; c < cardlist.length; c++) {
		dropHTML += '<li><a href="#" id="character-dropdown-' + c.toString() + '">' + cardlist[c].name + '</a></li>';
	}
	dropHTML += '</ul></div>';
	
	var dropDiv = document.getElementById("character-dropdown");
	dropDiv.innerHTML = dropHTML;
	
	for (var c = 0; c < cardlist.length; c++) {
		var num = Number(c);
		$('#character-dropdown-' + c.toString()).click(function(){setCharacterCardSelection(num)});
	}
}

//c is index to cardlist
function setCharacterCardSelection(c) {
	var selectionHTML = '<table class="table table-hover table-condensed"><tbody>';
	var cards = cardlist[c].cards;
	for (var crd = 0; crd < cards.length; crd++) {
		selectionHTML += '<tr><td><div class="btn-group" data-toggle="buttons" ' +
			'id="character-card-selection-' + procCardname(cards[crd]) + '">' +
			'<label class="btn btn-default" id="character-card-selection-0-' + procCardname(cards[crd]) + '"><input type="radio" name="cardnum">0</label>' + 
			'<label class="btn btn-default" id="character-card-selection-1-' + procCardname(cards[crd]) + '"><input type="radio" name="cardnum">1</label>' + 
			'<label class="btn btn-default" id="character-card-selection-2-' + procCardname(cards[crd]) + '"><input type="radio" name="cardnum">2</label>' +
			'<label class="btn btn-default" id="character-card-selection-3-' + procCardname(cards[crd]) + '"><input type="radio" name="cardnum">3</label>' +
			'</div></td>' +
			'<td>' + cards[crd] + '</td></tr>';
	}
	selectionHTML += '</tr></tbody></table>';
	
	document.getElementById("character-card-selection").innerHTML = selectionHTML;
	document.getElementById("character-dropdown-button").innerHTML = cardlist[c].name + '<span class="caret"></span>';
	
	for (var crd = 0; crd < cards.length; crd++) {
		/**
		for (var count = 0; count < MAX_CARD_COPIES; count++) {
			var countCopy = Number(count); //needed. Is this acting as a closure maybe?
			var crdCopy = Number(crd);
			$('#character-card-selection-' + count + '-' + procCardname(cards[crd])).click(function(){ changeCardCount(cards[crdCopy],countCopy)});
		}**/
		console.log($('#character-card-selection-' + procCardname(cards[crd])).length);
		$('#character-card-selection-' + procCardname(cards[crd])).click(function() {alert('clicked');}); // points to the clicked input button
		
	}
}

function confirmAction() {
	alert("You done did!");
}

function procCardname(cardname) {
	return cardname.toLowerCase().replace(/ /g,'_');
}