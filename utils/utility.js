class ErrorHandler extends Error{
    constructor(messgae,statusCode)
    {
        super(messgae);
        this.statusCode=statusCode
    }
}

export {ErrorHandler};