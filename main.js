
//legend data and color scale
const legendData = [{ "category": "Critically Endangered", "color": "#b30000" }, { "category": "Endangered", "color": "#e34a33" }, { "category": "Vulnerable", "color": "#fc8d59" }, { "category": "Near Threatened", "color": "#fdbb84" }, { "category": "Least Concern", "color": "#fdd49e" }, { "category": "Data Deficient", "color": "#d9d9d9" }];
const categories = legendData.map(d => d.category)
const colors = legendData.map(d => d.color)
const colorScale = d3.scaleOrdinal().domain(categories).range(colors);

// sort data based on the categories array so the order would go from most to least threatened
data = data.sort((a,b) => categories.indexOf(a.redlistCategory) - categories.indexOf(b.redlistCategory));

//convert data to hierarchical format
const groupingFn = [d => d.redlistCategory]; //can group by multiple attributes here 
const rollupData = d3.rollup(data, v => v.length, ...groupingFn);
const childrenAccessorFn = ([key, value]) => value.size && Array.from(value);
const hierarchyData = d3.hierarchy(rollupData, childrenAccessorFn)
    .sum(([key, value]) => value);

// all variables related to dimensions
const length = 750;

// Layout + data prep
const treemap = d3.treemap()
    .paddingInner(2)
    .paddingOuter(1)
    .paddingTop(1)
    .round(true)
    .size([length, length])
    .tile(d3.treemapResquarify.ratio(2));

const leaves = treemap(hierarchyData).leaves().sort( (a, b) => b.data[0] - a.data[0]);

//create SVG
const svg = d3.select("#chart").append("svg").attr("width", length).attr("height", length);

//draw rects
svg.selectAll("rect")
    .data(leaves)
    .join("rect")
    .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 1)
    .attr("fill", d => colorScale(d.data[0]));

svg.selectAll("text")
    .data(leaves)
    .join("text")
    .attr("x", d => d.x0 + 3)
    .attr("y", d => d.y0 + 15)
    .text(d => `${d.data[0]}: ${d.value}`)
