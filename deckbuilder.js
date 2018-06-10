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
		setCharacterDropdown();
	}, 'text');

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

function setCharacterDropdown() {	
	dropHTML = '<div class="btn-group">'+
			'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Select A Character<span class="caret"></span></button>'+
			'<ul class="dropdown-menu">';
	for (var c = 0; c < cardlist.length; c++) {
		dropHTML += '<li><a href="#" id="character-dropdown-' + c.toString() + '">' + cardlist[c].name + '</a></li>';
	}
	dropHTML += '</ul></div>';
	//alert(dropHTML);
	
	var dropDiv = document.getElementById("character-dropdown");
	dropDiv.innerHTML = dropHTML;
	
	for (var c = 0; c < cardlist.length; c++) {
		$('#character-dropdown-' + c.toString()).click(function(){confirmAction()});
	}
}

function confirmAction() {
	alert("You done did!");
}