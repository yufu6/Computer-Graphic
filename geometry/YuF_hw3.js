

var canvas;
var gl;
var program;

var numTimesToSubdivide = 4;
 
var index = 0;

var pointsArray = [];
//var normalsArray = [];

var near = -10;
var far = 10;

//init eye on z-axis
var radius = 1.5;
var theta  = 0.0;
var phi    = Math.PI / 2.0;
var dr = 10.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;


// initialize for sphere created by repeated subdivision of tetrahedron
//var va = vec3(0.0, 0.0, -1.0);
//var vb = vec3(0.0, 0.942809, 0.333333);
//var vc = vec3(-0.816497, -0.471405, 0.333333);
//var vd = vec3(0.816497, -0.471405, 0.333333);
    
// light position in eye coordinates
var lightPosition = vec4(1.0, 0.0, 0.0, 1.0 );
//var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );

//var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0 );
//var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );

//var lightDiffuse = vec4( 0.0, 0.0, 0.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

//var lightSpecular = vec4(  0.0, 0.0, 0.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

//var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
//var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
//var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
//var materialShininess = 100.0;

// silver (and set shini to 1000
var material1Ambient = vec4( 0.19225,0.19225,0.19225, 1.0 );
var material1Diffuse = vec4( 0.5754, 0.5754, 0.5754, 1.0 );
var material1Specular = vec4( 0.0508273, 0.0508273, 0.0508273, 1.0 );
var material1Shininess = 1000.0;

//set material silver as default
materialAmbient = material1Ambient;
materialDiffuse = material1Diffuse;
materialSpecular = material1Specular;
materialShininess = material1Shininess;

// red material; try changing light color
/*var material2Ambient = vec4( 1.0, 0.0, 0.0, 1.0 );
var material2Diffuse = vec4( 1.0, 0.0, 0.0, 1.0 );
var material2Specular = vec4( 1.0, 0.0, 0.0, 1.0 );
var material2Shininess = 1.0;
*/

//material 2: pearl
var material2Ambient = vec4( 0.25, 0.20725, 0.20725, 1.0 );
var material2Diffuse = vec4( 1, 0.829 , 0.829, 1.0 );
var material2Specular = vec4( 0.296648, 0.296648, 0.296648, 1.0 );
var material2Shininess = 0.088;
//var materialAmbient = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialDiffuse = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialSpecular = vec4( 1.0, 0.0, 0.0, 1.0 );
//var materialShininess = 1.0;

//material 3: turquoise
var material3Ambient = vec4( 0.1, 0.18725, 0.1745, 1.0 );
var material3Diffuse = vec4( 0.396, 0.74141, 0.69102, 1.0 );
var material3Specular = vec4( 0.297254, 0.30829, 0.306678, 1.0 );
var material3Shininess = 0.1;
var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;


//var at = vec3(0.0, 0.0, 0.0);
//var up = vec3(0.0, 1.0, 0.0);
var fov = 60;
var numVertices = 936;
var pointInx = 299;
var rotate = false;

var draw_cylinder = true;

function triangle(a, b, c) {

     normalsArray.push(a);
     normalsArray.push(b);
     normalsArray.push(c);
	 // play: create an incorrect normal vector to see what happens
	 //normalsArray.push(c + Math.random());
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     index += 3;
}


var perspProj = 
 {
     //start from 60
	fov: 60,
	aspect: 1,
	near: 0.1,
	far:  10
 }

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
		// normalize 3d vector
        ab = normalize(ab, false);
        ac = normalize(ac, false);
        bc = normalize(bc, false);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
	// comment out next line to create an open object
    //divideTriangle(a, c, d, n);
}

// mouse interaction
 
var mouse =
{
    prevX: 0,
    prevY: 0,

    leftDown: false,
    rightDown: false,
};

var viewer = 
{
	eye: vec3(0.0, 0.0, 3.0),
	at:  vec3(0.0, 0.0, 0.0),  
	up:  vec3(0.0, 1.0, 0.0),
	
	// for moving around object; set vals so at origin
	radius: null,
    theta: 0,
    phi: 0
};

window.onload = function init() {
   
    var messageLookEye = document.getElementById( "lookEye" );
    var messageLookAt  = document.getElementById( "lookAt" );
    var messageLookUp  = document.getElementById( "lookUp" );
     
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    // Change the background color to a color other than white
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    
	
    gl.enable(gl.DEPTH_TEST);
	
	// play with turning culling on/off (sphere is open)
	//gl.enable(gl.CULL_FACE);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    console.log(materialAmbient);
    console.log(materialDiffuse);
    console.log(materialSpecular);
    console.log(materialShininess);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	console.log("Ambient products = ",ambientProduct);
	console.log("Diffuse products = ",diffuseProduct);
    console.log("Specular products = ",specularProduct);
    
    //set resolution to 6 side cylinder
    geometry(resolution = 13);
    // init radius of sphere to move around object
    var diff = subtract(viewer.eye,viewer.at);
    viewer.radius = length(diff);

	// create sphere
    //tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    //console.log("computed sphere  index = ",index);

	// load the light
	pointsArray.push(lightPosition[0]);
	pointsArray.push(lightPosition[1]);
	pointsArray.push(lightPosition[2]);
	// not used, but size should match points
	normalsArray.push(1.0);
	normalsArray.push(0.0);
	normalsArray.push(0.0);
    
    // init radius of sphere to move around object
	var diff = subtract(viewer.eye,viewer.at);
	viewer.radius = length(diff);
	
	console.log("init radius = ",viewer.radius);
	console.log("viewer eye =",viewer.eye);
	console.log("viewer at =",viewer.at);
	console.log("viewer up =",viewer.up);
	console.log("perspective fov = ",perspProj.fov);
	console.log("perspective fov = ",perspProj.aspect);
	console.log("perspective fov = ",perspProj.near);
	console.log("perspective fov = ",perspProj.far);
	
	
	messageLookEye.innerHTML = "eye = " + formatOut(viewer.eye[0],2) + ",  " + formatOut(viewer.eye[1],2)  + ",  " + formatOut(viewer.eye[2],2);
	messageLookAt.innerHTML = "at = " + viewer.at;
	messageLookUp.innerHTML = "up = " +viewer.up;
    
            
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	console.log("vNormal = ",vNormal);
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrix = lookAt(viewer.eye, viewer.at , viewer.up);
	projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

     // SOR button
	document.getElementById("Cylinder").onclick = function(){
        draw_cylinder = true;
    }
    document.getElementById("Hat").onclick = function(){
        console.log("sor 2 choose");
        draw_cylinder = false;
    }

    //Resolurtion change button
    document.getElementById('high').onclick = function(){
        resolution = 50;
        geometry(resolution);
        numVertices = 14700;
        pointInx = 3200;
        //recereate buffur for new resolution
        var iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    
        var nBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
        
        var vNormal = gl.getAttribLocation( program, "vNormal" );
        console.log("vNormal = ",vNormal);
        gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal);
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        
        var vPosition = gl.getAttribLocation( program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        
        console.log('in high resolurtion');
    }
    document.getElementById('low').onclick = function(){
        resolution = 13;
        geometry(resolution);
        
        numVertices = 936;
        pointInx = 299;
        //recereate buffur for new resolution
        var iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    
        var nBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
        
        var vNormal = gl.getAttribLocation( program, "vNormal" );
        console.log("vNormal = ",vNormal);
        gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal);
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        
        var vPosition = gl.getAttribLocation( program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        
        console.log('in low resolurtion');
    }

    //material change button
    document.getElementById("silver").onclick = function(){
        console.log("silver choose");
        
        materialAmbient = material1Ambient;
        materialDiffuse = material1Diffuse;
        materialSpecular = material1Specular;
        materialShininess = material1Shininess;

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv( gl.getUniformLocation(program, 
            "ambientProduct"),flatten(ambientProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "diffuseProduct"),flatten(diffuseProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "specularProduct"),flatten(specularProduct) );	
         gl.uniform4fv( gl.getUniformLocation(program, 
            "lightPosition"),flatten(lightPosition) );
         gl.uniform1f( gl.getUniformLocation(program, 
            "shininess"),materialShininess ); 


        console.log(materialAmbient);
        console.log(materialDiffuse);
        console.log(materialSpecular);
        console.log(materialShininess);
    }

    document.getElementById("pearl").onclick = function(){
        console.log("pearl choose");
        
        materialAmbient = material2Ambient;
        materialDiffuse = material2Diffuse;
        materialSpecular = material2Specular;
        materialShininess = material2Shininess;

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv( gl.getUniformLocation(program, 
            "ambientProduct"),flatten(ambientProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "diffuseProduct"),flatten(diffuseProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "specularProduct"),flatten(specularProduct) );	
         gl.uniform4fv( gl.getUniformLocation(program, 
            "lightPosition"),flatten(lightPosition) );
         gl.uniform1f( gl.getUniformLocation(program, 
            "shininess"),materialShininess ); 
            
        
        console.log(materialAmbient);
        console.log(materialDiffuse);
        console.log(materialSpecular);
        console.log(materialShininess);

    }

    document.getElementById("turquoise").onclick = function(){
        console.log("turquoise choose");
        
        materialAmbient = material3Ambient;
        materialDiffuse = material3Diffuse;
        materialSpecular = material3Specular;
        materialShininess = material3Shininess;

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv( gl.getUniformLocation(program, 
            "ambientProduct"),flatten(ambientProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "diffuseProduct"),flatten(diffuseProduct) );
         gl.uniform4fv( gl.getUniformLocation(program, 
            "specularProduct"),flatten(specularProduct) );	
         gl.uniform4fv( gl.getUniformLocation(program, 
            "lightPosition"),flatten(lightPosition) );
         gl.uniform1f( gl.getUniformLocation(program, 
            "shininess"),materialShininess ); 
            
        
        console.log(materialAmbient);
        console.log(materialDiffuse);
        console.log(materialSpecular);
        console.log(materialShininess);

    }
    //rotation change
    document.getElementById("rotate").onclick = function(){
        rotate = true;
    }

    document.getElementById("fixed").onclick = function(){
        rotate = false;
    }

    //fov change
    document.getElementById("fovSlider").onchange = function(){
        degree = event.srcElement.value;
        console.log(degree);
        perspProj.fov = degree;
        projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);
    };

    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess ); 
	   
	console.log("light position = ",lightPosition);

   
// ========================== Camera control via mouse ============================================
	// There are 4 event listeners: onmouse down, up, leave, move
	//
	// on onmousedown event
	// check if left/right button not already down
	// if just pressed, flag event with mouse.leftdown/rightdown and stores current mouse location
    document.getElementById("gl-canvas").onmousedown = function (event)
    {
        if(event.button == 0 && !mouse.leftDown)
        {
            mouse.leftDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
        else if (event.button == 2 && !mouse.rightDown)
        {
            mouse.rightDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
    };

	// onmouseup event
	// set flag for left or right mouse button to indicate that mouse is now up
    document.getElementById("gl-canvas").onmouseup = function (event)
    {
        // Mouse is now up
        if (event.button == 0)
        {
            mouse.leftDown = false;
        }
        else if(event.button == 2)
        {
            mouse.rightDown = false;
        }

    };

	// onmouseleave event
	// if mouse leaves canvas, then set flags to indicate that mouse button no longer down.
	// This might not actually be the case, but it keeps input from the mouse when outside of app
	// from being recorded/used.
	// (When re-entering canvas, must re-click mouse button.)
    document.getElementById("gl-canvas").onmouseleave = function ()
    {
        // Mouse is now up
        mouse.leftDown = false;
        mouse.rightDown = false;
    };

	// onmousemove event
	// Move the camera based on mouse movement.
	// Record the change in the mouse location
	// If left mouse down, move the eye around the object based on this change
	// If right mouse down, move the eye closer/farther to zoom
	// If changes to eye made, then update modelview matrix

    document.getElementById("gl-canvas").onmousemove = function (event)
    {
		// only record changes if mouse button down
		if (mouse.leftDown || mouse.rightDown) {
			
			// Get changes in x and y at this point in time
			var currentX = event.clientX;
			var currentY = event.clientY;
			
			// calculate change since last record
			var deltaX = event.clientX - mouse.prevX;
			var deltaY = event.clientY - mouse.prevY;
			
			console.log("enter onmousemove with left/right button down");
			console.log("viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
			console.log("event clientX = ",currentX,"  clientY = ",currentY);
			console.log("mouse.prevX = ",mouse.prevX,"  prevY = ",mouse.prevY);
			console.log("change in mouse location deltaX = ",deltaX,"  deltaY = ",deltaY);

			// Compute camera rotation on left click and drag
			if (mouse.leftDown)
			{
				console.log("onmousemove and leftDown is true");
				console.log("theta=",viewer.theta,"  phi=",viewer.phi);
				
				// Perform rotation of the camera
				//
				if (viewer.up[1] > 0)
				{
					viewer.theta -= 0.01 * deltaX;
					viewer.phi -= 0.01 * deltaY;
				}
				else
				{
					viewer.theta += 0.01 * deltaX;
					viewer.phi -= 0.01 * deltaY;
				}
				console.log("incremented theta=",viewer.theta,"  phi=",viewer.phi);
				
				// Wrap the angles
				var twoPi = 6.28318530718;
				if (viewer.theta > twoPi)
				{
					viewer.theta -= twoPi;
				}
				else if (viewer.theta < 0)
				{
					viewer.theta += twoPi;
				}

				if (viewer.phi > twoPi)
				{
					viewer.phi -= twoPi;
				}
				else if (viewer.phi < 0)
				{
					viewer.phi += twoPi;
				}
				console.log("wrapped  theta=",viewer.theta,"  phi=",viewer.phi);

			} // end mouse.leftdown
			else if(mouse.rightDown)
			{
				console.log("onmousemove and rightDown is true");
				
				// Perform zooming; don't get too close           
				viewer.radius -= 0.01 * deltaX;
				viewer.radius = Math.max(0.1, viewer.radius);
			}
			
			//console.log("onmousemove make changes to viewer");
			
			// Recompute eye and up for camera
			var threePiOver2 = 4.71238898;
			var piOver2 = 1.57079632679;		
			var pi = 3.14159265359;
			
			//console.log("viewer.radius = ",viewer.radius);
			
			// pre-compute this value
			var r = viewer.radius * Math.sin(viewer.phi + piOver2);
			
			// eye on sphere with north pole at (0,1,0)
			// assume user init theta = phi = 0, so initialize to pi/2 for "better" view
			
			viewer.eye = vec3(r * Math.cos(viewer.theta + piOver2), viewer.radius * Math.cos(viewer.phi + piOver2), r * Math.sin(viewer.theta + piOver2));
			
			//add vector (at - origin) to move 
			for(k=0; k<3; k++)
				viewer.eye[k] = viewer.eye[k] + viewer.at[k];
			
			//console.log("theta=",viewer.theta,"  phi=",viewer.phi);
			//console.log("eye = ",viewer.eye[0],viewer.eye[1],viewer.eye[2]);
			//console.log("at = ",viewer.at[0],viewer.at[1],viewer.at[2]);
			//console.log(" ");
			
			// modify the up vector
			// flip the up vector to maintain line of sight cross product up to be to the right
			// true angle is phi + pi/2, so condition is if angle < 0 or > pi
			
			if (viewer.phi < piOver2 || viewer.phi > threePiOver2) {
				viewer.up = vec3(0.0, 1.0, 0.0);
			}
			else {
				viewer.up = vec3(0.0, -1.0, 0.0);
			}
			//console.log("up = ",viewer.up[0],viewer.up[1],viewer.up[2]);
			//console.log("update viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
			
			// Recompute the view
			modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
			
			console.log("modelViewMatrix = ",modelViewMatrix);
			 

			mouse.prevX = currentX;
			mouse.prevY = currentY;
			
			messageLookEye.innerHTML = "eye = " + formatOut(viewer.eye[0],2) + ",  " + formatOut(viewer.eye[1],2)  + ",  " + formatOut(viewer.eye[2],2);
			messageLookAt.innerHTML = "at = " + viewer.at;
			messageLookUp.innerHTML = "up = " +viewer.up;
			
			console.log("onmousemove: made change");
			console.log("viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
		
		} // end if button down

    };

   

    render();
}


function render() {
    
    

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
    //radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    //modelViewMatrix = lookAt(eye, at , up);
    //projectionMatrix = ortho(left, right, bottom, ytop, near, far);
            
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
          
    //rotate light
    if(rotate == false)
    {
        //do nothing
    }
 
    if (rotate == true && lightPosition[0] >= -0.9999 ) {
        //console.log('rotate');

        if((-0.00001 <= lightPosition[2] &&lightPosition[2] <= 1) )
        {
            if((0 <= lightPosition[0] &&lightPosition[0] <= 1))
            {
                console.log('from right to font')
                lightPosition[0] -= 0.01;
                lightPosition[2] += 0.01;
                console.log(lightPosition);
            }
            if((-1 <= lightPosition[0] &&lightPosition[0] < 0.0001))
            {
                console.log('from font to left')
                lightPosition[0] -= 0.01;
                lightPosition[2] -= 0.01;
                console.log(lightPosition);
            }
            else
            {
                console.log('left to right wrong');
            }
        }
       
    }
    if (rotate == true && lightPosition[0] >= -1.001)
    {
        console.log('a')
        if(-1.001 <= lightPosition[2] &&lightPosition[2] <= 0)
        {
            if((-1.001 <= lightPosition[0] &&lightPosition[0] < 0.00001))
            {
                console.log('from left to back')
                lightPosition[0] += 0.01;
                lightPosition[2] -= 0.01;
                console.log(lightPosition);
            }
            if((-0.0001 <= lightPosition[0] &&lightPosition[0] < 1))
            {
                console.log('from back to right')
                lightPosition[0] += 0.01;
                lightPosition[2] += 0.01;
                console.log(lightPosition);
            }
            else
            {
                console.log('left to right wrong');
            }
        }
    }


    /*   
    //console.log(lightPosition);
    console.log('lp',lightPosition[0]);
    console.log('lp',lightPosition[1]);
    console.log('lp',lightPosition[2]);
    console.log('lp',lightPosition[3]);
*/
    
    gl.uniform4fv( gl.getUniformLocation(program, 
        "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
        "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
        "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
        "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
        "shininess"),materialShininess );        

    if(draw_cylinder == true)
    {

        //console.log("draw sor 1");
        gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_SHORT, 0 );

    }
    else if( draw_cylinder == false )
    {
        //console.log("draw sor 2");
        //console.log(numVertices)
        //from the second vectex number draw
        gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_SHORT, 2*numVertices );
    }

    gl.uniform1i(gl.getUniformLocation(program,"colorFlag"), 1);

    //make light object visible
    
     // draw the light -- not hooked up to shader -- see "shadedSphereLight" program
    gl.uniform1i( gl.getUniformLocation(program, "colorFlag"),0 );
     // gl.drawArrays( gl.POINTS, 0, 1);
    //make light visible
    //gl.drawArrays( gl.POINTS,(0.4,1,18), 1);
    gl.drawArrays( gl.POINTS, pointInx, 1);

    window.requestAnimFrame(render);

     /*
    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );
	 
	// draw the light -- not hooked up to shader -- see "shadedSphereLight" program
	gl.uniform1i( gl.getUniformLocation(program, "colorFlag"),0 );
	gl.drawArrays( gl.POINTS, index, 1);

    window.requestAnimFrame(render);
    */
}

// input is the number to format
// decimals is the number of decimals to print
function formatOut (input, decimals) {
    return Math.floor(input * Math.pow(10, decimals)) / Math.pow(10, decimals) }
  
  