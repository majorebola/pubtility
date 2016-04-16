window.onload = function() {
    init();
};
var inputFile;
var fileReader;

var init = function() {
    inputFile = document.getElementById('input-file');
    fileReader = new FileReader();

    $('#generate').click(function() {
        loadFile(inputFile.files);
    });

    fileReader.onload = function() {
        console.log(fileReader.result);
        buildTable(fileReader.result);
    };
};

var loadFile = function(datas) {
    var file = datas[0];
    if (file) {
        fileReader.readAsText(file);
    } else {
        alert("load a file. A .JSON file");
    }
};


/**
 * Main BuildTable
 * @param result
 */
var buildTable = function(result) {
    console.log("building table . . . ");
    var data = JSON.parse(result);      // imported data from file

    // getting filters from gui
    var filters = getFilters();

    // filtering
    var filteredData = filterData(data, filters);

    // overwriting issues with filtered issues
    data.issues = filteredData;

    // adding output settings to the main object
    data.outputSetting = getOutputSettings();

    // generating the template
    $("<div>", {id: 'template-mustache'}).appendTo('body');
    $('#template-mustache').load("table.html", function() {
        var html = Mustache.to_html($('#table-template').html(), data);
        $('#table-container').html(html);
    });
};


var getOutputSettings = function() {
    var outputSettings = {};
    $("[type=checkbox]:checked").each(function(counter, item) {
        outputSettings[item.id] = true;
    });
    var type = $('#output-type').val();
    if(type == "list") {
        outputSettings.showList = true;
    } else if (type == "table") {
        outputSettings.showTable = true;
    }
    return outputSettings;
};


// get filters from gui
var getFilters = function() {
    var filters = {
        status: $("#query-status").val(),
        min_id: $("#minimum-id").val(),
        max_id: $("#maximum-id").val()
    };
    return filters;
};


// apply filters
var filterData = function(data, filters) {
    var issues = data.issues;
    var filtered = [];
    for (var i = 0; i < issues.length; i++) {
        var issue = issues[i];
        if (checkFilter(issue, filters)) {
            filtered.push(issue);
        }
    }
    return filtered;
};

var checkFilter = function(issue, filters) {
    return checkId(issue, filters) && checkStatus(issue, filters);
};
var checkId = function(issue, filters) {
    return checkMinId(issue, filters) && checkMaxId(issue, filters);
};
var checkMinId = function(issue, filters) {
    return filters.min_id == 0 || issue.id > filters.min_id;
};
var checkMaxId = function(issue, filters) {
    return filters.max_id == 0 || issue.id < filters.max_id;
};
var checkStatus = function(issue, filters) {
    return issue.status == filters.status;
};