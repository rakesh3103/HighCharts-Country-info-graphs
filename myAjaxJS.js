$(document).ready(function(){
	
  $("button").click(ButtonClickHandler);
 

});
var newSeries = [];
var newData=[];

function ButtonClickHandler(){

 console.log("In buttonClickHandler");
 $.ajax({
	dataType: "json",
	url: "https://restcountries.eu/rest/v1/all",
	data: "",
	success: processData,
	error:processError
	});
}


function processData(result){
	
	var header = "<tr><th>Country</th><th>Population</th><th>Capital</th></tr>";
	var newResult =[];
	var temp;
	
	 $("#myTable").empty().append(header);
	 console.log(result.length);
	 
	 result.sort(function(a,b){return b.population - a.population});
	 
	 
	 /*
	 for(var j=0; j<5; j++){
		 for (var k=1 ; k< 6; k++){
		 //console.log(result[j]);
		 if((result[j].population) >= (result[k].population)){
			 //newResult.push(result[j]);
			 temp= result[j];
		 }else{
			 //newResult.push(result[k]);
			 temp = result[k];
		 }
		  
		 
		 
		 }
		 newResult.push(temp);
		 
	 }
	 
	 console.log(newResult);*/
	 
	 
	 //$.each(result, processDataItem);
	 //var newSeries = "[{name: 'Population', data:[";
	 newSeries = [];
	 for (var j=0; j<20; j++){
		 processDataItem(j, result[j]);
		 
	 }
	 console.log(newSeries);
	 //console.log(newData);
	  MainChartDisplay();
	 
}
//created by Rakesh
function processDataItem(i,obj){

 // alert(JSON.stringify(obj));
  var tableItem = "<tr><td>" + obj.name + 
                  "</td><td>" + Math.round(obj.population/1000000) + 
				  " million</td><td>" + obj.capital +"</td></tr>";
		  
        $("#myTable").append(tableItem);
	//	alert(obj.name + "  has been added" );
	//var newObj="{"+'"country": ' + obj.name + ' ,"population": ' +  Math.round(obj.population/1000000) +"}";
	var newObj ={name: obj.name, y: Math.round(obj.population/1000000), drilldown: obj.alpha3Code };
		 newSeries.push(newObj);
		 
		 //var newArrayObj = [obj.name, Math.round(obj.population/1000000)];
		 //newData.push(newArrayObj);
	
}









function  processError() {
	                alert("Error in Service call");
					//console.log(path, arguments);
				}
				
				
				
				
//Created by Rakesh				
function MainChartDisplay(){
	console.log("In MainChartDisplay");
	//$("#mainChart").empty();
	if(!$("#mainChart").highcharts()){
	$("#mainChart").highcharts({chart: {
		 
            type: 'column',
       
		     /*events: {
	
                click: function () {
					//if (!e.seriesOptions) {
                   var chart = this;
				   console.log(this.point.drilldown);
				   secondChart(this.point.drilldown);
					//}
                }
			 }*/
		   }
            
        ,
		title: {
            text: 'Countries Population'
        },
        
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)'
            }
        },
		 plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            //alert('Category: ' + this.category + ', value: ' + this.drilldown);
							secondChart(this.drilldown);
                        }
                    }
                }
            }
        },

        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population: <b>{point.y:.1f} millions</b>'
        },
        series: [
		  {
            name: 'Population',
            data: newSeries
        }
		
		
		
		
		],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
			
			
				
				
				
			
        
		
		});
	}
}
  //Created by Rakesh.
function secondChart(code){
	
	console.log("In SecondChart");
	 var gdpURL = "http://api.worldbank.org/countries/" + code + "/indicators/NY.GDP.MKTP.CD?format=jsonP&prefix=?";

     $.ajax({
          dataType: "jsonp",
          jsonp: "prefix",
          jsonpCallback: "jquery_"+(new Date).getTime(),
          url: gdpURL,
          type: "GET",
          crossDomain: true,
          async: false,
          data: "",
          success: addSeriesOrCreateNewChart,
          error:processError,
          beforeSend : function(){
              waitingDialog.show('Loading Data ...');
          },
          complete: function(res){
              waitingDialog.hide();
          }
      });
	
	
	
	
	
	
}
var newSecondSeries=[];
function addSeriesOrCreateNewChart(secondResult){
	
	
	
	console.log(secondResult[1][0].country.value);
	 //var flag = true;
	/*for(var j=0 ; j< newSecondSeries.length; j++){
		
		if(secondResult[1][0].country.id === newSecondSeries[j].id){
			
			
			flag = false;
			
		}
		
		
	}*//*
	console.log(flag);
	if(flag){
		
		
	*/
	newSecondSeries=[];
	var newCategories=[];
	var newGDP=[];
	
	$.each(secondResult[1], processSecondDataItem);
	
	   
	   function processSecondDataItem(i, obj){
		   newCategories.push(obj.date);
		   
		   newGDP.push(Math.round(obj.value/1000000));
		   
		   
		   
		   
	   }
	   
	  // var color_rand="rgb(" + Math.round(Math.random()*255) +"," +Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + ")";
	   var newSecondObj = {name:secondResult[1][0].country.value, data: newGDP.reverse(), id:secondResult[1][0].country.id /*,color: color_rand*/};
	   newSecondSeries.push(newSecondObj);
	   
	   //console.log(newCategories);
	   console.log(newSecondSeries);
	
	if(!$("#drillDown").highcharts()){
		
		console.log("Map not exists");
	
	
		
	$('#drillDown').highcharts({
        title: {
            text: 'GDP Growth',
          
        },
        
        xAxis: {
            categories: newCategories.reverse()
        },
        yAxis: {
            title: {
                text: 'Million USD($)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'Million dollars'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
		
		
		        plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                hs.htmlExpand(null,  {
                                    pageOrigin: {
                                        x: e.pageX || e.clientX,
                                        y: e.pageY || e.clientY
                                    },
                                    headingText: this.series.name + " GDP",
                                    maincontentText: "Year: " + Highcharts.dateFormat('%Y', this.x)  + '<br/> ' +
                                        this.y + ' million Dollars',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },


		
		
		
		
		
		
        series:newSecondSeries
    });
	}else{
		console.log("Map exists");
		addToExistingChart(newSecondSeries);	
		//debugger;
		//var chart = $("#drillDown").highcharts();
		//debugger;
		//this.addSeries(newSecondSeries, true);
		
	}
	//}
}
	function addToExistingChart(SecondClick){
		var chart = $("#drillDown").highcharts();
		chart.addSeries({name: SecondClick[0].name, 
		data: SecondClick[0].data});
		
	}			
				
	//Loading

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (message, options) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
				progressType: '',
				onHide: null // This callback runs after the dialog was hidden
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
			$dialog.find('.progress-bar').attr('class', 'progress-bar');
			if (settings.progressType) {
				$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
			}
			$dialog.find('h3').text(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
			$dialog.modal();
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);

//End Loading 			
				

				
				
				
				
				
				
				
				
				