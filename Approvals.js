(function executeRule(current, gContext) {
    var endpoint = 'link to endpoint';

    var gr = new GlideRecord('sysapproval_approver');
    gr.addQuery('state', 'requested'); // Only pending approvals
	//gr.addQuery('sys_created_on', '<=', gs.daysAgoStart(3)); // This line will make sure that only the approvals that have been waiting for more than 3 days are sent reminders
	
	// add additional queries here to base this off of SN groups
    
	gr.query();

//These Lines are for testing purposes
	
    //while (gr.next()) {
//		if (gr.approver.getDisplayValue().toLowerCase() !== 'test test') {
//			continue; // Skip non-matching users
}
        var approver = gr.approver.getDisplayValue();
        var approverEmail = gr.approver.email;
        var approvalRecord = gr.sysapproval.getRefRecord();
		var shortDesc = '';
        var ritm = gr.sysapproval.getRefRecord(); // This will grab the RITM

		var requestedFor = '';
		if (ritm && ritm.getTableName() === 'sc_req_item') {
			shortDesc = ritm.short_description || '';
			if (ritm.requested_for)
				requestedFor = ritm.requested_for.getDisplayValue();
}

        
        var approvalLink = gs.getProperty('glide.servlet.uri') + 'sp?id=approval&sys_id=' + gr.sys_id;

        // Construct JSON payload
        var payload = {
            approver_email: approverEmail + '',
            short_description: shortDesc + '',
            requested_for: requestedFor + '',
            approval_link: approvalLink + ''
        };

        // Prepare REST message
        var r = new sn_ws.RESTMessageV2();
        r.setHttpMethod('post');
        r.setEndpoint(endpoint);
        r.setRequestHeader("Content-Type", "application/json");
        r.setRequestBody(JSON.stringify(payload));

        try {
            var response = r.execute();
            var httpStatus = response.getStatusCode();
            var responseBody = response.getBody();
            gs.info("Approval data sent: Status = " + httpStatus + ", Response = " + responseBody);
        } catch (ex) {
            gs.error("Failed to send approval data: " + ex.message);
        }
    }
})();
