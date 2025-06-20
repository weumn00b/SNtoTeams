(function executeRule(current, previous /*null when async*/) {

	try {
	// Check if "Additional comments" (comments field) changed
    if (!current.comments.changes()) {
        return; // No change, skip
    }

    // Get caller ID and current user ID
    var callerId = current.caller_id.sys_id + '';
    var currentUserId = gs.getUserID() + '';

    // Only proceed if the updater is NOT the caller
    if (callerId == currentUserId) {
        return; // Caller made the comment, skip
    }
        var user = current.caller_id;
        if (!user) return;

        var email = current.caller_id.email + '';
		var incidentNumber = current.number + '';
		var incidentLink = gs.getProperty("glide.servlet.uri") + "sp?id=ticket&table=incident&sys_id" + current.sys_id;
		var shortDescription = current.short_description + '';

        var payload = {
            email: email,
            incidentNumber: incidentNumber,
            webpageLink: incidentLink,
			shortDescription: shortDescription
        };

        var r = new sn_ws.RESTMessageV2();
        r.setEndpoint("https://example.com"); 
        r.setHttpMethod("POST");
        r.setRequestHeader("Content-Type", "application/json");
        r.setRequestBody(JSON.stringify(payload));

        var response = r.execute();
        var httpResponseStatus = response.getStatusCode();
        var responseBody = response.getBody();

        gs.info("REST call status: " + httpResponseStatus);
        gs.info("Response body: " + responseBody);

    } catch (ex) {
        gs.error("Error during REST call: " + ex.message);
    }

})(current, previous);
