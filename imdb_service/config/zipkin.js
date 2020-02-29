const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const CLSContext = require('zipkin-context-cls');

const tracer = new Tracer({
    ctxImpl: new CLSContext('zipkin'),//new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${process.env.ZIPKIN_ENDPOINT}/api/v2/spans`,
            jsonEncoder: jsonEncoder.JSON_V2,
        })
    }),
    localServiceName: "imdb_service",
});

const getTracer = () => {
    return tracer
}

module.exports = {
    tracer,
    getTracer
}