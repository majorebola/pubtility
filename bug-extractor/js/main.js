window.onload = function() {
    init();
};

var inputFile;
var fileReader;
var filters;

var init = function() {
    inputFile = document.getElementById('input-file');
    fileReader = new FileReader();

    inputFile.onchange = function() {
        loadFile(this.files);
    };

    fileReader.onload = function() {
        console.log(fileReader.result);
        buildTable(fileReader.result);
    };
};

var loadFile = function(datas) {
    var file = datas[0];
    fileReader.readAsText(file);
};

var buildTable = function(result) {
    console.log("building table . . . ");
    var data = JSON.parse(result);

    var filters = getFilters();

    var filteredData = filterData(data, filters);

    data.issues = filteredData;

    $("<div>", {id: 'template-mustache'}).appendTo('body');
    $('#template-mustache').load("table.html", function() {
        var html = Mustache.to_html($('#table-template').html(), data);
        $('#table-container').html(html);
    });
};

var getFilters = function() {
    var filters = {
        status: $("#status").val(),
        min_id: $("#minimum-id").val(),
        max_id: $("#maximum-id").val()
    };

    return filters;
};

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