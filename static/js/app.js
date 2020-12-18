// Functions

// This functions generates an html table using the metadata of the selected sample
function generateTable(metadata) {
    // Select table in HTML
    let tableHTML = d3.select('tbody');

    // Clear previous table 
    tableHTML.html('');

    // Generate metadata table (capitalize first letter of each word in table)
    Object.entries(metadata[0]).forEach(([key, value]) => {
        let htmlRow = tableHTML.append('tr');
        let cell1 = htmlRow.append('td');
        let words = key.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substring(1);
            }
        key = words.join(' ');
        cell1.text(key);
        let cell2 = htmlRow.append('td');
        cell2.text(value);
        }); 

};

// This function creates a bar chart of the top ten OTU's of the selected sample
function barChart(input, data) {
        // Sort data by sample values
        let sortedData = data.sort((a, b) => b.sample_values - a.sample_values);
        // Generate horizontal bar chart of top ten OTU's
        // Create trace of only top ten OTU's
        let topTrace = {
            y: sortedData[0].otu_ids.slice(0, 10).reverse().map(otu => `OTU ${otu}`),
            x: sortedData[0].sample_values.slice(0, 10).reverse(),
            text: sortedData[0].otu_labels.slice(0, 10).reverse(),
            type: 'bar', 
            orientation: 'h'
        };

        // Create layout
        let topLayout = {
            title: `Top Ten OTU's in Sample ${input}`,
            xaxis: { title: "Number of Samples Found"}
        };

        // Generate plot
        Plotly.newPlot('bar', [topTrace], topLayout);
};

// This function creates a bubble chart of all OTU's found in the selected sample
function bubbleChart(input, data) {
    // Create trace
    let bubbleTrace = {
        y: data[0].sample_values,
        x: data[0].otu_ids,
        text: data[0].otu_labels,
        mode: 'markers',
        marker: {
            color: data[0].otu_ids,
            size: data[0].sample_values, 
            colorscale: 'Earth'
        }
    };
    // Create layout
    let layout = {
        title: `All OTUs in Sample ${input}`,
        showlegend: false,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Number of Samples Found' }
    };
    // Generate plot
    Plotly.newPlot('bubble', [bubbleTrace], layout);

}

// This function creates a gauge that indicates the wash frequency of the selected sample
function gaugeChart(metadata) {
    let gaugeTrace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metadata[0].wfreq,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9] },
          bar: {color: '#1eb6a7'},
          steps: [
            { range: [0, 1], color: '#FF0080' },
            { range: [1, 2], color: '#E71C8A' },
            { range: [2, 3], color: '#CF3894' },
            { range: [3, 4], color: '#B7549E' },
            { range: [4, 5], color: '#9F70A8' },
            { range: [5, 6], color: '#878CB2' },
            { range: [6, 7], color: '#6FA8BC' },
            { range: [7, 8], color: '#57C4C6' },
            { range: [8, 9], color: '#40E0D0' },
          ]
        }
      };

    let gaugeLayout = {height: 500, width: 600};

    Plotly.newPlot('gauge', [gaugeTrace], gaugeLayout);
}

// Initialize the dashboard and update as the user selects different samples
// Import in the JSON sample data
d3.json("static/data/samples.json").then((data) => {
    const sampleNames = data.names;
    const metadata = data.metadata;
    const sampleData = data.samples;
    
    // Use sample names to generate dropdown menu
    // Select dropdown menu
    var dropdownOptions = d3.select('#selDataset');

    // Populate dropdown menu with all samples from dataset
    sampleNames.forEach(name => {
        dropdownOptions.append('option').text(`${name}`).property('value', `${name}`);
    });

    // Filter data based on input value
    var inputValue = d3.select('#selDataset').property('value');
    var filteredMetadata = metadata.filter(individual => individual.id === parseInt(inputValue));
    var filteredsampleData = sampleData.filter(individual => individual.id === inputValue);

    // Generate table using metadata
    generateTable(filteredMetadata);

    // Generate horizontal bar chart of top ten OTU's
    barChart(inputValue, filteredsampleData);

    // Generate bubble chart
    bubbleChart(inputValue, filteredsampleData);

    // Generate gauge chart
    gaugeChart(filteredMetadata);
    
    // Create event listener
    dropdownOptions.on('change', updateData);

    // This function updates the data based on the user's selection
    function updateData() {

        // Filter data based on input value
        let newinputValue = d3.select('#selDataset').property('value');
        let newfilteredMetadata = metadata.filter(individual => individual.id === parseInt(newinputValue));
        let newfilteredsampleData = sampleData.filter(individual => individual.id === newinputValue);

        // Generate table using metadata
        generateTable(newfilteredMetadata);

        // Generate new bar chart
        barChart(newinputValue, newfilteredsampleData);

        // Generate new bubble chart
        bubbleChart(newinputValue, newfilteredsampleData);

        // Restyle gauge chart
        Plotly.restyle('gauge', 'value', newfilteredMetadata[0].wfreq);

    }

});