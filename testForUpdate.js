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

    var dropDown = d3.select("#drop")
        .append("select")
        .attr("name", "date");

    var date = data.Time.map(function(d, i) {
        return d;
    })

    var options = dropDown.selectAll("option")
        .data(date)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        })

    dropDown.on("change", update);

    function update() {
        var filteredData = sortObject(data, this.value);
        fontScale.domain([
            d3.min(newValue, function(d) {
                return d.value
            }),
            d3.max(newValue, function(d) {
                return d.value
            }),
        ]);
        d3.layout.cloud()
            .size([width, height])
            .words(filteredData)
            .rotate(0)
            .text(function(d) {
                return d.label;
            })
            .font("Impact")
            .fontSize(function(d) {
                return fontScale(d.value)
            })
            .on("end", draw)
            .start();
    }

    function sortObject(obj, date) {
        var newValue = [];
        var orgS = date || "11/11/1961";
        //var dateS = "Jan";
        for (var shapes = 0; shapes < data.Shape.length; shapes++) {
            var time = data.Time.indexOf(orgS);
           // var date = data.dates.indexOf(dateS);
            newValue.push({
                label: data.Shape[shapes],
                value: data.values[shapes][time]
            });
        }
        newValue.sort(function(a, b) {
            return b.value - a.value;
        });
        newValue.splice(10, 50)
        return newValue;
    }

    var newValue = sortObject();

    fontScale.domain([
        d3.min(newValue, function(d) {
            return d.value
        }),
        d3.max(newValue, function(d) {
            return d.value
        }),
    ]);

    d3.layout.cloud().size([width, height])
        .words(newValue)
        .rotate(0)
        .text(function(d) {
            return d.label;
        })
        .font("Impact")
        .fontSize(function(d) {
            return fontScale(d.value)
        })
        .on("end", draw)
        .start();

    function draw(words) {
        var selectVis = svg.selectAll("text")
            .data(words);

        selectVis
            .enter().append("text")
            .style("font-size", function(d) {
                return fontScale(d.value)
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
                return d.label;
            })

        selectVis
            .transition()
            .duration(600)
            .style("font-size", function(d) {
                return fontScale(d.value)
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
