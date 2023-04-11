
var canvas;
var gl;
var program;
var program2;

var projectionMatrix; 
var modelViewMatrix;
var perspectiveMatrix;
var normalMatrix;
var instanceMatrix;

var modelViewMatrixLoc;
var colorLoc;

var projectionMatrix2; 
var modelViewMatrix2;

var planeNumVertices  = 36;

var planepointsArray = [];
var planecolorsArray = [];


var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


var torsoId = 0;
var headId  = 1;
//var head1Id = 1;
//var head2Id = 10;
var leftEyeIdId = 2;
//var leftLowerArmId = 3;
var rightEyeId = 4;
//var rightLowerArmId = 5;
var leftLegId = 6;
var leftFeetId = 7;
var rightlegId = 8;
var rightFeetId = 9;
var mouthId = 3;
var tailId = 5;

//var upperArmHeight = 0.5;
//var lowerArmHeight = 0.0;
//var upperArmWidth  = 0.5;
//var lowerArmWidth  = 0.0;

//body
var torsoHeight = 3.0;
var torsoWidth = 4.0;

//eyes
var eyeHeight = 0.5;
var eyeWidth = 0.5;

//leg
var legWidth  = 0.5;
var legHeight = 1.5;

//feet
var lowerLegWidth  = 0.5;
var lowerLegHeight = 1.0;

//head
var headHeight = 2.5;
var headWidth = 2.5;

//mouth
var mouthHeight = 0.3;
var mouthWeight = 1.0;

//tail
var tailHeight = 1.0;
var tailWidth = 1.0;

var torsoColor = vec4(1.0, 0.6, 0.0, 1.0);
var headColor = vec4(1.0, 0.8, 0.0, 1.0);
//black eye
var eyeColor = vec4(0.2, 0.2, 0.2, 1.0);
var lowerArmColor = vec4(0.0, 0.0, 1.0, 1.0);
var upperLegColor = vec4(0.4, 0.3, 0.0, 1.0);
var lowerLegColor = vec4(0.2, 0.2, 0.0, 1.0); 
var mouthColor = vec4(0.5, 0.2, 0.1, 1.0);
var tailColor = vec4(1.0, 0.8, 0.0, 1.0); 

var numNodes = 10;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 230, 0, 130, 0, 0];

var numVertices = 24;
var planenumVertices = 6;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//for texture
var texSize = 256;
var numChecks = 8;
var colorsArray = [];

var image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var x = Math.cos(i);
            if(x < 0) c = 255;
            else c = 0;

            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c;
            image1[4*i*texSize+4*j+2] = c;
            image1[4*i*texSize+4*j+3] = 255;
            //console.log(c);
        }
    }

var image2 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            
            image2[4*i*texSize+4*j] = 255-j;
            image2[4*i*texSize+4*j+1] = 255-j;
            image2[4*i*texSize+4*j+2] = 255-j;
            image2[4*i*texSize+4*j+3] = 255;
           }
    }

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];    

//for ground plane
var modelViewMatrixLoc2, projectionMatrixLoc2;
var planeLoc = translate(0, -2, 0);
var planeScla = scale4(17, 1.0, 17)
var planeArray = []
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


//for lookAt function
//var eye = vec3(1, 10, 20);
//var at = vec3(0, 0, 0);
//var up = vec3(0, 1, 0);
var eye = vec3(20, 5, 1);
var at = vec3(0.0, 0.0, 0.1);
var up = vec3(0.0, 1.0, 0.0);

//for perspective
var perspProj = 
 {
   fov: 60,
   aspect: 1,
   near: 0.1,
   far:  30
}
//for animation
//set animation at first
var aniamte = true;

//for moveing around
var movex = 0;
var movey = 0;
var movez = 1;
var zmovelock = false;
var ymovelock = true;

//for Phong illumination 
var lightPosition = vec4(3.0, 0.0, 0.0, 1.0 );
var lightAmbient = vec4(1.0, 0.7, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;
var normalsArray = [];


//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}



function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    
    //make it move 
    //control y and z
    //m = translate(movex,movey,movez);
    //first one is up down; second one is left right twise; thired is l-r shaking
    //m = mult(m, rotate(theta[torsoId], 1, 1, 1 ));
    //m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    m = rotate(theta[torsoId], 0, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );

    break;

    case headId: 
    //case head1Id: 
    //case head2Id:
    

	//DCH Comment: I think there is an error in the head
	// I have commented out the code that is not needed. We want the head to rotate about a point in base, not center
	
    //m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
    //move head lower
    //control the location of head.. maybe can used on torso to make it move
	m = translate(0.0, torsoHeight, 2.5);
	m = mult(m, rotate(theta[headId], 1, 0, 0))
	//m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    //m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftEyeIdId, null);
    break;

    //left eye
    case leftEyeIdId:
    
    m = translate(-(torsoWidth+eyeWidth)*0.13, 1.25*torsoHeight, 3.7);
	m = mult(m, rotate(theta[leftEyeIdId], 1, 0, 0));
    figure[leftEyeIdId] = createNode( m, leftEye, rightEyeId, null );
    break;

    //right eye
    case rightEyeId:
    
    m = translate((torsoWidth+eyeWidth)*0.13, 1.25*torsoHeight, 3.7);
	m = mult(m, rotate(theta[rightEyeId], 1, 0, 0));
    figure[rightEyeId] = createNode( m, rightEye, mouthId, null );
    break;
    
    //mouth
    case mouthId:
    
    m = translate(0.0, 1.1*torsoHeight, 4.3);
    m = mult(m, rotate(theta[mouthId], 1, 0, 0));
    figure[mouthId] = createNode( m, mouth, tailId, null );
    break;

    case tailId:
    
    m = translate(0.0, 1.0*torsoHeight, -2.5);
    m = mult(m, rotate(theta[tailId], 1, 0, 0));
    figure[tailId] = createNode( m, tail, leftLegId, null );
    break;


    //left leg
    case leftLegId:
    
    m = translate(-(torsoWidth+legWidth)*0.25, 0.1*legHeight, 0.0);
	m = mult(m , rotate(theta[leftLegId], 1, 0, 0));
    figure[leftLegId] = createNode( m, leftLeg, rightlegId, leftFeetId );
    break;

    //right leg
    case rightlegId:
    
    m = translate((torsoWidth+legWidth)*0.25, 0.1*legHeight, 0.0);
	m = mult(m, rotate(theta[rightlegId], 1, 0, 0));
    figure[rightlegId] = createNode( m, rightLeg, null, rightFeetId );
    break;
    
    /*
    case leftLowerArmId:

    m = translate(0.0, eyeHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;
    
    case rightLowerArmId:

    m = translate(0.0, eyeHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;
    */
   //left feet
    case leftFeetId:

    m = translate(0.0, legHeight, 0.0);
    m = mult(m, rotate(-90, 1, 0, 0));
    figure[leftFeetId] = createNode( m, leftFeet, null, null );
    break;
    
    //right feet
    case rightFeetId:

    m = translate(0.0, legHeight, 0.0);
    m = mult(m, rotate(-90, 1, 0, 0));
    figure[rightFeetId] = createNode( m, rightFeet, null, null );
    break;
    
    }

}

function traverse(Id) {
   
    if(Id == null) return; 
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if(figure[Id].child != null) traverse(figure[Id].child); 
     modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
 }

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(torsoColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(headColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function mouth() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * mouthHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(mouthWeight, mouthHeight, mouthWeight) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(mouthColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(tailColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftEye() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(eyeColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

/*
function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
*/
function rightEye() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * eyeHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(eyeWidth, eyeHeight, eyeWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(eyeColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
/*
function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerArmColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
*/
function  leftLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * legHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFeet() {
    
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * legHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(legWidth, legHeight, legWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(upperLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFeet() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.uniform4fv(colorLoc, flatten(lowerLegColor) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
/*
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     pointsArray.push(vertices[b]); 
     pointsArray.push(vertices[c]);     
     pointsArray.push(vertices[d]);    
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}
*/
//for texture
function quad1(a, b, c, d) {
    
    normalsArray.push(a);
    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]); 
    texCoordsArray.push(texCoord[0]);
    
    normalsArray.push(b);
    pointsArray.push(vertices[b]); 
    colorsArray.push(vertexColors[b]);
    texCoordsArray.push(texCoord[1]); 
    
    normalsArray.push(c);
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[c]);
    texCoordsArray.push(texCoord[2]); 

    normalsArray.push(d);
    pointsArray.push(vertices[d]); 
    colorsArray.push(vertexColors[d]);
    texCoordsArray.push(texCoord[3]);    
    
}

function colorCube()
{
   quad1( 1, 0, 3, 2 );
   quad1( 2, 3, 7, 6 );
   quad1( 3, 0, 4, 7 );
   quad1( 6, 5, 1, 2 );
   quad1( 4, 5, 6, 7 );
   quad1( 5, 4, 0, 1 );
  
}
function colorPlaneCube()
{
    planequad( 1, 0, 3, 2 );
    planequad( 2, 3, 7, 6 );
    planequad( 3, 0, 4, 7 );
    planequad( 6, 5, 1, 2 );
    planequad( 4, 5, 6, 7 );
    planequad( 5, 4, 0, 1 );
}

function planequad(a, b, c, d){
    normalsArray.push(a);
    normalsArray.push(b);
    normalsArray.push(c);
    normalsArray.push(d);

    planeArray.push(vertices[a]);
    planeArray.push(vertices[b]);
    planeArray.push(vertices[c]);
    planeArray.push(vertices[d]);
}


//texture
function configureTexture() {
    texture1 = gl.createTexture();       
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    //color sky
    gl.clearColor( 0.5, 0.7, 1.0, 1.0 );
	
	gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram(program);

    colorPlaneCube();
    colorCube();   

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	console.log("Ambient products = ",ambientProduct);
	console.log("Diffuse products = ",diffuseProduct);
	console.log("Specular products = ",specularProduct);
    
    gl.uniform4fv( gl.getUniformLocation(program, 
        "ambientProduct"),flatten(lightAmbient) );
     gl.uniform4fv( gl.getUniformLocation(program, 
        "diffuseProduct"),flatten(lightDiffuse) );
     gl.uniform4fv( gl.getUniformLocation(program, 
        "specularProduct"),flatten(lightSpecular) );	
     gl.uniform4fv( gl.getUniformLocation(program, 
        "lightPosition"),flatten(lightPosition) );
     gl.uniform1f( gl.getUniformLocation(program, 
        "shininess"),materialShininess ); 
        
     
        
     //console.log("light position = ",lightPosition);
    //load the light 
	pointsArray.push(lightPosition[0]);
	pointsArray.push(lightPosition[1]);
    pointsArray.push(lightPosition[2]);
    
    for(i=0; i<numNodes; i++) initNodes(i);


        
    
    //for matrix define lookat and perspectivedefine
    modelViewMatrix  = lookAt(eye, at, up);
    
    //instanceMatrix = mat4();
    //modelViewMatrix = mat4();

    //use perspective
    //projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);

    perspectiveMatrix = lookAt(eye, at, up);

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "perspectiveMatrix"), false, flatten(perspectiveMatrix));

    	
	colorLoc = gl.getUniformLocation(program, "fcolor");
	//gl.uniform4fv(colorLoc, flatten(torsoColor) );
    

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
            
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeArray), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(planecolorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    //buffrt for shape shader
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(planepointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //var tBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture();
  
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);


    //click animation for on/off
    document.getElementById("animation").onclick = function()
    {
        aniamte = !aniamte;
        console.log('animation change');
    };
    
    
    
    render();   

    
}

var legmoveDir = true;

//leg walk function
//control reverse for alternating walking
function moveleg(legmoveDir){

    if(legmoveDir == true){
    theta[leftLegId] += 1;
    //use initNotes in render function avoid lots of initNode here
    //initNodes(leftLegId);
    theta[rightlegId] -= 1;
    //initNodes(rightlegId);
    theta[tailId] -= 0.3;
    theta[torsoId] += 0.15;
    //movex += 0.1;
   
    if(movez >= 3 || movez <= -1)
    {
        ymovelock = false
        zmovelock = true;
        if(zmovelock == true)
        {
            movez;
            //console.log("1");
        }
        if(ymovelock == false)
        {
            movey += 0.05;
            //console.log("2");

        }
        //console.log("0");
    }
    if(movey <= -3 || movey >= 3.05)
    {
        ymovelock = true
        zmovelock = false;
        if(zmovelock == false)
        {
            movez -= 0.03;
            //console.log("3");
        }
        if(ymovelock == true)
        {
            movey;
            //console.log("4");
        }
        //console.log("01");
    }
    //console.log("moveaa");
    //console.log(theta[leftLegId]);
    }
    else
    {
    theta[leftLegId] -= 1;
    //initNodes(leftLegId);
    theta[rightlegId] += 1;
    //initNodes(rightlegId);
    theta[tailId] += 0.3;
    theta[torsoId] -= 0.15;
    //movex -= 0.1;
    //movey -= 0.05;
    
    if(movez >= 3 || movez <= -1)
    {
        ymovelock = false
        zmovelock = true;
        if(zmovelock == true)
        {
            movez;
            //console.log("5");
        }
        if(ymovelock == false)
        {
            movey -= 0.05;
            //console.log("6");
        }
        //console.log("00");
    }
    if(movey <= -3 || movey >= 3.05)
    {
        ymovelock = true
        zmovelock = false;
        if(zmovelock == false)
        {
            movez += 0.03;
            console.log("7");
        }
        if(ymovelock == true)
        {
            movey;
            console.log("8");
        }
        console.log("000");
    }
   
    //console.log(movey);

    //console.log(theta[leftLegId]);
    }
    //console.log("movebb");
    //console.log('z:' + movez);
    //console.log('y: ' + movey);

}

function movezneg(){
    movez -= 0.07;
}

function movezpos(){
    movez += 0.07;
}

var walk = 0;
var walkMatrix;
var render = function() {

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        traverse(torsoId);

        //for plane
        modelViewMatrix2  = lookAt(eye, at, up);
        modelViewMatrixLoc2 = gl.getUniformLocation(program, "modelViewMatrix2");
        
        modelViewMatrixLoc2 = mult(planeLoc, planeScla);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrixLoc2));

        //for avatar
        for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    

        if(aniamte == true)
        {
            walk -= 0.3;
            console.log(walk);
            //leg walk
            if(theta[leftLegId] == 150 || theta[leftLegId] == 230)
            {
                legmoveDir = !legmoveDir;
               
            }
            moveleg(legmoveDir);
        
            //console.log(theta[leftEyeIdId]);
            //console.log(theta[rightEyeId]);
            //console.log(theta[leftLegId]);
            //console.log(theta[rightlegId]);

        }
        else if(aniamte == false)
        {
            //do nothing just stop
            //console.log('animation is off');
            
        }

        walkMatrix = rotate(walk, 0, 1, 0);
        modelViewMatrix = mult(walkMatrix, translate(torsoHeight, 0.0, 0.0));
        

        for(i=0; i<numNodes; i++) initNodes(i);


        requestAnimFrame(render);
}

/* cause mess...
var plane = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    
    gl.drawArrays( gl.TRIANGLES, 0, planeNumVertices );
	
	
    requestAnimFrame(plane);
}
*/