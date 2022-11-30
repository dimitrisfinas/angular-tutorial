# angular-tutorial

This application is issued from [Angular tutorial](https://angular.io/start)

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/angular-hpfuq7-cwsbw7)

## Adding OpenTelemetry instrumentation

Instrumentation code below is coming from https://github.com/open-telemetry/opentelemetry-demo/blob/main/docs/services/frontend.md#browser-instrumentation

- Install the OpenTelemetry libraries
```shell
npm install @opentelemetry/api @opentelemetry/core @opentelemetry/sdk-trace-web @opentelemetry/sdk-trace-base @opentelemetry/instrumentation @opentelemetry/auto-instrumentations-web @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/exporter-trace-otlp-http @opentelemetry/context-zone
```

- create tracing wrapper file `./src/utils/telemetry/FrontendTracer.ts`

```java
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

import { environment } from './../../environments/environment';

const FrontendTracer = async () => {
  const { ZoneContextManager } = await import('@opentelemetry/context-zone');

  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: environment.OTEL_SERVICE_NAME,
    }),
  });
  //const traceExporter = new ConsoleSpanExporter();
  //const traceExporter = new OTLPTraceExporter();
  const traceExporter = new OTLPTraceExporter({
    url: environment.OTEL_EXPORTER_OTLP_ENDPOINT,
    headers: {
      'lightstep-access-token': environment.LIGHTSTEP_ACCESS_TOKEN,
    },
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

  const contextManager = new ZoneContextManager();

  provider.register({
    contextManager,
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
      ],
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: /.*/,
          clearTimingResources: true,
        },
      }),
    ],
  });
};

export default FrontendTracer;
```

- add use of tracer in your application, for this, put these 2 lines just after the list of imports in `src/main.ts`:

```java
import FrontendTracer from './utils/telemetry/FrontendTracer';
if (typeof window !== 'undefined') FrontendTracer();
```

> **_NOTE:_** You can also put them in `src/app/app.module.ts` using path `../utils/telemetry/FrontendTracer` instead


- in order to manage you trace exporter properties (endpoint, access token), we will generate an environment file before each build using this script `./src/environments/createEnvFile.sh`

```shell
#! /bin/sh
SCRIPTDIR=$(dirname "$0")
cat <<EOF > ./$SCRIPTDIR/environment.ts
export const environment = {
  production: false,
  title: 'Local Environment Heading',
  LIGHTSTEP_ACCESS_TOKEN: '$LIGHTSTEP_ACCESS_TOKEN',
  OTEL_EXPORTER_OTLP_ENDPOINT: '$OTEL_EXPORTER_OTLP_ENDPOINT',
  OTEL_SERVICE_NAME: 'angular-frontend',
};
EOF
```

- before each build, you will have to export the two environment variables and then, run script `./src/environments/createEnvFile.sh` to generate your `environment.ts` file
```shell
export OTEL_EXPORTER_OTLP_ENDPOINT=<YOUR_VALUE>
export LIGHTSTEP_ACCESS_TOKEN=<YOUR_VALUE>
```

  - example of Lightstep endpoint for traces over http: `https://ingest.lightstep.com:443/traces/otlp/v0.9`
  - see [here](https://docs.lightstep.com/otel/general-otlp-configuration) for more Lightstep endpoints


- Finally, build and start the application using
```shell
ng serve
```

- you can now test it connecting to http://localhost:4200


## Adding Backend Instrumentation

- Create your function
  => Add instrumentation to your function using tips

- Create your API that will call your function. Follow instructions [here](https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js/#automated-setup-create-new-rest-api) to create your API
  => Enable x-ray tracing on your API Gateway using this doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enabling-xray.html



## Troubleshooting

- on Backend build, getting error:
```
# Starting phase: build
2022-02-14T02:47:02.527Z [INFO]: [31mInvalid feature flag configuration[39m
2022-02-14T02:47:02.530Z [INFO]: [31mThese feature flags are defined in the "amplify/cli.json" configuration file and are unknown to the currently running Amplify CLI:[39m
[31m  - project[39m
```
  - check you version of amplify cli with `amplify --version`
  - Then update version in your AWS Amplify console -> Build Settings -> Build Image Settings -> Live package updates -> Amplify CLI
  - see more details [here](https://stackoverflow.com/questions/71106728/amplify-invalid-feature-flag-configuration-on-build)

- on Frontend build, getting error:
```
Error: src/main.ts:5:30 - error TS2307: Cannot find module 'aws-amplify' or its corresponding type declarations.
  5 import { Amplify, API } from 'aws-amplify';
```
  - install aws-amplify library with `npm install aws-amplify`

- on Frontend build, getting error:
```
Error: src/main.ts:6:23 - error TS7016: Could not find a declaration file for module './aws-exports'.
```
  - if present, remove `aws-export` from your `.gitignore` file

- on Frontend build, getting error:
```
error TS7006: Parameter 'error' implicitly has an 'any' type.
```
  - add `"noImplicitAny": false,` in your `tsconfig.json` file

- At runtime, getting error in browser console:
`Uncaught ReferenceError: global is not defined`
  - update `./src/index.html` to add at the beginning:
  ```html
  <script>
    if (global === undefined) {
      var global = window;
    }
  </script>
  ```

- At runtime, getting error in browser console when calling external API:
```
Access to XMLHttpRequest at 'https://your_api' from origin 'https://your_app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
  - update your lambda function to return CORS header. Example below is for node JS
```java
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://www.example.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```
  - see details [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
