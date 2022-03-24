/*jshint esversion: 6 */

const urlData = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';


d3.json(urlDat, function(error, data) {
  if (error) throw error;
  var dataset = data.data;

  drawBar(dataset);
  
});

function drawBar(dataset) {
    let margin = {
        top:50, right:50, bottom:50, left: 100 },
        width = 800,
        height = 600;
    
    let minDate = new Date(dataset[0][0].substrn(0,4));
    
    let maxDate = new Date(dataset[dataset.length - 1][0].substrn(0,4));

    let xAxisScale = d3.time.scale()
                        .domain([minDate,maxDate])
                        .range([0,width]);
    
    let yAxisScale = d3.time.linear()
                        .domain(0,d3.max(dataset, (date) => {
                            return date[1];
                        }))
                        .range(height,0);

    let xAxis = d3.svg.axis().scale(xAxisScale).orient('bottom');
    let yAxis = d3.svg.axis().scale(yAxisScale).orient('left');

    let tooltip = d3.select('body')
                    .append('div')
                    .style({
                        'position': 'absolute',
                        'padding': '4px',
                        'background' : 'white',
                        'border' : '1px solid black',
                        'color' : 'black'

                    });

    let svg = d3.select('#barGraph')
                .append(svg)
                .attr('width', width + margin.right + margin.left)
                .attr('heiht', height + margin.bottom + margin.top)
                .attr('class', 'graph-svg-component')
                .append('g')
                .attr("transform", "translate(" + margin.left + ", " +margin.top  + ")");

    svg.selectAll('bar')
        .data(dataset)
        .enter()
        .append('rect')
        .style('fill', 'orangered')
        .attr({
            x: function(data, index) {return index * (width/dataset.length)},
            width: width/dataset.length,
        });
    
}