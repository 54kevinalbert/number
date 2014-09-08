angular.module('FunWithNumbers', [])
    .controller('TheController', function($scope, Generator, Ennumerator) {
        $scope.in = ''
        $scope.out = []

        $scope.refresh = function() {
            $scope.out = []
            var options = [],
                parts = $scope.in.split(/\s+/)

            var x
            for (var i in parts)
                if (!isNaN(x = parseFloat(parts[i].replace(/^\$/, '')))) {
                    options.push(Generator.generate(x, 
                        (parts[i].indexOf('$') >= 0)))
                }

            var matrix = Ennumerator.process(options)
            for (var i in matrix) {
                console.log(matrix[i])
                var j = 0, 
                    sentence = ''

                for (var k in parts) {
                    if (k > 0) 
                        sentence += ' '
                    
                    sentence += parts[k].match(/^\$?[0-9]+$/) ? 
                        matrix[i][j++] : 
                        parts[k]

                    if (k == (parts.length - 1) && j == matrix[i].length) {
                        sentence = sentence.replace(/ ?of([.!?])?$/, '$1')
                    }
                }

                $scope.out.push(sentence)
            }
        }
    })
    .service('Generator', function() {

        var t = [
            {
                range: 0,
                names: [
                    { single: '0' },
                    { single: 'no', dollars: 'no money' },
                    { single: 'zero', dollars: 'nothing' }
                ]
            },
            {
                range: 1,
                names: [
                    { single: 'one', dollars: 'one dollar' },
                    { single: 'a single', dollars: 'a dollar' }
                ]
            },
            {
                range: 2, 
                mod: 2,
                names: [
                    { single: 'a couple of', plural: 'couples of', dollars: 'a couple bucks', pluralDollars: 'couples of dollars' },
                    { single: 'a pair of', plural: 'pairs of' }
                ]
            },
            {
                range: [3, 10], 
                names: [ { single: 'several', dollars: 'several dollars' } ]
            },
            {
                range: [3, 11], 
                names: [ { single: 'a few', dollars: 'a few dollars' } ]
            },
            {
                range: 12, 
                names: [ { single: 'a dozen', plural: 'dozens of' } ]
            },
            {
                range: 13,
                names: [ { single: 'a baker\'s dozen', plural: 'baker\'s dozens of' } ]
            },
            {
                range: 144,
                names: [ { single: 'gross' } ]
            },
            {
                range: 169,
                names: [ { single: 'baker\'s gross' } ]
            },
            {
                range: [10, 100],
                mod: 55,
                names: [
                    { single: 'a bunch of', plural: 'bunches of', dollars: 'a bunch of money', pluralDollars: 'bunches of money' }
                ]
            }
        ]



        function gen(x, dollars, plural) {

            var names = []
            for (var i in t) {

                if (typeof t[i].range == 'number' ?  x == t[i].range : 
                        (x >= t[i].range[0] && x <= t[i].range[1])) {

                    for (var j in t[i].names) {
                        var name = dollars ?
                            (plural ? t[i].names[j].pluralDollars : t[i].names[j].dollars) :
                            (plural ? t[i].names[j].plural : t[i].names[j].single)
                        if (plural) console.log('plural: ' + name)
                        if (name) names.push(name)
                    }
                }

                else if (x > 3) {
                    if (t[i].mod && x / t[i].mod >= 2 && 
                            (!Math.floor(x % t[i].mod) || Math.ceil(x % t[i].mod) == t[i].mod)) {
                        var subNames = gen(x / t[i].mod, dollars, true),
                            modNames = gen(t[i].mod, dollars, plural)

                        for (var j in subNames)
                            for (var k in modNames)
                                names.push(modNames[k] + ' ' + subNames[j])

                    }
                }
            }
            return names
        }

        return {
            generate: gen
        }
    })
    .service('Ennumerator', function() {

        function merge(A, a_Id, B, b_Id, N) {
            N /= A[a_Id].length
            for (var i = 0; i < A[a_Id].length; i++) {
                for (var j = 0; j < N; j++)
                    B[i*N+b_Id+j].push(A[a_Id][i])

                if (a_Id + 1 < A.length)
                    merge(A, a_Id+1, B, b_Id+i*N, N)
            }
        }

        return {
            process: function(A) {
                var B = [],
                    N = 1

                for (var i in A)
                    N *= A[i].length
                
                for (var i = 0; i < N; i++)
                    B.push([])

                merge(A, 0, B, 0, N)
                return B
            }
        }
    })

