/*eslint-env es6*/

let scene, camera, renderer;
let material, materialBlack, materialPink, materialTeeth, materialEgg; 
let rabbit, head;

let face, ear1, ear2, eye1, eye2, nose, mouthV, mouthO, teeth1, teeth2, cheek1, cheek2;
let faceGeometry, earGeometry, eyeGeometry, noseGeometry, mouthOGeometry, mouthVGeometry, teethGeometry, cheekGeometry;

let body, tail, legF1, legF2, legB1, legB2, legF1low, legF2low, legB1low, legB2low;
let bodyGeometry, tailGeometry, legGeometry;

let f1, f2, b1, b2;

let eggGeometry;
let egg;

let wellGeometry;
let well;

let groupRun;

let run_check= false, run_fixed_check= false, jump_check= false, jump_check_egg= false, jump_check_well=false, fall_check=false, stop_check= false, hi_check= false, night_check= false;

let tween_run, tween_fixedrun, tween_egg, tween_b1up, tween_b2up, tween_well, tween_well2, tween_hi; //start_run, start_fixed_run, start_eggs, start_backlegs1 and 2, start well, start hi

let eggCounter=0;

let textureEgg1, textureEgg2, textureEgg3, textureEgg4, textureEgg5, textureEgg6, textureEgg7;

let bg, bg2, bgn, bgn2;

function init(){
    document.getElementById("scoren").innerHTML= eggCounter;
    
    scene= new THREE.Scene();
    bg= new THREE.TextureLoader().load("imgs/bg.jpg");
    bg2= new THREE.TextureLoader().load("imgs/bg2.jpg");
    bgn= new THREE.TextureLoader().load("imgs/bgn.jpg");
    bgn2= new THREE.TextureLoader().load("imgs/bgn2.jpg");
    
    scene.background= bg;
    
    camera= new THREE.PerspectiveCamera(75, 
                                        window.innerWidth/window.innerHeight, 
                                        0.1, 
                                        1000);
    camera.position.z= 6.5;
    
    renderer= new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    
    //MATERIALS
    const textureFur= new THREE.TextureLoader().load('imgs/white.jpg');
    
    textureEgg1= new THREE.TextureLoader().load('imgs/egg1.jpg');
    textureEgg2= new THREE.TextureLoader().load('imgs/egg2.jpg');
    textureEgg3= new THREE.TextureLoader().load('imgs/egg3.jpg');
    textureEgg4= new THREE.TextureLoader().load('imgs/egg4.jpg');
    textureEgg5= new THREE.TextureLoader().load('imgs/egg5.jpg');
    textureEgg6= new THREE.TextureLoader().load('imgs/egg6.jpg');
    textureEgg7= new THREE.TextureLoader().load('imgs/egg7.jpg');
    
    
    material= new THREE.MeshLambertMaterial({color: 0xffffff,
                                            shading: THREE.FlatShading,
                                            map: textureFur
                                            }); 

    materialBlack= new THREE.MeshPhongMaterial({color: 0x000000}); 
    materialPink= new THREE.MeshPhongMaterial({color: 0xfe7f9c,
                                               map: textureFur}); 
    materialTeeth= new THREE.MeshPhongMaterial({color: 0xffffff}); 
    
    
    //LIGHTS
    var light= new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 20, 20);
    light.power=14;
    scene.add(light);
    
    var lightAmbient = new THREE.AmbientLight( 0x606060 );
    scene.add(lightAmbient);
    
    
    introRabbit();
    
    
    
    //EVENT LISTENERS
    

    document.getElementById("body").onkeydown= function(event){
        var x= event.key;
        if(x=="ArrowUp"){
            if(!stop_check){
                jump_check=true;
                jump_check_egg=true;
                jump_check_well=true;
                
                pause();
                jump();
                
                setTimeout(function jmpchk(){
                    jump_check_well=false;
                    jump_check=false;
                }, 350);
                
                setTimeout(function jmpchk(){
                    jump_check_egg=false;
                }, 250);
                
                setTimeout(restart, 280);
            }
        }
    }
    
    
    document.getElementById("start").onclick= function(event){
        
        document.getElementById("credits").style.display= "none";
        document.getElementById("instructions").style.display= "none";
        document.getElementById("day").style.display= "none";
        document.getElementById("night").style.display= "none";
        document.getElementById("score").style.display="block";
        
        document.getElementById("stop").disabled= false;
        document.getElementById("home").disabled = false;
        
        start();
        
        document.getElementById("start").disabled= true;
    };
    
    document.getElementById("stop").onclick= function(event){
        stop();
    };
    
    document.getElementById("home").onclick= function(event){
        location.reload();
    };
    
    
    document.getElementById("day").onclick= function(event){
        light.power=14;
        night_check= false;
        scene.background= bg;
    }
    document.getElementById("night").onclick= function(event){
        light.power=6;
        night_check= true;
        scene.background= bgn;
    }
}
    
function drawRabbit(){ 
    rabbit= new THREE.Group();
    
    drawHead();
    drawBody();
    
    rabbit.position.set(-4.5, -0.8, -0.2);
    rabbit.rotation.y= -0.2;
    
    rabbit.add(head);
    
    rabbit.add(f1);
    rabbit.add(f2);
    rabbit.add(b1);
    rabbit.add(b2);
    
    scene.add(rabbit);
}

function introRabbit(){
    document.getElementById("stop").disabled = true;
    document.getElementById("home").disabled = true;
    
    hi_check=true;
    drawRabbit();
    rabbit.position.x=-2.75;
    
    rabbit.rotation.y=-1.25;
    head.rotation.x=0.3;
    
    tween_hi= new TWEEN.Tween(head.rotation)
                    .to({x: -0.3}, 1100);
    var tween_hi2= new TWEEN.Tween(head.rotation)
                    .to({x: 0.3}, 1100);
    
    tween_hi.chain(tween_hi2);
    tween_hi2.chain(tween_hi);
    
    tween_hi.start();
}

function drawHead(){
    //HEAD
    head= new THREE.Group();
    head.position.set(0.71, 0.4, 0);
    
    faceGeometry= new THREE.IcosahedronGeometry(0.5, 0);
    
    face= new THREE.Mesh(faceGeometry, material);
    face.position.set(head.position.x, head.position.y, head.position.z);
    
    head.add(face);
    
    
    //EARS
    earGeometry= new THREE.BoxGeometry(0.12, 0.5, 0.2);
    
    ear1= new THREE.Mesh(earGeometry, material);
    //ear1.position.set(1.45, 1.15, 0.25);
    ear1.position.set(head.position.x+0.1, head.position.y+0.45, head.position.z+0.25);
    ear1.rotation.set(0.35, 2.3, 0.2);
    
    head.add(ear1);
    
    ear2= ear1.clone();
    ear2.position.z=-ear1.position.z;
    ear2.rotation.set(-ear1.rotation.x, -ear1.rotation.y, ear1.rotation.z);
    
    head.add(ear2);
    
    
    //EYES
    eyeGeometry= new THREE.SphereGeometry(0.045);
    eye1= new THREE.Mesh(eyeGeometry, materialBlack);
    eye1.position.set(head.position.x+0.4, head.position.y, head.position.z+0.17);
    
    head.add(eye1);
    
    eye2=eye1.clone();
    eye2.position.z=-eye1.position.z;
    
    head.add(eye2);
    
    
    //NOSE
    noseGeometry= new THREE.SphereGeometry(0.02);
    nose= new THREE.Mesh(noseGeometry, materialBlack);
    nose.position.set(head.position.x+0.4, head.position.y-0.1, head.position.z);
    
    head.add(nose);
    
    //MOUTH
    mouthOGeometry= new THREE.BoxGeometry(0.01, 0.08, 0.01);
    mouthO= new THREE.Mesh(mouthOGeometry, materialBlack);
    mouthO.position.set(nose.position.x, nose.position.y-0.02, nose.position.z);
    
    head.add(mouthO);
    
    mouthVGeometry= new THREE.BoxGeometry(0.01, 0.01, 0.1);
    mouthV= new THREE.Mesh(mouthVGeometry, materialBlack);
    mouthV.position.set(mouthO.position.x, mouthO.position.y-0.05, mouthO.position.z);
    
    
    head.add(mouthV);
    
    
    //TEETH
    teethGeometry= new THREE.BoxGeometry(0.01, 0.1, 0.04);
    teeth1= new THREE.Mesh(teethGeometry, materialTeeth);
    teeth1.position.set(mouthO.position.x, mouthO.position.y-0.105, mouthO.position.z+0.024);
    
    head.add(teeth1);
    
    teeth2= teeth1.clone();
    teeth2.position.z= -teeth1.position.z;
    
    head.add(teeth2);
    
    
    //CHEEKS
    cheekGeometry= new THREE.CircleGeometry(0.08, 32);
    cheek1= new THREE.Mesh(cheekGeometry, materialPink);
    cheek1.position.set(head.position.x+0.394, head.position.y-0.15, head.position.z+0.2);
    
    cheek1.rotation.y=1.55;
    
    head.add(cheek1);
    
    cheek2= cheek1.clone();
    cheek2.position.z= -cheek1.position.z;
    
    
    head.add(cheek2);
    
    scene.add(head);
}

function drawBody(){
    //BODY
    bodyGeometry= new THREE.IcosahedronGeometry(1, 0);
    
    body= new THREE.Mesh(bodyGeometry, material);
    body.position.set(0.8,-0.25,0);
    
    rabbit.add(body);
    
    
    //TAIL
    tailGeometry= new THREE.SphereGeometry(0.17);
    
    tail= new THREE.Mesh(tailGeometry, material);
    tail.position.set(body.position.x-0.8, body.position.y-0.38, 0);
    
    rabbit.add(tail);
    
    
    //LEGS
    f1= new THREE.Group();
    f2= new THREE.Group();
    b1= new THREE.Group();
    b2= new THREE.Group();
    
    legGeometry= new THREE.BoxGeometry(0.25, 0.4, 0.2);
    
    legF1= new THREE.Mesh(legGeometry, material);
    legF1.position.set(body.position.x+0.4, body.position.y-0.53, body.position.z-0.28);
    legF1.rotation.z=9;
    
    f1.add(legF1);
    
    
    legF2= legF1.clone();
    legF2.position.z=-legF1.position.z;
    legF2.rotation.z=legF1.rotation.z;
    
    f2.add(legF2);
    
    
    legB1= legF1.clone();
    legB1.position.x=0.5;
    legB1.rotation.z=legF1.rotation.z;
    
    b1.add(legB1);
    
    
    legB2= legB1.clone();
    legB2.position.z=-legB1.position.z;
    legB2.rotation.z=legF1.rotation.z;
    
    b2.add(legB2);
    
    
    //LOWER LEGS
    legF1low= legF1.clone();
    legF1low.position.y= legF1.position.y-0.3;
    legF1low.rotation.z=-6;
    
    f1.add(legF1low);
    
    legF2low=legF2.clone();
    legF2low.position.y= legF2.position.y-0.3;
    legF2low.rotation.z= -6;
    
    f2.add(legF2low);
    
    legB1low= legB1.clone();
    legB1low.position.y= legB1.position.y-0.3;
    legB1low.rotation.z=-6;
    
    b1.add(legB1low);
    
    legB2low= legB2.clone();
    legB2low.position.y= legB2.position.y-0.3;
    legB2low.rotation.z=-6;
    
    b2.add(legB2low);
    
    scene.add(f1);
    scene.add(f2);
    scene.add(b1);
    scene.add(b2);
}

function drawEggs(){
    if(fall_check==false && stop_check==false){
        
        let textureEgg;
        x= Math.floor(Math.random() * 7);
        switch(x){
            case 0:
                textureEgg= textureEgg1;
                break;
            case 1:
                textureEgg=textureEgg2;
                break;
            case 2:
                textureEgg=textureEgg3;
                break;
            case 3:
                textureEgg=textureEgg4;
                break;
            case 4:
                textureEgg=textureEgg5;
                break;
            case 5:
                textureEgg=textureEgg6;
                break;
            case 6:
                textureEgg=textureEgg7;
                break;
        }

        materialEgg= new THREE.MeshPhongMaterial({map: textureEgg});

        var points = [];
        for (var deg =0; deg<=180; deg+=6 ) {
            var rad = Math.PI * deg / 180;
            var point = new THREE.Vector2((0.7 + 0.1 * Math.cos( rad)) * Math.sin(rad), -Math.cos(rad) );
            points.push( point );
        }
        eggGeometry = new THREE.LatheBufferGeometry(points, 32);
        
        
        egg= new THREE.Mesh(eggGeometry, materialEgg);
        scene.add(egg);
        egg.rotation.y+=1; //so that the texture shows correctly
        
        
        egg.scale.x= 0.6;
        egg.scale.y= 0.6;
        egg.scale.z= 0.6;
        
        
        egg.position.set(10, -0.9, -0.2);

        var eggend=1;

        tween_egg= new TWEEN.Tween(egg.position)
                        .to({x:eggend}, 1600)
                        .onComplete(function(){removeEgg()});
        
        tween_egg.start();

        setTimeout(drawEggs, 2800 + Math.random()*2000);
    }
}
    
function removeEgg(){
    if(!jump_check_egg){
        eggCounter++;
        eggGeometry.dispose();
        materialEgg.dispose();
        scene.remove(egg);
        document.getElementById("scoren").innerHTML= eggCounter;
    }
    
    else{
        var eggend= -13;
        var tween_egg2= new TWEEN.Tween(egg.position)
                        .to({x:eggend}, 2130) 
       
        tween_egg2.start();
    }
}

function drawWell(){
    wellGeometry= new THREE.CircleGeometry(0.9, 32);
    well= new THREE.Mesh(wellGeometry, materialBlack);
    well.rotation.set(0.6, -0.15, -0.3);
    
    well.position.set(15, -1.7, 0);
    
    
    scene.add(well);
}

function addWell(){
    if(fall_check==false && stop_check==false){

        drawWell();

        var wellfall= 0.5;

        tween_well= new TWEEN.Tween(well.position)
                            .to({x:wellfall}, 2570)
                            .onComplete(function(){checkFall()});

        tween_well.start();


        setTimeout(addWell, 10000 + Math.random()*1000);
    }
}

function wellAway(){
    var wellend=-14;
    
    tween_well2= new TWEEN.Tween(well.position)
                    .to({x:wellend}, 2570)
                    .onComplete(function dltwell(){
                        tween_well2.stop;});
    tween_well2.start();
}

function checkFall(){
    if(!jump_check_well){
        fall();
        stop();
    }
    else wellAway();
}

var rabbitx, runxup, runxdown; 
function run(){
    run_check=true;
    rabbitx=-4.5, runxup= 0.35, runxdown= 0.15;
    
    groupRun= new TWEEN.Group();
    
    //front legs
    var tween_run_f1= new TWEEN.Tween(f1.rotation, groupRun)
                .to({z: 0.15}, 300);
    var tween_run_f2= new TWEEN.Tween(f2.rotation, groupRun)
                .to({z: 0.15}, 300);
    
    tween_run_f1.start();
    tween_run_f2.start();
    
    
    var timeout=500; //upspeed+downspeed
    for(var i=0; i<8; i++){
        setTimeout(single_run, timeout*i);
    }
    
    run_fixed();
}

function single_run(){
    var upspeed= 300;
    var downspeed= 200;
    
    rabbitx+=runxup;
    tween_run= new TWEEN.Tween(rabbit.position, groupRun)
            .to({x: rabbitx}, upspeed);

    rabbitx+=runxdown;
    var tween_run2= new TWEEN.Tween(rabbit.position, groupRun)
            .to({x: rabbitx}, downspeed);

    
    tween_run.chain(tween_run2);
    
    if(!stop_check)
        tween_run.start();
}

function run_fixed(){
    run_fixed_check=true;
    
    var rabbity=-0.8;
    var runy= 0.2;
    
    var upspeed= 300;
    var downspeed= 200;
    
    tween_fixedrun= new TWEEN.Tween(rabbit.position)
                    .to({y: rabbity+runy}, upspeed);
    var tween_fixedrun2= new TWEEN.Tween(rabbit.position)
                    .to({y: rabbity}, downspeed);
    
    tween_fixedrun.chain(tween_fixedrun2);
    tween_fixedrun2.chain(tween_fixedrun);
    
    tween_fixedrun.start();
    
    
    tween_b1up= new TWEEN.Tween(b1.rotation)
                .to({z: -0.15}, upspeed);
    
    tween_b2up= new TWEEN.Tween(b2.rotation)
                .to({z: -0.15}, upspeed);
    
    var tween_b1down= new TWEEN.Tween(b1.rotation)
                .to({z: 0}, downspeed);
    
    var tween_b2down= new TWEEN.Tween(b2.rotation)
                .to({z: 0}, downspeed);

    
    tween_b1up.chain(tween_b1down);
    tween_b1down.chain(tween_b1up);
    tween_b1up.start();
    
    tween_b2up.chain(tween_b2down);
    tween_b2down.chain(tween_b2up);
    tween_b2up.start();
}


function jump(){
    var rabbity=-0.8;
    var jumpy=2;
    
    var earz= 0.2;
    var taily= -0.63;
    
    var upspeed= 280;
    var downspeed= 280;
    
    var upspeedear= 120;
    var downspeedear= 140;
    
    var tween_jump= new TWEEN.Tween(rabbit.position)
                    .to({y:rabbity+jumpy}, upspeed);

    var tween_jump2= new TWEEN.Tween(rabbit.position)
                    .to({y:rabbity}, downspeed);
       
    //ears
    var tween_ear1up= new TWEEN.Tween(ear1.rotation)
                    .to({z: earz-0.3}, upspeedear);
    
    var tween_ear2up= new TWEEN.Tween(ear2.rotation)
                    .to({z: earz-0.3}, upspeedear);
                         
    var tween_ear1down= new TWEEN.Tween(ear1.rotation)
                    .to({z: earz}, downspeedear);
    
    var tween_ear2down= new TWEEN.Tween(ear2.rotation)
                    .to({z: earz}, downspeedear);
    
    //tail
    var tween_tail= new TWEEN.Tween(tail.position)
                    .to({y: taily+0.13}, 120);
    var tween_tail2= new TWEEN.Tween(tail.position)
                    .to({y: taily}, 120);
              
    //legs
    b1.rotation.z=-0.18;
    b2.rotation.z=-0.18;
    
    
    tween_jump.chain(tween_jump2);
    tween_jump.start();
    
    tween_ear1up.chain(tween_ear1down);
    tween_ear1up.start();
    
    tween_ear2up.chain(tween_ear2down);
    tween_ear2up.start();
    
    tween_tail.chain(tween_tail2);
    tween_tail.start();
}

function fall(){
    fall_check=true;
    
    var rabbity= -0.8;
    var fally= 1.5;
    
    
    var downspeed= 80;
    var rotatespeed= 100;
    
    var tween_fall= new TWEEN.Tween(rabbit.rotation)
                    .to({x:-1, y:0.1}, rotatespeed);
    var tween_fall2= new TWEEN.Tween(rabbit.position)
                    .to({y:rabbity-fally, z:-4}, downspeed)
                    .onComplete(function dltrabbit(){
                        (scene.remove(rabbit));});
    
    tween_fall.chain(tween_fall2);
    tween_fall.start();
}


function animate(){
    requestAnimationFrame(animate);
    
    if(run_check)
        groupRun.update();
    
    if(hi_check || run_fixed_check || jump_check)
        TWEEN.update();
    
    renderer.render(scene, camera);
}

function onWindowResize(){
    camera.aspect= window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize,false);

function start(){
    if(night_check)
        scene.background= bgn2;
    else
        scene.background= bg2;
    
    rabbit.position.set(-4.5, -0.8, -0.2);
    rabbit.rotation.set(0, -0.2, 0);
    
    tween_hi.start();
    setTimeout(run, 1000);
    
    setTimeout(drawEggs, 7000);

    setTimeout(addWell, 15000);
}

function stop(){
    stop_check=true;
    document.getElementById("stop").disabled= true;
    
    document.getElementById("scorefinal").innerHTML= eggCounter;
    
    setTimeout(function finalscore(){
        document.getElementById("finalscore").style.display="block";}, 500);
    
    tween_hi.stop();
    tween_run.stop();
    tween_fixedrun.stop();
    tween_b1up.stop();
    tween_b2up.stop();
    tween_egg.stop(); 
    tween_well.stop();
    tween_well2.stop();
    
    }

function pause(){    
    tween_fixedrun.stop();
    tween_b1up.stop();
    tween_b2up.stop();
}

function restart(){
    tween_fixedrun.start();
    tween_b1up.start();
    tween_b2up.start();
}
