//
//CSE 470 HW 1 TWISTY!  
//
/*
Written by: HW470:Yu Fu
Date: Jan, 30 2021

Description: 
This program is for CSE 470 first assignment - TWISTY. This javascript should
compile with the twisty.html. The twisty.js file defined the vertices, color, and draw.
Also, use the function to decide the rotation angle. Base on the rotation angle,
using loop to make the rotation direction change when it is greater than 90 degree.
Set one object to stationary while other is routation and twist.
*/

var canvas;
var gl;

//store the vertices
//Each triplet represents one triangle
var vertices = [];


//store a color for each vertex
var colors = [];

//HW470: control the rotation
//(Your variable here)
var theta = 0.0;
var thetaLoc;
var direction = true;
//set angle
var s;
var c;
var x;
var num;
var d;

//HW470: control the redraw rate
var delay = 20;

// =============== function init ======================
 
// When the page is loaded into the browser, start webgl stuff
window.onload = function init()
{
	// notice that gl-canvas is specified in the html code
    canvas = document.getElementById( "gl-canvas" );
    
	// gl is a canvas object
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Track progress of the program with print statement
    console.log("Opened canvas");
        
    //HW470:
    // Define  data for object 
	// See HW specs for number of vertices  required
	// Recommendation: each set of three points corresponds to a triangle.
	// Here is one triangle. You can use parametric equations, for example of a circle to generate (x,y) values
	
    vertices = [
       //right 1 wing
       vec2(0.87, -0.1),
       vec2(0.55, 0),
       vec2(0.5, 0.3),
       //left 1 wing
       vec2(-0.87, -0.1),
       vec2(-0.55, 0),
       vec2(-0.5, 0.3),
       //right 2 wing
       vec2(0.54, -0.01),
       vec2(0.45, -0.2),
       vec2(0.5, 0.3),
       //left 2 wing
       vec2(-0.54, -0.01),
       vec2(-0.45, 0-.2),
       vec2(-0.5, 0.3),
       //right 3 wing
       vec2(0.2, -0.08),
       vec2(0.44, -0.21),
       vec2(0.5, 0.3),
       //left 3 wing
       vec2(-0.2, -0.08),
       vec2(-0.44, -0.21),
       vec2(-0.5, 0.3),
       //right 4 wing
       vec2(0.11, 0.2),
       vec2(0, -0.3),
       vec2(0.5, 0.3),
       //left 4 wing
       vec2(-0.11, 0.2),
       vec2(0, -0.3),
       vec2(-0.5, 0.3),
       //right main 1
       vec2(0.05, 0.3),
       vec2(0, -0.3),
       vec2(0.1, 0.2),
       //left main 1
       vec2(-0.05, 0.3),
       vec2(0, -0.3),
       vec2(-0.1, 0.2),
       //main center
       vec2(0.048, 0.3),
       vec2(0, -0.3),
       vec2(-0.048, 0.3),
       //right ear
       vec2(0.1, 0.21),
       vec2(0.052, 0.31),
       vec2(0.08, 0.43),
       //left ear
       vec2(-0.1, 0.21),
       vec2(-0.052, 0.31),
       vec2(-0.08, 0.43),

         //stationary object
       //right side
       vec2(0, 0.6),
       vec2(0.15, 0.73),
       vec2(0.07, 0.72),

       //left side
       vec2(0, 0.6),
       vec2(-0.15, 0.73),
       vec2(-0.07, 0.72),

       //center right
       vec2(0, 0.69),
       vec2(0, 0.6),
       vec2(0.07, 0.72),

       //center left
       vec2(0, 0.69),
       vec2(0, 0.6),
       vec2(-0.07, 0.72),

       //center
       vec2(0, 0.8),
       vec2(-0.06, 0.62),
       vec2(0.06, 0.62),

       //point 1
       vec2(0.18, 0.74),
       vec2(0.16, 0.74),
       vec2(0.17, 0.755),
       //point 2
       vec2(0.18, 0.74),
       vec2(0.16, 0.74),
       vec2(0.17, 0.725),

       //point 3
       vec2(0.01, 0.82),
       vec2(-0.01, 0.82),
       vec2(0, 0.835),
       //point 4
       vec2(0.01, 0.82),
       vec2(-0.01, 0.82),
       vec2(0, 0.805),

       //point 5
       vec2(-0.18, 0.74),
       vec2(-0.16, 0.74),
       vec2(-0.17, 0.755),
       //point 6
       vec2(-0.18, 0.74),
       vec2(-0.16, 0.74),
       vec2(-0.17, 0.725),

       //right side
       vec2(0, 0.6),
       vec2(0.15, 0.73),
       vec2(0.07, 0.72),

       //left side
       vec2(0, 0.6),
       vec2(-0.15, 0.73),
       vec2(-0.07, 0.72),

       //center right
       vec2(0, 0.69),
       vec2(0, 0.6),
       vec2(0.07, 0.72),

       //center left
       vec2(0, 0.69),
       vec2(0, 0.6),
       vec2(-0.07, 0.72),

       //center
       vec2(0, 0.8),
       vec2(-0.06, 0.62),
       vec2(0.06, 0.62),

       //point 1
       vec2(0.18, 0.74),
       vec2(0.16, 0.74),
       vec2(0.17, 0.755),
       //point 2
       vec2(0.18, 0.74),
       vec2(0.16, 0.74),
       vec2(0.17, 0.725),

       //point 3
       vec2(0.01, 0.82),
       vec2(-0.01, 0.82),
       vec2(0, 0.835),
       //point 4
       vec2(0.01, 0.82),
       vec2(-0.01, 0.82),
       vec2(0, 0.805),

       //point 3
       vec2(-0.18, 0.74),
       vec2(-0.16, 0.74),
       vec2(-0.17, 0.755),
       //point 4
       vec2(-0.18, 0.74),
       vec2(-0.16, 0.74),
       vec2(-0.17, 0.725)

    ];
	 
	
	//HW470: Create colors for the core and outer parts
	// See HW specs for the number of colors needed
	for(var i=0; i < vertices.length; i++) {
        //console.log(vec2.length);
        if(i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5)
        {
            colors.push(vec3(0.6, 0.6, 0.9));
        }
        else if(i == 6 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11)
        {
            colors.push(vec3(0.5, 0.5, 0.7));
        }
        else if(i == 12 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17)
        {
            colors.push(vec3(0.4, 0.4, 0.5));
        }
        else if(i == 18 || i == 19 || i == 20 || i == 21 || i == 22 || i == 23)
        {
            colors.push(vec3(0.3, 0.3, 0.3));
        }
        else if(i == 24 || i == 25 || i == 26 || i == 27 || i == 28 || i == 29)
        {
            colors.push(vec3(0.2, 0.2, 0.2));
        }
        else if(i == 30 || i == 31 || i == 32 )
        {
            colors.push(vec3(0.1, 0.1, 0.1));
        }
        else if( i == 33 || i == 34 || i == 35 || i == 36 || i == 37 || i == 38)
        {
            colors.push(vec3(1.0, 1.0, 0.2));
        }
        else if( i == 66 || i == 67 || i == 68 || i == 69 || i == 70 || i == 71 || i == 72 || i == 73 || i == 74 || i == 75 || i == 76 || i == 77
            ||i == 78 || i == 79 ||i == 80 || i == 81 || i == 82 || i == 83 || i == 84 || i == 85 || i == 86 )
        {
            colors.push(vec3(0.0, 0.7, 0.0));
        }
        else
        {
            colors.push(vec3(1.0, 0.0, 0.0));
            console.log(i);

        }

       
    };
        

	
	// HW470: Print the input vertices and colors to the console
	console.log("Input vertices and colors:");
	 
	 

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	// Background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Define shaders to use  
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
	//
	// color buffer: create, bind, and load
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	// Associate shader variable for  r,g,b color
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // vertex buffer: create, bind, load
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables for x,y vertices	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
	//HW470: associate shader explode variable ("Loc" variables defined here) 
    thetaLoc = gl.getUniformLocation( program, "theta" );

    console.log("Data loaded to GPU -- Now call render");


    render();
};


// =============== function render ======================

function render()
{
    // clear the screen 
    gl.clear( gl.COLOR_BUFFER_BIT );
	
    //HW470: send uniform(s) to vertex shader

    printSineAndCosineForAnAngle(theta);

    console.log(s);
    if(s > 0.06)
    {
        direction = false;
        
    }
    else if(s < 0)
    {
        direction = true;
       
    }


    theta += (direction ? 0.01 : -0.01);

    //console.log(Math.sin(theta)); 

    gl.uniform1f(thetaLoc, theta);
	
	//HW470: draw the object
	// You will need to change this to create the twisting outer parts effect
    // Hint: you will need more than one draw function call


    gl.drawArrays( gl.TRIANGLES, 0, 39);

    gl.uniform1f(thetaLoc, 0.0);
    gl.drawArrays( gl.TRIANGLES, 72, 33);


	//re-render after delay
	setTimeout(function (){requestAnimFrame(render);}, delay);
}

function printSineAndCosineForAnAngle(angleInDegrees) {
    var angleInRadians = angleInDegrees * Math.PI / 180;
    s = Math.sin(angleInRadians);
    c = Math.cos(angleInRadians);
    console.log("s = " + s + " c = " + c);

    return s;
  }
