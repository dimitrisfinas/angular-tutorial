export const environment = {
  production: false,
  title: 'Local Environment Heading',
  LIGHTSTEP_ACCESS_TOKEN:
    $LIGHTSTEP_ACCESS_TOKEN,
  OTEL_EXPORTER_OTLP_ENDPOINT: 'https://ingest.lightstep.com:443/traces/otlp/v0.9',
  OTEL_SERVICE_NAME: 'angular-frontend',
};
