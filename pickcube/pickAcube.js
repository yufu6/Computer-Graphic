
var canvas;
var gl;

var NumVertices  = 36;

var cubeVertices = [];
var cubeColor = [];

var axis = 0;
var theta = 0;
var size = 0.2;

var thetaLoc;

var morigina, mvMatrix, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7, mvMatrix8, mvMatrix9;
var modelView;
var is2 = false, is3 = false, is4 = false, is5 = false, is6 = false, is7 = false, is8 = false, is9 = false;
var s = scalem(0.2,0.2,0.2);
var t = translate(-0.5,-0.5,0.0);


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    createCube();

	//var origin = vec4(0.0, 0.0, 0.0, 1.0);
	//cubeVertices.push(origin); 
    cubeColor.push(vertexColors[0]);
    

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //enable zBuffer
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeColor), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
  
    thetaLoc = gl.getUniformLocation(program, "theta"); 
    console.log(theta);
    modelView = gl.getUniformLocation( program, "modelView" );

	//mvMatrix = mat4();
	//mvMatrix3 = mat4();

    //speed
    //initial speed!
    theta = 0.2;
    document.getElementById("rotation").onchange = function() {
        degree = event.srcElement.value;
        console.log("speed = ",degree);
        theta = degree;
    };

    //scale
    //initial scale for scale use

    mvMatrix = mult(s,t);
    morigina = mult(s,t);
    //console.log(mvMatrix);

    //for location use
    mvMatrix2 = mult(translate(-0.75, 0.0, 0.0),mvMatrix);
    mvMatrix3 = mult(translate(0.75, 0.0, 0.0),mvMatrix);
    mvMatrix4 = mult(translate(0.0, 0.75, 0.5),mvMatrix);
    mvMatrix5 = mult(translate(0.0, -0.75, 0.5),mvMatrix);
    mvMatrix6 = mult(translate((0.75)/Math.sqrt(2), (0.75)/Math.sqrt(2), 0.5),mvMatrix);
    mvMatrix7 = mult(translate(-(0.75)/Math.sqrt(2), (0.75)/Math.sqrt(2), 0.5),mvMatrix);
    mvMatrix8 = mult(translate((0.75)/Math.sqrt(2), -(0.75)/Math.sqrt(2), 0.5),mvMatrix);
    mvMatrix9 = mult(translate(-(0.75)/Math.sqrt(2), -(0.75)/Math.sqrt(2), 0.5),mvMatrix);

    document.getElementById("scale").onchange = function(){
        size = event.srcElement.value;
        mvMatrix = mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value), translate(-0.5,-0.5,0.5));
        morigina = mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value), translate(-0.5,-0.5,0.5));
        mvMatrix2 = mult(translate(-0.75, 0.0, 0.0),mult( scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value), translate(-0.5,-0.5,0.5)));
        mvMatrix3 = mult(translate(0.75, 0.0, 0.0),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix4 = mult(translate(0.0, 0.75, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix5 = mult(translate(0.0, -0.75, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix6 = mult(translate(0.53033, 0.53033, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix7 = mult(translate(-0.53033, 0.53033, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix8 = mult(translate(0.53033, -0.53033, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));
        mvMatrix9 = mult(translate(-0.53033, -0.53033, 0.5),mult(scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value),translate(-0.5,-0.5,0.5)));

        s = scalem(event.srcElement.value, event.srcElement.value, event.srcElement.value);
        console.log("ModelView matrix =", mvMatrix); 
        console.log("ModelView matrix2 after =", mvMatrix2); 
        console.log("size is", size);

        };
        
    //reset the center cube
    document.getElementById("resetButton").onclick = function(){
        mvMatrix;
        is2 = false;
        is3 = false;
        is4 = false;
        is5 = false;
        is6 = false;
        is7 = false;
        is8 = false;
        is9 = false;    }

    //get mouse click element
    canvas.addEventListener("mousedown", function(){
					  
		  var screenx = event.clientX - canvas.offsetLeft;
		  var screeny = event.clientY - canvas.offsetTop;
		  
		  var posX = 2*screenx/canvas.width-1;
		  var posY = 2*(canvas.height-screeny)/canvas.height-1;
		  
          t1 = vec2(posX,posY);
        console.log("first point canvas x=",t1[0]);
        console.log("first point canvas y=",t1[1]);
      
        //decide which cube is on click by the axis around
        //[] = btm; top; left; right; up right; up left
        let condition1 = [size/2, size/2, -0.75 + +size/2, 0.75 + +size/2, 0.54+ +size/2, -0.54+ +size/2, 0.54+ +size/2,-0.54+ +size/2]
        let condition2 = [-size/2, -size/2,-0.75-size/2,0.75-size/2, 0.54-size/2, -0.54-size, 0.54-size/2, -0.54-size/2]
        let condition3 =  [-0.75 + +size/2, 0.75 + +size/2,size/2,size/2, 0.54 + +size/2,0.54+ +size/2, -0.54 + +size, -0.54 + +size/2]
        let condition4 =  [-0.75 - size/2, 0.75-size/2, -size, -size/2, 0.54-size/2, 0.54-size/2, -0.54-size/2, -0.54-size/2]
        var num;
        for(i = 0; i < 8; i++)
        {
            const conditionsArray = [
                posX < condition1[i], 
                condition2[i] < posX,                
                posY < condition3[i],
                condition4[i] < posY
            ]  
            if(conditionsArray.indexOf(false) === -1)
            {
                num = i;
            }
        }
//find which one is clicked
        switch(num)
        {
            case 0:
                is5 = true;
                is2 = false;
                is3 = false;
                is4 = false;
                is6 = false;
                is7 = false;
                is8 = false;
                is9 = false;
                console.log("is5");
                break;
            case 1:
                is4 = true;
                is2 = false;
                is3 = false;
                is5 = false;
                is6 = false;
                is7 = false;
                is8 = false;
                is9 = false;
                console.log("is4");
                break;
            case 2:
                is2 = true;
                is3 = false;
                is4 = false;
                is5 = false;
                is6 = false;
                is7 = false;
                is8 = false;
                is9 = false;
                console.log("is2");
                break;
            case 3:
                is2 = false;
                is3 = true;
                is4 = false;
                is5 = false;
                is6 = false;
                is7 = false;
                is8 = false;
                is9 = false;
                console.log("is3");
                break;
            case 4:
                is2 = false;
                is3 = false;
                is4 = false;
                is5 = false;
                is6 = true;
                is7 = false;
                is8 = false;
                is9 = false;
                console.log("is4");                    
                break;
            case 5:
                is2 = false;
                is3 = false;
                is4 = false;
                is5 = false;
                is6 = false;
                is7 = true;
                is8 = false;
                is9 = false;
                console.log("is7");                    
                break;
            case 6:
                is2 = false;
                is3 = false;
                is4 = false;
                is5 = false;
                is6 = false;
                is7 = false;
                is8 = true;
                is9 = false;
                console.log("is8");                    
                break;
            case 7:
                    is2 = false;
                    is3 = false;
                    is4 = false;
                    is5 = false;
                    is6 = false;
                    is7 = false;
                    is8 = false;
                    is9 = true;
                    console.log("is9");                    
                    break;
            default:
                is2 = false;
                is3 = false;
                is4 = false;
                is5 = false;
                is6 = false;
                is7 = false;
                is8 = false;
                is9 = false;

        }
            //console.log(is5);
            //console.log(conditionsArray);
       

    });


    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //theta += degree;
    //console.log("theta = ",theta);

    //gl.uniform3fv(thetaLoc, theta);

    //mvMatrix = morigina;
    //not work
    var mstay = mult(s,t);
    //console.log(mvMatrix);

    var m1 = mvMatrix;
    var m2 = mvMatrix2;
    var m3 = mvMatrix3;
    var m4 = mvMatrix4;
    var m5 = mvMatrix5;
    var m6 = mvMatrix6;
    var m7 = mvMatrix7;
    var m8 = mvMatrix8;
    var m9 = mvMatrix9;

    //define rotation direction
    var rx = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, 1.0, 0.0, 0.0)),translate(-0.5,-0.5,0.5));
    var nrx = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, -1.0, 0.0, 0.0)),translate(-0.5,-0.5,0.5));
    var ry = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, 0.0, 1.0, 0.0)),translate(-0.5,-0.5,0.5));
    var nry = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, 0.0, -1.0, 0.0)),translate(-0.5,-0.5,0.5));
    var rz = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, 0.5, 0.5, 0.0)),translate(-0.5,-0.5,0.5));
    var rza = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, -0.5, 0.5, 0.0)),translate(-0.5,-0.5,0.5));
    var rzb = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, 0.5, -0.5, 0.0)),translate(-0.5,-0.5,0.5));
    var rzc = mult(mult(translate(0.5,0.5,-0.5),rotate(theta, -0.5, -0.5, 0.0)),translate(-0.5,-0.5,0.5));

    //mvMatrix = mult(scalem(0.2,0.2,0.2),mult(translate(-0.5,-0.5,0.5),rotate(theta, 0.0, 1.0, 0.0)));
    //mvMatrix = mult(scalem(0.2,0.2,0.2),mult(translate(-0.5,-0.5,0.5),rotate(theta, 0.0, 0.0, 1.0)));
    //console.log(mvMatrix);
    //console.log(mvMatrix2[2][2]);
    //mvMatrix = mult(mvMatrix,rx);

    //determine if reset the center cube and which cube should followed
    //But just can rotation based on the rotation is already has
    if(is2 == true){
        ma = mult(m1,nrx);
        gl.uniformMatrix4fv( modelView, false, flatten(ma));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is3 == true)
    {
        mb = mult(m1, rx);
        gl.uniformMatrix4fv( modelView, false, flatten(mb));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is4 == true)
    {
        mc = mult(m1, ry);
        gl.uniformMatrix4fv( modelView, false, flatten(mc));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is5 == true)
    {
        mvMatrix = mult(m1, nry);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix)); 
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    }
    else if(is6 == true)
    {
        mvMatrix = mult(m1, rz);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is7 == true)
    {
        mvMatrix = mult(m1, rza);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is8 == true)
    {
        mvMatrix = mult(m1, rzb);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else if(is9 == true)
    {
        mvMatrix = mult(m1, rzc);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    else
    {   mvMatrix = morigina;
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix)); 
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }

    //left cube
    //mvMatrix2 = mult(translate(0.75, 0, 0),mult(scalem(0.2, 0.2, 0.2),mult(translate(-0.5,-0.5,0.5),rotate(theta, 1.0, 0.0, 0.0))));
    mvMatrix2 = mult(m2, nrx);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix2));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
   
    //right cube
    mvMatrix3 = mult(m3,rx);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix3));
    //console.log("ModelView matrix S*T", mult(scalem(0.2, 0.2, 0.2), translate(0.75, -0.5, 0.5))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //up cube
    mvMatrix4 = mult(m4, ry);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix4));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.1, 0.75, 0.5), scalem(0.2, 0.2, 0.2))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //down cube
    mvMatrix5 = mult(m5, nry);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix5));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    //gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix2));
    //gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //upright cube
    mvMatrix6 = mult(m6, rz);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix6));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //upleft cube
    mvMatrix7 = mult(m7, rza);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix7));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //btm right cube
    mvMatrix8 = mult(m8, rzb);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix8));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
   
    //btm left cube
    mvMatrix9 = mult(m9, rzc);
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix9));
    //console.log("ModelView matrix2 S*T", mult(translate(-0.5, -0.5, 0.5), scalem(0.1, 0.1, 0.1))); 
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );


}



