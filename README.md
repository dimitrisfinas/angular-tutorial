# angular-tutorial

This application is issued from [Angular tutorial](https://angular.io/start)

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/angular-hpfuq7-cwsbw7)

# Open-Telemetry

npm install @opentelemetry/api @opentelemetry/core @opentelemetry/sdk-trace-web @opentelemetry/sdk-trace-base @opentelemetry/instrumentation @opentelemetry/auto-instrumentations-web @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/exporter-trace-otlp-http @opentelemetry/context-zone

create file ./src/envionments/environment.ts
```java
export const environment = {
  production: false,
  title: 'Local Environment Heading',
  LIGHTSTEP_ACCESS_TOKEN: '$LIGHTSTEP_ACCESS_TOKEN',
  OTEL_EXPORTER_OTLP_ENDPOINT: '$OTEL_EXPORTER_OTLP_ENDPOINT',
  OTEL_SERVICE_NAME: 'angular-frontend',
};
```


create file ./src/utils/telemetry/FrontendTracer.ts

add use of tracer in `src/app/app.module.ts`

```java
import FrontendTracer from '../utils/telemetry/FrontendTracer';
if (typeof window !== 'undefined') FrontendTracer();
```
