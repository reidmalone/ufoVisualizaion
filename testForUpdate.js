var width = 455;
var height = 310;
var fontScale = d3.scale.linear().range([0, 30]);
var fill = d3.scale.category20();

// Initialize slider
var slider1 = d3.slider().min(0).max(10).ticks(10).showRange(true).value(6);
var slider2 = d3.slider().min(0).max(10).ticks(10).showRange(true).value(6);
// Render the slider in the div
d3.select('#slider1').call(slider1);
d3.select('#slider2').call(slider2);

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
// .selectAll("text")


d3.csv("ufo.csv", function(error, data) {



    if (error) {
        console.log(error)
    } else {
        data = data
    }
    //parseDate = d3.time.format("%m-%d-%Y").parse(data.Time)
    dateData = data.map(d=>d.Time);
    //shapeData = data.map(d=>d.Shape);
    //lightshapes = data.filter(d=>d.Shape === "light");
    //nested = d3.nest().key(d=>d.Shape).entries(data);
    //counting = nested.map(d=>{d.count=d.values.length; return d});
    //selectedData = data.filter(d=>d.Time < "10/10/1971 23:4" && d.Time>"10/10/1949 20:30"); //this is for the slider crap

    var dropDown = d3.select("#drop")
        .append("select")
        .attr("name", "dates");

    var newData = data.map(function(d) {
        let newItem = {};
        newItem.Time = d.Time;
        newItem.Shape = d.Shape;
        return newItem;
    })
    selectedData = newData.filter(d=>d.Time < "10/10/2005 23:40" && d.Time>"10/10/1949 20:30"); //this is for the slider crap
    nested = d3.nest().key(d=>d.Shape).entries(selectedData);
    counting = nested.map(d=>{d.count=d.values.length; return d});
    var options = dropDown.selectAll("option")
        .data(selectedData)
        .enter()
        .append("option")
        .text(function(d) {
            return d.Time;
        })
        .attr("value", function(d) {
            return d.Time;
        })

    dropDown.on("change", update);

    function update() {
        selectedData = newData.filter(d=>d.Time < "10/10/2009 23:40" && d.Time>"10/10/1954 20:30"); //this is for the slider crap
        nested = d3.nest().key(d=>d.Shape).entries(selectedData);
        counting = nested.map(d=>{d.count=d.values.length; return d});

        fontScale.domain([
            d3.min(counting, function(d) {
                return d.count
            }),
            d3.max(counting, function(d) {
                return d.count
            }),
        ]);
        d3.layout.cloud()
            .size([width, height])
            .words(counting)//changed from selectedDAta
            .rotate(0)
            .text(function(d) {
                return d.key; //maybe
            })
            .font("Impact")
            .fontSize(function(d) {
                return fontScale(d.count)
            })
            .on("end", draw)
            .start();
    }

   // selectedData = data.filter(d=>d.Time < "10/10/1978 22:00" && d.Time>"10/10/1950 20:30");
   // shapeData = selectedData.map(d=>d.Shape);
    fontScale.domain([
        d3.min(counting, function(d) {
            return d.count
        }),
        d3.max(counting, function(d) {
            return d.count
        }),
    ]);

    d3.layout.cloud().size([width, height])
        .words(counting)
        .rotate(0)
        .text(function(d) {
            return d.key; //idk
        })
        .font("Impact")
        .fontSize(function(d) {
            return fontScale(d.count)
        })
        .on("end", draw)
        .start();

    function draw(words) {
        var selectVis = svg.selectAll("text")
            .data(words);

        selectVis
            .enter().append("text")
            .style("font-size", function(d) {
                return fontScale(d.size)
            })
            .style("font-family", "Impact")
            .style("fill", function(d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) {
                return d.key;
            })

        selectVis
            .transition()
            .duration(600)
            .style("font-size", function(d) {
                return fontScale(d.size)
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        selectVis.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }
});
