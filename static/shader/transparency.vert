//for water transparency modification

varying vec4 texcoord;
varying vec4 vert_color;
varying float is_vertical;

void main()
{
    texcoord = gl_MultiTexCoord0;
    vert_color = gl_Color;
    is_vertical = gl_Normal.y;
    
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}