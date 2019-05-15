window.modules = {};
var currentModule = "";
var moduleHira = "hira";
var moduleKanji = "kanji";
var hira_contain = $("#hira_contain");
var kanji_div = $("#kanji_div");
var fileName;

$(function() {
	"use strict"

	var modules = window.modules;
	// init all modules
	modules[moduleHira].initEvent();
	modules[moduleKanji].initEvent();

	// On first load, hira mode is default selection
	currentModule = moduleHira;
	hira_contain.show();
	kanji_div.hide();
});

function importFile() {

	fileName = hira_contain.find(":input[type='file']").val();

	if (currentModule === moduleHira){
		modules[moduleHira].reload(fileName);
	}
	if (currentModule === moduleKanji){
		modules[moduleKanji].reload(fileName);
	}
}

function onEnterWords($this, event) {
	modules[currentModule].onEnterWords($this, event);
}

function onFocus($this) {
	modules[currentModule].onFocus($this);
}

function mixKanjiWord() {
	modules.kanji.mixWord();
	$('.kanji_block').each(function(){
		$(this).find(':input').val("");
		$(this).find('.result_kanji').html('');
	});
}

function ClearAll() {
	$(':input').val("");
	$('.result_kanji').html('');
}

function changeMode(value) {
	currentModule = value;
	if (currentModule === moduleHira) {
		hira_contain.show();
		kanji_div.hide();
	} else if (currentModule === moduleKanji) {
		hira_contain.hide();
		kanji_div.show();
	} 
	modules[currentModule].reload();
}
