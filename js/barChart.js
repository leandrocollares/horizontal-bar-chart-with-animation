const margin = { top: 30, right: 50, bottom: 30, left: 250 },
      width = 960 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom; 
     
const xScale = d3.scaleLinear()
      .range([0, width]);

const yScale = d3.scaleBand()
      .rangeRound([height, 0])
      .padding(0.05);
 
const svg = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

const wrapper = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');  
           
d3.csv('data/population.csv').then(data => {

  data.forEach(d => {
    d.population = +d.population;
  });

  data = data.sort((a, b) => a['population'] - b['population']); 
  
  xScale.domain(d3.extent(data, d => d.population)).nice();
  yScale.domain(data.map(d => d.provinceTerritory));
      
  const bars = wrapper.append('g'),
        unitLabels = wrapper.append('g'),
        populationLabels = wrapper.append('g');

  bars.selectAll('rect')
      .data(data)
    .enter().append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.provinceTerritory))
      .attr('width', 0)
      .attr('height', yScale.bandwidth()) 
      .style('fill', '#b2182b')
      .transition()
      .duration(750)
      .attr('width', d => xScale(d.population))
      
  unitLabels.selectAll('text')
      .data(data)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', xScale(0))
      .attr('y', d => yScale(d.provinceTerritory))
      .attr("dx", "-.32em")
      .attr("dy", "1.4em")
      .attr('text-anchor','end')
      .style('fill', '#333333')
      .text(d => d.provinceTerritory);
   
  populationLabels.selectAll('text')
      .data(data)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr("x", d => xScale(d.population) + 10)
      .attr("y", d => yScale(d.provinceTerritory))
      .attr("dx", "-.32em")
      .attr("dy", "1.4em")
      .attr('text-anchor','start')
      .style('fill', '#333333')
      .text(d => d3.format(",")(d.population))
      .style('opacity', 0)
      .transition()
      .delay(750) 
      .duration(750)
      .style('opacity', 1)
});