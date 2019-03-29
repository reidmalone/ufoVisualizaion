
var width = 750,
    height = 500;
var fill = d3.scale.category20();

//under here is the bulk of what takes forever really.
d3.csv('ufo.csv', function (data) {
  var sightings=[];
  //the slice here takes the last 200 entries, could change the slice based upon year
  //makes it more efficient
  data.slice(-2000).forEach(function(row){
    sightings.push({
      time: row.Time,
      city: row.City,
      state: row.State,
      country: row.Country,
      text: row.Shape, //changed
      desc: row.Description,
      size: +row.Duration //this is what the size is on. This NEEDS to be
      //something like the amount of occurrences of a single shape. So say triangle is
      //listed 50 times, but cigar is listed 5. Then triangle is a lot bigger.
    });

  });
  console.log(sightings[0]);


  var sightingsScale = d3.scale.linear()
    .range([10,60])
    .domain([d3.min(sightings,function(d) { return d.size; }),
             d3.max(sightings,function(d) { return d.size; })
           ]);

  d3.layout.cloud().size([width, height])
    .words(sightings)
    .padding(0)
    .font("Impact")
    .fontSize(function(d) { return sightingsScale(d.size); })
    .on("end", drawCloud)
    .start();


});
function drawCloud(words) {
  d3.select("#word-cloud").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate("+(width / 2)+","+(height / 2)+")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}

