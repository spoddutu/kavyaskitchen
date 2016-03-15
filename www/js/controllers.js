angular.module('restaurant.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$localStorage',
  '$ionicPlatform', '$cordovaCamera', '$cordovaImagePicker', 
  function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, 
    $cordovaCamera, $cordovaImagePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
    var appCtrl = this;
    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    // Form data for reservation modal
    $scope.reservation = {};

    // From data for register modal
    appCtrl.register ={};
    appCtrl.register.showImage = false;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      appCtrl['loginModal'] = modal;
    });

    // Triggered in the login modal to close it
    appCtrl.closeModal = function(modalName) {
      appCtrl[modalName].hide();
    };

    // Open the login modal
    appCtrl.showModal = function(modalName) {
      appCtrl[modalName].show();
    };

    // Perform the login action when the user submits the login form
    appCtrl.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $localStorage.setObject('userinfo', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        appCtrl.closeModal('loginModal');
      }, 1000);
    };

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    })
    .then(function(modal){
      appCtrl['registerModal'] = modal;
    });

    $ionicPlatform.ready(function(){
      var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };

      appCtrl.takePicture = function(){
        $cordovaCamera.getPicture(options)
        .then(function(imageData){
          appCtrl.register.profileImage = "data:image/jpeg;base-64," + imageData;
          appCtrl.register.showImage = true;
        },
        function(err){

        })
      }

      var pickerOptions ={
        maximumImagesCount: 1,
        width: 100,
        height: 100,
        quality: 50
      }

      appCtrl.browsePicture = function(){
        $cordovaImagePicket.getPictures(pickerOptions)
        .then(function(images){
          appCtrl.register.profileImage = "data:image/jpeg;base-64," + images[0];
        },
        function(err){

        })
      }
    })

    // Create a Reservation Modal
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function(modal){
      appCtrl['reserveModal'] = modal;
    });

    // Perform the login action when the user submits the login form
    appCtrl.doReserve = function() {
      console.log('Doing login', $scope.reservation);

      // Simulate a reservation delay. 
      $timeout(function() {
        appCtrl.closeModal('reserveModal');
      }, 1000);
    };
  }
])


// Home controller to handle home page data
.controller('HomeCtrl', ['dish', 'promotion', 'leadership', 'baseURL', 
  function(dish, promotion, leadership, baseURL){
    var homeCtrl = this;
    homeCtrl.baseURL = baseURL;

    homeCtrl.dish = dish;
    homeCtrl.promotion = promotion;
    homeCtrl.leader = leadership;
}])

// Menu controller
.controller('MenuCtrl', ['dishes', 'baseURL', 'favFactory', '$ionicListDelegate', 
  '$ionicLoading', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
 function(dishes, baseURL, favFactory, $ionicListDelegate, $ionicLoading,
  $ionicPlatform, $cordovaLocalNotification, $cordovaToast){
  var menuCtrl = this;
  menuCtrl.tabIndex = 1;
  menuCtrl.filterText = '';
  menuCtrl.baseURL = baseURL;
  menuCtrl.favDishes = [];

  menuCtrl.dishes = dishes;

  menuCtrl.isTab = function(tab){
    return menuCtrl.tabIndex === tab;
  };

  menuCtrl.select = function(tab){
    menuCtrl.tabIndex = tab;
    if (tab === 2) {
        menuCtrl.filterText = "appetizer";
    }
    else if (tab === 3) {
        menuCtrl.filterText = "mains";
    }
    else if (tab === 4) {
        menuCtrl.filterText = "dessert";
    }
    else {
        menuCtrl.filterText = "";
    }    
  };

  // Method to store favourite dishes
  menuCtrl.addToFav = function(id){
    favFactory.addToFav(id);

    $ionicPlatform.ready(function(){
      $cordovaLocalNotification.schedule({
        id: 1,
        title: "Added Favorite",
        text: menuCtrl.dishes[id].name
      })
      .then(function(){
        // Success
      },
      function(){
        // Failure
      });

      $cordovaToast.show('Added Favorite ' + menuCtrl.dishes[id].name, 'long', 'center')
      .then(function(){
        // Success
      },
      function(){
        // Failure
      });
    });

    // Closes the option button.
    $ionicListDelegate.closeOptionButtons();
  };

}])

.controller('FavCtrl', ['baseURL', 'favFactory', 'dishes', 'favourites', 
  '$ionicLoading', '$ionicPopup',
  function(baseURL, favFactory, dishes, favourites, $ionicLoading, $ionicPopup){
    var favCtrl = this;
    favCtrl.baseURL = baseURL;
    favCtrl.isShowDelete = false;

    favCtrl.favs = favourites;

    favCtrl.dishes = dishes;

    favCtrl.toggleDelete = function(){
      favCtrl.isShowDelete = !favCtrl.isShowDelete;
    };

    favCtrl.deleteFav = function(id){
      favCtrl.isShowDelete = false;      
      var confirmPopup = $ionicPopup.confirm({
        title: "Confirm Delete",
        template: "Are you sure, you want to reomve from favs?"
      });

      confirmPopup.then(function(res){
        if(res){ // delete
          favFactory.deleteFav(id);
        }
        else{ // ignore
        }
      });
    }
}])

.controller('DishDetailCtrl',['$scope', 'dish', 'baseURL', 
  '$ionicPopover', 'favFactory', '$ionicModal',
  function($scope, dish, baseURL, $ionicPopover, favFactory, $ionicModal){
    var detailCtrl = this;
    detailCtrl.baseURL = baseURL;

    detailCtrl.dish = dish;

    // Create popover from template
    $ionicPopover.fromTemplateUrl('templates/dishdetail-popover.html',{
      scope: $scope
    })
    .then(function(popover){
      detailCtrl['dishdetailPopover'] = popover;
    });

    detailCtrl.showPopover = function($event, label){
      detailCtrl[label].show($event);
    };

    detailCtrl.hidePopover = function(label){
      detailCtrl[label].hide();
    };

    detailCtrl.addToFav = function(id){
      favFactory.addToFav(id);
      detailCtrl.hidePopover('dishdetailPopover');
    };

    $ionicModal.fromTemplateUrl('templates/comments-modal.html', {
      scope: $scope
    })
    .then(function(modal){
      detailCtrl['commentModal'] = modal;
    })

    detailCtrl.showModal = function(label){
      detailCtrl[label].show();
      detailCtrl.hidePopover('dishdetailPopover');
    };

    detailCtrl.closeModal = function(label){
      detailCtrl[label].hide();
    };
}])

.controller('ContactCtrl',['contact', function(contact){
  var contactCtrl = this;

  contactCtrl.detail = contact;
  
}])

.controller('HistoryCtrl', ['history', 'leaderships', 'baseURL', 
  function(history, leaderships, baseURL){
    var historyCtrl = this;
    historyCtrl.baseURL = baseURL;

    historyCtrl.detail = history;

    historyCtrl.leadership = leaderships;
}])
