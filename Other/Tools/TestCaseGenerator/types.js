class Types{
    constructor(){
        this.LEFT_CONNECTION = 0;
        this.RIGHT_CONNECTION = 1;

        this.ELEMENT_NODE_INPUT_TYPE = 0;
        this.ELEMENT_NODE_FUNCTION_TYPE = 1;
        this.ELEMENT_NODE_OUTPUT_TYPE = 2;

        this.INPUT_TEXT_TYPE = 0;
        this.INPUT_LONG_TEXT_TYPE = 1;
        this.INPUT_INT_TYPE = 2;
        this.INPUT_FLOAT_TYPE = 3;
        this.INPUT_ARRAY_TYPE = 4;
        this.INPUT_NAMES = ["string", "long string", "int", "float"];
    }
}

const types = new Types()
export default types;
