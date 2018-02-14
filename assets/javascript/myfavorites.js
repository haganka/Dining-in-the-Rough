
var favorites = JSON.parse(localStorage.getItem("savedplaces"));

if (!Array.isArray(favorites)) {
    favorites = [];

}
/** Saves restaurants and corresponding links in local storage 
 * @param {method} event - Prevents page from reloading
 * @return {function} putOnPage - runs putOnPage function
 */
function saveRestaurant(event) {

    event.preventDefault();

    var rest = $(this).attr('data-name');
    var link = $(this).attr('data-url');
    link = '<span class="right"><a target="_blank" href=' + link + '>' + "Visit on Yelp" + '</a></span>';
    var save = [rest, link];
    favorites.push(save);
    localStorage.setItem("savedplaces", JSON.stringify(favorites));


    putOnPage();
}

$(document).on("click", ".favBox", saveRestaurant);

/** 
 * Gets restaurant names and links from local storage and appends to My Favorites div
 * */
function putOnPage() {
    $(".saved-list").empty();

    var insideFavorites = JSON.parse(localStorage.getItem("savedplaces"));
    var empty = true;
    if (!Array.isArray(insideFavorites)) {
        insideFavorites = [];
    }
    
    for (var i = 0; i < insideFavorites.length; i++) {
        var name = $("<p>").append(insideFavorites[i]);
        var remove = $("<button class=delete id=deleteID>").text("x").attr("data-index", i);
        name.prepend(remove);
        $(".saved-list").append(name);
        $('.saved-list').removeClass('hidden');
        empty = false;


    }

    if (empty) {
        $('.saved-list').addClass('hidden');
    }

}
putOnPage();

/**
 * On click removes corresponding restaurant name and link from My Favorites and local storage 
 * @param {method} event 
 * @return {function} putOnPage - calls putOnPage to push to favorites
*/
$(document).on("click", "button.delete", function () {
    var favelist = JSON.parse(localStorage.getItem("savedplaces"));
    var currentIndex = $(this).attr("data-index");

    favelist.splice(currentIndex, 1);
    favorites = favelist;
    localStorage.setItem("savedplaces", JSON.stringify(favelist));

    putOnPage();
});

