/**
 * Created by JELENA on 30.8.2017.
 */
$(document).ready(function () {
    $("#html_link").click(function () {
        $("#reader_id").val("HTMLReader");
        console.log("hidden " + $("#reader_id").val())
        $("#load_file").show();
    });

    $("#json_link").click(function () {
        $("#reader_id").val("json_reader");
        console.log("hidden " + $("#reader_id").val())
        $("#load_file").show();
    });

    $("#btn_load_file").click(function () {
        $("#load_file").hide();
    });
});