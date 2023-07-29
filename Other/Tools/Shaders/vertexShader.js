export const shader = `#version 300 es
    // an attribute will receive data from buffer
    in vec2 a_position;
    uniform vec2 uTranslation;
    uniform vec2 uResolution;
    uniform vec2 uScale;

    void main(){
        vec2 position = (a_position + uTranslation)*uScale;
        vec2 zeroToOne = position / uResolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`
