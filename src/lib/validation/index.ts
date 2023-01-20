import addFormats from "ajv-formats";
import { Validator, ValidationError } from "express-json-validator-middleware";
import { ErrorRequestHandler } from "express";

//new instance of Validator class
const validator = new Validator({});

//configuration of ajv
addFormats(validator.ajv, ["date-time"])
    .addKeyword("kind")
    .addKeyword("modifier");

//validator will access validate property and export it
export const validate = validator.validate;

//to handle validation Errors
export const validationErrorMiddleware: ErrorRequestHandler = (
    error,
    request,
    response,
    next
) => {
    if (error instanceof ValidationError) {
        //unprocessable entity
        response.status(422).send({
            errors: error.validationErrors,
        });

        //to call the next Middleware
        next();
    } else {
        next(error);
    }
};

//planetSchema and planetDatay will be available
export * from "./planet";
