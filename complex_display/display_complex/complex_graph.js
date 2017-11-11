function displayGraph(svg, links, bird) {
    var nodes = {};
    links.forEach(function (link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
                name: "node_" + link.source.split('|')[0],
                text: link.source.split('|')[1].replace(/\\"/g, '"'),
                type: link.source.split('|')[2],
                attributes: link.source.split('|')[3].split(','),
                numOfChildren: link.source.split('|')[4],
                selected: link.source.split('|')[5]
            });
        link.target = nodes[link.target] || (nodes[link.target] = {
                name: "node_" + link.target.split('|')[0],
                text: link.target.split('|')[1].replace(/\\"/g, '"'),
                type: link.target.split('|')[2],
                attributes: link.target.split('|')[3].split(','),
                numOfChildren: link.target.split('|')[4],
                selected: link.target.split('|')[5]
            });
    });
    var width = 500;
    var height = 500;


    //Build the arrow
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    //Build graph
    var force = d3.layout.force()
        .size([width, height])
        .nodes(d3.values(nodes))
        .links(links)
        .linkDistance(150)
        .charge(-400)
        .gravity(0.03)
        .theta(0.9)
        .alpha(0.2)
        .on("tick", tick)
        .start();

    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("id", function (d) {
            return d.target.name + '***' + d.source.name;
        });

    svg.selectAll('path').data(links).each(function () {
        var target = this.id.split('***')[0];
        var source = this.id.split('***')[1];
        if (target != source) {
            d3.select(this).attr('marker-end', 'url(#end)');
        }
    });

    var nodeDrag = force.drag().on("dragstart", function (d) {
        d3.event.sourceEvent.stopPropagation();
    });

    var node = svg.selectAll('.node')
        .data(d3.values(nodes))
        .enter().append('g')
        .attr("class", 'node')
        .attr("id", function (d) {
            return d.name + "_" + bird
        })
        .call(nodeDrag)
        .on("click", hideAttributesTooltip)
        .on("dblclick", showAttributesTooltip);

    d3.selectAll('.node').each(function (d) {
        makeNodeView(d);
    });

    function tick(e) {
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
            .call(force.drag);

        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
    }

    var attrTooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function showAttributesTooltip(d) {
        var attributesText = "";
        for (var i = 0; i < d.attributes.length; i++) {
            var attr = d.attributes[i];
            if (attr.length == 0) {
                attributesText = "No attributes.   "
            } else {
                var prep = attr.split("=");
                if (prep[1] == "") {
                    attributesText += prep[0] + ", ";
                } else {
                    attributesText += "[" + attr + "] \r\n";
                }
            }
        }
        attributesText = attributesText.replace("+", ", ");
        attributesText = attributesText.substring(0, attributesText.length - 2);

        content = '<p class = "tooltip-title">' + d.text + "</p><br/>" + '<hr class="tooltip-hr">' +
            "Type: " + d.type + "<br/>" +
            "Children: " + d.numOfChildren + "<br/>" +
            "Attributes: " + "<br/>" +
            attributesText + "<br/>";

        attrTooltip.transition()
            .attr("class", "tooltip")
            .duration(200)
            .style("opacity", .9);

        attrTooltip.html(content)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    function hideAttributesTooltip(d) {
        attrTooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    function makeNodeView(d) {
        var textSize = 10;
        var width = 150;
        var height = 70;
        var maxChildNum = 100;

        //Add rectangle
        d3.select("g#" + d.name + "_false").append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('width', function (d) {
                return width + parseInt(d.numOfChildren)
            })
            .attr('height', function (d) {
                return height + parseInt(d.numOfChildren) * 10
            })
            .attr("rx", 6).attr("ry", 6)
            .attr('fill', '#ccccff')
            .style("stroke", function(d) {
                if(d.selected == "true")
                    return "#ff0000";
            });


        d3.select("g#" + d.name + "_true").append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('width', function (d) {
                return width + parseInt(d.numOfChildren)
            })
            .attr('height', function (d) {
                return height + parseInt(d.numOfChildren) * 10
            })
            .attr("rx", 6).attr("ry", 6)
            .attr('fill', '#ccccff')
            .style("stroke", function(d) {
                if(d.selected == "true")
                    return "#ff0000";
            });


        //Add name to rectangle
        d3.select("g#" + d.name + "_false").append('text')
            .attr('x', width / 2)
            .attr('y', 10)
            .attr('font-size', 12)
            .attr('font-family', 'Pacifico')
            .attr('text-anchor', 'middle')
            .style("fill", function(d) {
                if(d.selected == "true")
                    return "#ff0000";
            })
            .text(function (d) {
                var maxTextLength = 15;
                var customizedText;
                if (d.text.length > maxTextLength) {
                    customizedText = d.text.substring(0, maxTextLength) + "...";
                } else {
                    customizedText = d.text;
                }
                return customizedText;
            });

        d3.select("g#" + d.name + "_true").append('text')
            .attr('x', width / 2)
            .attr('y', 10)
            .attr('font-size', 12)
            .attr('font-family', 'Pacifico')
            .attr('text-anchor', 'middle')
            .style("fill", function(d) {
                if(d.selected == "true")
                    return "#ff0000";
            })
            .text(function (d) {
                var maxTextLength = 15;
                var customizedText;
                if (d.text.length > maxTextLength) {
                    customizedText = d.text.substring(0, maxTextLength) + "...";
                } else {
                    customizedText = d.text;
                }
                return customizedText;
            });

        //Separator in rectangle
        d3.select("g#" + d.name + "_false").append('line')
            .attr('x1', 0)
            .attr('y1', 11)
            .attr('x2', width)
            .attr('y2', 11)
            .attr('stroke', '#666666')
            .attr('stroke-width', 1);

        d3.select("g#" + d.name + "_true").append('line')
            .attr('x1', 0)
            .attr('y1', 11)
            .attr('x2', width)
            .attr('y2', 11)
            .attr('stroke', '#666666')
            .attr('stroke-width', 1);

        //Type
        var type = "Type: " + d.type;
        d3.select("g#" + d.name + "_false").append('text').attr('x', 1).attr('y', textSize * 2)
            .attr('text-anchor', 'start')
            .attr('font-size', textSize).attr('font-family', 'sans-serif')
            .attr('fill', '#000000').text(type);

        d3.select("g#" + d.name + "_true").append('text').attr('x', 1).attr('y', textSize * 2)
            .attr('text-anchor', 'start')
            .attr('font-size', textSize).attr('font-family', 'sans-serif')
            .attr('fill', '#000000').text(type);

        //Children -> for bird only
        var children = "Children: " + d.numOfChildren;
        d3.select("g#" + d.name + "_true").append('text').attr('x', 1).attr('y', textSize * 3)
            .attr('text-anchor', 'start')
            .attr('font-size', textSize).attr('font-family', 'sans-serif')
            .attr('fill', '#000000').text(children);

        if (!bird) {
            showAttributes(d);
        }
    }

    function showAttributes(d) {
        var numOfAttributes = d.attributes.length;
        var maxAttrLength = 23;
        var textSize = 10;
        var handleAttr = true;
        var yStep = 40;
        var height = 70;

        var label = "Attributes: ";
        d3.select("g#" + d.name + "_false").append('text').attr('x', 1).attr('y', textSize * 3)
            .attr('text-anchor', 'start')
            .attr('font-size', textSize).attr('font-family', 'sans-serif')
            .attr('fill', '#000000').text(label);


        for (var i = 0; i < numOfAttributes; i++) {
            if (handleAttr) {
                var attr = d.attributes[i];
                if (attr.length == 0) {
                    attr = "No attributes."
                } else {
                    if (attr.length > maxAttrLength) {
                        attr = attr.slice(0, maxAttrLength) + "... more";
                    }
                    if (attr.indexOf("=") !== -1) {
                        var prep = attr.split("=");
                        if (prep[1] === "") {
                            attr = prep[0];
                        }
                    }
                }

                d3.select("g#" + d.name + "_false").append("text")
                    .attr("x", function (d) {
                        return 1;
                    })
                    .attr("y", function (d) {
                        yStep = yStep + i * textSize;
                        if (yStep >= height) {
                            yStep = height - textSize;
                            handleAttr = false;
                            attr = "... double click for more."
                        }
                        return yStep;
                    })
                    .text(attr)
                    .attr('font-size', textSize).attr('font-family', 'sans-serif')
                    .attr('fill', '#000000');

            }
        }
    }

    return force;
}