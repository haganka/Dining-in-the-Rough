var favorites = JSON.parse(localStorage.getItem("savedplaces"));

if (!Array.isArray(favorites)) {
    favorites = [];
    
}

function saveRestaurant(event){

    event.preventDefault();

    var rest = $(this).attr('data-name');
    var link = $(this).attr('data-url');
    link = '<span class="right"><a target="_blank" href=' + link + '>' + "Visit on Yelp" + '</a></span>';
    var save = [rest, link];
    console.log("link", link);
    console.log("rest", rest);
    favorites.push(save);
    console.log("faves", favorites);
    localStorage.setItem("savedplaces", JSON.stringify(favorites));


putOnPage();
}

$(document).on("click", ".favBox", saveRestaurant);


function putOnPage () {
    $(".saved-list").empty();

    var insideFavorites = JSON.parse(localStorage.getItem("savedplaces"));
    var empty = true;
    if (!Array.isArray(insideFavorites)){
        insideFavorites = [];
        console.log("inside1", insideFavorites);
    }
    for (var i = 0; i < insideFavorites.length; i++) {
        var name = $("<p>").append(insideFavorites[i]);
        var remove = $("<button class=delete id=deleteID>").text("x").attr("data-index", i);
        name.prepend(remove);
        $(".saved-list").append(name);
        $('.saved-list').removeClass('hidden');
        empty = false;
        // $(".saved-places").append(insideFavorites[i]);

    }

    if (empty){
        $('.saved-list').addClass('hidden');
    }
    
}
putOnPage();

$(document).on("click", "button.delete", function() {
    var favelist = JSON.parse(localStorage.getItem("savedplaces"));
    var currentIndex = $(this).attr("data-index");

    favelist.splice(currentIndex, 1);
    favorites = favelist;

    localStorage.setItem("savedplaces", JSON.stringify(favelist));

    putOnPage();
  });

    