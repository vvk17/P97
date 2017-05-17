/* global angular, nodered, express, openwhisk */


Highcharts.setOptions({
 colors: ['#ffb3ff', '#000', '#2d862d', '#ac7339']
});

angular.module('template', [])
.controller('MainCtrl', function($scope, $http){
    // BEGIN CODE HERE
   $scope.title = "Tweets and Personality Insights";
   $scope.myTwitterId = "V12345Valery";
   $scope.myTweetsNum = 100;
   $scope.celTwitterId = "CharlizeAfrica";
   $scope.celTweetsNum = 198;
//   $scope.defTwitsNumber = 200;
   $scope.myTweets = "";
   $scope.celTweets = "";
   $scope.myName = "...";
   $scope.celName = "...";
   $scope.myText = "";
   $scope.celText = "";
   $scope.myInsights;
   $scope.celInsights;

   $scope.getIds = function () {

     var myIdInput = document.getElementById("my-twitter-id-field").value.replace(/ /g,"");
     var celIdInput = document.getElementById("cel-twitter-id-field").value.replace(/ /g,"");

     if (myIdInput.length > 0) {
       $scope.myTwitterId = myIdInput;
     } else {
       $scope.myTwitterId = "V12345Valery";
     }

     if (celIdInput.length > 0) {
       $scope.celTwitterId = celIdInput;
     } else {
       $scope.celTwitterId = "CharlizeAfrica";
     }

     $scope.myTweetsNum = document.getElementById("my-twits-number-field").value;
     $scope.celTweetsNum = document.getElementById("cel-twits-number-field").value;

     var myResponse = "... getting " + $scope.myTweetsNum + " tweets from @"+ $scope.myTwitterId + " ...";
     var celResponse = "... getting " + $scope.celTweetsNum + " tweets from @" + $scope.celTwitterId + " ...";

     document.getElementById("my-twitter-field-response").innerHTML = myResponse;
     document.getElementById("cel-twitter-field-response").innerHTML = celResponse;

   }

    $scope.getTweets = function() {
    //   $scope.coffeeNumber = 0;
    //   $scope.iceCreamNumber = 0;
      $scope.getIds();

      var myUrl = '/tweets?screen_name='+$scope.myTwitterId+'&count='+$scope.myTweetsNum+'&include_rts=false';
      var celUrl = '/tweets?screen_name='+$scope.celTwitterId+'&count='+$scope.celTweetsNum+'&include_rts=false';

      $http.get(myUrl).then(function(response) {

           $scope.myTweets = response.data;

           if($scope.myTweets.length > 0) {
             $scope.myName = $scope.myTweets[0].user.name;
           } else {
             $scope.myName = "not found"
           }

         console.log($scope.myTweets.length);
         console.log($scope.myName);

          $scope.myText = "";
          for (var i = 0; i < $scope.myTweets.length; i++) {
            $scope.myText += $scope.myTweets[i].text+" ";
          }
 //         console.log("myText : "+$scope.myText);

      });

      $http.get(celUrl).then(function(response) {

           $scope.celTweets = response.data;

           if($scope.celTweets.length > 0) {
             $scope.celName = $scope.celTweets[0].user.name;
           } else {
             $scope.celName = "not found"
           }

           console.log($scope.celTweets.length);
           console.log($scope.celName);

           $scope.celText = "";
          for (var i = 0; i < $scope.celTweets.length; i++) {
            $scope.celText += $scope.celTweets[i].text+" ";
          }
  //        console.log("celText : "+$scope.celText);
      });

    }

    $scope.getMyInsights = function() {

        var params = {
          recaptcha: "ok",
          text: $scope.myText,
          language: 'en'
        };

      $http.post('/api/myprofile',params).then(function(response) {
        $scope.myInsights = response.data;
        console.log($scope.myInsights);
        });

   //     console.log("myinsights:"+$scope.myInsights);
      }


      $scope.getCelInsights = function() {

        var params = {
          recaptcha: "ok",
          text: $scope.celText,
          language: 'en'
        };

      $http.post('/api/celprofile',params).then(function(response) {
        $scope.celInsights = response.data;
 //       console.log($scope.celInsights);
        });

 //       console.log("celInsights : "+JSON.stringify($scope.celInsights));
      }

    $scope.logInsights = function() {
      console.log($scope.myInsights);
      console.log($scope.celInsights);
    }




    $scope.drawChart = function() {
        // console.log("ICE CREAM:", $scope.iceCreamNumber);
        // console.log("COFFEE:", $scope.coffeeNumber);
        // console.log("TEA:", $scope.teaNumber);
        // console.log("CHOCOLATE:", $scope.chocolateNumber);
        // console.log("ICE CREAMSentiment:", $scope.iceCreamAverage);
        // console.log("COFFEESentiment:", $scope.coffeeAverage);
        // console.log("TEASentiment:", $scope.teaAverage);
        // console.log("CHOCOLATESentiment:", $scope.chocolateAverage);
        drawChart($scope.tweets);
    }
    // END CODE


function drawChart(tweets){
//   $('#graph').highcharts({
//     title: {
//       text: 'Tweet Sentiment Analysis'
//     },
//     xAxis: {
//       categories: tweets.map(function(t, i){return i})
//     },
//     series: [
//      {
//       data: tweets.map(function(t){return t.SCORE})
//      }
//     ]
//   });

    $('#popularity').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Popularity Chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Desserts',
                colorByPoint: true,
                data: [
                    {
                        name: 'Ice Cream',
                        y: $scope.iceCreamNumber
                    },
                    {
                        name: 'Coffee',
                        y: $scope.coffeeNumber

                    },
                    {
                        name: 'Tea',
                        y: $scope.teaNumber

                    },
                    {
                        name: 'Chocolate',
                        y: $scope.coffeeNumber

                    }
                ]
            }]
        });

         $('#sentiment').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Sentiment Chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Desserts',
                colorByPoint: true,
                data: [
                    {
                        name: 'Ice Cream',
                        y: $scope.iceCreamAverage
                    },
                    {
                        name: 'Coffee',
                        y: $scope.coffeeAverage

                    },
                    {
                        name: 'Tea',
                        y: $scope.teaAverage

                    },
                    {
                        name: 'Chocolate',
                        y: $scope.coffeeAverage

                    }
                ]
            }]
        });
}
});

