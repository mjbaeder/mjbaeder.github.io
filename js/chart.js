/* This JS will pull the data from these source files: 

chartweeks.json: metrics by week (overall metrics)
charworkoutdays.json: any daily metrics, currently used for power
chartsprint.json: baseline metrics (currently sprints, switching to baseline)
chartmetrics.json: single metrics for the individual stats

It is responsible for creating all the charts and metrics in the dashboard.

Open Issues:
jQuery .ready function is used to open and read the json files. Currently I cannot figure out how to make the jsondata variable global, so
I had to keep the function open for all the processing and chart creation.
*/

//Update chart defaults
//ChartJS is being used for the charts. This updates the global defaults so they don't have to be listed for each
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.legend.position = 'bottom';
Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.tooltips.mode = 'label'; //Label currently isn't working, needs to be fixed
Chart.defaults.global.hover.mode= 'nearest';
Chart.defaults.global.hover.intersect= true;
Chart.defaults.scale.gridLines.drawOnChartArea = false;
Chart.defaults.scale.scaleLabel.display = true;
Chart.defaults.global.elements.line.fill = false;
var defaultcolor = '#2b90d9';
var secondcolor = 'darkgray';
var thirdcolor = 'green';

//CURRENT PROGRESS chart
//As noted above, currently have to do everything within this function...
$().ready(function(){
  $.getJSON( "data/chartweeks.json", function( jsondata ) {
   var labels = jsondata.map(function(e) {
   return e.Week;
   });
   //I started with two projected paths, but later changed it to linear and polynomial projections. Left this here just in case
   // var path36 = jsondata.map(function(e) {
   //    return e.Total36;
   // });
   // var path32 = jsondata.map(function(e) {
   //    return e.Total32;
   // });
   var pathAct = jsondata.map(function(e) {
      return e.TotalActual;
   });
   var TrendEx = jsondata.map(function(e) {
      return e.TrendEx;
   });
   var TrendLin = jsondata.map(function(e) {
      return e.TrendLin;
   });

//CURRENT PROGRESS Configuration
   var chart36wk = document.getElementById('36weeks').getContext('2d');
   var config36wk = {
      type: 'line',
      data: {
         labels: labels,
         datasets: [{
            label: 'Actual',
            data: pathAct,
            borderColor: defaultcolor,
            backgroundColor: defaultcolor
            //fill: true
         },
         {
            label: 'Trend Top',
            data: TrendEx,
            borderColor: secondcolor,
            backgroundColor: secondcolor,
            borderDash: [5,5],
            pointRadius: 0
         },
         {
            label: 'Trend Bottom',
            data: TrendLin,
            borderColor: secondcolor,
            backgroundColor: secondcolor,
            borderDash: [5,5],
            pointRadius: 0
         // },
         // {
         //    label: '32-week path',
         //    data: path32,
         //    borderColor: secondcolor,
         //    backgroundColor: secondcolor,
         //    borderDash: [5,5],
         //    pointRadius: 0
         // },
         // {
         //    label: '36-week path',
         //    data: path36,
         //    borderColor: secondcolor,
         //    backgroundColor: secondcolor,
         //    borderDash: [5,5],
         //    pointRadius: 0
         }],
      },
      options: {
         legend: {
            display: false
         },
         scales: {
            xAxes: [{
              scaleLabel: {
                labelString: 'Week'
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0
              }
            }],
            yAxes: [{
              scaleLabel: {
                labelString: 'Total meters (thousands)'
              }
            }]
         }
      }
   };

   var Mainchart = new Chart(chart36wk, config36wk);
   });
});

//POWER and SPI Charts
$().ready(function(){
  $.getJSON( "data/chartworkoutdays.json", function( jsondata ) {
   var labels = jsondata.map(function(e) {
   return e.Day;
   });

   var AvgPower = jsondata.map(function(e) {
      return e.AvgWatts;
   });
   //Originally plotted max power as well; have left that out for now
   // var MaxPower = jsondata.map(function(e) {
   //    return e.MaxWatts;
   // });
   var Trend = jsondata.map(function(e) {
      return e.Trend;
   });

   var spi = jsondata.map(function(e) {
      return e.SPI;
   });

   //Power Chart 
   var chartPower = document.getElementById('power').getContext('2d');
   var configPower = {
      type: 'line',
      data: {
         labels: labels,
         datasets: [{
            label: 'Avg Power',
            data: AvgPower,
            borderColor: 'rgb(255,255,255,0)', //lazy way to make a scatter plot instead of changing the chart type
            backgroundColor: defaultcolor,
            cubicInterpolationMode: 'monotone'
         // },
         // {
         //    label: 'Max Power',
         //    data: MaxPower,
         //    borderColor: 'rgb(255,255,255,1)',
         //    backgroundColor: 'rgb(0,0,0,0)',
         //    cubicInterpolationMode: 'monotone'
            },
            {
            label: 'Trend',
            data: Trend,
            borderColor: thirdcolor,
            backgroundColor: thirdcolor,
            pointRadius: 0
         }]
      },
      options: {
         legend: {
            display: false
         },
         scales: {
            xAxes: [{
              scaleLabel: {
                labelString: 'Rows (10+ min)'
            },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 2,
                maxRotation: 0
              }
            }],
            yAxes: [{
              scaleLabel: {
                labelString: 'Power (watts)'
              }
            }]
         }
      }
   };

   //SPI Chart 
   var chartSPI = document.getElementById('spi').getContext('2d');
   var configSPI = {
      type: 'line',
      data: {
         labels: labels,
         datasets: [{
            label: 'SPI',
            data: spi,
            borderColor: 'rgb(255,255,255,0)', //lazy way to make a scatter plot instead of changing the chart type
            backgroundColor: defaultcolor,
            cubicInterpolationMode: 'monotone'
            // },
            // {
            // label: 'Trend',
            // data: Trend,
            // borderColor: thirdcolor,
            // backgroundColor: thirdcolor,
            // pointRadius: 0
         }]
      },
      options: {
         legend: {
            display: false
         },
         scales: {
            xAxes: [{
              scaleLabel: {
                labelString: 'Rows (10+ min)'
            },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 2,
                maxRotation: 0
              }
            }],
            yAxes: [{
              scaleLabel: {
                labelString: 'SPI (avg watts/spm)'
              }
            }]
         }
      }
   };

   var Powerchart = new Chart(chartPower, configPower);
   var SPIchart = new Chart(chartSPI, configSPI);
   });
});

//SPRINT/BASELINE chart
$().ready(function(){
  $.getJSON( "data/chartsprint.json", function( jsondata ) {
   var labels = jsondata.map(function(e) {
   return e.Sprint;
   });

   var sprintdata = jsondata.map(function(e) {
      return e.AvgSplit;
   });
   
   var chartSprint = document.getElementById('sprints').getContext('2d');
   var configSprint = {
      type: 'line',
      data: {
         labels: labels,
         datasets: [{
            label: 'Splits',
            data: sprintdata,
            borderColor: defaultcolor,
            backgroundColor: defaultcolor,
            cubicInterpolationMode: 'monotone'
         }]
      },
      options: {
         legend: {
            display: false
         },
         scales: {
            xAxes: [{
              scaleLabel: {
                labelString: '1K Sprint (every 10 days)'
              }
            }],
            yAxes: [{
              // ticks:{
              //  display:false
              // },
              scaleLabel: {
                labelString: 'Avg min / 500m'
              }
            }]
         }
      }
   };

   var Sprintchart = new Chart(chartSprint, configSprint);
   });
});

//4 METRICS BOXES (to the right of the main chart)
$().ready(function(){
  $.getJSON("data/chartmetrics.json", function( jsondata ) {

   //Box 1: Current Week
   var week = jsondata.map(function(e) {
      return e.Week;
      });
   $('#currentWeek').html(week);
   
   //Box 2 Percent Complete
   var totalM = jsondata.map(function(e) {
      return e.CurrentTotalM;
      });
   var percom = jsondata.map(function(e) {
      return e.PercentComplete;
      });

   $('#percentComplete').css('width', percom); //Set bar width
   $('#percentComplete').html(totalM+"K"); //comment out until %complete is >16% so the number isn't cut off (lazy)

   //Box 3: Number of days rowed
   var rowdays = jsondata.map(function(e) {
      return e.RowDays;
      });
   $('#rowDays').html(rowdays);
   
   //Box 4: Average meters per row day
   var mperday = jsondata.map(function(e) {
      return e.AvgMperDay; //will need to send a text string with the formatted number already
      });
   $('#avgMperday').html(mperday);
   
   // //Add Projected Finish Week to CURRENT PROGRESS chart (this didn't end up being meaningful)
   // var maintitle = jsondata.map(function(e) {
   //    return e.ProjFinish;
   //    });
   // $('#MainChartTitle').html("PROJECTED FINISH WEEK: " + maintitle);

   //Sprint chart title number update
   var sprinttitle = jsondata.map(function(e) {
      return e.BestSprint;
      });
   $('#SprintChartTitle').html("PB 1K: " + sprinttitle + "/500 AVG");

   
   });
});