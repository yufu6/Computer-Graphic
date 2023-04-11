function geometry(resolution) {
    
    // initial use array
    vertices = [];
    indices = [];
    normalsArray = [];


    //draw cylinder
    //define indeces for cylinder
    /*
    indices.push = [ 1,0,3,           
                    3,2,1,
                    2,3,7,
                    7,6,2, 
                    3,0,4,
                    4,7,3,
                    6,5,1,
                    1,2,6,
                    4,5,6,
                    6,7,4,
                    5,4,0,
                    0,1,5]
                    ;*/
    for (var i = 0; i < resolution; i++) {
        j = 0;
            
        //for(var the = 0; the<= 2 * Math.PI; the+=0.1)
        //{
        if(resolution < 35)
        {
            for (var side = 0; side < resolution; side ++) {
                //console.log('iii',i);
                //console.log('jjj',j);

                var vectice = vec3(0.3*Math.cos(2*Math.PI*j/resolution), 0.15*i-1, 0.3*Math.sin(2*Math.PI*j/resolution));
                var array = vec3(0.3*Math.cos((2*Math.PI*j/resolution)), 0, 0.3*Math.sin((2*Math.PI*j/resolution)));
                vertices.push(vectice);
                normalsArray.push(array);

                //console.log('vectice', vectice);
                //console.log('array', array);

                j++;
            }
        }
        //match the hight
        else if(resolution > 35)
        {
            for (var side = 0; side < resolution; side ++) {
                //console.log('iii',i);
                //console.log('jjj',j);

                var vectice = vec3(0.3*Math.cos(2*Math.PI*j/resolution), 0.0367*i-1, 0.3*Math.sin(2*Math.PI*j/resolution));
                var array = vec3(0.3*Math.cos((2*Math.PI*j/resolution)), 0, 0.3*Math.sin((2*Math.PI*j/resolution)));
                vertices.push(vectice);
                normalsArray.push(array);

                //console.log('vectice', vectice);
                //console.log('array', array);

                j++;
            }
        }
        //vertices.push(vec3(r*Math.cos(theta), t, r*Math.sin(theta)));
       //normalsArray.push(vec3(Math.cos(theta), 0, Math.sin(theta)));
    //}

    console.log('1 high res');

    }

    //Need to fix: if use theta how to implement resolution ?
    //push indices
    var quad = [];
    for (var i = 0; i < resolution; i++) {
        for (var j = 0; j < resolution; j++) {
        
            /*
            //Not work..
            quad = [
                (j+resolution*i),
                ((j+1)%resolution+resolution*i),
                ((j+1)%resolution+resolution*(i+1)),
                (j+resolution*i),
                ((j+1)%resolution+resolution*(i+1)),
                (j+resolution*(i+1))
            ];
            console.log(quad[i]); 
            indices.push(quad[i]);    
            */
           //directly push works
            a = j+resolution*i;
            b = (j+1)%resolution+resolution*i;
            c = (j+1)%resolution+resolution*(i+1);
            d = j+resolution*i;
            e = (j+1)%resolution+resolution*(i+1);
            f = j+resolution*(i+1);

            indices.push(a, b, c, d, e, f);
            

            console.log('a', a);
            console.log('b', b);
            console.log('c', c);
            console.log('d', d);
            console.log('e', e);
            console.log('f', f);

        }
        console.log('2 high res');

    }


    // SOR2
    // x=sqrt(t): (t*t*cos(theta), t, t*tsin(theta))
    // range of z: 0,1
    // range of theta: 0,2pi
    // rotate y axis


    // other model

    for (var i = 0; i < resolution; i++) {
        j = 0;
            
        //for(var the = 0; the<= 2 * Math.PI; the+=0.1)
        //{
        if(resolution < 35)
        {
            index = 180;
            for (var side = 0; side < resolution; side ++) {
                //console.log('iii',i);
                //console.log('jjj',j);
                //hat
                v = Math.sin(Math.PI/4);
                var vectice = vec3(v*Math.cos(2*Math.PI*j/resolution), 0.04*i-1, v*Math.sin(2*Math.PI*j/resolution));
                var array = vec3(Math.cos((2*Math.PI*j/resolution)), 0, Math.sin((2*Math.PI*j/resolution)));
                vertices.push(vectice);
                normalsArray.push(array);

                //console.log('vectice', vectice);
                //console.log('array', array);

                j++;
            }
        }
        else if(resolution > 35)
        {
            index = 450;
            for (var side = 0; side < resolution; side ++) {
                //console.log('iii',i);
                //console.log('jjj',j);
                v = Math.sin(Math.PI/4);
                var vectice = vec3(v*Math.cos(2*Math.PI*j/resolution), 0.069*i-1, v*Math.sin(2*Math.PI*j/resolution));
                var array = vec3(Math.cos((2*Math.PI*j/resolution)), 0, Math.sin((2*Math.PI*j/resolution)));
                vertices.push(vectice);
                normalsArray.push(array);

                //console.log('vectice', vectice);
                //console.log('array', array);
                j++;
            }
        }
    }

    //push indixes same with the cylinder 
    for (var i = 0; i < resolution; i++) {
        for (var j = 0; j < resolution; j++) {
        
            a = j+resolution*i+index;
            b = (j+1)%resolution+resolution*i+index;
            c = (j+1)%resolution+resolution*(i+1)+index;
            d = j+resolution*i+index;
            e = (j+1)%resolution+resolution*(i+1)+index;
            f = j+resolution*(i+1)+index;

            indices.push(a, b, c, d, e, f);
            

            //console.log('a', a);
            //console.log('b', b);
            //console.log('c', c);
            //console.log('d', d);
            //console.log('e', e);
            //console.log('f', f);

        }
        console.log('4 high res');

    }
}

