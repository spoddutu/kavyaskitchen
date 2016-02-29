angular.module('restaurant.filters', [])

.filter('favFilter', function(){
	return function(dishes, favs){
		if(!dishes || favs.length === 0){
			return;
		}
		var filteredDishes = [];

		for(var i=0; i < dishes.length; i++){
			for(var j=0; j < favs.length; j++){
				if(dishes[i].id === favs[j].id){
					filteredDishes.push(dishes[i]);
				}
			}
		}

		return filteredDishes;
	}
})