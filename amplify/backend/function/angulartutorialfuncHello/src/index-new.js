/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	AWS_LAMBDA_EXEC_WRAPPER
Amplify Params - DO NOT EDIT */

const { GetTracer } = require("./opentelemetry/tracer");
const { SpanKind } = require("@opentelemetry/api");

const lambda_tracer = GetTracer("multi-lambda-nodejs");

exports.handler = async function (event, context) {
  console.info("Serving lambda request.");
  const result = get_bucket_names(context);
  return result;
};

const get_bucket_names = async (context) => {
  const span = lambda_tracer.startSpan("get_bucket_names", {
    kind: SpanKind.CLIENT,
  });
  span.setAttribute("lambda.function_name", context.functionName);
  const result = {
        statusCode: 200,
        // Header below is to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify('Hello from Lambda v2!'),
    };
  console.info('RESULT: ${result}');
  span.end();
  return result;
};
