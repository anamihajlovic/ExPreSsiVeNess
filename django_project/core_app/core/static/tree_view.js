/**
 * Created by JELENA on 3.9.2017.
 */
    $(document).ready(function () {
        $(".minusLink").hide();
    });

    $(document).on("click", ".plusLink", function(){
        var plusId = $(this).attr("id");
        var id = plusId.slice(4, plusId.length);
        //var name = $(this).attr("name");
        var dl_id = id;
        $("#" + dl_id).show();
        $(this).hide();
        $("#minus" + id).show();
    });

    $(document).on("click", ".minusLink", function(){
        var minusId = $(this).attr("id");
        var id = minusId.slice(5, minusId.length);
        //var name = $(this).attr("name");
        var dl_id = id;
        $("#" + dl_id).hide();
        $(this).hide();
        $("#plus" + id).show();
    });


