angular.module('restaurant.services', ['ngResource'])

.constant('baseURL', 'https://heroku-kk-node.herokuapp.com/')

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

.factory('favFactory', ['$localStorage', function($localStorage){

	var favs = $localStorage.getObject('myfavs', '[]');

	return {
		addToFav: function(dish_id){
			for(var i=0; i< favs.length; i++){
				if(favs[i].id === dish_id){
					return;
				}
			}
			favs.push({id: dish_id});
			$localStorage.setObject('myfavs', favs);
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
			$localStorage.setObject('myfavs', favs);			
		}
	}

}])

.factory('$localStorage', ['$window', function($window){
	return {
		get: function(key, defaultValue){
			return $window.localStorage[key] || defaultValue;
		},

		set: function(key, value){
			$window.localStorage[key] = value;
		},

		getObject: function(key, defaultValue){
			return JSON.parse($window.localStorage[key] || defaultValue);
		},

		setObject: function(key, value){
			$window.localStorage[key] = JSON.stringify(value);
		}
	};
}])
