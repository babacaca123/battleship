



function Ship(length){
    let numOfHits = 0;
    let beenSunk = false;



    function hit(){
        numOfHits += 1;
    }

    function getHits(){
        return numOfHits;
    }

    function isSunk(){
        if (length === getHits()){
            beenSunk = true;
        }
        else{
            beenSunk = false;
        }
        return beenSunk;
    }


    return { length, beenSunk, hit, getHits, isSunk };
}



export default Ship;