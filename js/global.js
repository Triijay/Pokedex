$(function () {

	console.log("DOM-ready");

	// file_dir auch fürs JavaScript verfügbar machen
	file_dir = $("#file_dir").data("string");

	var myPokemon = [];
	var myPokemonCookieString = document.cookie;
	var pokeIds = myPokemonCookieString.split(" ");
	for(var i = 0; i < pokeIds.length; i++){
		myPokemon.push(parseInt(pokeIds[i]));
	}

	// Get the Pokémon list of the 151 original pokémon and add them to cards
	// Store the own pokemon additionally in the second html part
	$.ajax({url:"https://pokeapi.co/api/v2/pokemon?limit=151", success: function(result){
		var overviewHtmlCode = "";
		var classOwned = "";
		var icon = "";
		var promises = [];
		for(var i=0; i<result.results.length; i++){		
			var request = $.ajax({url:"https://pokeapi.co/api/v2/pokemon/" + (i+1), success: function(pokemon){
				if(pokemon != undefined){

					if($.inArray(pokemon.id, myPokemon) != -1){
						icon = '<img class="ownIcon pokemonSelected" src="img/heart-fill.svg">';
						classOwned = "owned";
					} else {
						icon = '<img class="ownIcon" src="img/heart.svg">';
						classOwned = "notOwned";
					}

					var html = '\
<div class="card pokemonCard '+ classOwned + ' mb-2 mx-1" data-id="'+ pokemon.id +'">'
	+ icon +'\
	<img class="card-img-top" src="'+ pokemon.sprites.front_default +'" alt="Card image cap">\
  	<div class="card-body">\
    <h5 class="card-title"><strong>'+ pokemon.id + '. </strong>'+ pokemon.name +'</h5>\
  </div>\
</div>'; 

				overviewHtmlCode += html;

			}}});	

			promises.push(request);	
		}

		$.when.apply(null, promises).done(function(){
			$(".pokemonOverview").html(overviewHtmlCode);
			$(".myPokemon").html(overviewHtmlCode);
			$(".myPokemon .pokemonCard.notOwned").hide();
		})
		
	}});




	// Button Click on Switch (All / Own)
	$("#viewToggle .btn").on("click", function(){
		// Toggle Button appearance
		$("#viewToggle .btn").removeClass("active");
		$(this).addClass("active");

		// Show specified list
		if($(this).hasClass("btn-own")){
			$(".myPokemon").removeClass("d-none").addClass("d-inline")
			$(".pokemonOverview").removeClass("d-inline").addClass("d-none")
		} else {
			$(".pokemonOverview").removeClass("d-none").addClass("d-inline")
			$(".myPokemon").removeClass("d-inline").addClass("d-none")
		}
	});


	// Button Click on heart
	$(document).on("click", ".ownIcon", function(){
		if($(this).hasClass("pokemonSelected")){
			removeOwnedPokemon($(this).parent(".pokemonCard").attr("data-id"));
		} else {
			addOwnedPokemon($(this).parent(".pokemonCard").attr("data-id"));
		}
	});


	// Refresh the html Code for the owned Pokemon
	function addOwnedPokemon(id){
		// Update MyPokemon
		var pokemonCardOwn = $(".myPokemon").find(".pokemonCard[data-id=" + id + "]");
		pokemonCardOwn.find(".ownIcon").addClass("pokemonSelected").attr("src", "img/heart-fill.svg");
		pokemonCardOwn.removeClass("notOwned").addClass("owned");
		pokemonCardOwn.show();	
		// Update Overview
		var pokemonCardOverview = $(".pokemonOverview").find(".pokemonCard[data-id=" + id + "]");
		pokemonCardOverview.find(".ownIcon").addClass("pokemonSelected").attr("src", "img/heart-fill.svg");
		pokemonCardOverview.removeClass("notOwned").addClass("owned");

		// Cookie aktualisieren
		setCookie();

	}

	function removeOwnedPokemon(id){
		// Update MyPokemon
		var pokemonCardOwn = $(".myPokemon").find(".pokemonCard[data-id=" + id + "]");
		pokemonCardOwn.find(".ownIcon").removeClass("pokemonSelected").attr("src", "img/heart.svg");
		pokemonCardOwn.removeClass("owned").addClass("notOwned");
		pokemonCardOwn.hide();	
		// Update Overview
		var pokemonCardOverview = $(".pokemonOverview").find(".pokemonCard[data-id=" + id + "]");
		pokemonCardOverview.find(".ownIcon").removeClass("pokemonSelected").attr("src", "img/heart.svg");
		pokemonCardOverview.removeClass("owned").addClass("notOwned");

		// Cookie aktualisieren
		setCookie();

	}

	function setCookie(){
		var ownedString = "";

		$(".myPokemon .pokemonCard.owned").each(function(){
			ownedString += $(this).attr("data-id") + " ";
		});
		document.cookie=ownedString;
	}


}); 