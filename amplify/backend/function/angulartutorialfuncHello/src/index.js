/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	AWS_LAMBDA_EXEC_WRAPPER
Amplify Params - DO NOT EDIT */

const api = require('@opentelemetry/api');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const activeContext = api.context.active();
    if (activeContext) {
        // access the current span from active context
        let activeSpan = api.trace.getSpan(activeContext);
        // log an event and include some structured data.
        activeSpan.addEvent('Lambda Event:', { lambda_event: JSON.stringify(event), });
        activeSpan.addEvent("Lambda Context", { lambda_context: JSON.stringify(context), });
        // Set custom attributes
        activeSpan.setAttribute("lambda.memory_allocated", context.memoryLimitInMB);
    } else {
        console.warn("No active context");
    }
    return {
        statusCode: 200,
        // Header below is to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
