//for water transparency modification

uniform sampler2D colorMap;
varying vec4 texcoord;
varying vec4 vert_color;
varying float is_vertical;

void main()
{
    vec4 color = texture2D(colorMap,texcoord.rg);
    float alpha = color.a;
    //-1 at surface
    //0 at waterfall
    if (is_vertical <= 0.1) {
    
        //0.0666
        alpha = (1.0 + is_vertical) * 0.2666 * (2.0*color.r + 2.0*color.g + 2.0*color.b - 1.0);
        
        color.rgb = (2.0*color.r + 2.0*color.g + 2.0*color.b)/4.5 + color.rgb*0.8; ///4.5
    
    }
    
	gl_FragColor = vec4(vert_color.r*color.r, vert_color.g*color.g, vert_color.b*color.b, alpha);
}