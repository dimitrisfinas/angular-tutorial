const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { trace } = require("@opentelemetry/api");

const GetTracer = (serviceName) => {
  // create a provider using the AWS ID Generator
  const tracerConfig = {
    // any instrumentations can be declared here
    instrumentations: [],
    // any resources can be declared here
    resource: Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      })
    ),
  };

  const tracerProvider = new NodeTracerProvider(tracerConfig);

  // add OTLP exporter
  const otlpExporter = new OTLPTraceExporter({
    // port configured in the Collector config, defaults to 4317
    //url: "localhost:4317",
  });
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

  // Return an tracer instance
  return trace.getTracer("get-bucket-names");
};

module.exports = { GetTracer };
