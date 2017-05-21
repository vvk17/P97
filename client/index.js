/* global angular, nodered, express, openwhisk */
/*
var $content = $('.content'),
    $loading   = $('.loading'),
    $error     = $('.error'),
    $errorMsg  = $('.errorMsg'),
    $traits    = $('.traits'),
    $results   = $('.results'),
    $captcha   = $('.captcha');
*/

Highcharts.setOptions({
    colors: ['#ffb3ff', '#000', '#2d862d', '#ac7339']
});

angular.module('template', [])
.controller('MainCtrl', function($scope, $http){
    // BEGIN CODE HERE
    $scope.title = "Tweets and Personality Insights";
    $scope.myTwitterId = "IBM";
    $scope.myTweetsNum = 199;
    $scope.celTwitterId = "CharlizeAfrica";
    $scope.celTweetsNum = 198;
//   $scope.defTwitsNumber = 200;
    $scope.myTweets = "";
    $scope.celTweets = "";
    $scope.myName = "...";
    $scope.celName = "...";
    $scope.chartName = "...";
    $scope.myText = "";
    $scope.celText = "";
    $scope.myInsights;
    $scope.celInsights;
    $scope.showTweets = false;
    $scope.showInsights = false;
    $scope.showMatch = false;

    $scope.getMyInsights = function() {

        var params = {
            recaptcha: "ok",
            text: $scope.myText,
            language: 'en'
        };

        $http.post('/api/myprofile',params).then(function(response) {
            $scope.myInsights = response.data;
 //       console.log($scope.myInsights);
        });
    }

    $scope.getCelInsights = function() {

        var params = {
            recaptcha: "ok",
            text: $scope.celText,
            language: 'en'
        };

        $http.post('/api/celprofile',params).then(function(response) {
            $scope.celInsights = response.data;
 //     console.log($scope.celInsights);
        });
    }


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

        $scope.showTweets = true;
        $scope.showInsights = false;
        $scope.showMatch = false;

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
                  console.log("myText - done");
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
                  console.log("celText - done");
            $scope.getMyInsights();
            $scope.getCelInsights();
        });
    }

    $scope.logInsights = function() {
        console.log($scope.myInsights);
        console.log($scope.celInsights);
    }

    $scope.showMyInsights = function () {

        $scope.showInsights = true;
        $scope.showTweets = false;
        $scope.showMatch = false;
        $scope.chartName = $scope.myName;

        drawTraits($scope.myInsights);
              console.log("myInsights:drawTraits - done");
        drawVisual($scope.myInsights);
              console.log("myInsights:drawVisual - done");

    }

    $scope.showCelInsights = function () {

        $scope.showInsights = true;
        $scope.showTweets = false;
        $scope.showMatch = false;
        $scope.chartName = $scope.celName;

        drawTraits($scope.celInsights);
              console.log("celInsights:drawTraits - done");
        drawVisual($scope.celInsights);
              console.log("celInsights:drawVisual - done");
    }

    $scope.showMyCelMatch = function() {

        $scope.showInsights = false;
        $scope.showTweets = false;
        $scope.showMatch = true;

        drawMatch($scope.myInsights,$scope.celInsights);
    }

/**
   * Displays the match between you and celebrity received from the
   * Personality Insights API
   */
    function drawMatch(myData,celData) {

        var myList = flatten(myData.tree);
        var celList = flatten(celData.tree);
        var c1 = [], myS = [], celS = [], difMeCel = [];
 //   console.log(myList); console.log(celList);

//  Making category, values and difference arrays
        for (var i=0; i < myList.length; i++){
            if ((myList[i].value != "") && (celList[i].value != "")) {
                c1.push (myList[i].id);
                myS.push(parseInt(myList[i].value));
                celS.push(parseInt(celList[i].value));
                difMeCel.push(Math.abs(parseInt(myList[i].value)-parseInt(celList[i].value)))
            }
        }
  //    console.log("c1 length : "+c1.length);
  //    console.log("arrays :");
  //    for (i=0;i<c1.length;i++) {console.log(c1[i]+":"+myS[i]+":"+celS[i]+":"+difMeCel[i])}

        var switchCells = false, tempC;

        do {
            switchCells = false;
            for (i = 0; i < (difMeCel.length - 1); i++) {
  //      console.log(i,difMeCel[i]);
                if (difMeCel[i] > difMeCel[i+1]) {
                    switchCells = true;
                    tempC = difMeCel[i] ; difMeCel[i] = difMeCel[i+1]; difMeCel[i+1] = tempC;
  //        console.log("switch up : "+c1[i]+":"+c1[i+1]);
                    tempC = c1[i] ; c1[i] = c1[i+1]; c1[i+1] = tempC;
  //        console.log("switch down : "+c1[i]+":"+c1[i+1]);
                    tempC = myS[i] ; myS[i] = myS[i+1]; myS[i+1] = tempC;
                    tempC = celS[i] ; celS[i] = celS[i+1]; celS[i+1] = tempC;
                }
            }
        } while(switchCells);
 //   console.log(difMeCel); console.log(c1); console.log(myS); console.log(celS);
                              console.log("drawMatch()");

        Highcharts.chart('celmatch', {
            chart: {
                type: 'area',
                inverted: true,
                height: 1000
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Personality Insights Match'
            },
            subtitle: {
                style: {
                    position: 'absolute',
                    right: '0px',
                    bottom: '10px'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 50,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: c1
            },
            yAxis: {
                title: {
                    text: 'Value (%)'
                },
                labels: {
                    formatter: function () {return this.value;}
                },
                min: 0
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: $scope.myName,
                data: myS,
                color: '#009922',
                fillOpacity: 0.1
            }, {
                name: $scope.celName,
                data: celS,
                color: '#00AAFF',
                fillOpacity: 0.1
            }]
        });
    }

/**
   * Displays the traits received from the
   * Personality Insights API in a chart,
   * just trait names and values.
   */
    function drawTraits(data) {
                      console.log('drawTraits()');
        var traitList = flatten(data.tree);
        var ind, c1 = [], s1=[], s2=[], s3=[];

        for (var i=0; i < traitList.length; i++) {
            ind = traitList[i];
            c1.push(ind.id);
            switch (c1[i]) {
                case "Big 5":
                    s1.push(100); s2.push(0); s3.push(0); break;
                case "Openness":
                    s1.push(0); s2.push(parseInt(ind.value)); s3.push(0); break;
                case "Conscientiousness":
                    s1.push(0); s2.push(parseInt(ind.value)); s3.push(0); break;
                case "Extraversion":
                    s1.push(0); s2.push(parseInt(ind.value)); s3.push(0); break;
                case "Agreeableness":
                    s1.push(0); s2.push(parseInt(ind.value)); s3.push(0); break;
                case "Emotional range":
                    s1.push(0); s2.push(parseInt(ind.value)); s3.push(0); break;
                case "Needs":
                    s1.push(100); s2.push(0); s3.push(0); break;
                case "Values":
                    s1.push(100); s2.push(0); s3.push(0); break;
                default:
                    s1.push(0); s2.push(0); s3.push(parseInt(ind.value));
            };
        }

        Highcharts.chart('traits', {
            chart: {
                type: 'bar',
                renderTo: 'traits',
                width : 380,
                height : 1800
            },
            title: {
                text: 'Personality Insights'
            },
            xAxis: {
                categories: c1,
                title: {
                    text: "Categories"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Value (%)',
                    align: 'high'
                },
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            legend: {
                reversed:true
            },
            credits: {
                enabled: false
            },
            series: [{
                pointWidth: 30,
                name: 'Titles',
                data: s1,
                color: '#0000AA'
            }, {
                pointWidth: 30,
                dataLabels: {
                    enabled : true,
                    formatter: function () {
                        return this.y > 0 ? this.y : null;
                    }
                },
                name: 'SubTitles',
                data: s2,
                color: '#00AAAA'
            }, {
                pointWidth: 30,
                dataLabels: {
                    enabled : true,
                    formatter: function () {
                        return this.y > 0 ? this.y : null;
                    }
                },
                name: 'Items',
                data: s3,
                color: '#00AA00'
            }]
        });
    }

    function drawVisual(data) {
                        console.log('drawVisual()');
        var visList = flatten(data.tree);

        var pTotal = 0;
        var inC = [], midC = [], outC = [];

        for (var i = 0; i < visList.length; i++) {
            if (!visList[i].title) {
                pTotal += parseInt(visList[i].value);
                outC.push({
                    name: visList[i].id,
                    y: parseInt(visList[i].value),
                    color: '#0000FF'
                });
            }
        }

        var temp;
        var inName = ['Big Five','Needs','Values'], inValues = [0,0,0], inColors =['#0088CC','#00CC88','#777777'];
        var midName = ['Openness','Conscientiousness','Extraversion','Agreeableness','Emotional range',' ',' '],
            midValues = [0,0,0,0,0,0,0],
            midColors =['#0099DD','#0099DD','#0099DD','#0099DD','#0099DD','#00DD99','#999999'];

        for (i=0; i < outC.length; i++) {
            temp = outC[i].y;
            if (i <= 5) {
                outC[i].color = '#00AAFF'; inValues[0] += temp; midValues[0] += temp;
            }
            if ((i >= 6) && (i <= 11)) {
                outC[i].color = '#00AAFF'; inValues[0] += temp; midValues[1] += temp;
            }
            if ((i >= 12) && (i <= 17)) {
                outC[i].color = '#00AAFF'; inValues[0] += temp; midValues[2] += temp;
            }
            if ((i >= 18) && (i <= 23)) {
                outC[i].color = '#00AAFF'; inValues[0] += temp; midValues[3] += temp;
            }
            if ((i >= 24) && (i <= 29)) {
                outC[i].color = '#00AAFF'; inValues[0] += temp; midValues[4] += temp;
            }
            if ((i >= 30) && (i <= 41)) {
                outC[i].color = '#00FFAA'; inValues[1] += temp; midValues[5] += temp;
            }
            if ((i >= 42) && (i <= 46)) {
                outC[i].color = '#AAAAAA'; inValues[2] += temp; midValues[6] += temp;
            }
        }

        for (i = 0; i < inName.length; i++) {
            inC.push({name: inName[i], y: inValues[i], color: inColors[i]});
        }

        for (i = 0; i < midName.length; i++) {
            midC.push({name: midName[i], y: midValues[i], color: midColors[i]});
        }
// Create the chart
        Highcharts.chart('vizcontainer', {
            chart: {
                type: 'pie',
                width: 800,
                height: 600
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Personality Insights 360 degree'
            },
            yAxis: {
                title: {
                   text: 'Values (%)'
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },
            tooltip: {
                valueSuffix: '%'
            },
            series: [{
                name: 'Category',
                data: inC,
                size: '40%',
                dataLabels: {
                    formatter: function () {return this.point.name;},
                    color: '#ffffff',
                    distance: -30
                },
                fillOpacity: 0.6
            }, {
                name: 'Sub-category',
                data: midC,
                size: '75%',
                innerSize: '40%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 0 ? this.point.name : null;
                    },
                    color: '#ffffff',
                    distance: -40
                },
                fillOpacity: 0.4
            }, {
                name: 'Items',
                data: outC,
                size: '100%',
                innerSize: '75%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 0 ? this.point.name + ' ' +
                              this.y + '%' : null;
                    },
                    fillOpacity: 0.2
                },
            id: 'items'
      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 1200
              },
              chartOptions: {
                  series: [{
                      id: 'items',
                      dataLabels: {
                          enabled: false
                      }
                  }]
              }
          }]
        }
    });
}


  /**
   * Returns a 'flattened' version of the traits tree, to display it as a list
   * @return array of {id:string, title:boolean, value:string} objects
   */
  function flatten( /*object*/ tree) {
    var arr = [],
      f = function(t, level) {
        if (!t) return;
        if (level > 0 && (!t.children || level !== 2)) {
          arr.push({
            'id': t.name,
            'title': t.children ? true : false,
            'value': (typeof (t.percentage) !== 'undefined') ? Math.floor(t.percentage * 100) + '%' : '',
            'sampling_error': (typeof (t.sampling_error) !== 'undefined') ? Math.floor(t.sampling_error * 100) + '%' : ''
          });
        }
        if (t.children && t.id !== 'sbh') {
          for (var i = 0; i < t.children.length; i++) {
            f(t.children[i], level + 1);
          }
        }
      };
    f(tree, 0);
    return arr;
  }

});

