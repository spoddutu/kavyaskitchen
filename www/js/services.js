angular.module('restaurant.services', ['ngResource'])

.constant('baseURL', 'http://192.168.1.68:3000/')

.factory('menuFactory',['$resource', 'baseURL', function($resource, baseURL){
	return $resource(baseURL + 'dishes/:id', {id:'@id'});
}])

.factory('promotionFactory',['$resource', 'baseURL', function($resource, baseURL){
	return $resource(baseURL + 'promotions/:id', {id:'@id'});
}])

.factory('leadershipFactory',['$resource', 'baseURL', function($resource, baseURL){
	return $resource(baseURL + 'leadership/:id', {id:'@id'});
}])

.factory('contactFactory',['$resource', 'baseURL', function($resource, baseURL){
	return $resource(baseURL + 'contact/:id', {id:'@id'});
}])

.factory('historyFactory',['$resource', 'baseURL', function($resource, baseURL){
	return $resource(baseURL + 'history/:id', {id:'@id'});
}])

.factory('favFactory', [function(){

	var favs = [];

	return {
		addToFav: function(dish_id){
			for(var i=0; i< favs.length; i++){
				if(favs[i].id === dish_id){
					return;
				}
			}
			favs.push({id: dish_id});
		},

		getFavs: function(){
			return favs;
		},

		deleteFav: function(dish_id){
			for(var i=0; i< favs.length; i++){
				if(favs[i].id === dish_id){
					favs.splice(i, 1);
					break;
				}
			}			
		}
	}

}])
