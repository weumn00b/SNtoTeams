(function executeRule(current, previous /*null when async*/) {

	try {
        var user = current.caller_id;
        if (!user) return;

        var email = current.caller_id.email + '';
		var incidentNumber = current.number + '';
		var incidentLink = gs.getProperty("glide.servlet.uri") + "nav_to.do?uri=incident.do?sys_id=" + current.sys_id;
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
