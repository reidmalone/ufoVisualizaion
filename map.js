
var stateList = [
    "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL",
    "GA","HI","IA","ID", "IL","IN","KS","KY","LA","MA",
    "MD","ME","MI","MN", "MO","MS","MT","NC","ND","NE",
    "NH","NJ","NM","NV","NY", "OH","OK","OR","PA","RI",
    "SC","SD","TN","TX","UT","VA","VT","WA","WI","WV",
    "WY"
];

var stateNames = [
    'Alaska','Alabama','Arkansas','Arizona', 'California','Colorado','Connecticut','District_of_Columbia','Delaware','Florida',
    'Georgia','Hawaii','Iowa','Idaho','Illinois','Indiana','Kansas','Kentucky','Louisiana','Massachusetts',
    'Maryland','Maine','Michigan','Minnesota','Missouri','Mississippi','Montana','North_Carolina','North_Dakota','Nebraska','New_Hampshire',
    'New_Jersey','New_Mexico','Nevada','New_York','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode_Island','South_Carolina','South_Dakota',
    'Tennessee','Texas','Utah','Virginia','Vermont','Washington','Wisconsin','West_Virginia','Wyoming'
    ];

var colors = ['#0000ff','#7000b5','#6d0a6d','#281027','#454316','#d7d613','#a1c800','#008000','#af6600','#ff3800','#ff8700','#e5831c','#b23e29','#cf6c6b','#ffc0cb'];

var div2 = d3.select("#usMap")
      .append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

const width = 600, height = 400,
    margin = {top: 20, right: 20, bottom: 80, left: 80},
    contentWidth = width - margin.left - margin.right,
    contentHeight = height - margin.top - margin.bottom;
    // Add check boxes


    var file = "ufo.csv";
    var parseDate = d3.time.format("%").parse;

    processData();


function processData()
{
  console.log("In process Data");
        d3.csv('ufo.csv', function (data) {
            data.forEach(
                function(d)
                {
                  var dateTime = d.Time.split(" ");
                   d.date = dateTime[0];
                   d.time = dateTime[1];
                  // var hour = Number(date.split("/"))
                  // var time = date[1].split(":");
                  // if(Number(time[0]) < 12)
                  // {
                  //   date[0] = (Number(data[0])+1).toString()
                  // }
                });

              var shapeCount = d3.nest()
                .key(function(d) { return d.Shape; })
                .rollup(function(v) { return v.length; })
                .entries(data).sort(function(a,b){
                  return (a.values - b.values);
                });

                var shapes = [];
                shapeCount.forEach(function(d)
                  {
                    shapes.push(d.key);
                  });

            console.log(data[1]);
            var us_data = data.
        filter(function(d)
            {
                return(d.Country == "us" || d.State != "");
            }).filter(
            function(d)
            {
                var arr = d.date.split("/");
                var len = arr.length;
                return(len > 1);
            });

        makeMap();
       // makeCalendar(us_data);


    function findNextDay(entered_day, entered_month, entered_year)
    {
      var day = Number(entered_day);
      var month = Number(entered_month);
      var year = Number(entered_year);
      if(month == 2 && day == 28 && year %4 !=0)
      {
        day = 1;
        month = month +1
      }
      else if(month == 2 && day == 29 && year %4 ==0)
      {
        day = 1;
        month = month +1
      }
      else if (day == 30 && month % 2 == 0) 
      {
        day = 1;
        month = month +1;
      }
      else if (day == 31 && month %2 == 1)
      {
        day = 1;
        month = month +1
      }
      if(month > 12)
      {
        month = 1;
        year = year + 1
      }
      return (month.toString()+"/"+ day.toString()+"/"+ year.toString);
    }
        document.getElementById("nightBtn").onclick=updateMap;
    function updateMap()
    {
      
      //d3.selectAll("mapSvg > *").remove()
      d3.selectAll("circle").remove();
      //d3.select("mapSvg").selectAll("circle").data([]).exit().remove() 
      //d3.select("mapSvg").selectAll(".pin").remove();
      makeMap();

    }

    function makeMap() {
      var pointArr = us_data;
       var entered_day = "4";
       var entered_month = "1";
       var entered_year = "2004";


        const minDate = document.getElementById('night').value;
        console.log(minDate);
        var newDate = minDate.split("-");
        entered_month = newDate[1];
        entered_day = newDate[2];
        entered_year = newDate[0];
        if (entered_day.charAt(0) == '0')
          entered_day = entered_day.charAt(1);
        if (entered_month.charAt(0) == '0')
          entered_month = entered_month.charAt(1);


        entered_date = entered_month+"/"+ entered_day+"/"+ entered_year;
        console.log("Entered Date: "+entered_date);
        var next_day = findNextDay(entered_day, entered_month, entered_year);

        pointArr = pointArr.filter(
            function(d){
                return (d.date == entered_date//);
                 || d.date == next_day);
            })
        .filter(
            function(d)
            {
              var hour = d.Time.split(" ")[1].split(":")[0];
              if(d.date == entered_date)
                return(Number(hour) > 12);
              return(Number(hour) < 12);

            });
        console.log(pointArr);
        d3.json("us-states.json", function(json) {
          
            var widthMap = 600;
            var heightMap = 300;
            var projection = d3.geo.albersUsa()
                               .translate([widthMap/2, heightMap/2])    // translate to center of screen
                               .scale([widthMap]);          // scale things down so see entire US
            // Define path generator
            var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                         .projection(projection);  // tell path generator to use albersUsa projection
            
            //Create SVG element and append map to the SVG
            var mapSvg = d3.select("#usMap")
                        .select("svg")
                        .attr("width", widthMap)
                        .attr("height", heightMap);

          // Bind the data to the SVG and create one path per GeoJSON feature
          mapSvg.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
             .style("stroke", "steelblue")
              .style("stroke-width", "1")


              mapSvg.selectAll(".pin")
              .data(pointArr)
              .enter().append("circle")
              .attr("r", 3)
              .attr("fill", function(d){
                if(d.Shape in shapes)
                  console.log
              })
              .attr("fill",function(d)
                {
                  console.log("Shape: "+d.Shape +" index: "+ (shapes.indexOf(d.Shape)-15));
                  if(d.Shape == "Other" || d.Shape == "")
                    return "red";
                  if(shapes.indexOf(d.Shape) >= 15)
                    return (colors[((shapes.indexOf(d.Shape)*3)%15)]);
                  return "red";
                 })
              .attr("transform", function(d) {
                //console.log(d);
                return "translate(" + projection([
                  +d.Long,
                  +d.Lat
                ]) + ")";
              })
              .on("mouseenter",
                function(d)
                {
                  console.log("Shape: "+d.Shape );
;
                })            .on("mouseover", function(d) {      
                div2.transition()        
                   .duration(200)      
                   .style("opacity", 1);      
                   div2.html( "<strong>Shape: </strong>" +d.Shape + "<br><strong>Time:</strong> " + d.time
                    + "<br><strong>Description: </strong>" + d.Description
                    )
                   .style("left", (d3.event.pageX) + "px")     
                   .style("top", (d3.event.pageY - 120) + "px");  ;  
            }) 
            // fade out tooltip on mouse out               
            .on("mouseleave", function(d) {       
            div2.transition()        
               .duration(500)      
               .style("opacity", 0);  
            });

            }); //end of process JSON

}// end of makeMap

        });//csv ufo end of func
}