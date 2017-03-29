var numUpdates = 0
function updateMessages() {
    numUpdates++
    $.getJSON("http://cs120.liucs.net/assn4/messages.json", "", function(data){
        // TODO: format the messages nicely
        //d = JSON.stringify(data)
        var buf = ""
        for(i=0; i < data.length; i++) {
          buf = buf + "<br>Timestamp: " + data[i].timestamp + "<br>Sender: " + data[i].sender + "<br>Mood: " + data[i].mood + "<br>Message: " + data[i].text + "<br>"
        }
        $("#messages").html(buf)
    })
    // Call this function again after 10s delay
    setTimeout(updateMessages, 10000)
}

// Get the <datalist> and <input> elements
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('ajax');

// Create new XMLHttpRequest
var request = new XMLHttpRequest();

// Handle state changes for the request
request.onreadystatechange = function(response) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      // Parse the JSON
      var jsonOptions = JSON.parse(request.responseText);

      // Loop over the JSON array
      jsonOptions.forEach(function(item) {
        // Create a new <option> element
        var option = document.createElement('option');
        // Set the value using the item in the JSON array
        option.value = item;
        // Add the <option> element to the <datalist>
        dataList.appendChild(option);
      });

      // Update the placeholder text
      input.placeholder = "Feeling";
    } else {
      // An error occured
      input.placeholder = "Couldn't load datalist options";
    }
  }
};

// Update the placeholder text
//input.placeholder = "Feeling";

// Set up and make the request
request.open('GET', 'http://cs120.liucs.net/assn4/moods.json', true);
request.send();

$(function(){
    console.log("READY TO GO.")
    $("#post").click(function(event){
        event.preventDefault()
        console.log("YOU CLICKED.")
        // Grab field values
        var sender = $("#sender").val()
        var message = $("#message").val()
        var mood = $("#ajax").val()
        console.log([sender, message, mood])
        // TODO: validate that sender/message are non-empty
        // Create message object, TODO: add mood if non-empty
        var obj = JSON.stringify({sender: sender, text: message, mood: mood})
        console.log(obj)
        //Clears fields upon submission
        $("#ajax").val("");
        $("#message").val("");
        // TODO(CL): fix OPTIONS for CORS preflight on server
        $.ajax({
          url: "http://cs120.liucs.net/assn4/messages.json",
          type: "POST",
          data: obj,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(){
            console.log("SUCCESS, posted to server")
            updateMessages()
          }
        })
    })
    updateMessages()
})
