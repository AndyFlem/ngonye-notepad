// https://observablehq.com/d/d7fe980b106768f0@160
import define1 from "./3beca8bbe2002fa3@159.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Simulation`
)});
  main.variable(observer("viewof exceed")).define("viewof exceed", ["html","format_flow","pefdc"], function(html,format_flow,pefdc)
{
  const form = html`<form>
  <div style="display: flex; padding:5px;">
    <div style="flex:25%;">
      <div class="cell">River Flow</div>
    </div>
    <div style="flex:75%;">
      <div class="cell2"><input type=range name=exceed_select min=0 max=95 step=1 value=77>&nbsp<span id=flow_disp></span></div>
    </div>
  </div>
</form>`;
  form.oninput = () => {
    form.querySelector("[id=flow_disp]").textContent =  
      format_flow(pefdc.filter(f=>f.ExceedanceRnd*100==(100-form.exceed_select.valueAsNumber))[0].Flow);
    form.value = pefdc.filter(f=>f.ExceedanceRnd*100==(100-form.exceed_select.valueAsNumber))[0];
  };
  form.oninput();
  return form;
}
);
  main.variable(observer("exceed")).define("exceed", ["Generators", "viewof exceed"], (G, _) => G.input(_));
  main.variable(observer()).define(["exceed","d3","colr","width","font","DOM","plt","html","format_flow"], function(exceed,d3,colr,width,font,DOM,plt,html,format_flow)
{
  var data1 = [
    {
      x: ['Power', 'Flow' ,'Head'],
      y: [
        exceed.Power/180*100, 
        exceed.FlowCanal/1100*100,
        exceed.HeadTurbine1/25.4*100,
      ],
      text: [
        d3.format(",.0f")(exceed.Power/180*100) + '%',
        d3.format(",.0f")(exceed.FlowCanal/1100*100) + '%' ,
        d3.format(",.0f")(exceed.HeadTurbine1/25.4*100) + '%'
      ],
      marker: {
        color: [colr(1),colr(7),colr(4)],
      },
       textposition: 'outside',
      hoverinfo: 'none',
      type: 'bar'
    }
  ];
  
  var layout1={
    margin: { l: 40, r: 10,b: 30, t: 10 }, 
    height:200,
    width:width*.2,
    font: font,
    yaxis: {
      range: [0, 120],
      title: '%',
    }
  }
  
  const div1 = DOM.element('div');
  plt.newPlot(div1, data1, layout1,{staticPlot: true});
  
  return html` 
    <div style="display:flex;">
    <div style="flex:40%;">
      <ul>
        <li><em>Power: </em> ${d3.format(',.0f')(exceed.Power)} MW</li>
        <li><em>Monthly Energy: </em> ${d3.format(',.0f')(exceed.Power*24*30/1000)} GWh</li>
        <li><em>Turbines: </em> ${Math.ceil(exceed.Turbines)}</li>
        <li><em>Head: </em> ${d3.format(',.1f')(exceed.HeadTurbine1)}m</li>
        <li><em>Flow Exceedance: </em>${d3.format(',.0f')(exceed.ExceedanceRnd*100)}%</li>
      </ul>
    </div>
    <div style="flex:40%;">
      <ul>
        <li><em>River Flow: </em> ${format_flow(exceed.Flow)}</li>
        <li><em>Environmental Flow: </em> ${format_flow(exceed.EWRTotal + exceed.FlowSpill)} (${d3.format(',.0f')((exceed.EWRTotal + exceed.FlowSpill)/exceed.Flow*100)}%)</li>
        <li><em>Canal Flow: </em> ${format_flow(exceed.FlowCanal)}</li>
        <li><em>Main Fall Flow: </em> ${format_flow(exceed.FlowChannelA)}</li>     
      </ul>
    </div>
    <div style="flex:20%;" class="chart_type">
      ${div1}
    </div>
    </div>
`;
}
);
  main.variable(observer()).define(["d3","s_width","s_height","sankey","data","format_flow","DOM","width"], function(d3,s_width,s_height,sankey,data,format_flow,DOM,width)
{
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, s_width, s_height]);
      
  const parent=svg.append("g");
  
  const {nodes, links} = sankey(data);

  parent.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => d.color)
    .append("title")
      .text(d => `${d.name}\n${format_flow(d.value)}`);

  const link = parent.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");

  const gradient = link.append("linearGradient")
  .attr("id", d => (d.uid = DOM.uid("link")).id)
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", d => d.source.x1)
  .attr("x2", d => d.target.x0);

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d => d.source.color);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d => d.target.color);

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d.uid)
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${format_flow(d.value)}`);

  parent.append("g")
      .style("font", "10px Courier New, monospace")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 3*2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 3*2 ? "start" : "end")
      .text(d => d.name);

    return svg.node();  
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Appendix`
)});
  main.variable(observer("data")).define("data", ["format_flow","exceed","colr"], function(format_flow,exceed,colr)
{
  var nodes = [
    {name: format_flow(exceed.Flow),color:colr(1)},
    {name: "Left Channel",color:colr(3)},
    {name: "Intake",color:"#CD5C5C"},
    {name: "Canal",color:"#CD5C5C"},
    {name: "Turbine 1",color:"red"},
    {name: "Channel A",color:colr(7)},
    {name: "Channel C",color:colr(7)},
    {name: "Channel D",color:colr(7)},
    
    {name: "Main Fall",color:colr(2)},
    {name: "Right Channel",color:colr(3)},
    {name: "Channel FG",color:colr(7)},
    {name: "Channel E",color:colr(7)},
    
    {name: "Right Fall",color:colr(2)},   
    {name: "Gorge",color:colr(5)},
    {name: "Outflow",color:colr(1)}
  ]
  
  var turbines=Math.ceil(exceed.Turbines)
  var turbine_flow=exceed.FlowCanal/turbines;
  
  var links = [
    {source: format_flow(exceed.Flow), target: "Left Channel",value: exceed.FlowLeftChannel},
    {source: format_flow(exceed.Flow), target: "Right Channel",value: exceed.Flow-exceed.FlowLeftChannel},
    {source: "Left Channel", target: "Intake",value: exceed.FlowCanal},
    {source: "Left Channel", target: "Channel A",value: exceed.FlowChannelA},
    {source: "Left Channel", target: "Channel C",value: exceed.FlowChannelC},
    {source: "Left Channel", target: "Channel D",value: exceed.FlowChannelD},
    {source: "Channel A", target: "Main Fall",value: exceed.FlowChannelA},
    {source: "Channel C", target: "Main Fall",value: exceed.FlowChannelC},
    {source: "Channel D", target: "Main Fall",value: exceed.FlowChannelD},
    {source: "Main Fall", target: "Gorge",value: exceed.FlowChannelA+exceed.FlowChannelC+exceed.FlowChannelD},
    {source: "Intake", target: "Canal",value: exceed.FlowCanal},
    {source: "Canal", target: "Turbine 1",value: turbine_flow},
    {source: "Turbine 1", target: "Outflow",value: turbine_flow},
    
    {source: "Right Channel", target: "Channel FG",value: exceed.FlowChannelFG},
    {source: "Right Channel", target: "Channel E",value: exceed.FlowChannelE},

    {source: "Channel FG", target: "Right Fall",value: exceed.FlowChannelFG},
    {source: "Channel E", target: "Right Fall",value: exceed.FlowChannelE},

    {source: "Right Fall", target: "Gorge",value: exceed.FlowChannelE + exceed.FlowChannelFG},
    {source: "Gorge", target: "Outflow",value: exceed.FlowChannelE + exceed.FlowChannelFG +exceed.FlowChannelA + exceed.FlowChannelC + exceed.FlowChannelD} 
  ];

  if (exceed.FlowTurbine2>0){
    nodes.splice(6,0,{name: "Turbine 2",color:"red"})
    links.splice(13,0,{source: "Canal", target: "Turbine 2",value: turbine_flow})
    links.splice(15,0,{source: "Turbine 2", target: "Outflow",value: turbine_flow})
  }
  if (exceed.FlowTurbine3>0){
    nodes.splice(7,0,{name: "Turbine 3",color:"red"})
    links.splice(17,0,{source: "Canal", target: "Turbine 3",value: turbine_flow})
    links.splice(19,0,{source: "Turbine 3", target: "Outflow",value: turbine_flow})
  }
  if (exceed.FlowTurbine4>0){
    nodes.splice(8,0,{name: "Turbine 4",color:"red"})
    links.splice(21,0,{source: "Canal", target: "Turbine 4",value: turbine_flow})
    links.splice(23,0,{source: "Turbine 4", target: "Outflow",value: turbine_flow})
  }
  return {nodes, links};
}
);
  main.variable(observer("sankey")).define("sankey", ["d3","s_width","s_height"], function(d3,s_width,s_height)
{
  const sankey = d3.sankey()
      .nodeId(d => d.name)
      .nodeAlign(d3["sankeyCenter"])
      .nodeWidth(12)
      .nodePadding(4)
      .nodeSort(null)
      .linkSort(null)
      .extent([[1, 5], [s_width - 1, s_height - 5]]);
  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}
);
  main.variable(observer("s_width")).define("s_width", function(){return(
900
)});
  main.variable(observer("s_height")).define("s_height", function(){return(
300
)});
  main.variable(observer("model_name")).define("model_name", function(){return(
'Base Case'
)});
  main.variable(observer("model")).define("model", ["models","model_name"], function(models,model_name){return(
models.filter(md=>md.ModelName==model_name)[0]
)});
  main.variable(observer("models")).define("models", ["d3"], async function(d3){return(
await d3.csv("https://gis.westernpower.org/data/input_data/models.csv?" + Math.floor(Math.random() * 1000),d3.autoType)
)});
  main.variable(observer("pefdc")).define("pefdc", ["d3","model"], async function(d3,model){return(
await d3.csv("https://gis.westernpower.org/data/output_data/" + model.OutputPrefix + "_pe_fdc.csv?" + Math.floor(Math.random() * 1000), d3.autoType)
)});
  const child1 = runtime.module(define1);
  main.import("commonStyle", child1);
  const child2 = runtime.module(define1);
  main.import("colr", child2);
  const child3 = runtime.module(define1);
  main.import("font", child3);
  const child4 = runtime.module(define1);
  main.import("margin", child4);
  const child5 = runtime.module(define1);
  main.import("plotTitle", child5);
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const color = d3.scaleOrdinal(d3.schemePastel2);
  return name => color(name.replace(/ .*/, ""));
}
);
  main.variable(observer("format_flow")).define("format_flow", ["d3"], function(d3){return(
function format_flow(flow) {
  return d3.format(',.0f')(flow) + 'm\u00b3/s';
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-sankey@0.12","d3-hsv@0.1")
)});
  main.variable(observer("plt")).define("plt", ["require"], function(require){return(
require("https://cdn.plot.ly/plotly-latest.min.js")
)});
  return main;
}
