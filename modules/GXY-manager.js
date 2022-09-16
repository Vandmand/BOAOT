
//Global X/Y
export let relativeX = 0; export let relativeY = 0;

export function transform(coord, xy){ //turns the window x/y to a global x/y
return xy == "x" ? coord+relativeX : coord+relativeY;
} 

export function moveWindow(){
    if(mouseX < 80){
        if(keyCode === SHIFT && keyIsPressed){
            relativeX+=5;}
            else { relativeX+=2;}
    } else if (mouseX > windowWidth-80){
        if(keyCode === SHIFT && keyIsPressed){
            relativeX-=5;}
            else { relativeX-=2;}
    }
    if (mouseY < 80 && relativeY < 0){
        if(keyCode === SHIFT && keyIsPressed){
            relativeY+=5;}
            else { relativeY+=2;}
        
    } else if (mouseY > windowHeight-80 && relativeY > -1600){
        if(keyCode === SHIFT && keyIsPressed){
            relativeY-=5;}
            else { relativeY-=2;}
        }
    }