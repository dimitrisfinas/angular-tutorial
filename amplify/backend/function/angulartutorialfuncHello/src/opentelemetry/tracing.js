const {
  AwsLambdaInstrumentationConfig,
} = require("@opentelemetry/instrumentation-aws-lambda");
const { context: otelContext, propagation } = require("@opentelemetry/api");

// getter/setter for APIGW
const headerGetter = {
  keys(carrier) {
    return Object.keys(carrier);
  },
  get(carrier, key) {
    return carrier[key];
  },
};

// getter/setter for SQS
const sqsGetter = {
  keys(carrier) {
    return "AWSTraceHeader";
  },
  get(carrier, key) {
    return carrier.Records[0].attributes[key];
  },
};

global.configureLambdaInstrumentation = (config) => {
  return {
    ...config,
    disableAwsContextPropagation: true,
    eventContextExtractor: (event, context) => {
      // If using APIGW, the headers are in the event object
      // we need to extract context from those
      if (event.headers) {
        const httpHeaders = event.headers || {};
        return propagation.extract(
          otelContext.active(),
          httpHeaders,
          headerGetter
        );
      }

      // If using SQS, the value we need is in the attributes
      // collection. We need to use the AWSTraceHeader value
      // to propagate context
      if (event.Records[0].attributes.AWSTraceHeader) {
        return propagation.extract(otelContext.active(), event, sqsGetter);
      }
    },
  };
};
