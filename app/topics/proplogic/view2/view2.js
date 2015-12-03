'use strict';

angular.module('myApp.view2', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('topics.proplogic.view2', {
            url: "/view2",
            templateUrl: 'topics/proplogic/view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$scope', '$state', function ($scope, $state) {
        $scope.checked = false;
        $scope.correct = false;
        $scope.bool = {};
        $scope.buttonMessage = "Check answer";

        $scope.check = function (bool) {

            if ($scope.checked && $scope.correct) {
                $state.go('topics.proplogic.view3');
                return;
            }

            if (bool.or == "0" && bool.and == "0" && bool.xor == "0" && bool.a == "0" && bool.b == "1" && bool.c == "1" && bool.d == "1") {
                $scope.correct = true;
                $scope.buttonMessage = "Goto next question";
            }

            $scope.checked = true;
        }
    }]);