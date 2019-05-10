var ieltsModule = (function() {
	var ielts = {};
	var dictionary = [];
	var iCurrentWord = {};
	var ctrlCount = 0;
	var firstWord_div;
	var secondWord_input;
	var listGroup_list;
	var firstLoad = true;
	
	// private
	ielts.initEvent = function(){
		// first words div
		firstWord_div = $("#ielts_contain .first_contain");

		// second words div
		secondWord_input = $("#ielts_contain #second_words");

		// list learnt words 
		listGroup_list = $("#ielts_contain .list-group");

		// load data
		this.reload();
	}

	ielts.reload = function() {
		if(firstLoad){
			//importData('file/ielts.txt');
			importData('file/EC.txt');
			setTimeout( function() {  // show words
				showWord();
			}, 50);
			$("#ielts_contain #resultLabel").text("");
			listGroup_list.empty();
			firstWord_div.html("");
			secondWord_input.val("");
			secondWord_input.focus();
			secondWord_input.focus();

			firstLoad = false;
		}
	}

	ielts.onEnterWords = function($this, event) {
		if (event.keyCode === 13) {
			this.checkWords($this);
	    } else if (event.keyCode === 17) {
	    	ctrlCount++;
	    	if (ctrlCount === 1) {
	    		showWordResult();
	    	} else if (ctrlCount === 2){
				if (iCurrentWord.English_meaning !== ""){
					addToLearntWords();
					removeWordFromDictionary();
				}
				$("#ielts_contain #resultLabel").text("");
				showWord();
			}
		}
	}

	// Validate word
	ielts.checkWords = function() {
		var inputWord = secondWord_input.val();
		if(inputWord !== "") {
			//if(iCurrentWord.vietnamese.indexOf(inputWord) !== -1)
			var wordCheck = iCurrentWord.vietnamese_ori.toUpperCase();
			if(wordCheck.trim() === inputWord.toUpperCase().trim()) 
				showResult(1);
			else
				showResult(2);
		}
	}

	// Show result
	showResult = function(result) {
		switch(result) {
			case 1 : $("#ielts_contain #resultLabel").removeClass("text-danger").addClass("text-success").text("OK");
					//remove word from dictionary
					addToLearntWords();
					// remove wors from list
					removeWordFromDictionary();
					// show word
					showWord();
					break;

			case 2 : $("#ielts_contain #resultLabel").removeClass("text-success").addClass("text-danger").text("Failed");
					break;

			case 3 : $("#ielts_contain #resultLabel").addClass("text-success").removeClass("text-danger").text("Finished");
					firstWord_div.text("");
					break;
		}
		secondWord_input.val("");
		secondWord_input.focus();
	}

	// Show word result
	showWordResult = function() {
		var Eng_meaning = iCurrentWord.English_meaning;
		if(Eng_meaning !== "")
			$("#ielts_contain #resultLabel").addClass("text-danger").removeClass("text-success").text(iCurrentWord.English_meaning);
		else
			$("#ielts_contain #resultLabel").addClass("text-danger").removeClass("text-success").text(iCurrentWord.vietnamese_ori);
			secondWord_input.val("");
		secondWord_input.focus();
	}

	// Add To Learnt Words
	var addToLearntWords = function() {
		var Eng_meaning = iCurrentWord.English_meaning !== "" ? ' - ' + iCurrentWord.English_meaning : "";
		firstWord_div.text(iCurrentWord.English + Eng_meaning);
		var li = "<a class='list-group-item'><span style='font-weight: bold;'>" + iCurrentWord.English +"</span>" + Eng_meaning + " : <span style='font-style: italic;'> "+ iCurrentWord.vietnamese_ori +'</span>' +"</a>";
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
				"English": words[0],
				"English_meaning": words.length > 2 ? words[1] : "",
        		"vietnamese_ori": words.length > 2 ? words[2] : words[1],
        		//"vietnamese": words.length > 2 ? splitWords(words[2]) : splitWords(words[1])
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
	   		if (dictionary[i].English === iCurrentWord.English) {
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
		iCurrentWord = randomWords();
		if(iCurrentWord === null || iCurrentWord === undefined) {
			showResult(3);
			return;
		} 
		var English = iCurrentWord.English !== "" ? iCurrentWord.English : "";
		firstWord_div.text(English);
		// reset Ctrl count
		ctrlCount = 0;
	}
	window.modules.ielts = ielts;
}());