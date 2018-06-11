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
	for (var c = 0; c < deck.length; c++) {
		if (deck[c].name === cardname) {
			found = true;
			if (count === 0) {
				console.log('Deleting from deck.');
				deck.splice(c,1);
				var toDelete = document.getElementById('decklist-card-selection-' + procCardname(cardname)).parentNode.parentNode;
				toDelete.parentNode.removeChild(toDelete);
			} else {
				console.log('Updating card in deck.');
				deck[c].count = count;
				//console.log($('#decklist-card-selection-' + count.toString() + '-' + procCardname(cardname)).children().first());
				$('#decklist-card-selection-' + count.toString() + '-' + procCardname(cardname)).button("toggle");
			}
			break;
		}
	}	
	if (!found) {
		console.log('Adding new card to deck.')
		//Create entry in internal decklist and interface
		deck.push({'name':cardname,'count':count});
		document.getElementById('decklist-table').innerHTML += cardSelectionTableRow(cardname,'decklist-card-selection');
	}
	
	//TODO update card count
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
//TODO: Fetch card names from decklist in case some cards are already in deck
function setCharacterCardSelection(c) {
	var selectionHTML = '<table class="table table-hover table-condensed"><tbody>';
	var cards = cardlist[c].cards;
	for (var crd = 0; crd < cards.length; crd++) {
		selectionHTML += cardSelectionTableRow(cards[crd],'character-card-selection');
	}
	selectionHTML += '</tr></tbody></table>';
	
	document.getElementById("character-card-selection").innerHTML = selectionHTML;
	document.getElementById("character-dropdown-button").innerHTML = cardlist[c].name + '<span class="caret"></span>';
	
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
	//TODO add count param or get count from cardlist to preset radio button
	return '<tr><td><div class="btn-group" data-toggle="buttons" ' +
		'id="' + idPrefix + '-' + procCardname(cardname) + '">' +
		'<label class="btn btn-default" id="' + idPrefix + '-0-' + procCardname(cardname) + '"><input type="radio" name="0" data-cardname="' + cardname + '">0</label>' + 
		'<label class="btn btn-default" id="' + idPrefix + '-1-' + procCardname(cardname) + '"><input type="radio" name="1" data-cardname="' + cardname + '">1</label>' + 
		'<label class="btn btn-default" id="' + idPrefix + '-2-' + procCardname(cardname) + '"><input type="radio" name="2" data-cardname="' + cardname + '">2</label>' +
		'<label class="btn btn-default" id="' + idPrefix + '-3-' + procCardname(cardname) + '"><input type="radio" name="3" data-cardname="' + cardname + '">3</label>' +
		'</div></td>' +
		'<td>' + cardname + '</td></tr>';
}