var width = 750;
var height = 500;
var fontScale = d3.scale.linear().range([10, 60]);
var fill = d3.scale.category20();


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

    dateData = data.map(d=>d.Time);
    //shapeData = data.map(d=>d.Shape);
    //lightshapes = data.filter(d=>d.Shape === "light");
    //nested = d3.nest().key(d=>d.Shape).entries(data);
    //counting = nested.map(d=>{d.count=d.values.length; return d});
    //selectedData = data.filter(d=>d.Time < "10/10/1971 23:4" && d.Time>"10/10/1949 20:30"); //this is for the slider crap
    let div = d3.select("body").append("div").attr("class", "tooltip").attr("opacity", 0);
    var dropDown = d3.select("#drop")
        .append("select")
        .attr("name", "dates");
    /*
    var dropDown = d3.select("#drop")
        .append("select")
        .attr("name", "dates");
*/
    var newData = data.map(function(d) {
        let newItem = {};
        newItem.Time = d.Time;
        newItem.Shape = d.Shape;
        return newItem;
    })

//formats the date here
    newData.forEach(function(d,i){
        d3.time.format("%Y-%m-%d").parse(d.Time);
        return d;
    });
    console.log(newData.Time);

    selectedData = newData.filter(d=>d.Time < "10/10/2009 23:40" && d.Time>"10/10/1949 20:30"); //this is for the slider crap
    nested = d3.nest().key(d=>d.Shape).entries(selectedData);
    counting = nested.map(d=>{d.count=d.values.length; return d});
    var options = dropDown.selectAll("option")
        .data(selectedData)
        .enter()
        .append("option")
        .text(function(d) {
            return d.Time;
        })
        /*
        .attr("value", function(d) {
            return d.value;
        })


*/
/*
    var options2 = dropDown2.selectAll("option")
        .data(selectedData)
        .enter()
        .append("option")
        .text(function(d) {
            return d.Time;
        })
    dropDown1.on("change", update(options1.value,options2.value));

 */
    dropDown.on("change", update);

    function update() {


        //selectedData = newData.filter(d=>d.Time < min && d.Time>max); //this is for the slider crap

        selectedData = newData.filter(d=>d.Time < "10/10/2009 23:40" && d.Time>this.value); //this is for the slider crap
        nested = d3.nest().key(d=>d.Shape).entries(selectedData);
        counting = nested.map(d=>{d.count=d.values.length; return d});

        //console.log(counting);
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
                return fontScale(d.count)
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
                return fontScale(d.count)
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


        selectVis.on("mouseover", d => {
            div.style('left', d3.event.pageX + "px").style("top", d3.event.pageY + "px");
            div.transition().duration(1000).style("opacity", 1);
            div.html(d.count);

            paused = true;
        })
            .on("mouseout", d => {
                div.transition().duration(1000).style("opacity", 0);
                paused = false;
            });
        //endnew

    }

//need help here too :)



});
