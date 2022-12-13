#! /bin/sh

#### GENERATOR FOR ENVIRONMENT FILE
## Variables defined here with $ prefix can be defined using a shell EXPORT before launching the script
## Define LIGHTSTEP_ACCESS_TOKEN variable only if you want to directly send traces to Lightstep for test purposes
## Define OTEL_EXPORTER_OTLP_ENDPOINT to go to your OpenTelemetry collector or directly to Lightstep for test purposes
## For Otel Collector, you can use: https://<YOU_OTEL_COLLECTOR_HOST>:4318/v1/traces
## For Lightstep, you can use: https://ingest.lightstep.com:443/traces/otlp/v0.9

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
