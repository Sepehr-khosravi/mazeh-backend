import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function AtLeastOne(
    properties : string[],
    ValidationOptions? : ValidationOptions
){
    return function(object: Object, propertyName : string){
        registerDecorator({
            name : "AtLeastOne",
            target : object.constructor,
            propertyName,
            options : ValidationOptions,
            validator : {
                validate(_:any, args : ValidationArguments){
                    const obj = args.object as any;
                    return properties.some(
                        (prop)=> obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== "",
                    );

                }
            }
        })
    }
}