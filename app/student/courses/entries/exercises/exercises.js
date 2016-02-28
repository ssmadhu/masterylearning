angular.module ('myapp.student.courses.entries.exercises', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.exercises', {
            url: '/exercises',
            resolve: {
                exercises: ['$stateParams', 'course_id', 'entry_id', 'entry', 'database', '$log', function ($stateParams, course_id, entry_id, entry, database, $log)
                {
                    var entries = [];
                    if (entry.data.type === 'unit' || entry.data.type === 'section') {
                        entries = entry.children;
                    }

                    return entries.filter(function (entry)
                    {
                        return entry.data.type === 'yesnoexercise' || entry.data.type === 'multianswerexercise';
                    });
                }]
            },
            templateUrl: 'student/courses/entries/exercises/exercises.html',
            controller: 'ExerciseController'
        });
    }])

    .controller ('ExerciseController', ['$scope', 'exercises', '$log', function ($scope, exercises, $log)
    {
        var exercise_count = 0;

        var load_next_exercise = function ()
        {
            exercise_count++;
            $scope.exercises = exercises.slice(0, exercise_count);
        };

        $log.info ("[myApp] ExerciseController: Loaded " + exercises.length + " exercises");


        $scope.answered_cb = function (index, answer)
        {
            $log.info ("Answered exercise " + index + ", answer=" + answer);

            load_next_exercise ();

            //TODO: when a multi answer is answered, I still need to connect the result[index].value with the answer
            // object since we are getting an array and not a single boolean value we also need to handle this
            // different from the yesnoanswers.
        };

        load_next_exercise();
    }])

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppExercise', ['$log', '$sanitize', function ($log, $sanitize)
    {
        return {
            scope: {
                exercise: '=exercise',
                onanswered: '&onanswered'
            },
            controller: ['$scope', function ($scope)
            {
                var get_type = function (type)
                {
                    switch (type)
                    {
                        case "yesnoexercise":
                            return "dropdown";
                        case "multianswerexercise":
                            return "checkboxes";
                        default:
                            throw Error ("Exercise type is not implemented");
                    }
                };

                $scope.type = get_type ($scope.exercise.type);
                $scope.results = [];
                $scope.answered = false;

                $scope.sanitize = function (text)
                {
                    return $sanitize (text);
                };

                $scope.answered_cb = function ()
                {
                    $scope.answered = true;
                    $scope.onanswered ({answer: $scope.results[0]});
                };

                $scope.showAlertClass = function (success, index)
                {
                    var result = true;
                    var results = [];

                    if ($scope.type === 'dropdown')
                    {
                        result = $scope.results[0] !== undefined && $scope.results[0] === $scope.exercise.answer;

                        if (success)
                            return $scope.answered && result;
                        else
                            return $scope.answered && !result;
                    }
                    else if ($scope.type === 'checkboxes')
                    {
                        $scope.exercise.answer_candidates.forEach (function (candidate, i)
                        {
                            results[i] = result && $scope.results[i] === candidate.key;
                        });

                        if (success)
                            return $scope.answered && results[index];
                        else
                            return $scope.answered && !results[index];
                    }
                };

                $scope.check_answer = function ()
                {
                    $scope.answered = true;
                    for (var i = 0, n = $scope.exercise.answer_candidates.length; i < n; i++)
                    {
                        $scope.results[i] = $scope.results[i] || false;
                    }
                    $scope.onanswered ({answer: $scope.results});
                }
            }],
            templateUrl: 'student/courses/entries/exercises/myAppExercise.tpl.html'
        };
    }]);