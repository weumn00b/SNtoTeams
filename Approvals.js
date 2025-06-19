(function executeRule(current, gContext) {
    var endpoint = 'example.com';

    var gr = new GlideRecord('sysapproval_approver');
    gr.addQuery('state', 'requested'); // Only pending approvals
	//gr.addQuery('sys_created_on', '<=', gs.daysAgoStart(3)); // This line will make sure that only the approvals that have been waiting for more than 3 days are sent reminders
	
	// add additional queries here to base this off of SN groups
    
	gr.query();

    while (gr.next()) {
        var approver = gr.approver.getDisplayValue();
        var approverEmail = gr.approver.email;
        var approvalRecord = gr.sysapproval.getRefRecord();
        var shortDesc = approvalRecord.short_description || '';
        var requestedFor = approvalRecord.requested_for.getDisplayValue() || '';

        
        var taskSysId = gr.sysapproval.sys_id;
        var approvalLink = gs.getProperty('glide.servlet.uri') + 'approval.do?sys_id=' + taskSysId;

        // Construct JSON payload
        var payload = {
            approver_email: approverEmail,
            short_description: shortDesc,
            requested_for: requestedFor,
            approval_link: approvalLink
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
})(current, gContext);
