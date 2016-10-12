
var app = angular.module('nice', ['ui.router', 'nvd3', 'gridster', 'ui.bootstrap', 'nice.services']);

app

.config(($locationProvider, $stateProvider, $urlRouterProvider) => {
		"ngInject";

		// Define our app routing, we will keep our layout inside the app component
		// The layout route will be abstract and it will hold all of our app views
		$stateProvider
				.state('app', {
						url: '/app',
						abstract: true,
						template: '<app></app>'
				})

				// Dashboard page to contain our goats list page
				.state('app.home', {
						url: '/home',
						templateUrl: './pages/home/home.html'
				})

				// Create route for our goat listings creator
				.state('app.create', {
            url: '/chart',
            templateUrl: './pages/chart/chart.html>'
				});

		$urlRouterProvider.otherwise('/app/home');
})

  // .config(($stateProvider, $urlRouterProvider) => {
	//
  //     $stateProvider
  //         // .state('app', {
  //         //     url: '/app',
  //         //     abstract: true,
  //         //     template: '<app></app>'
  //         // })
	//
  //         .state('home', {
  //             url: '/home',
	// 						templateUrl: './pages/home/home.html'
  //             // template: '<home></home>'
  //         })
	//
  //         .state('chart', {
  //             url: '/chart',
  //             templateUrl: './pages/chart/chart.html>'
	// 						// template: '<chart></chart>'
  //         });
	//
  //     $urlRouterProvider.otherwise('/home');
  // })


	.controller('MainCtrl', ($scope, $timeout, DataService) => {
	  $scope.gridsterOptions = {
			margins: [20, 20],
			columns: 6,
			mobileModeEnabled: false,
			draggable: {
				handle: 'h3'
			},
			resizable: {
	     enabled: true,
	     handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

	     // optional callback fired when resize is started
	     start: (event, $element, widget) => {},

	     // optional callback fired when item is resized,
	     resize: (event, $element, widget) => {
	       if (widget.chart.api) widget.chart.api.update();
	     },

	      // optional callback fired when item is finished resizing
	     stop: (event, $element, widget) => {
	       $timeout(() => {
	         if (widget.chart.api) widget.chart.api.update();
	       },400)
	     }
	    },
		};

		$scope.dashboard = {
			widgets: [ {
				col: 0,
				row: 0,
				sizeY: 2,
				sizeX: 4,
				name: "Stacked Area Chart Widget",
				type: 'stackedAreaChart',
				chart: {
					options: DataService.stackedAreaChart.options(),
					data: DataService.stackedAreaChart.data(),
					api: {}
				}
			},
			{
			 	col: 7,
			 	row: 0,
			 	sizeY: 2,
			 	sizeX: 2,
			 	name: "Pie Chart Widget",
			 	type: 'pieChart',
			 	chart: {
			 		options: DataService.pieChart.options(),
			 		data: DataService.pieChart.data(),
			 		api: {}
			 	}
			},
			{
				col: 0,
				row: 3,
				sizeY: 2,
				sizeX: 2,
				name: "Spring Campign",
				chart: {
				  options: DataService.discreteBarChart.options(),
				  data: DataService.discreteBarChart.data(),
				  api: {}
				}
			}
			// {
			// 	col: 0,
			// 	row: 5,
			// 	sizeY: 2,
			// 	sizeX: 3,
			// 	name: "Test Campign",
			// 	chart: {
			// 		options: DataService.multiBarChart.options(),
			// 		data: DataService.multiBarChart.data(),
			// 		api: {}
			// 	}
			// }
		]
		};

	  // We want to manually handle `window.resize` event in each directive.
	  // So that we emulate `resize` event using $broadcast method and internally subscribe to this event in each directive
	  // Define event handler
	  $scope.events = {
	    resize: function resize(e, scope) {
	      $timeout(() => {
	        scope.api.update()
	      },200)
	    }
	  };
	  angular.element(window).on('resize', (e) => {
	    $scope.$broadcast('resize');
	  });

		// grid manipulation ========================================================
		$scope.clear = () => {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = () => {
			$scope.dashboard.widgets.push({
				name: "New DE Chart",
				sizeX: 2,
				sizeY: 2
			});
		};

	  // We want to hide the charts until the grid will be created and all widths and heights will be defined.
	  // So that use `visible` property in config attribute
	  $scope.config = {
	    visible: false
	  };

	  $timeout(() => {
	    $scope.config.visible = true;
	  }, 200);

	  //// init dashboard (selecting diffrent dashboards)
	  //$scope.selectedDashboardId = '1';
})


// I chaned the dependency name from $modal to $uibModal to work!
.controller('CustomWidgetCtrl', ['$scope', '$uibModal',
  ($scope, $uibModal) => {

    $scope.remove = (widget) => {
      $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    $scope.openSettings = (widget) => {
      $uibModal.open({
        scope: $scope,
        templateUrl: '../widgetSettings.html',
        controller: 'WidgetSettingsCtrl',
        resolve: {
          widget: () => {
            return widget;
          }
        }
      });
    };

  }
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$uibModalInstance', 'widget', 'DataService',
  ($scope, $timeout, $rootScope, $uibModalInstance, widget, DataService) => {
    $scope.widget = widget;
    $scope.widgetTypes = Object.keys(DataService);

    $scope.form = {
      name: widget.name,
      sizeX: widget.sizeX,
      sizeY: widget.sizeY,
      col: widget.col,
      row: widget.row,
      type: widget.type
    };

    $scope.sizeOptions = [{
      id: '1',
      name: '1'
    }, {
      id: '2',
      name: '2'
    }, {
      id: '3',
      name: '3'
    }, {
      id: '4',
      name: '4'
    }];

    $scope.dismiss = () => {
      $uibModalInstance.dismiss();
    };

    $scope.remove = () => {
      $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
      $uibModalInstance.close();
    };

    $scope.submit = () => {
      angular.extend(widget, $scope.form);

      //update with new options and data
      if (widget.type) {
        widget.chart.options = DataService[widget.type].options();
        widget.chart.data = DataService[widget.type].data();
      }
      $uibModalInstance.close(widget);

      //update new chart
      $timeout(() => {
        widget.chart.api.update();
      },600)
    };

  }
])

.filter('object2Array', () => {
  return (input) => {
    let out = [];
    for (let i in input) {
      out.push(input[i]);
    }
    return out;
  }
});
