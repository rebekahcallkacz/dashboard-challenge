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

    // Generate horizontal bar chart
    // Sort by OTU values and pull out top 10
    // THIS CODE DOES NOT WORK - NEED TO REFORMAT DATA OR MODIFY APPROACH
    var sortedsampleData = filteredsampleData.sort((a, b) => b.sample_values - a.sample_values);
    var topTen = sortedsampleData.slice(0, 10).reverse();
    console.log('all', sortedsampleData)
    console.log('top ten', topTen)

    // Reverse order for Plotly

    // Create trace

    // Create layout

    // Generate plot



    // Generate bubble chart


    // Generate gauge chart

});

function optionChanged(value) {
    console.log(value)
}