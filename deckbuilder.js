var deck;
var cardlist;
var DEBUG = true
var MAX_CARD_COPIES = 3; //TODO not fully utilized
var deckCardCount = 0;

function init() {
	deck = [];
	cardlist = [];
	
	$.get('cardlist.txt', function(data) {
		var lines = data.split('\n');
		var newChar = true;
		var cnum = -1;
		for (var l = 0; l < lines.length; l++) {
			lines[l] = lines[l].replace(/[\r\n]/g, '');
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
	console.log('changeCardCount');
	console.log(count);
	console.log(cardname);
	var found = false;
	var deckCountChange = 0;
	for (var c = 0; c < deck.length; c++) {
		if (deck[c].name === cardname) {
			found = true;
			deckCountChange = count - deck[c].count;
			
			//This stops infinite recursion when the toggle event triggers this
			if (deck[c].count === count) {
				console.log('no change needed.');
				return;
			}
			
			if (count === 0) {
				console.log('Deleting from deck.');
				deck.splice(c,1);
				var toDelete = document.getElementById('decklist-card-selection-' + procCardname(cardname)).parentNode.parentNode;
				toDelete.parentNode.removeChild(toDelete);
			} else {
				console.log('Updating card in deck.');
				deck[c].count = count;
				//console.log($('#decklist-card-selection-' + count.toString() + '-' + procCardname(cardname)));
				$('#decklist-card-selection-' + count.toString() + '-' + procCardname(cardname)).button("toggle");
				//may not find any buttons if char not currently selected
				$('#character-card-selection-' + count.toString() + '-' + procCardname(cardname)).button("toggle"); 
			}
			break;
		}
	}	
	if (!found) {
		console.log('Adding new card to deck.')
		//Create entry in internal decklist and interface
		deck.push({'name':cardname,'count':count});
		document.getElementById('decklist-table').innerHTML += cardSelectionTableRow(cardname,'decklist-card-selection');
		$('#decklist-card-selection-' + procCardname(cardname) + ' :input').change(function() { changeCardCount(this.getAttribute('data-cardname'), parseInt(this.name));});
		deckCountChange = count;
	}
		
	//TODO update total card count
	deckCardCount += deckCountChange;
	document.getElementById("deck-card-count").innerHTML = deckCardCount.toString();
	
	console.log(deck);
}

function setCharacterDropdown() {	
	var dropHTML = '<div class="btn-group">'+
			'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="character-dropdown-button">Select A Character<span class="caret"></span></button>'+
			'<ul class="dropdown-menu">';
	for (var c = 0; c < cardlist.length; c++) {
		dropHTML += '<li><a href="#" id="character-dropdown-' + c.toString() + '" name="' + c.toString() + '">' + cardlist[c].name + '</a></li>';
	}
	dropHTML += '</ul></div>';
	
	var dropDiv = document.getElementById("character-dropdown");
	dropDiv.innerHTML = dropHTML;
	
	for (var c = 0; c < cardlist.length; c++) {
		//var num = Number(c);
		$('#character-dropdown-' + c.toString()).click(function(){setCharacterCardSelection(parseInt(this.name))});
	}
}

//c is index to cardlist
function setCharacterCardSelection(c) {
	var selectionHTML = '<table class="table table-hover table-condensed"><tbody>';
	var cards = cardlist[c].cards;
	for (var crd = 0; crd < cards.length; crd++) {
		selectionHTML += cardSelectionTableRow(cards[crd],'character-card-selection');
	}
	selectionHTML += '</tr></tbody></table>';
	
	document.getElementById("character-card-selection").innerHTML = selectionHTML;
	document.getElementById("character-dropdown-button").innerHTML = cardlist[c].name + '<span class="caret"></span>';
	
	//WARNING: dplicated code in changeNum with deck list because I don't know how to make it single-point...
	for (var crd = 0; crd < cards.length; crd++) {		
		//var cardnameCopy = String(cards[crd]);
		//console.log($('#character-card-selection-' + procCardname(cards[crd]) + ' :input').length);
		$('#character-card-selection-' + procCardname(cards[crd]) + ' :input').change(function() { changeCardCount(this.getAttribute('data-cardname'), parseInt(this.name));}); // points to the clicked input button
	}
}

function procCardname(cardname) {
	return cardname.toLowerCase().replace(/ /g,'_');
}

function cardSelectionTableRow(cardname,idPrefix) {
	var count = countInDeck(cardname);
	return '<tr><td><div class="btn-group" data-toggle="buttons" ' +
		'id="' + idPrefix + '-' + procCardname(cardname) + '">' +
		'<label class="btn btn-default' + ((count === 0) ? ' active' : '') + '" id="' + idPrefix + '-0-' + procCardname(cardname) + '"><input type="radio" name="0" data-cardname="' + cardname + '"' + ((count === 0) ? ' checked' : '') + '>0</label>' + 
		'<label class="btn btn-default' + ((count === 1) ? ' active' : '') + '" id="' + idPrefix + '-1-' + procCardname(cardname) + '"><input type="radio" name="1" data-cardname="' + cardname + '"' + ((count === 1) ? ' checked' : '') + '>1</label>' + 
		'<label class="btn btn-default' + ((count === 2) ? ' active' : '') + '" id="' + idPrefix + '-2-' + procCardname(cardname) + '"><input type="radio" name="2" data-cardname="' + cardname + '"' + ((count === 2) ? ' checked' : '') + '>2</label>' + 
		'<label class="btn btn-default' + ((count === 3) ? ' active' : '') + '" id="' + idPrefix + '-3-' + procCardname(cardname) + '"><input type="radio" name="3" data-cardname="' + cardname + '"' + ((count === 3) ? ' checked' : '') + '>3</label>' + 
		'</div></td>' +
		'<td>' + cardname + '</td></tr>';
		
		/**'<label class="btn btn-default" id="' + idPrefix + '-1-' + procCardname(cardname) + '"><input type="radio" name="1" data-cardname="' + cardname + '">1</label>' + 
		'<label class="btn btn-default" id="' + idPrefix + '-2-' + procCardname(cardname) + '"><input type="radio" name="2" data-cardname="' + cardname + '">2</label>' +
		'<label class="btn btn-default" id="' + idPrefix + '-3-' + procCardname(cardname) + '"><input type="radio" name="3" data-cardname="' + cardname + '">3</label>' + **/
}

function countInDeck(cardname) {
	for (var crd = 0; crd < deck.length; crd++) {
		if (deck[crd].name === cardname) {
			return deck[crd].count;
		}
	}
	return 0;
}