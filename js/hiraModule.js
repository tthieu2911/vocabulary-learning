var hiraModule = (function() {

	var hira = {};
	var dictionary = [];
	var currentWord = {};
	var ctrlCount = 0;
	var firstWord_div;
	var secondWord_input;
	var listGroup_list;
	var hfirstLoad = true;
	
	// private
	hira.initEvent = function(){
		// first words div
		firstWord_div = $("#hira_contain .first_contain");

		// second words div
		secondWord_input = $("#hira_contain #second_words");

		// list learnt words 
		listGroup_list = $("#hira_contain .list-group");

		// load data
		this.reload();
	}

	hira.reload = function() {
		if(hfirstLoad){
			importData('file/japanese.txt');
			setTimeout( function() {  // show words
				showWord();
			}, 200);
			$("#hira_contain #resultLabel").text("");
			listGroup_list.empty();
			firstWord_div.html("");
			secondWord_input.val("");
			secondWord_input.focus();
			
			hfirstLoad = false;
		}
	}

	hira.onEnterWords = function($this, event) {
		if (event.keyCode === 13) {
			this.checkWords($this);
	    } else if (event.keyCode === 17) {
	    	ctrlCount++;
	    	if (ctrlCount === 1) {
	    		this.showWordResult();
	    	} else if (ctrlCount === 2){
				$("#hira_contain #resultLabel").text("");
	    		showWord();
	    	}
		}
	}

	// Validate word
	hira.checkWords = function() {
		var inputWord = secondWord_input.val();
		if(inputWord.trim() !== "") {
			var wordCheck = currentWord.vietnamese;
			if(wordCheck.indexOf(inputWord) !== -1) 
				this.showResult(1);
			else
				this.showResult(2);
		}
	}

	// Show result
	hira.showResult = function(result) {
		switch(result) {
			case 1 : $("#hira_contain #resultLabel").removeClass("text-danger").addClass("text-success").text("OK");
					//remove word from dictionary
					addToLearntWords();
					// remove wors from list
					removeWordFromDictionary();
					// show word
					showWord();
					break;

			case 2 : $("#hira_contain #resultLabel").removeClass("text-success").addClass("text-danger").text("Failed");
					break;

			case 3 : $("#hira_contain #resultLabel").addClass("text-success").removeClass("text-danger").text("Finished");
					firstWord_div.text("");
					break;
		}
		secondWord_input.val("");
		secondWord_input.focus();
	}

	// Show word result
	hira.showWordResult = function() {
		$("#hira_contain #resultLabel").addClass("text-danger").removeClass("text-success").text(currentWord.vietnamese_ori);
		secondWord_input.val("");
		secondWord_input.focus();
	}

	// Add To Learnt Words
	var addToLearntWords = function() {
		var kanji = currentWord.kanji !== "" ? '(' + currentWord.kanji + ')' : "";
		firstWord_div.text(currentWord.hira_kata + kanji);
		var li = "<a class='list-group-item'>"+ currentWord.hira_kata + kanji + ':<span> '+ currentWord.vietnamese_ori +'</span>' +"</a>";
		listGroup_list.prepend(li);
	}

	// Import data from local file
	var importData = function(fileName) {
		$.get(fileName, function(data) {
     	dictionary = [];
        var lines = data.split("\n");
        for(var i = 0 ; i < lines.length; i++) {
        	var words = lines[i].split("/");
        	// create object words
        	var wordsObj = {
        		"hira_kata": words[0],
        		"kanji": words.length > 2 ? words[1] : "",
        		"vietnamese_ori": words.length > 2 ? words[2] : words[1],
        		"vietnamese": words.length > 2 ? splitWords(words[2]) : splitWords(words[1])
        	}
	        dictionary.push(wordsObj);
        }});
	}

	var splitWords = function(words) {
		var arr = words.split(",").map(function(item) {
		  return item.trim();
		});
		return arr;
	}

	// Remove Word From Dictionary
	var removeWordFromDictionary = function(){
		for (var i =0; i < dictionary.length; i++)
	   		if (dictionary[i].hira_kata === currentWord.hira_kata) {
	     		dictionary.splice(i,1);
	      		break;
	   }
	}

	// Get random words
	var randomWords = function() {
	    var item = dictionary[Math.floor(Math.random()*dictionary.length)];
	    return item;
	};

	// Show word to screen
	function showWord() {
		currentWord = randomWords();
		if(currentWord === null || currentWord === undefined) {
			showResult(3);
			return;
		} 
		var kanji = currentWord.kanji !== "" ? '(' + currentWord.kanji + ')' : "";
		firstWord_div.text(currentWord.hira_kata + kanji);
		// reset Ctrl count
		ctrlCount = 0;
	}
	window.modules.hira = hira;
}());