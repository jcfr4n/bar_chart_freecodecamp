//jshint esversion:6

/**
 * coded by @juan-carlos-francisco
 * github: https://github.com/jcfr4n/bar_chart_freecodecamp
 * 
 */

const urlData =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// init variables.
const width = 800;
const height = 400;

/* Define "tooltip" element. Select "barChartHolder" element, append to it a div element with "tooltip" id and set its opacity to 0
 */

/* Defina el elemento "tooltip". Seleccione el elemento "barChartHolder", agréguele un elemento div con la identificación de "tooltip" y establezca su opacidad en 0
 */
let tooltip = d3
  .select(".barChartHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

/* Define "svgContainer" element. Select "barChartHolder" element, append to it a div element with "svgContainer" id and set its width and height attributes a little bit higher than constants width and height
 */

/* Defina el elemento "svgContainer". Seleccione el elemento "barChartHolder", agréguele un elemento div con la identificación "svgContainer" y establezca sus atributos de ancho y alto un poco más altos que las constantes de ancho y alto.
 */
let svgContainer = d3
  .select(".barChartHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

  /* Sends http request to the specified url to load .json file or data and executes callback function with parsed json data objects.

  Signature:
d3.json(url, callback);

The first parameter is the url of .json file and second parameter is a callback function which will be executed once .json file is loaded. It passes parsed data object as a parameter to callback function.
  */

/* Envía una petición http a la url especificada para cargar un archivo o datos .json y ejecuta una callback con los objetos de datos json analizados.

  Sintaxis:
d3.json(url, callback);

El primer parámetro es la url del archivo .json y el segundo es una función callback que se ejecutará una vez cargado el archivo .json. Pasa el objeto de datos analizado como parámetro a la función callback.
*/

d3.json(urlData).then((data) => {
/* Define vars needed to set x-Axis in svgContainer.
 */
/* Defina las variables necesarias para configurar el eje x en svgContainer.
*/
  let yearsDate = data.data.map((item) => {
    return new Date(item[0]);
  });

  let xMax = d3.max(yearsDate);

  let xMin = d3.min(yearsDate);

  let xScale = d3.scaleTime()
                  .domain([xMin, xMax])
                  .range([0, width]);

  let xAxis = d3.axisBottom()
                .scale(xScale);

  svgContainer
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(50, 400)");

/* Define vars needed to set y-Axis in svgContainer.
*/
/* Defina las variables necesarias para configurar el eje y en svgContainer.
*/

  let gdp = data.data.map((item) => {
    return item[1];
  });

  let gdpMax = d3.max(gdp);

  let linearScale = d3.scaleLinear()
                      .domain([0, gdpMax])
                      .range([0, height]);

  let scaledGdp = gdp.map((item) => {
    return linearScale(item);
  });

  let yAxisScale = d3.scaleLinear()
                      .domain([0, gdpMax])
                      .range([height, 0]);

  let yAxis = d3.axisLeft(yAxisScale);

  svgContainer
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(50, 0)");

/* Define the width of the bars and create their attributes, also set the mouseover and mouseout functions and define the tooltip element.
*/ 
/* Define el ancho de las barras y crea sus atributos, también establece las funciones de mouseover y mouseout y define el elemento tooltip.
*/   
  let barWidth = width / yearsDate.length;

  d3.select("svg")
    .selectAll("rect")
    .data(scaledGdp)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", function (d, i) {
      return data.data[i][0];
    })
    .attr("data-gdp", function (d, i) {
      return data.data[i][1];
    })
    .attr("x", function (d, i) {
      return xScale(yearsDate[i]);
    })
    .attr("y", function (d) {
      return height - d;
    })
    .attr("width", barWidth)
    .attr("height", function (d) {
      return d;
    })
    .attr("index", (d, i) => i)
    .attr("transform", "translate(50, 0)")
    .on("mouseover", function (event, item) {
      let i = this.getAttribute("index");

      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html(data.data[i][0].substring(0, 4) + ' - $ ' + data.data[i][1])
        .attr("id", "tooltip")
        .attr("data-date", data.data[i][0])
        .attr("data-gdp", data.data[i][1])
        .style("left", i * barWidth + 30 + "px")
        .style("top", height - 100 + "px")
        .style("transform", "translateX(50px)");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});
