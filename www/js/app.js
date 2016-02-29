// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('restaurant', ['ionic', 'restaurant.controllers', 'restaurant.services', 'restaurant.filters'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('loading:show', function(){
    $ionicLoading.show();
  });

  $rootScope.$on('loading:hide', function(){
    $ionicLoading.hide();
  });

  $rootScope.$on('$stateChangeStart', function(){
    $rootScope.$broadcast('loading:show');
  });

  $rootScope.$on('$stateChangeSuccess', function(){
    $rootScope.$broadcast('loading:hide');
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  if (ionic.Platform.isAndroid()) {    
    $ionicConfigProvider.scrolling.jsScrolling(true);
  }
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl',
    controllerAs: 'restaurant'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home',
        resolve: {
          dish: ['menuFactory', function(menuFactory){
            return menuFactory.get({id:0});
          }],

          promotion: ['promotionFactory', function(promotionFactory){
            return promotionFactory.get({id:0});
          }],

          leadership: ['leadershipFactory', function(leadershipFactory){
            return leadershipFactory.get({id:0});
          }]
        }
      }
    }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'mainContent': {
          templateUrl: 'templates/about.html',
          controller: 'HistoryCtrl',
          controllerAs: 'history',
          resolve: {
            history: ['historyFactory', function(historyFactory){
              return historyFactory.get({id: 0});
            }],

            leaderships: ['leadershipFactory', function(leadershipFactory){
              return leadershipFactory.query();
            }]
          }
        }
      }
    })

  .state('app.menu', {
      url: '/menu',
      views: {
        'mainContent': {
          templateUrl: 'templates/menu.html',
          controller: 'MenuCtrl',
          controllerAs: 'menu',
          resolve: {
            dishes: ['menuFactory', function(menuFactory){
              return menuFactory.query();
            }]
          }
        }
      }
    })

  .state('app.favourites', {
      url: '/favourites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favourites.html',
          controller: 'FavCtrl',
          controllerAs: 'fav',
          resolve:{
            dishes: ['menuFactory', function(menuFactory){
              return menuFactory.query();
            }],

            favourites: ['favFactory', function(favFactory){
              return favFactory.getFavs();
            }]
          }
        }
      }
    })

  .state('app.contact', {
      url: '/contact',
      views: {
        'mainContent': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl',
          controllerAs: 'contact',
          resolve: {
            contact: ['contactFactory', function(contactFactory){
              return contactFactory.get({id:0});
            }]
          }
        }
      }
    })

  .state('app.dishdetails', {
      url: '/menu/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/dishdetail.html',
          controller: 'DishDetailCtrl',
          controllerAs: 'detail',
          resolve: {
            dish: ['$stateParams', 'menuFactory', function($stateParams, menuFactory){
              return menuFactory.get({id: parseInt($stateParams.id, 10)});
            }]
          }
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
