function displayGraph(canvas, links, bird) {
    var nodes = {};
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source.split('|')[0],
            text: link.source.split('|')[1],
            type: link.source.split('|')[2],
            attributes: "node_" + link.source.split('|')[3].split(','),
            numOfChildren: link.source.split('|')[4],
            selected: link.source.split('|')[5]
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target.split('|')[0],
            text: link.target.split('|')[1],
            type: link.target.split('|')[2],
            attributes: "node_" + link.target.split('|')[3].split(','),
            numOfChildren: link.target.split('|')[4],
            selected: link.target.split('|')[5]
        });
    });

    var indents = []
    links.forEach(function(link) {
        if(link.source == link.target)
            return
        link.source.indent = indents[link.source.name] == undefined ? 1 : indents[link.source.name]
        link.target.indent = link.source.indent + .5
        indents[link.target.name] = link.target.indent
    });



    var width = 1000;
    var height = 650;

    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    var simulation = d3.layout.force()
                       .size([width, height])
                       .nodes(d3.values(nodes))
                       .links(links)
                       .linkDistance(60)
                       .charge(-200)
                       .on("tick", tick)
                       .start();

    var link = canvas.append("g")
                     .attr("class", "links")
                     .data(links)
                     .selectAll("line")
                     .data(links)
                     .enter()
                      .append("line")

    var myDrag = simulation.drag().on("dragstart", function(d) {d3.event.sourceEvent.stopPropagation();});
    var node = canvas.selectAll('.node')
                  .data(simulation.nodes())
                  .enter().append('g')
                  .attr('class', 'node')
                  .call(myDrag)
                  .on('mouseover', showTooltip)
                  .on('mouseout', hideTooltip)
                  .on('mouseup', hideTooltip);

    var minRadius = 8;
    var radiusScale = d3.scale.linear().range([minRadius,10]);
    var color = d3.scale.category10();

    node.append("circle")
        .attr("class", "circle")
        .attr("r", function(d) { return radiusScale(d.numOfChildren); })
        .style("fill", function(d) { return color(d.type); })
        .style("fill-opacity", function(d) { return 1/d.indent; })
        .style("stroke", function(d) {
            if(d.selected == "true")
                return "#ff0000";
        });

    var maxTextLength = 15
    node.append("text")
        .attr("class", "graphText")
        .text(function (d) {
            if(d.text.length >= maxTextLength)
                return d.text.substring(0,maxTextLength) + "..."
            return d.text
        })
        .style("fill", function(d) {
            if(d.selected == "true")
                return "#ff0000";
        })
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

    function tick(e) {

        node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";})
            .call(simulation.drag);

        link.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }

    function showTooltip(d) {
        content = '<p class = "tooltip-title">' + d.text + "</p><br/>" + '<hr class="tooltip-hr">' +
                  "Type: " + d.type + "<br/>" +
                  "Children: " + d.numOfChildren

        tooltip.transition()
               .attr("class", "tooltip")
               .duration(200)
               .style("opacity", .9);
        tooltip.html(content)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    }

    function hideTooltip(d) {
        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    }

    return simulation;
}