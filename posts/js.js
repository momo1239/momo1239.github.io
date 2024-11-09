var plotChart = null;

function version(success, failure) {
    $.ajax({
        url: "ThermCalc/version",
        success: function (data) {
            alert(data)
        },
        error: function (x, s, e) {
            alert(e.toString());
        },
    });
}

function prodComp() {
    $('#productComparison').modal('show');
}

function propertyTemperatureTable() {
    $('#propertyTemperatureTable').modal('show');
}

function propertyTemperaturePlot() {
    $('#propertyTemperaturePlot').modal('show');
}

function viewFluidChart() {
    $('#viewFluidChart').modal('show');
}

function selectTubePipe() {
    $('#selectTubePipeModal').modal('show');
}

function selectUnits() {
    $('#PropPlot').prop('selectedIndex', 0);

    $('#unitsModal').modal('show');
}

function setUnitsSI() {   
    
    $('#TempUnit').html(getUnits(1));
    $('#DensUnit').html(getUnits(3));
    $('#HeatCapUnit').html(getUnits(8));
    $('#ThermCondUnit').html(getUnits(11));
    $('#ViscUnit').html(getUnits(14));
    $('#VapPUnit').html(getUnits(20));
    $('#PranUnit').html();
    $('#VelUnit').html(getUnits(28));
    $('#DiamUnit').html(getUnits(26));
    $('#RoughUnit').html(getUnits(26));
    $('#FlowUnit').html(getUnits(36));
    $('#ReyUnit').html("");
    $('#VolHeatUnit').html(getUnits(42));
    $('#PressDUnit').html(getUnits(30));
    $('#HeatTCUnit').html(getUnits(37));

    $('#TableTempUnit').html(getUnits(1));
    $('#TableDensUnit').html(getUnits(3));
    $('#TableHeatCUnit').html(getUnits(8));
    $('#TableThermCUnit').html(getUnits(11));
    $('#TableViscUnit').html(getUnits(14));
    var getCheckedTable = $('input[name=phaseGroupTable]:checked').val();
    if (getCheckedTable == 'Liquid') {
        $('#TableVapPUnit').html(getUnits(20));
    }
    else
    {
        $('#TableVapPUnit').html(getUnits(39));
    }

    var getCheckedPlot = $('input[name=phaseGroupPlot]:checked').val();
    $('#PropUnitTemp').val(getUnits(1));
    $('#PropUnitDens').val(getUnits(3));
    $('#PropUnitHeatC').val(getUnits(8));
    $('#PropUnitThermC').val(getUnits(11));
    $('#PropUnitVisc').val(getUnits(14));
    $('#PropUnitVapP').val(getUnits(20));
    $('#PropUnitHeatVap').val(getUnits(39));


    $('#PropUnit').html('(SI Units)');


    updateTable();
    clearPipes();
    updateFluidTemps();
    $('#unitsModal').modal('hide');
}
function setUnitsEnglish() {    
    
    $('#TempUnit').html(getUnits(2));
    $('#DensUnit').html(getUnits(5));
    $('#HeatCapUnit').html(getUnits(9));
    $('#ThermCondUnit').html(getUnits(12));
    $('#ViscUnit').html(getUnits(17));
    $('#VapPUnit').html(getUnits(21));
    $('#PranUnit').html("");
    $('#VelUnit').html(getUnits(29));
    $('#DiamUnit').html(getUnits(27));
    $('#RoughUnit').html(getUnits(27));
    $('#FlowUnit').html(getUnits(35));
    $('#ReyUnit').html("");
    $('#VolHeatUnit').html(getUnits(43));
    $('#PressDUnit').html(getUnits(31));
    $('#HeatTCUnit').html(getUnits(38));

    var getCheckedTable = $('input[name=phaseGroupTable]:checked').val();
    $('#TableTempUnit').html(getUnits(2));
    $('#TableDensUnit').html(getUnits(5));
    $('#TableHeatCUnit').html(getUnits(9));
    $('#TableThermCUnit').html(getUnits(12));
    $('#TableViscUnit').html(getUnits(17));
    if (getCheckedTable == 'Liquid') {
        $('#TableVapPUnit').html(getUnits(21));
    }
    else {
        $('#TableVapPUnit').html(getUnits(40));
    }

    var getCheckedPlot = $('input[name=phaseGroupPlot]:checked').val();
    $('#PropUnitTemp').val(getUnits(2));
    $('#PropUnitDens').val(getUnits(5));
    $('#PropUnitHeatC').val(getUnits(9));
    $('#PropUnitThermC').val(getUnits(12));
    $('#PropUnitVisc').val(getUnits(17));
    $('#PropUnitVapP').val(getUnits(21));
    $('#PropUnitHeatVap').val(getUnits(40));
    $('#PropUnit').html('(English Units)');
    updateTable();
    updateFluidTemps();
    clearPipes();
    $('#unitsModal').modal('hide');
}

function unitConverter() {
    $('#unitConverterModal').modal('show');
}

function customUnits() {
    //Populate units
    //Temperature

    if ($('#CustomTemp option').length == 1) {
        $('#CustomTemp').append($('<option>' + getUnits(1) + '</option>').val(1).html(getUnits(1)));
        $('#CustomTemp').append($('<option>' + getUnits(2) + '</option>').val(2).html(getUnits(2)));
        //Density
        $('#CustomDens').append($('<option>' + getUnits(6) + '</option>').val(6).html(getUnits(6)));
        $('#CustomDens').append($('<option>' + getUnits(3) + '</option>').val(3).html(getUnits(3)));
        $('#CustomDens').append($('<option>' + getUnits(5) + '</option>').val(5).html(getUnits(5)));
        $('#CustomDens').append($('<option>' + getUnits(4) + '</option>').val(4).html(getUnits(4)));
        $('#CustomDens').append($('<option>' + getUnits(7) + '</option>').val(7).html(getUnits(7)));
        //Heat Capacity
        $('#CustomHeatC').append($('<option>' + getUnits(9) + '</option>').val(9).html(getUnits(9)));
        $('#CustomHeatC').append($('<option>' + getUnits(10) + '</option>').val(10).html(getUnits(10)));
        $('#CustomHeatC').append($('<option>' + getUnits(8) + '</option>').val(8).html(getUnits(8)));
        //Thermal Conductivity
        $('#CustomThermC').append($('<option>' + getUnits(12) + '</option>').val(12).html(getUnits(12)));
        $('#CustomThermC').append($('<option>' + getUnits(13) + '</option>').val(13).html(getUnits(13)));
        $('#CustomThermC').append($('<option>' + getUnits(11) + '</option>').val(11).html(getUnits(11)));
        //Viscosity
        $('#CustomVisc').append($('<option>' + getUnits(14) + '</option>').val(14).html(getUnits(14)));
        $('#CustomVisc').append($('<option>' + getUnits(15) + '</option>').val(15).html(getUnits(15)));
        $('#CustomVisc').append($('<option>' + getUnits(16) + '</option>').val(16).html(getUnits(16)));
        $('#CustomVisc').append($('<option>' + getUnits(17) + '</option>').val(17).html(getUnits(17)));
        $('#CustomVisc').append($('<option>' + getUnits(18) + '</option>').val(18).html(getUnits(18)));
        $('#CustomVisc').append($('<option>' + getUnits(19) + '</option>').val(19).html(getUnits(19)));
        //Vapor Pressure
        $('#CustomVapP').append($('<option>' + getUnits(25) + '</option>').val(25).html(getUnits(25)));
        $('#CustomVapP').append($('<option>' + getUnits(24) + '</option>').val(24).html(getUnits(24)));
        $('#CustomVapP').append($('<option>' + getUnits(23) + '</option>').val(23).html(getUnits(23)));
        $('#CustomVapP').append($('<option>' + getUnits(20) + '</option>').val(20).html(getUnits(20)));
        $('#CustomVapP').append($('<option>' + getUnits(22) + '</option>').val(22).html(getUnits(22)));
        $('#CustomVapP').append($('<option>' + getUnits(21) + '</option>').val(21).html(getUnits(21)));
        //Length
        $('#CustomLen').append($('<option>' + getUnits(27) + '</option>').val(27).html(getUnits(27)));
        $('#CustomLen').append($('<option>' + getUnits(26) + '</option>').val(26).html(getUnits(26)));
        //Velocity
        $('#CustomVelo').append($('<option>' + getUnits(29) + '</option>').val(29).html(getUnits(29)));
        $('#CustomVelo').append($('<option>' + getUnits(28) + '</option>').val(28).html(getUnits(28)));
        //Pressure Drop
        $('#CustomPressD').append($('<option>' + getUnits(32) + '</option>').val(32).html(getUnits(32)));
        $('#CustomPressD').append($('<option>' + getUnits(30) + '</option>').val(30).html(getUnits(30)));
        $('#CustomPressD').append($('<option>' + getUnits(31) + '</option>').val(31).html(getUnits(31)));
        //Flow Rate
        $('#CustomFlowR').append($('<option>' + getUnits(35) + '</option>').val(35).html(getUnits(35)));
        $('#CustomFlowR').append($('<option>' + getUnits(34) + '</option>').val(34).html(getUnits(34)));
        $('#CustomFlowR').append($('<option>' + getUnits(33) + '</option>').val(33).html(getUnits(33)));
        $('#CustomFlowR').append($('<option>' + getUnits(36) + '</option>').val(36).html(getUnits(36)));
        //Heat Transfer Coefficient
        $('#CustomHeatTC').append($('<option>' + getUnits(38) + '</option>').val(38).html(getUnits(38)));
        $('#CustomHeatTC').append($('<option>' + getUnits(37) + '</option>').val(37).html(getUnits(37)));
        //Heat of Vaporization
        $('#CustomHeatV').append($('<option>' + getUnits(40) + '</option>').val(40).html(getUnits(40)));
        $('#CustomHeatV').append($('<option>' + getUnits(41) + '</option>').val(41).html(getUnits(41)));
        $('#CustomHeatV').append($('<option>' + getUnits(39) + '</option>').val(39).html(getUnits(39)));
        //Volumetric Heat Capacity
        $('#CustomVolHC').append($('<option>' + getUnits(43) + '</option>').val(43).html(getUnits(43)));
        $('#CustomVolHC').append($('<option>' + getUnits(44) + '</option>').val(44).html(getUnits(44)));
        $('#CustomVolHC').append($('<option>' + getUnits(42) + '</option>').val(42).html(getUnits(42)));
    }
    $('#customUnitsModal').modal('show');
}

function populateClose() {
    //populate main table units
    if ($('#CustomTemp option:selected').text() != "") {
        $('#TempUnit').html($('#CustomTemp option:selected').text());
    }
    if ($('#CustomDens option:selected').text() != "") {
        $('#DensUnit').html($('#CustomDens option:selected').text());
    }
    if ($('#CustomHeatC option:selected').text() != "") {
        $('#HeatCapUnit').html($('#CustomHeatC option:selected').text());
    }
    if ($('#CustomThermC option:selected').text() != "") {
        $('#ThermCondUnit').html($('#CustomThermC option:selected').text());
    }
    if ($('#CustomVisc option:selected').text() != "") {
        $('#ViscUnit').html($('#CustomVisc option:selected').text());
    }
    if ($('#CustomVapP option:selected').text() != "") {
        $('#VapPUnit').html($('#CustomVapP option:selected').text());
    }
    $('#PranUnit').html("");

    if ($('#CustomVelo option:selected').text() != "") {
        $('#VelUnit').html($('#CustomVelo option:selected').text());
    }

    if ($('#CustomLen option:selected').text() != "") {
        $('#DiamUnit').html($('#CustomLen option:selected').text());
    }
    if ($('#CustomLen option:selected').text() != "") {
        $('#RoughUnit').html($('#CustomLen option:selected').text());
    }

    if ($('#CustomFlowR option:selected').text() != "") {
        $('#FlowUnit').html($('#CustomFlowR option:selected').text());
    }
        $('#ReyUnit').html("");
        if ($('#CustomVolHC option:selected').text() != "") {
        $('#VolHeatUnit').html($('#CustomVolHC option:selected').text());
    }
        if ($('#CustomPressD option:selected').text() != "") {
        $('#PressDUnit').html($('#CustomPressD option:selected').text());
    }
        if ($('#CustomHeatTC option:selected').text() != "") {
        $('#HeatTCUnit').html($('#CustomHeatTC option:selected').text());
    }

        if ($('#CustomTemp option:selected').text() != "") {
        $('#TableTempUnit').html($('#CustomTemp option:selected').text());
    }
        if ($('#CustomDens option:selected').text() != "") {
        $('#TableDensUnit').html($('#CustomDens option:selected').text());
    }
        if ($('#CustomHeatC option:selected').text() != "") {
        $('#TableHeatCUnit').html($('#CustomHeatC option:selected').text());
    }
        if ($('#CustomThermC option:selected').text() != "") {
        $('#TableThermCUnit').html($('#CustomThermC option:selected').text());
    }
        if ($('#CustomVisc option:selected').text() != "") {
        $('#TableViscUnit').html($('#CustomVisc option:selected').text());
    }
        if ($('#CustomVapP option:selected').text() != "") {
        $('#TableVapPUnit').html($('#CustomVapP option:selected').text());
    }

        if ($('#CustomTemp option:selected').text() != "") {
        $('#PropUnitTemp').val($('#CustomTemp option:selected').text());
    }
        if ($('#CustomDens option:selected').text() != "") {
        $('#PropUnitDens').val($('#CustomDens option:selected').text());
    }
        if ($('#CustomHeatC option:selected').text() != "") {
        $('#PropUnitHeatC').val($('#CustomHeatC option:selected').text());
    }
        if ($('#CustomThermC option:selected').text() != "") {
        $('#PropUnitThermC').val($('#CustomThermC option:selected').text());
    }
        if ($('#CustomVisc option:selected').text() != "") {
        $('#PropUnitVisc').val($('#CustomVisc option:selected').text());
    }
        if ($('#CustomVapP option:selected').text() != "") {
        $('#PropUnitVapP').val($('#CustomVapP option:selected').text());
        }

        if ($('#CustomHeatV option:selected').text() != "") {
            $('#PropUnitHeatVap').val($('#CustomHeatV option:selected').text());
        }

        var getChecked = $('input[name=phaseGroupTable]:checked').val();
        if (getChecked == 'Vapor') {
            $('#TableVapPUnit').html($('#CustomHeatV option:selected').text());
        }


    $('#PropUnit').html('(Custom Units)');

    updateFluidTemps();
    clearPipes();
    $('#customUnitsModal').modal('hide');
    $('#unitsModal').modal('hide');
    updateTable();
}

function populatePipes() {
    var Diameter = "";
    var Roughness = "";
    var pipe = $('input[name=pipeGroup]:checked').val();

    switch (pipe) {
        case '1': Diameter = 5.4; Roughness = 0.00152; break;
        case '2': Diameter = 9.2; Roughness = 0.0457; break;
        case '3': Diameter = 17.3; Roughness = 0.0457; break;
        case '4': Diameter = 9.4; Roughness = 0.00152; break;
        case '5': Diameter = 15.8; Roughness = 0.0457; break;
        case '6': Diameter = 28.5; Roughness = 0.0457; break;
        case '7': Diameter = 10.2; Roughness = 0.00152; break;
        case '8': Diameter = 26.6; Roughness = 0.0457; break;
        case '9': Diameter = 43.1; Roughness = 0.0457; break;
        case '10': Diameter = 14.8; Roughness = 0.00152; break;
        case '11': Diameter = 52.5; Roughness = 0.0457; break;
        case '12': Diameter = 54.5; Roughness = 0.0457; break;
        case '13': Diameter = 15.8; Roughness = 0.00152; break;
        case '14': Diameter = 77.9; Roughness = 0.0457; break;
        case '15': Diameter = 82.5; Roughness = 0.0457; break;
        case '16': Diameter = 21.2; Roughness = 0.00152; break;
        case '17': Diameter = 102.3; Roughness = 0.0457; break;
        case '18': Diameter = 107.1; Roughness = 0.0457; break;
        case '19': Diameter = 22.1; Roughness = 0.00152; break;
        case '20': Diameter = 154.1; Roughness = 0.0457; break;
        case '21': Diameter = 159.3; Roughness = 0.0457; break;
        case '22': Diameter = 27.5; Roughness = 0.00152; break;
        case '23': Diameter = 202.7; Roughness = 0.0457; break;
        case '24': Diameter = 207.3; Roughness = 0.0457; break;
        case '25': Diameter = 254.5; Roughness = 0.0457; break;
        case '26': Diameter = 260.4; Roughness = 0.0457; break;
        case '27': Diameter = 309.7; Roughness = 0.0457; break;
        case '28': Diameter = 303.2; Roughness = 0.0457; break;
        case '29': Diameter = 381; Roughness = 0.0457; break;
        case '30': Diameter = 388.8; Roughness = 0.0457; break;
        case '31': Diameter = 489; Roughness = 0.0457; break;
        case '32': Diameter = 486; Roughness = 0.0457; break;
    }

    var diamUnit = getUnitNum($("#DiamUnit").html());
    if (diamUnit == 27)
    {
        Diameter = ConvertFromSI("Length", 27, Diameter, 0);

        Diameter = parseFloat(Diameter).toPrecision(3).toString();
    }
    var roughUnit = getUnitNum($("#RoughUnit").html());
    if (roughUnit == 27) {
        Roughness = ConvertFromSI("Length", 27, Roughness, 0);

        Roughness = parseFloat(Roughness).toPrecision(3).toString();
    }

    if ($("#Apply1").is(':checked')) {
        $("#Diam1").val(Diameter.toString());
        $("#Rough1").val(Roughness.toString());
    }
    if ($("#Apply2").is(':checked')) {
        $("#Diam2").val(Diameter.toString());
        $("#Rough2").val(Roughness.toString());
    }
    if ($("#Apply3").is(':checked')) {
        $("#Diam3").val(Diameter.toString());
        $("#Rough3").val(Roughness.toString());
    }
    if ($("#Apply4").is(':checked')) {
        $("#Diam4").val(Diameter.toString());
        $("#Rough4").val(Roughness.toString());
    }
    if ($("#Apply5").is(':checked')) {
        $("#Diam5").val(Diameter.toString());
        $("#Rough5").val(Roughness.toString());
    }
    if ($("#Apply6").is(':checked')) {
        $("#Diam6").val(Diameter.toString());
        $("#Rough6").val(Roughness.toString());
    }

    $('#selectTubePipeModal').modal('hide');

}

function copyFirst1() {
    var temp = $('#Temp1').val();
    $('#Temp2').val(temp);
    $('#Temp3').val(temp);
    $('#Temp4').val(temp);
    $('#Temp5').val(temp);
    $('#Temp6').val(temp);
}

function changeUnits() {
    var velo = $('#UnitConvProp').val();
    $('#UnitOrig').empty();
    $('#UnitConverted').empty();
    $('#Property2').val("");
    switch (velo) {
        case "Temperature":
            $('#UnitOrig').append($('<option>' + getUnits(1) + '</option>').val(1).html(getUnits(1)));
            $('#UnitOrig').append($('<option>' + getUnits(2) + '</option>').val(2).html(getUnits(2)));
            $("#UnitOrig").val(1);
            $('#UnitConverted').append($('<option>' + getUnits(1) + '</option>').val(1).html(getUnits(1)));
            $('#UnitConverted').append($('<option>' + getUnits(2) + '</option>').val(2).html(getUnits(2)));
            $("#UnitConverted").val(2);
        break;
        case "Density":
            $('#UnitOrig').append($('<option>' + getUnits(6) + '</option>').val(6).html(getUnits(6)));
            $('#UnitOrig').append($('<option>' + getUnits(3) + '</option>').val(3).html(getUnits(3)));
            $('#UnitOrig').append($('<option>' + getUnits(5) + '</option>').val(5).html(getUnits(5)));
            $('#UnitOrig').append($('<option>' + getUnits(4) + '</option>').val(4).html(getUnits(4)));
            $('#UnitOrig').append($('<option>' + getUnits(7) + '</option>').val(7).html(getUnits(7)));
            $("#UnitOrig").val(6);

            $('#UnitConverted').append($('<option>' + getUnits(6) + '</option>').val(6).html(getUnits(6)));
            $('#UnitConverted').append($('<option>' + getUnits(3) + '</option>').val(3).html(getUnits(3)));
            $('#UnitConverted').append($('<option>' + getUnits(5) + '</option>').val(5).html(getUnits(5)));
            $('#UnitConverted').append($('<option>' + getUnits(4) + '</option>').val(4).html(getUnits(4)));
            $('#UnitConverted').append($('<option>' + getUnits(7) + '</option>').val(7).html(getUnits(7)));
            $("#UnitConverted").val(3);
        break;
        case "Heat Capacity":
            $('#UnitOrig').append($('<option>' + getUnits(9) + '</option>').val(9).html(getUnits(9)));
            $('#UnitOrig').append($('<option>' + getUnits(10) + '</option>').val(10).html(getUnits(10)));
            $('#UnitOrig').append($('<option>' + getUnits(8) + '</option>').val(8).html(getUnits(8)));
            $("#UnitOrig").val(9);

            $('#UnitConverted').append($('<option>' + getUnits(9) + '</option>').val(9).html(getUnits(9)));
            $('#UnitConverted').append($('<option>' + getUnits(10) + '</option>').val(10).html(getUnits(10)));
            $('#UnitConverted').append($('<option>' + getUnits(8) + '</option>').val(8).html(getUnits(8)));
            $("#UnitConverted").val(10);
            break;
        case "Thermal Conductivity":
            $('#UnitOrig').append($('<option>' + getUnits(12) + '</option>').val(12).html(getUnits(12)));
            $('#UnitOrig').append($('<option>' + getUnits(13) + '</option>').val(13).html(getUnits(13)));
            $('#UnitOrig').append($('<option>' + getUnits(11) + '</option>').val(11).html(getUnits(11)));
            $("#UnitOrig").val(12);

            $('#UnitConverted').append($('<option>' + getUnits(12) + '</option>').val(12).html(getUnits(12)));
            $('#UnitConverted').append($('<option>' + getUnits(13) + '</option>').val(13).html(getUnits(13)));
            $('#UnitConverted').append($('<option>' + getUnits(11) + '</option>').val(11).html(getUnits(11)));
            $("#UnitConverted").val(13);
            break;
        case "Dynamic Viscosity":
            $('#UnitOrig').append($('<option>' + getUnits(14) + '</option>').val(14).html(getUnits(14)));
            $('#UnitOrig').append($('<option>' + getUnits(15) + '</option>').val(15).html(getUnits(15)));
            $('#UnitOrig').append($('<option>' + getUnits(16) + '</option>').val(16).html(getUnits(16)));
            $("#UnitOrig").val(14);

            $('#UnitConverted').append($('<option>' + getUnits(14) + '</option>').val(14).html(getUnits(14)));
            $('#UnitConverted').append($('<option>' + getUnits(15) + '</option>').val(15).html(getUnits(15)));
            $('#UnitConverted').append($('<option>' + getUnits(16) + '</option>').val(16).html(getUnits(16)));
            $("#UnitConverted").val(15);
            break;
        case "Kinematic Viscosity":
            $('#UnitOrig').append($('<option>' + getUnits(17) + '</option>').val(17).html(getUnits(17)));
            $('#UnitOrig').append($('<option>' + getUnits(18) + '</option>').val(18).html(getUnits(18)));
            $('#UnitOrig').append($('<option>' + getUnits(19) + '</option>').val(19).html(getUnits(19)));
            $("#UnitOrig").val(17);

            $('#UnitConverted').append($('<option>' + getUnits(17) + '</option>').val(17).html(getUnits(17)));
            $('#UnitConverted').append($('<option>' + getUnits(18) + '</option>').val(18).html(getUnits(18)));
            $('#UnitConverted').append($('<option>' + getUnits(19) + '</option>').val(19).html(getUnits(19)));
            $("#UnitConverted").val(18);
            break;
        case "Vapor Pressure":
            $('#UnitOrig').append($('<option>' + getUnits(25) + '</option>').val(25).html(getUnits(25)));
            $('#UnitOrig').append($('<option>' + getUnits(24) + '</option>').val(24).html(getUnits(24)));
            $('#UnitOrig').append($('<option>' + getUnits(23) + '</option>').val(23).html(getUnits(23)));
            $('#UnitOrig').append($('<option>' + getUnits(20) + '</option>').val(20).html(getUnits(20)));
            $('#UnitOrig').append($('<option>' + getUnits(22) + '</option>').val(22).html(getUnits(22)));
            $('#UnitOrig').append($('<option>' + getUnits(21) + '</option>').val(21).html(getUnits(21)));
            $("#UnitOrig").val(25);

            $('#UnitConverted').append($('<option>' + getUnits(25) + '</option>').val(25).html(getUnits(25)));
            $('#UnitConverted').append($('<option>' + getUnits(24) + '</option>').val(24).html(getUnits(24)));
            $('#UnitConverted').append($('<option>' + getUnits(23) + '</option>').val(23).html(getUnits(23)));
            $('#UnitConverted').append($('<option>' + getUnits(20) + '</option>').val(20).html(getUnits(20)));
            $('#UnitConverted').append($('<option>' + getUnits(22) + '</option>').val(22).html(getUnits(22)));
            $('#UnitConverted').append($('<option>' + getUnits(21) + '</option>').val(21).html(getUnits(21)));
            $("#UnitConverted").val(24);
            break;
        case "Length":
            $('#UnitOrig').append($('<option>' + getUnits(27) + '</option>').val(27).html(getUnits(27)));
            $('#UnitOrig').append($('<option>' + getUnits(26) + '</option>').val(26).html(getUnits(26)));
            $("#UnitOrig").val(27);

            $('#UnitConverted').append($('<option>' + getUnits(27) + '</option>').val(27).html(getUnits(27)));
            $('#UnitConverted').append($('<option>' + getUnits(26) + '</option>').val(26).html(getUnits(26)));
            $("#UnitConverted").val(26);
            break;
        case "Velocity":
            $('#UnitOrig').append($('<option>' + getUnits(29) + '</option>').val(29).html(getUnits(29)));
            $('#UnitOrig').append($('<option>' + getUnits(28) + '</option>').val(28).html(getUnits(28)));
            $("#UnitOrig").val(29);

            $('#UnitConverted').append($('<option>' + getUnits(29) + '</option>').val(29).html(getUnits(29)));
            $('#UnitConverted').append($('<option>' + getUnits(28) + '</option>').val(28).html(getUnits(28)));
            $("#UnitConverted").val(28);
            break;
        case "Pressure Drop":
            $('#UnitOrig').append($('<option>' + getUnits(32) + '</option>').val(32).html(getUnits(32)));
            $('#UnitOrig').append($('<option>' + getUnits(30) + '</option>').val(30).html(getUnits(30)));
            $('#UnitOrig').append($('<option>' + getUnits(31) + '</option>').val(31).html(getUnits(31)));
            $("#UnitOrig").val(32);

            $('#UnitConverted').append($('<option>' + getUnits(32) + '</option>').val(32).html(getUnits(32)));
            $('#UnitConverted').append($('<option>' + getUnits(30) + '</option>').val(30).html(getUnits(30)));
            $('#UnitConverted').append($('<option>' + getUnits(31) + '</option>').val(31).html(getUnits(31)));
            $("#UnitConverted").val(30);
            break;
        case "Flow Rate":
            $('#UnitOrig').append($('<option>' + getUnits(35) + '</option>').val(35).html(getUnits(35)));
            $('#UnitOrig').append($('<option>' + getUnits(34) + '</option>').val(34).html(getUnits(34)));
            $('#UnitOrig').append($('<option>' + getUnits(33) + '</option>').val(33).html(getUnits(33)));
            $('#UnitOrig').append($('<option>' + getUnits(36) + '</option>').val(36).html(getUnits(36)));
            $("#UnitOrig").val(35);

            $('#UnitConverted').append($('<option>' + getUnits(35) + '</option>').val(35).html(getUnits(35)));
            $('#UnitConverted').append($('<option>' + getUnits(34) + '</option>').val(34).html(getUnits(34)));
            $('#UnitConverted').append($('<option>' + getUnits(33) + '</option>').val(33).html(getUnits(33)));
            $('#UnitConverted').append($('<option>' + getUnits(36) + '</option>').val(36).html(getUnits(36)));
            $("#UnitConverted").val(34);
            break;
        case "Heat Transfer Coefficient":
            $('#UnitOrig').append($('<option>' + getUnits(38) + '</option>').val(38).html(getUnits(38)));
            $('#UnitOrig').append($('<option>' + getUnits(37) + '</option>').val(37).html(getUnits(37)));
            $("#UnitOrig").val(38);

            $('#UnitConverted').append($('<option>' + getUnits(38) + '</option>').val(38).html(getUnits(38)));
            $('#UnitConverted').append($('<option>' + getUnits(37) + '</option>').val(37).html(getUnits(37)));
            $("#UnitConverted").val(37);
            break;
        case "Heat of Vaporization":
            $('#UnitOrig').append($('<option>' + getUnits(40) + '</option>').val(40).html(getUnits(40)));
            $('#UnitOrig').append($('<option>' + getUnits(41) + '</option>').val(41).html(getUnits(41)));
            $('#UnitOrig').append($('<option>' + getUnits(39) + '</option>').val(39).html(getUnits(39)));
            $("#UnitOrig").val(40);

            $('#UnitConverted').append($('<option>' + getUnits(40) + '</option>').val(40).html(getUnits(40)));
            $('#UnitConverted').append($('<option>' + getUnits(41) + '</option>').val(41).html(getUnits(41)));
            $('#UnitConverted').append($('<option>' + getUnits(39) + '</option>').val(39).html(getUnits(39)));
            $("#UnitConverted").val(41);
            break;
        case "Volumetric Heat Capacity":
            $('#UnitOrig').append($('<option>' + getUnits(43) + '</option>').val(43).html(getUnits(43)));
            $('#UnitOrig').append($('<option>' + getUnits(44) + '</option>').val(44).html(getUnits(44)));
            $('#UnitOrig').append($('<option>' + getUnits(42) + '</option>').val(42).html(getUnits(42)));
            $("#UnitOrig").val(43);

            $('#UnitConverted').append($('<option>' + getUnits(43) + '</option>').val(43).html(getUnits(43)));
            $('#UnitConverted').append($('<option>' + getUnits(44) + '</option>').val(44).html(getUnits(44)));
            $('#UnitConverted').append($('<option>' + getUnits(42) + '</option>').val(42).html(getUnits(42)));
            $("#UnitConverted").val(44);
            break;
    }
}

function getUnits(num)
{
        var unitString = "";
        switch (num) {
            case 1: unitString = "°C"; break;
            case 2: unitString = "°F"; break;
            case 3: unitString = "kg/m³"; break;
            case 4: unitString = "lb/gal"; break;
            case 5: unitString = "lb/ft³"; break;
            case 6: unitString = "g/cm³"; break;
            case 7: unitString = "Spec. Grav."; break;
            case 8: unitString = "kJ/(kg·K)"; break;
            case 9: unitString = "Btu/(lb·°F)"; break;
            case 10: unitString = "kcal/(kg·°C)"; break;
            case 11: unitString = "W/(m·K)"; break;
            case 12: unitString = "Btu/(h·ft·°F)"; break;
            case 13: unitString = "kcal/(h·m·°C)"; break;
            case 14: unitString = "Pa·s"; break;
            case 15: unitString = "lb/(ft·h)"; break;
            case 16: unitString = "cP"; break;
            case 17: unitString = "cSt"; break;
            case 18: unitString = "ft²/h"; break;
            case 19: unitString = "mm²/s"; break;
            case 20: unitString = "kPa"; break;
            case 21: unitString = "psia"; break;
            case 22: unitString = "mmHg"; break;
            case 23: unitString = "kgf/cm²"; break;
            case 24: unitString = "bar"; break;
            case 25: unitString = "atm"; break;
            case 26: unitString = "mm"; break;
            case 27: unitString = "in"; break;
            case 28: unitString = "m/s"; break;
            case 29: unitString = "ft/s"; break;
            case 30: unitString = "Pa/m"; break;
            case 31: unitString = "psi/(100 ft)"; break;
            case 32: unitString = "bar/m"; break;
            case 33: unitString = "L/s"; break;
            case 34: unitString = "gal/min"; break;
            case 35: unitString = "ft³/min"; break;
            case 36: unitString = "m³/h"; break;
            case 37: unitString = "W/(m²·K)"; break;
            case 38: unitString = "Btu/(h·ft²·°F)"; break;
            case 39: unitString = "kJ/kg"; break;
            case 40: unitString = "Btu/lb"; break;
            case 41: unitString = "kcal/kg"; break;
            case 42: unitString = "kJ/(m³·K)"; break;
            case 43: unitString = "Btu/(ft³·°F)"; break;
            case 44: unitString = "kcal/(m³·°C)"; break;
            default: unitString = "Unknown";
        }
        return unitString;
}

function getUnitNum(unitString) {
    var unitNum = "";
    switch (unitString) {
        case "°C": unitNum = 1; break;
        case "°F": unitNum = 2; break;
        case "kg/m³": unitNum = 3; break;
        case "lb/gal": unitNum = 4; break;
        case "lb/ft³": unitNum = 5; break;
        case "g/cm³": unitNum = 6; break;
        case "Spec. Grav.": unitNum = 7; break;
        case "kJ/(kg·K)": unitNum = 8; break;
        case "Btu/(lb·°F)": unitNum = 9; break;
        case "kcal/(kg·°C)": unitNum = 10; break;
        case "W/(m·K)": unitNum = 11; break;
        case "Btu/(h·ft·°F)": unitNum = 12; break;
        case "kcal/(h·m·°C)": unitNum = 13; break;
        case "Pa·s": unitNum = 14; break;
        case "lb/(ft·h)": unitNum = 15; break;
        case "cP": unitNum = 16; break;
        case "cSt": unitNum = 17; break;
        case "ft²/h": unitNum = 18; break;
        case "mm²/s": unitNum = 19; break;
        case "kPa": unitNum = 20; break;
        case "psia": unitNum = 21; break;
        case "mmHg": unitNum = 22; break;
        case "kgf/cm²": unitNum = 23; break;
        case "bar": unitNum = 24; break;
        case "atm": unitNum = 25; break;
        case "mm": unitNum = 26; break;
        case "in": unitNum = 27; break;
        case "m/s": unitNum = 28; break;
        case "ft/s": unitNum = 29; break;
        case "Pa/m": unitNum = 30; break;
        case "psi/(100 ft)": unitNum = 31; break;
        case "bar/m": unitNum = 32; break;
        case "L/s": unitNum = 33; break;
        case "gal/min": unitNum = 34; break;
        case "ft³/min": unitNum = 35; break;
        case "m³/h": unitNum = 36; break;
        case "W/(m²·K)": unitNum = 37; break;
        case "Btu/(h·ft²·°F)": unitNum = 38; break;
        case "kJ/kg": unitNum = 39; break;
        case "Btu/lb": unitNum = 40; break;
        case "kcal/kg": unitNum = 41; break;
        case "kJ/(m³·K)": unitNum = 42; break;
        case "Btu/(ft³·°F)": unitNum = 43; break;
        case "kcal/(m³·°C)": unitNum = 44; break;
        default: unitNum = "Unknown";
    }
    return unitNum;
}

function copyFirst2() {
    var velo = $('#Vel1').val();
    $('#Vel2').val(velo);
    $('#Vel3').val(velo);
    $('#Vel4').val(velo);
    $('#Vel5').val(velo);
    $('#Vel6').val(velo);
}

function clearPipes()
{
    $('#Rough1').val("");
    $('#Rough2').val("");
    $('#Rough3').val("");
    $('#Rough4').val("");
    $('#Rough5').val("");
    $('#Rough6').val("");
    $('#Diam1').val("");
    $('#Diam2').val("");
    $('#Diam3').val("");
    $('#Diam4').val("");
    $('#Diam5').val("");
    $('#Diam6').val("");
}

function fluidChange(column) {

    var fluid = $('#Fluid' + column).val();
    var obj = getFluidObj(fluid);
    var min = obj.min;
    var max = obj.max;
    var unit = $('#TempUnit').html();

    if (getUnitNum(unit) == 2 && (min != 'Unknown'))
    {
        min = Math.round(ConvertFromSI("Temperature", 2, min, 0));
        max = Math.round(ConvertFromSI("Temperature", 2, max, 0));
        max = Math.ceil(max / 5) * 5;
        switch (fluid) {
            case 'VLT':
                max = 176.66666666666666; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
            case 'ADX-10':
                max = 248.88888888888889; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
            case '66':
                max = 343.3333333333333; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
            case '68':
                min = -26.1111111111111; min = Math.round(ConvertFromSI("Temperature", 2, min, 0)); break;
            case '72':
                max = 379.44444444444446; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
            case 'VP-3':
                max = 329.44444444444446; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
            case 'VP-1':
                max = 398.88888888888886; max = Math.round(ConvertFromSI("Temperature", 2, max, 0)); break;
        }
    }
    else
    {
        unit = '°C';
    }

    if (min != 'Unknown' && max != 'Unknown') {
        $('#FluidDesc' + column).html(min + unit + '<br /> to <br />' + max + unit);
    }
    else
    {
        $('#FluidDesc' + column).html('');
    }
}

function minMaxTest(column) {
    var fluid = $('#Fluid' + column).val();
    var obj = getFluidObj(fluid);
    var min = obj.min;
    var max = obj.max;
    var temp = $('#Temp' + column).val();
    var unit = $('#TempUnit').html();

    if (getUnitNum(unit) == 2 && (min != 'Unknown')) {
        min = Math.round(ConvertFromSI("Temperature", 2, min, 0));
        max = Math.round(ConvertFromSI("Temperature", 2, max, 0));
    }

    if (min != 'Unknown' && max != 'Unknown') {
        try {
            if (parseFloat(temp) < parseFloat(min)) {
                $('#Temp' + column).val(min);
            }
        }
        catch (err) { }
        try {
            if (parseFloat(temp) > parseFloat(max)) {
                $('#Temp' + column).val(max);
            }
        }
        catch (err) { }

    }
    else
    {
        $('#Temp' + column).val('');
    }
}

function getFluidObj(fluid)
{
    var fluidObj;
    switch (fluid) {
        case "VLT": fluidObj = { min: "-115", max: "175" }; break;
        case "D-12": fluidObj = { min: "-94", max: "230" }; break;
        case "LT": fluidObj = { min: "-75", max: "315" }; break;
        case "ADX-10": fluidObj = { min: "-56", max: "250" }; break;
        //case "RD": fluidObj = { min: "-36", max: "270" }; break;
        case "54": fluidObj = { min: "-28", max: "280" }; break;
        case "55": fluidObj = { min: "-28", max: "315" }; break;
        case "SP": fluidObj = { min: "-28", max: "315" }; break;
        case "XP": fluidObj = { min: "-20", max: "315" }; break;
        //case "58": fluidObj = { min: "-26", max: "300" }; break;
        case "59": fluidObj = { min: "-49", max: "315" }; break;
        case "62": fluidObj = { min: "-23", max: "325" }; break;
        case "66": fluidObj = { min: "-3", max: "345" }; break;
        case "68": fluidObj = { min: "-26", max: "360" }; break;
        case "72": fluidObj = { min: "-14", max: "380" }; break;
        case "75": fluidObj = { min: "80", max: "385" }; break;
        case "VP-3": fluidObj = { min: "2", max: "330" }; break;
        case "VP-1": fluidObj = { min: "12", max: "400" }; break;
        case "Water": fluidObj = { min: "0", max: "315" }; break;
        case "Marlotherm XC": fluidObj = { min: "-90", max: "300" }; break;
        case "Marlotherm LH": fluidObj = { min: "-30", max: "330" }; break;
        case "Marlotherm SH": fluidObj = { min: "-15", max: "325" }; break;
        default: fluidObj = { min: "Unknown", max: "Unknown" };
    }
    return fluidObj;
}

function updateFluidTemps()
{
    fluidChange(1);
    fluidChange(2);
    fluidChange(3);
    fluidChange(4);
    fluidChange(5);
    fluidChange(6);
}

function phaseComparisonChange() {
    var getChecked = $('input[name=phaseGroup]:checked').val();
    if (getChecked == 'Liquid') {
        $("#LiquidRadio2").prop("checked", true);
        $("#LiquidRadio3").prop("checked", true);
        $('#VaporPressureRow').show();
    }
    else {
        $("#VaporRadio2").prop("checked", true);
        $("#VaporRadio3").prop("checked", true);
        $('#VaporPressureRow').hide();
    }

    phaseChange();
}

function phaseTableChange() {
    var getChecked = $('input[name=phaseGroupTable]:checked').val();
    if (getChecked == 'Liquid') {
        $("#LiquidRadio").prop("checked", true);
        $("#LiquidRadio3").prop("checked", true);
    }
    else {
        $("#VaporRadio").prop("checked", true);
        $("#VaporRadio3").prop("checked", true);
    }

    phaseChange();
}

function phasePlotChange() {
    var getChecked = $('input[name=phaseGroupPlot]:checked').val();
    if (getChecked == 'Liquid')
    {
        $("#LiquidRadio").prop("checked", true);
        $("#LiquidRadio2").prop("checked", true);
    }
    else
    {
        $("#VaporRadio").prop("checked", true);
        $("#VaporRadio2").prop("checked", true);
    }

    phaseChange();
}

function phaseChange() {

    //Clear all values
    $('.tabletext').val('');

    //Populate from Database
    var phaseL = ["", "VLT", "D-12", "LT", "ADX-10", "54", "55", "SP", "XP", "59", "62", "66", "68", "72", "75", "VP-3", "VP-1", "Marlotherm XC", "Marlotherm LH", "Marlotherm SH", "Water"];
    var phaseV = ["", "LT", "VP-3", "VP-1", "Marlotherm LH", "Water"];
    var phaseObj;
    var phase = $('input[name=phaseGroup]:checked').val();

    if (phase == "Liquid")
    {
        phaseObj = phaseL;

        $('#VapPressProp').html("Vapor Pressure");
        $('#TableVapPUnit').html(getUnits(20));
        $('#PropUnitVapP').html(getUnits(20));
        $('#PropPlot').empty();
        $('#PropPlot').append($('<option></option>').val('').html(''));
        $('#PropPlot').append($('<option></option>').val('Density').html('Density'));
        $('#PropPlot').append($('<option></option>').val('Heat Capacity').html('Heat Capacity'));
        $('#PropPlot').append($('<option></option>').val('Thermal Conductivity').html('Thermal Conductivity'));
        $('#PropPlot').append($('<option></option>').val('Viscosity').html('Viscosity'));
        $('#PropPlot').append($('<option></option>').val('Vapor Pressure').html('Vapor Pressure'));
    }
    else
    {
        $('#PropPlot').empty();
        phaseObj = phaseV;
        $('#VapPressProp').html("Heat of Vaporization");
        $('#TableVapPUnit').html(getUnits(39));
        $('#PropUnitVapP').html(getUnits(39));
        $('#PropPlot').empty();
        $('#PropPlot').append($('<option></option>').val('').html(''));
        $('#PropPlot').append($('<option></option>').val('Density').html('Density'));
        $('#PropPlot').append($('<option></option>').val('Heat Capacity').html('Heat Capacity'));
        $('#PropPlot').append($('<option></option>').val('Thermal conductivity').html('Thermal conductivity'));
        $('#PropPlot').append($('<option></option>').val('Viscosity').html('Viscosity'));
        $('#PropPlot').append($('<option></option>').val('Heat of Vaporization').html('Heat of Vaporization'));

    }

    $('#Fluid1').empty();
    $('#Fluid2').empty();
    $('#Fluid3').empty();
    $('#Fluid4').empty();
    $('#Fluid5').empty();
    $('#Fluid6').empty();
    $('#FluidPlot1').empty();
    $('#FluidPlot2').empty();
    $('#FluidPlot3').empty();
    $('#FluidPlot4').empty();
    $('#FluidPlot5').empty();
    $('#FluidPlot6').empty();
    $('#FluidTempTable').empty();
    $.each(phaseObj, function (i, p) {
        $('#Fluid1').append($('<option></option>').val(p).html(p));
        $('#Fluid2').append($('<option></option>').val(p).html(p));
        $('#Fluid3').append($('<option></option>').val(p).html(p));
        $('#Fluid4').append($('<option></option>').val(p).html(p));
        $('#Fluid5').append($('<option></option>').val(p).html(p));
        $('#Fluid6').append($('<option></option>').val(p).html(p));
        $('#FluidPlot1').append($('<option></option>').val(p).html(p));
        $('#FluidPlot2').append($('<option></option>').val(p).html(p));
        $('#FluidPlot3').append($('<option></option>').val(p).html(p));
        $('#FluidPlot4').append($('<option></option>').val(p).html(p));
        $('#FluidPlot5').append($('<option></option>').val(p).html(p));
        $('#FluidPlot6').append($('<option></option>').val(p).html(p));
        $('#FluidTempTable').append($('<option></option>').val(p).html(p));
    });
    updateFluidTemps();
}

function updategraph()
{
    getDataSets();
}

function clearTemperatureTable() {
    $('#tableResultsData tbody').remove();
    $('#tableResultsData tr').remove();
}

function updateTable()
{
    $('#tableResultsData tbody').remove();
    $('#tableResultsData tr').remove();
    var fluid = $('#FluidTempTable').val();
    var phase = $('input[name=phaseGroup]:checked').val();
    var fluidObj = getFluidObj(fluid);
    var fluidmin = fluidObj.min;
    var fluidmax = fluidObj.max;

    var interval = $('#TempInterval').val();
    var beginning = $('#BegAt').val();


    if (getUnitNum($('#TableTempUnit').text()) == "2") {
        if (parseFloat(beginning) <= parseFloat(Convert("Temperature", "1", "2", fluidmin, ""))) {
            $('#BegAt').val(Math.round(parseFloat(Convert("Temperature", "1", "2", fluidmin, ""))));
            beginning = parseFloat(Convert("Temperature", "1", "2", fluidmin, ""));
        }
        if (parseFloat(beginning) >= parseFloat(Convert("Temperature", "1", "2", fluidmax, ""))) {
            $('#BegAt').val(Math.round(parseFloat(Convert("Temperature", "1", "2", fluidmax, ""))));
            beginning = parseFloat(Convert("Temperature", "1", "2", fluidmax, ""));
            beginning = Math.round(beginning);
        }
    }
    else {
        if (parseFloat(beginning) <= parseFloat(fluidmin)) {
            $('#BegAt').val(fluidmin);
            beginning = fluidmin;
        }
        if (parseFloat(beginning) > parseFloat(fluidmax)) {
            $('#BegAt').val(fluidmax);
            beginning = fluidmax;
        }
    }

    if (beginning == "")
    {
        beginning = fluidmin;
    }

    var tempUnit = getUnitNum($("#TableTempUnit").text());

    if (tempUnit == "2")
    {
        interval = interval / 1.8;

        fluidmax = Convert("Temperature", "1", "2", fluidmax, "");
        fluidmax = Math.ceil(fluidmax / 5) * 5;
        fluidmax = Convert("Temperature", "2", "1", fluidmax, "");

        if ($('#BegAt').val().trim() != "") {
            beginning = Convert("Temperature", "2", "1", beginning, "");
        }

        switch (fluid) {
            case 'VLT':
                fluidmax = 176.66666666666666; break;
            case 'ADX-10':
                fluidmax = 248.88888888888889; break;
            case '66':
                fluidmax = 343.3333333333333; break;
            case '72':
                fluidmax = 379.44444444444446; break;
            case 'VP-3':
                fluidmax = 329.44444444444446; break;
            case 'VP-1':
                fluidmax = 398.88888888888886; break;
        }
    }

    var params = fluid + '@' + phase + '@' + beginning + '@' + fluidmax + '@' + interval;

    // Special handling of range for Marlotherm LH
    if (fluid == 'Marlotherm LH') {
        params = fluid + '@' + phase + '@' + beginning + '@361@' + interval;
    }

    // Special handling of range for Marlotherm SH
    if (fluid == 'Marlotherm SH') {
        params = fluid + '@' + phase + '@' + beginning + '@350@' + interval;
    }

    //Convert values to metric and send to function
    //
        var calcurl = getCalcUrl();
        $.ajax({
            url: calcurl + '?paramType=2&paramConcat=' + params,
            crossDomain: true,
            type: 'GET',
            success: function (data) {
                var output = JSON.parse(data);
                var count = 0;
                jQuery.each(output, function () {

                    var convertTemp = Convert("Temperature", "1", getUnitNum($('#TableTempUnit').html()), output[count].temp.toString(), "");
                    var convertDens = Convert("Density", "3", getUnitNum($('#TableDensUnit').html()), output[count].dens.toString(), "");;
                    var convertHeatC = Convert("Heat Capacity", "8", getUnitNum($('#TableHeatCUnit').html()), output[count].heatC.toString(), "");;
                    var convertThermC = Convert("Thermal Conductivity", "11", getUnitNum($('#TableThermCUnit').html()), output[count].thermC.toString(), "");;
                    var convertVisc = Convert("Dynamic Viscosity", "16", getUnitNum($('#TableViscUnit').html()), output[count].visc.toString(), output[count].dens.toString());;
                    var convertVapC = Convert("Vapor Pressure", "", getUnitNum($('#TableVapPUnit').html()), output[count].vapP.toString(), "");;

                    convertTemp = Math.round(convertTemp);

                    //3 Significant Digits
                    convertDens = parseFloat(convertDens).toPrecision(3).toString();

                    if (fluid == '54') {
                        if (getUnitNum($('#TableTempUnit').text()) == "1") {
                            convertHeatC = parseFloat(convertHeatC).toFixed(2).toString();
                            convertThermC = parseFloat(convertThermC).toFixed(3).toString();
                        }
                        else {
                            convertHeatC = parseFloat(convertHeatC).toPrecision(2).toString();
                            convertThermC = parseFloat(convertThermC).toPrecision(2).toString();
                        }
                    }
                    else {
                        convertHeatC = parseFloat(convertHeatC).toFixed(3).toString();
                        convertThermC = parseFloat(convertThermC).toFixed(4).toString();
                    }

                    //3 Significant Digits
                    convertVisc = parseFloat(convertVisc).toPrecision(3).toString();

                    //3 Significant Digits
                    convertVapC = parseFloat(convertVapC).toPrecision(3).toString();

                    $('#tableResultsData').append('<tr><td>  ' + convertTemp + '</td><td>' + convertDens.toString() + '</td><td>' + convertHeatC + '</td><td>' + convertThermC + '</td><td>' + convertVisc + '</td><td>' + convertVapC + '</td></tr>');
                      count = count + 1;
                } 
            )},
            error: function (x) {

            }
        });

}

function setPropUnit() {
    $('#PropUnit').html('');
    var propIndex = $("#PropPlot option:selected").index();
    var propUnits = '';
    if (propIndex == 1) { propUnits = $('#PropUnitDens').val(); }
    if (propIndex == 2) { propUnits = $('#PropUnitHeatC').val(); }
    if (propIndex == 3) { propUnits = $('#PropUnitThermC').val(); }
    if (propIndex == 4) { propUnits = $('#PropUnitVisc').val(); }
    if (propIndex == 5) {
        if ($("#PropPlot option:selected").val() == "Heat of Vaporization") {
            propUnits = $('#PropUnitHeatVap').val();
        }
        else {
            propUnits = $('#PropUnitVapP').val();
        }
    }
    $('#PropUnit').html(propUnits);

    if ($('#PropUnit').html() == '')
    {
        $('#PropUnit').html('(Select Units)');
    }
}

function clearPlotChart() {
    plotChart.destroy();

    $('#FluidPlot1').val($('#FluidPlot1 option:first').val());
    $('#FluidPlot2').val($('#FluidPlot2 option:first').val());
    $('#FluidPlot3').val($('#FluidPlot3 option:first').val());
    $('#FluidPlot4').val($('#FluidPlot4 option:first').val());
    $('#FluidPlot5').val($('#FluidPlot5 option:first').val());
    $('#FluidPlot6').val($('#FluidPlot6 option:first').val());
}

function getDataSets(option) {

    if (plotChart != null)
    {
        plotChart.destroy();
    }

    var degreeUnit = 'Temperature ' + $('#PropUnitTemp').val();
    var degreeNum = getUnitNum($('#PropUnitTemp').val());
    var valueUnits = getUnitNum($('#PropUnit').html());
    var propUnitText = $('#PropUnit').html();
    var propIndex = $("#PropPlot option:selected").index();
    var propPlotValue = $("#PropPlot option:selected").text();
    var dataUnits = '';
    var calcurl = getCalcUrl();
    var result = "";
    var params = "";

    if (propIndex == '1') { dataUnits = '3'; }
    if (propIndex == '2') { dataUnits = "8"; }
    if (propIndex == '3') { dataUnits = "11"; }
    if (propIndex == '4') { dataUnits = "16"; }
    if (propIndex == '5') { dataUnits = "20"; }

    if (propPlotValue.trim() === 'Viscosity') { propPlotValue = 'Dynamic Viscosity'; }


    var xMaxVar = 0;
    var xStepValueVar = 0;
    var xStepsVar = 0;

    var yMinVar = 0;
    var yMaxVar = 0;
    var yStepValueVar = 0;
    var yStepsVar = 0;


    var phase = $('input[name=phaseGroupPlot]:checked').val();
    var prop = $("#PropPlot option:selected").index();

    for (i = 1; i < 7; i++) {

        var fp = "#FluidPlot" + i.toString() + " option:selected";
        var fluid = $(fp).text()
        params = params + fluid + "@";
    }

    params = phase + "@" + prop + "@" + params;

    $.ajax({
        url: calcurl + '?paramType=3&paramConcat=' + params,
        crossDomain: true,
        type: 'GET',
        success: function (data) {

            var output = JSON.parse(data);
            var data1;
            var data2;
            var data3;
            var data4;
            var data5;
            var data6;

            var datasetfinal = [];
            var datasetxy0 = [];

            var countSet = 0;
            if (output.length >= 1) {
                for (var i = 0; i < output[0].tempData.length; ++i) {

                    output[0].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[0].tempData[i], output[0].density[i])).toPrecision(4);


                    if (degreeNum == '2') {
                        output[0].xData[i] = Convert('Temperature', '1', '2', output[0].xData[i], '');
                    }

                    var dec = output[0].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[0].xData[i] = parseFloat(output[0].xData[i]).toPrecision(4);
                    }

                    datasetxy0.push({ x: output[0].xData[i], y: output[0].tempData[i] });
                }

                datasetfinal.push({
                    data: datasetxy0,
                    label: output[0].label,
                    borderColor: output[0].borderColor,
                    fill: false
                });
            }

            var datasetxy1 = [];
            if (output.length >= 2) {

                for (var i = 0; i < output[1].tempData.length; ++i) {
                    output[1].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[1].tempData[i], output[1].density[i])).toPrecision(4);

                    if (degreeNum == '2') {
                        output[1].xData[i] = Convert('Temperature', '1', '2', output[1].xData[i], '');
                    }

                    var dec = output[1].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[1].xData[i] = parseFloat(output[1].xData[i]).toPrecision(4);
                    }

                    datasetxy1.push({ x: output[1].xData[i], y: output[1].tempData[i] });
                }

                datasetfinal.push({
                    data: datasetxy1,
                    label: output[1].label,
                    borderColor: output[1].borderColor,
                    fill: false
                });
            }

            var datasetxy2 = [];
            if (output.length >= 3) {
                for (var i = 0; i < output[2].tempData.length; ++i) {
                    output[2].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[2].tempData[i], output[2].density[i])).toPrecision(4);

                    if (degreeNum == '2') {
                        output[2].xData[i] = Convert('Temperature', '1', '2', output[2].xData[i], '');
                    }

                    var dec = output[2].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[2].xData[i] = parseFloat(output[2].xData[i]).toPrecision(4);
                    }

                    datasetxy2.push({ x: output[2].xData[i], y: output[2].tempData[i] });
                }
               

                datasetfinal.push({
                    data: datasetxy2,
                    label: output[2].label,
                    borderColor: output[2].borderColor,
                    fill: false
                });
            }

            var datasetxy3 = [];
            if (output.length >= 4) {
                for (var i = 0; i < output[3].tempData.length; ++i) {
                    output[3].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[3].tempData[i], output[3].density[i])).toPrecision(4);

                    if (degreeNum == '2') {
                        output[3].xData[i] = Convert('Temperature', '1', '2', output[3].xData[i], '');
                    }

                    var dec = output[3].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[3].xData[i] = parseFloat(output[3].xData[i]).toPrecision(4);
                    }

                    datasetxy3.push({ x: output[3].xData[i], y: output[3].tempData[i] });
                }               

                datasetfinal.push({
                    data: datasetxy3,
                    label: output[3].label,
                    borderColor: output[3].borderColor,
                    fill: false
                });
            }

            var datasetxy4 = [];
            if (output.length >= 5) {
                for (var i = 0; i < output[4].tempData.length; ++i) {
                    output[4].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[4].tempData[i], output[4].density[i])).toPrecision(4);

                    if (degreeNum == '2') {
                        output[4].xData[i] = Convert('Temperature', '1', '2', output[4].xData[i], '');
                    }

                    var dec = output[4].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[4].xData[i] = parseFloat(output[4].xData[i]).toPrecision(4);
                    }

                    datasetxy4.push({ x: output[4].xData[i], y: output[4].tempData[i] });
                }                

                datasetfinal.push({
                    data: datasetxy4,
                    label: output[4].label,
                    borderColor: output[4].borderColor,
                    fill: false
                });
            }

            var datasetxy5 = [];
            if (output.length >= 6) {
                for (var i = 0; i < output[5].tempData.length; ++i) {
                    output[5].tempData[i] = parseFloat(Convert(propPlotValue, dataUnits, valueUnits, output[5].tempData[i], output[5].density[i])).toPrecision(4);

                    if (degreeNum == '2') {
                        output[5].xData[i] = Convert('Temperature', '1', '2', output[5].xData[i], '');
                    }

                    var dec = output[5].xData[i].toString();
                    if (dec.search(".").toString() != -1) {
                        output[5].xData[i] = parseFloat(output[5].xData[i]).toPrecision(4);
                    }

                    datasetxy5.push({ x: output[5].xData[i], y: output[5].tempData[i] });
                }

                datasetfinal.push({
                    data: datasetxy5,
                    label: output[5].label,
                    borderColor: output[5].borderColor,
                    fill: false
                });
            }

            var clabel = [];

            if (degreeNum == '1')
            {
                clabel = [-200, -100, 0, 100, 200, 300, 400];
            }
            else
            {
                clabel = [-200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800];
            }
           /* try { */
                //var y = clabel;
                $("#line-chart").html('');
                plotChart = new Chart(document.getElementById("line-chart"), {
                    type: 'scatter',
                    data: {
                        labels: clabel,
                        datasets: datasetfinal
                    },
                    options: {
                        responsive: false,
                        title: {
                            display: true,
                            text: 'Property by Temperature Plot'
                        },
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 20
                            },
                            padding: 20
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: degreeUnit
                                },
                                ticks: {
                                    //beginAtZero: false,
                                    autoSkip: false,
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: propUnitText
                                },
                                ticks: {
                                    //beginAtZero: false,
                                    autoSkip: true
                                }
                            }]
                        }
                    }
                });

                phase = $('input[name=phaseGroupPlot]:checked').val()

                switch (prop) {
                    case 1:
                        if (degreeNum == '1') {
                            //plotChart.options.scales.xAxes[0].ticks.max = 410;
                            //plotChart.options.scales.yAxes[0].ticks.min = 0;
                            //plotChart.update();
                        } else {
                            plotChart.options.scales.xAxes[0].ticks.max = 800;
                            //plotChart.options.scales.yAxes[0].ticks.min = 0;
                            //plotChart.update();
                        }
                        break;
                    case 2:
                        if (degreeNum == '1') {
                            //plotChart.options.scales.xAxes[0].ticks.max = 410;
                        }
                        else {
                            plotChart.options.scales.xAxes[0].ticks.max = 800;
                        }
                        //plotChart.options.scales.yAxes[0].ticks.min = 0;
                        //plotChart.options.scales.yAxes[0].ticks.max = 3;
                        //plotChart.update();
                        break;
                    case 3:
                        break;
                    case 4:
                        if (phase == 'Liquid') {
                            plotChart.options.scales.yAxes[0].type = 'logarithmic';
                            //plotChart.options.scales.yAxes[0].ticks.callback = function (label, index) { return index % 5 === 0 ? label : ''; };
                            plotChart.options.scales.yAxes[0].ticks.callback = function (label, index) { var i = label.toString(); if (i.search("1").toString() != -1) { return label; } else { label = ''; return label; } }
                            plotChart.options.scales.yAxes[0].ticks.maxTicksLimit = 20;
                            //plotChart.options.scales.yAxes[0].afterBuildTicks = function (plotChart) { plotChart.ticks = []; plotChart.ticks.push(0.000001); plotChart.ticks.push(0.00001); plotChart.ticks.push(0.0001); plotChart.ticks.push(0.001); plotChart.ticks.push(0.01); plotChart.ticks.push(0.1); plotChart.ticks.push(1.0); plotChart.ticks.push(10); }
                            plotChart.update();
                        }
                        break;
                    case 5:
                        if (phase == 'Liquid') {
                            plotChart.options.scales.yAxes[0].type = 'logarithmic';
                            //plotChart.options.scales.yAxes[0].ticks.callback = function (label, index) { return index % 10 === 0 ? label : ''; };
                            plotChart.options.scales.yAxes[0].ticks.callback = function (label, index) { var i = label.toString(); if (i.search("1").toString() != -1 && parseFloat(i) > .000000001) { return label; } else { label = ''; return label; } }
                            //plotChart.options.scales.yAxes[0].afterBuildTicks = function (plotChart) { plotChart.ticks = []; plotChart.ticks.push(0.000001); plotChart.ticks.push(0.00001); plotChart.ticks.push(0.0001); plotChart.ticks.push(0.001); plotChart.ticks.push(0.01); plotChart.ticks.push(0.1); plotChart.ticks.push(1.0); plotChart.ticks.push(10); plotChart.ticks.push(100); plotChart.ticks.push(1000);}
                            plotChart.update();
                        }
                        break;
                }
            /*}
            catch (err) { console.log(err.toString()); } */

                if (option == '2') {

                    var output = 'Fluid,Phase,Temperature,' + $("#PropPlot").find(":selected").text() + '\r\n';
                    output = output + ',,' + $('#PropUnitTemp').val() + ',' + $('#PropUnit').html() + '\r\n';
                    var phase = $('input[name=phaseGroupPlot]:checked').val();;
                    var fluid = '';
                    for (var i in datasetfinal)
                    {
                        fluid = datasetfinal[i].label;
                        for (var j in datasetfinal[i].data)
                        {
                            var datax = datasetfinal[i].data[j].x.toString();
                            var datay = datasetfinal[i].data[j].y.toString();
                            
                            output = output + fluid + ',' + phase + ',' + datax + ',' + datay + '\r\n';
                        }
                    }

                    var blob = new Blob(["\ufeff", output], { encoding:"UTF-8", type: "text/csv;charset=utf-8" });
                    if (window.navigator.msSaveOrOpenBlob)  
                        window.navigator.msSaveBlob(blob, "TherminolPropertyByTempPlot.csv");
                    else {
                        var link = window.document.createElement("a");
                        link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(output));
                        link.setAttribute("download", "TherminolPropertyByTempPlot.csv");
                        link.click();
                    }
                }
        },
        error: function (x) {

        }
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function getCalcUrl() {
    //Dev 
    //var url = 'https://tzjwnlx8t1.execute-api.us-east-1.amazonaws.com/dev';

    //Prd
    var url = 'https://3sxxmpbw57.execute-api.us-east-1.amazonaws.com/prd';

    return url;
}


$(document).ready(function () {

    //if (window.top === window.self) {
    //    window.top.location.replace('http://therminol-dev.us-east-1.elasticbeanstalk.com/');
    //}
    document.getElementById("LiquidRadio").checked = true;
    document.getElementById("LiquidRadio2").checked = true;
    document.getElementById("LiquidRadio3").checked = true;
    $('#TempInterval').val('10');

    phaseChange();
});

