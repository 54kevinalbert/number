angular.module('FunWithNumbers', [])
    .controller('TheController', function($scope, NumberGenerator) {
        $scope.in = ''
        $scope.out = ''

        $scope.refresh = function() {
            console.log('refresh')
            var options = []

            var parts = $scope.in.split(/\s+/),
                x,
                out = []

            for (var i in parts)
                if ((x = parseFloat(parts[i])) != NaN)
                    options[i] = NumberGenerator.generate(x)


            $scope.out = options
        }
    })
    .service('NumberGenerator', function() {
        return {
            generate: function(x) {
                return ['some', 'an uncertain amount']
            }
        }
    })