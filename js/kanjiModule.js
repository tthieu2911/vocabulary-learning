var kanjiModule = (function () {
	var kanji = {};
	var previousDictionary = [];
	var dictionary = [];
	var kanji_area = $("#kanji_area");
	var lastInput;
	var ctrlCount = 0;
	// private
	kanji.initEvent = function () {
		this.reload();
	}

	kanji.reload = function () {
		importData('file/kanji10.txt');
	}

	kanji.onEnterWords = function ($this, event) {
		var key = event.keyCode;
		if (key === 13) // enter
			this.checkWord($this);
		else if (key === 17) //Ctrl
			this.showWordResult($this);
		else if (key === 39) { //forward
			$($this).parent().parent().next().children().eq(1).find('input').focus();
			this.checkWord($this);
		}
		else if (key === 37) { //backwward
			$($this).parent().parent().prev().children().eq(1).find('input').focus();
			this.checkWord($this);
		}
		else if (key === 9) { //tab
			var lastBlock = $($this).parent().parent().prev().children().eq(1).find('input');
			this.checkWord(lastBlock);
			$($this) = lastInput;
		}
		lastInput = $($this);
	}

	kanji.checkWord = function ($this) {
		var input = $($this);
		var value = input.val().toUpperCase();
		var kanjiObj;
		if (value !== "") {
			var attributeContent = input.attr('kanjiKey');
			kanjiObj = JSON.parse(attributeContent).vietnamese.toUpperCase();
			successWord = JSON.parse(attributeContent).vietnamese + ': ' + JSON.parse(attributeContent).vietnamese_ori
			if (kanjiObj.indexOf(value) !== -1) {
				input.removeClass("text-danger").addClass("text-success");
				//input.parent().find('.result_kanji').removeClass("text-danger").addClass("text-success").text("OK");
				input.parent().find('.result_kanji').removeClass("text-danger").addClass("text-success").text(successWord);
				// move to next word
				$($this).parent().parent().next().children().eq(1).find('input').focus();
			}
			else {
				input.removeClass("text-success").addClass("text-danger");
				input.parent().find('.result_kanji').removeClass("text-success").addClass("text-danger").text("Failed");
			}
		}
	}

	kanji.mixWord = function () {
		var blocks = $(".kanji_block");
		for (var i = 0; i < blocks.length; i++) {
			var target = Math.floor(Math.random() * blocks.length - 1) + 1;
			var target2 = Math.floor(Math.random() * blocks.length - 1) + 1;
			blocks.eq(target).before(blocks.eq(target2));
		}
	}

	// Show word result
	kanji.showWordResult = function ($this) {
		var input = $($this);
		var kanjiObj;
		var attributeContent = input.attr('kanjiKey');
		kanjiObj = JSON.parse(attributeContent);
		switch (ctrlCount){
			case 0:{
				input.parent().find('.result_kanji').removeClass("text-success").addClass("text-danger").text(kanjiObj.vietnamese_ori);
				ctrlCount = 1;
				break;
			}
			case 1:{
				input.parent().find('.result_kanji').removeClass("text-success").addClass("text-danger").text(kanjiObj.vietnamese);
				ctrlCount = 0;
				break;
			}
		}
		
		input.val('');
	}

	// Import data from local file
	var importData = function (fileName) {
		$.get(fileName, function (data) {
			dictionary = [];
			var lines = data.split("\n");
			for (var i = 0; i < lines.length; i++) {
				var words = lines[i].split("/");
				// create object words
				var wordsObj = {
					"kanji": words[0],
					"on": words[1],
					"kun": words[2],
					"vietnamese": words[3],
					"vietnamese_ori": words[4]
				}
				dictionary.push(wordsObj);
			}
		});
		if (previousDictionary.length !== dictionary.length) {
			previousDictionary = dictionary;
			displayWord();
		}
	}

	// Import data from local file
	displayWord = function () {
		for (var i = 0; i < dictionary.length; i++) {
			var kanjiBlock = createKanjiBlock(dictionary[i]);
			kanji_area.append(kanjiBlock);
		}
	}

	// use to seperate VNese meanings
	var splitWords = function (words) {
		var arr = words.split(",").map(function (item) {
			return item.trim();
		});
		return arr;
	}

	var createKanjiBlock = function (obj) {
		var result =
			"<div class='col-6 col-md-2 kanji_block'>" +
			"<div class='kanji_contain'>" +
			obj.kanji +
			"</div>" +
			"<div class ='kanji_result_contain'>" +
			"<lable class='onkun_label'></lable>" +
			"<div class='kanji_result_contain dvKanjiResult'>" +
			"<lable>Result: </lable>" +
			"<span class='result_kanji'></span>" +
			"</div>" +
			"<input type='input' kanjiKey='" + JSON.stringify(obj) + "' class='form-control' onkeyup='onEnterWords(this, event)'/>" +
			"</div>" +
			"</div>";

		return result;
	}

	window.modules.kanji = kanji;
}());