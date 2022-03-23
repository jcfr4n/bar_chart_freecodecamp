/*jshint esversion: 6 */

const urlData = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const req = new XMLHttpRequest();


let data;
let values = [];


let yScale;
let xScale;
let yAxisScale;
let xAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let drawCanvas = () => {
    svg
    .attr('width',width)
    .attr('height',height);
};

let generateScales = () => {
    yScale = d3.scaleLinear()
                .domain([0,d3.max(values,(item) => {
                    return item[1];
                })])
                .range([0,height-2*padding]);

    xScale = d3.scaleLinear()
                .domain([0,values.length-1])
                .range([padding, width - padding]);

    let datesArray = values.map((item) => {
        return new Date(item[0]);
    });

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray),d3.max(datesArray)])
                    .range([padding, width - padding]);

    yAxisScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (item) => {
                        return item[1];
                    })])
                    .range([height - padding,padding]);

};

let generateAxis = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr('transform','translate(0,' + (height - padding) + ')');
    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform','translate(' + (padding) + ', 0)');
};

let generateBars = () => {

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
            .attr('class','bar')
            .attr('width',(width - 2 * padding) / values.length )
            .attr('height', (item) => {
                return yScale(item[1]);
            })
            .attr('data-date',(item) => {
                return item[0];
            })
            .attr('data-gdp',(item) => {
                return item[1];
            })
            .attr('x',(item, index) => {
                return xScale(index);
            })
            .attr('y',(item) => {
                return (height - padding) - yScale(item[1]);
            });
        

};

req.open('GET',urlData,true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.table(values);
    drawCanvas();
    generateScales();
    generateAxis();
    generateBars();
};
req.send();