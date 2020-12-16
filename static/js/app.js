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

    // WRAP ALL OF THIS BELOW IN A FUNCTION LATER
    // Filter data based on input value
    var inputValue = d3.select('#selDataset').property('value');
    var filteredMetadata = metadata.filter(individual => individual.id === parseInt(inputValue));
    var filteredsampleData = sampleData.filter(individual => individual.id === inputValue);

    // Generate metadata table
    Object.entries(filteredMetadata[0]).forEach(([key, value]) => {
        let htmlRow = d3.select('tbody').append('tr');
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

    // Reformat data of interest for use in plotting
    var otuData = [];
    var otuIds = filteredsampleData[0].otu_ids;
    var otuLabels = filteredsampleData[0].otu_labels;
    var sampleValues = filteredsampleData[0].sample_values;

    for (let i = 0; i < otuIds.length; i++) {
        var otuDatapoint = {};
        otuDatapoint['id'] = otuIds[i];
        otuDatapoint['label'] = otuLabels[i];
        otuDatapoint['value'] = sampleValues[i];
        otuData.push(otuDatapoint);
    }

    // Sort data, pull out top ten results and reverse order
    var sortedotuData = otuData.sort((a, b) => b.value - a.value);
    var topTen = sortedotuData.slice(0, 10).reverse();

    // Generate horizontal bar chart of top ten OTU's
    // Create trace
    var topTrace = {
        y: topTen.map(otu => `OTU ${otu.id}`),
        x: topTen.map(otu => otu.value),
        text: topTen.map(otu => otu.label),
        type: 'bar', 
        orientation: 'h'
    };

    // Create layout
    var topLayout = {
        title: `Top Ten OTU's in Sample ${inputValue}`,
        xaxis: { title: "Number of Samples Found"}
    };

    // Generate plot
    Plotly.newPlot('bar', [topTrace], topLayout);

    // Generate bubble chart
    // Create trace
    var bubbleTrace = {
        y: otuData.map(otu => otu.value),
        x: otuData.map(otu => otu.id),
        text: otuData.map(otu => otu.label),
        mode: 'markers',
        marker: {
            color: otuData.map(otu => otu.id),
            size: otuData.map(otu => otu.value)
        }
    };
    // Create layout
    var layout = {
        title: `All OTUs in Sample ${inputValue}`,
        showlegend: false,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Number of Samples Found' }
    };
    // Generate plot
    Plotly.newPlot('bubble', [bubbleTrace], layout);

    // Generate gauge chart

});

function optionChanged(value) {
    console.log(value)
}