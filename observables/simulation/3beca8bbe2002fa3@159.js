// https://observablehq.com/@westernpower/commonlibrary@159
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# CommonLibrary`
)});
  main.variable(observer("commonStyle")).define("commonStyle", ["html"], function(html){return(
html`
<style>
  figcaption {
    margin-bottom:10px;
  }
  
  .row {
    height: 30px;
    border-bottom: solid 1px #e38a46;
  color: #6f6f6f;
  }
  td {
    padding: 0px 20px 0px 20px;
  font-family: "Courier New, monospace";
  }
  .header {
    font-weight: 700;
   border-bottom: solid 1px #e38a46;
  }

</style>
`
)});
  main.variable(observer()).define(["book_index"], function(book_index){return(
book_index('power-and-energy-model')
)});
  main.variable(observer("book_index")).define("book_index", ["html"], function(html){return(
function book_index(presRef){
  
 function wrap(ref,text){
    
   if (presRef==ref){
    text='<b>' + text + '</b>'
   }else
   {
    text='<a target="_blank" href="https://observablehq.com/@westernpower/' + ref + '">' + text + '</a>' 
   }
   return text;
 }
 
 return html`
  This is one of a series of presentations describing various aspects of the hydrology, power and energy modelling, environmental hydrology and climate change resilience of the proposed <b>Ngonye Falls Hydroelectric Project</b> on the Zambezi River in western Zambia.
<br><br>
<div style="padding-left:30px;padding-bottom:20px;">
${wrap('design-and-operation','1. Design and Operation<br>')}
${wrap('catchment-hydrology','2. Catchment Hydrology<br>')}
${wrap('power-and-energy-model','3. Power and Energy Model<br>')}
${wrap('power-and-energy','4. Power and Energy Analysis<br>')}
${wrap('selected-years','5. Selected Years Simulations<br>')}
${wrap('environmental-flows','6. Environmental Flows<br>')}
${wrap('climate-change-and-variability','7. Climate Change and Variability<br>')}
${wrap('upstream-impact','8. Upstream Impact<br>')}
</div>
 `
}
)});
  main.variable(observer("month_names")).define("month_names", function(){return(
['January','February','March','April','May','June','July','August','September','October','November','December']
)});
  main.variable(observer("format_flow")).define("format_flow", ["d3","cumec"], function(d3,cumec){return(
function format_flow(flow){
  return d3.format(',.0f')(flow) + cumec
}
)});
  main.variable(observer("format_power")).define("format_power", ["d3"], function(d3){return(
function format_power(power){
  return d3.format(',.1f')(power) + ' MW'
}
)});
  main.variable(observer("format_energy")).define("format_energy", ["d3"], function(d3){return(
function format_energy(energy){
  return d3.format(',.0f')(energy) + ' GWh'
}
)});
  main.variable(observer("cumec")).define("cumec", function(){return(
' m\u00b3/s'
)});
  main.variable(observer("margin")).define("margin", function(){return(
function margin(narrow=false) {
  
  return {
  l: 90,
  r: 90,
  b: narrow?50:90,
  t: 40
  }
}
)});
  main.variable(observer("plotTitle")).define("plotTitle", function(){return(
function plotTitle (text) {
  return {text: text ,font: { size: 18 }}
}
)});
  main.variable(observer("colr")).define("colr", ["d3hsv"], function(d3hsv){return(
function colr(i = 1, a = 1) {
  return d3hsv.hsv(26, 0.85, ((6 - i + 1.5) * 15)/100, a).toString();
}
)});
  main.variable(observer("font")).define("font", function(){return(
{
  family: 'Courier New, monospace',
  size: 13,
  color: '#6f6f6f'
}
)});
  main.variable(observer("movingAverage")).define("movingAverage", function(){return(
function movingAverage(values, N) {
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i];
    means[i - Math.floor(N / 2)] = sum / N;
    sum -= values[i - N + 1];
  }
  return means;
}
)});
  main.variable(observer("d3hsv")).define("d3hsv", ["require"], function(require){return(
require("d3-hsv@0.1")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
