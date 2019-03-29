var width = 750,
    height = 500;
var fill = d3.scale.category20();

d3.csv('ufo.csv', function (data) {
    //data = data.slice(-2000);
    nested = d3.nest().key(d=>d.Shape).entries(data);
    counting = nested.map(d=>{d.count=d.values.length; return d});



    //console.log(sightings[0]);
    var wordScale = d3.scale.linear()
        .range([10,60])
        .domain([d3.min(counting,function(d) { return d.count; }),
            d3.max(counting,function(d) { return d.count; })
        ]);

    d3.layout.cloud().size([width, height])
        .words(counting)
        .padding(0)
        .font("Impact")
        .fontSize(function (d) {
            return wordScale(d.count);
        })
        .on("end", drawCloud)
        .start();


});

function drawCloud(words) {
    d3.select("#word-cloud").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) {
            return d.size + "px";
        })
        .style("font-family", "Impact")
        .style("fill", function (d, i) {
            return fill(i);
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
            return d.key;
        });
}

