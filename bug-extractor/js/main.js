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

    document.getElementById('settings-button').onclick = function() {
        $("#settings").slideToggle();
    };

    fileReader.onload = function() {
        console.log(fileReader.result);
        buildTable(fileReader.result);
    };

    filters = {
        status: 'resolved',
        min_id: 10,
        max_id: 25
    }
};

var loadFile = function(datas) {
    var file = datas[0];
    fileReader.readAsText(file);
};

var buildTable = function(result) {
    console.log("building table . . . ");
    var data = JSON.parse(result);

    var filteredData = filterData(data, filters);

    data.issues = filteredData;

    $("<div>", {id: 'template-mustache'}).appendTo('body');
    $('#template-mustache').load("table.html", function() {
        var html = Mustache.to_html($('#table-template').html(), data);
        $('#table-container').html(html);
    });
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
    return issue.status == filters.status;
};