
/* to-do list
    - add comments to code
    - add pencil feature 
    - add number highlight (highlight all cells of the same number)
*/


let cell_on = null;
let autocheck = true; 
let difficulty = 0;
let pencil = false;

var board = [
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-']
]

var solution = [
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-']
]

var empty_board = [
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-','-']
]


window.onload = function(){
    newPuzzle();
    align_settings_with_board();
}

window.onresize = function(){
    align_settings_with_board();
}

document.addEventListener('keyup', event => {
    if (cell_on == null){
        return;
    }
    if (event.key >= '1' && event.key <= '9'){
        if(pencil){
            edit_note(event.key, cell_on);
        }
        else{
            document.getElementById(cell_on + "answer").innerText = event.key;
            hide_notes(cell_on);
            if (autocheck){check_puzzle();}
            if(solved()){
                open_pop_up();
            }
        }
        
    }
    else if(event.key == "Delete" || event.key == "Backspace" ){
        if(pencil){
            erase_note(cell_on);
        }
        else{
            document.getElementById(cell_on + 'answer').innerText = '';
            show_notes(cell_on);
            if (autocheck){check_puzzle();}
        }
    }
    else if(event.key == "Enter"){
        move_highlight("enter");
    }
    else if(event.key == "ArrowRight"){
        move_highlight("right");
    }
    else if(event.key == "ArrowLeft"){
        move_highlight("left");
    }
    else if(event.key == "ArrowUp" ){
        move_highlight('up');
    }
    else if(event.key == "ArrowDown"){
        move_highlight("down");
    }
});

window.onclick = (event) => {
    if(!event.target.matches('.cell')){
      document.querySelector(".highlighted_cell")?.classList.remove("highlighted_cell");
      cell_on = null;
    }
}

/************************************************************************************************************************************
    functions related to creating sudoku game

*************************************************************************************************************************************/ 

function remove_old_puzzle(){
    for(i = 0; i < 9; i++){
        for(j = 0; j < 9; j++){
            solution[i][j] = '-';
            board[i][j] = '-'
            id = i.toString() + '-' + j.toString();
            document.getElementById(id)?.remove();
        }
    }
}

function solved(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            id = i.toString() + '-' + j.toString();
            if(document.getElementById(id).classList.contains("game_cell")){
                if(document.getElementById(id).innerText != solution[i][j]){
                    return false;
                }   
            }
        }
    }
    console.log("solved");
    return true;
}

function validMove(r, c, tmp_board){
    for(let i = 0; i < 9; i++){ //check row and column

        if (tmp_board[r][c] == tmp_board[r][i] && i != c){
            return false;
        }
        if (tmp_board[r][c] == tmp_board[i][c] && i != r){
            return false;
        }
    }

    for (let i = Math.floor(r / 3) * 3; i < (Math.floor(r / 3) * 3 + 3); i++){ // check boxes
        for(let j = Math.floor(c / 3) * 3; j < (Math.floor(c / 3) * 3 + 3); j++){

            if(tmp_board[r][c] == tmp_board[i][j] ){
                if (!(r == i && c == j)){
                    return false;
                }
            } 
        }
    }
     return true;
    
}

function emptySquare(tmp_board){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(tmp_board[i][j] == '-'){
                return [i,j];
            }
        }
    }
    return [-1,-1];
}

function previousSquare(cords){
    let r = 0;
    let c = 0;
    if(cords[1] == 0 && cords[0] == 0){
        c = 0;
        r = 0;
    }
    else if(cords[1] == 0){
        c = 8;
        r = cords[0] - 1;
    }
    else{
        c = cords[1] - 1;
        r = cords[0];
    }
    return [r,c]
}

function generatePuzzle(tmp_board, attempted_values){

    let cords = emptySquare(tmp_board);
  
    if(cords[0] == -1){ // check if board is filled
        return tmp_board;
    }

    if (attempted_values.length == 0){ // get new number to try
        attempted_values.push(Math.floor(Math.random()*9) + 1);
    }
    else{ // don't repete numbers
        if(attempted_values.length == 9){
            let prv_cords = previousSquare(cords);
            tmp_board[cords[0]][cords[1]] = '-';
            past_attempt = tmp_board[prv_cords[0]][prv_cords[1]]
            tmp_board[prv_cords[0]][prv_cords[1]] = '-';
            return tmp_board
        }
        if (attempted_values.at(-1) == 9){
            attempted_values.push(1);
        }
        else{
            attempted_values.push(attempted_values.at(-1) + 1);
        }
    }

    tmp_board[cords[0]][cords[1]] = attempted_values.at(-1);
    if(validMove(cords[0], cords[1], tmp_board)){
        tmp_board = generatePuzzle(tmp_board, [])
        if(emptySquare(tmp_board) == [-1,-1]){
            return tmp_board;
        }
        else{
            return generatePuzzle(tmp_board,attempted_values)
        }
    }
    else{
        tmp_board[cords[0]][cords[1]] = '-';
        return generatePuzzle(tmp_board, attempted_values);
    }
}

function remove_tiles(tmp_board){
    let number_positions = [[],[],[],[],[],[],[],[],[]];
    for(let i = 0; i < 9; i++){ // get position of tiles ordered by number value
        for(let j = 0; j < 9; j++){
            let value = tmp_board[i][j] - 1;
            number_positions[value].push([i,j]);
        }
    }
    let super_easy = [1,0,0,0,0,0,0,0,0];
    let easy = [3,4,4,5,5,5,6,6,7];
    let medium = [5,5,6,6,6,7,7,8,9];
    let hard = [6,6,6,7,7,7,8,8,9];
    let difficulty_setting = [];

    if(difficulty == 0){
        difficulty_setting = easy;
    }
    else if (difficulty == 1){ difficulty_setting = medium;}
    else if(difficulty == -1){difficulty_setting = super_easy}
    else { difficulty_setting = hard;}

    for(let i = 0; i < 9; i++){
        let remove = Math.floor(Math.random() * difficulty_setting.length);
        
        let count = 0;
        while(count < difficulty_setting[remove]){
            let ran = Math.floor(Math.random() * 9);
            let r = number_positions[i][ran][0];
            let c = number_positions[i][ran][1];
            if (tmp_board[r][c] != '-'){
                count++;
                tmp_board[r][c] = '-';
            }
        }
        difficulty_setting[remove] = difficulty_setting[difficulty_setting.length-1];
        difficulty_setting.pop();
    }

   
    return tmp_board;
}

function set_boards_equal(s_board,b_board){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            b_board[i][j] = s_board[i][j];
        }
    }
}

/************************************************************************************************************************************
    functions related to html display

*************************************************************************************************************************************/ 

function setGame(){
    for (let i = 0; i < 9; i++){1
        for (let j = 0; j < 9; j++){
            let cell = document.createElement("div");
            cell.id = i.toString() + "-" + j.toString();
            cell.classList.add("cell");
            if (board[i][j] != '-'){
                cell.innerText = board[i][j]
                cell.classList.add("complete_cell");
            }
            else{
                cell.addEventListener("click", selectCell);
                cell.addEventListener("keyup",check_puzzle);
                cell.classList.add("game_cell");

                let note = document.createElement('div');
                note.id = i.toString() + "-" + j.toString() + "note";
                note.classList.add("notes")
                note.innerText = ""
                cell.appendChild(note);

                let answer = document.createElement('div');
                answer.classList.add('answer');
                answer.id = cell.id + "answer";
                answer.innerText = "";
                cell.appendChild(answer);
            }
            
            if(i == 2 || i == 5){
                cell.classList.add("bottom_border");
            }
            if(i==3 || i == 6){
                cell.classList.add("top_border");
            }
            if(j == 2 || j == 5){
                cell.classList.add("right_border");
            }
            if(j == 3 || j == 6){
                cell.classList.add("left_border");
            }
            
            
            document.getElementById("board").appendChild(cell);
        }
    }
}

function newPuzzle(){
    remove_old_puzzle()
    generatePuzzle(solution,[]);
    set_boards_equal(solution,board);
    board = remove_tiles(board);
    setGame();
}

function set_difficulty(level){
    document.getElementById("difficulty_dropdown_button").innerText = level;
    switch(level){
        case "super Easy":
            difficulty = -1;
            break;
        case "Easy":
            difficulty = 0;
            break;
        case "Medium":
            difficulty = 1;
            break;
        case "Hard":
            difficulty = 2;
            break;
        default:
            difficulty = 0;
            break; 
    }
}

function set_autocheck(setting){
    if(setting){
        document.getElementById("autocheck_on").classList.add('autocheck_btn_active');
        document.getElementById("autocheck_off").classList.remove('autocheck_btn_active');
        autocheck = true;
        check_puzzle();
    }
    else{
        document.getElementById("autocheck_off").classList.add('autocheck_btn_active');
        document.getElementById("autocheck_on").classList.remove('autocheck_btn_active');
        autocheck = false;
        let tmpList = document.querySelectorAll(".wrong")
        for (let i = 0; i < tmpList.length; i++){
            tmpList[i].classList.remove("wrong");
        }
    }
}

function close_pop_up(play_again){
    document.getElementById("win_pop_up").classList.add("hide");
    if(play_again){
        newPuzzle();
    }
}

function open_pop_up(){
    document.getElementById("win_pop_up").classList.remove("hide");
}

function selectCell(){
    document.querySelector(".highlighted_cell")?.classList.remove("highlighted_cell");
    this.classList.add("highlighted_cell");
    cell_on = this.id; 
}

function check_puzzle(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let id = i.toString() + '-' + j.toString();
            let id_answer = id + 'answer';
            if(document.getElementById(id).classList.contains('game_cell')){
                if (document.getElementById(id_answer).innerText != '' && document.getElementById(id_answer).innerText != solution[i][j]){
                    document.getElementById(id).classList.add('wrong');
                }
                else{
                    document.getElementById(id).classList.remove('wrong');
                }
            }
        }
    }
}

function next_cell(r,c, direction){
    switch (direction){
        case "right": 
            if( c == 8){ c = 0;}
            else{c++}
            break;
        case "left":
            if( c == 0){ c = 8;}
            else{c--}
            break;
        case "up":
            if(r == 0){ r = 8;}
            else{r--}
            break;
        case "down":
            if( r == 8){ r = 0}
            else{r++}
            break;
        case "enter": 
            if(r == 8 && c == 8){
                r = 0;
                c = 0;
            }
            else if(c == 8){
                c = 0;
                r++;
            }
            else{c++;}
            break;
    }
    return [r.toString(),c.toString()];
}

function move_highlight(direction){
    let found_cell = false;
    let id = document.querySelector('.highlighted_cell').id;
    document.getElementById(id).classList.remove('highlighted_cell');
    let cords = id.split('-');
    while (!found_cell){ 
        cords = next_cell(cords[0],cords[1],direction);
        id = cords[0] + '-' + cords[1];
        cell_on = id;
        if(document.getElementById(id).classList.contains("game_cell")){
            found_cell = true;
            document.getElementById(id).classList.add("highlighted_cell");
        }
    }
}

function align_settings_with_board(){
    let cell_width = document.getElementById("0-0").clientWidth;
    let board_width = cell_width*9;
    document.getElementById("game_settings").style.width = board_width.toString() + 'px';
}

function toggle_pencil(){
    document.getElementById('pencil_img').classList.toggle('pencil_on');
    if (pencil){pencil = false}
    else{pencil = true}
}

function edit_note(value, cell_id){
    let oldtext = document.getElementById(cell_id + "note").innerText
    let newtext = "";
    let found = false;
    if(oldtext == ""){
        document.getElementById(cell_id + "note").innerText = value;
    }
    else{
        for(let i = 0; i < oldtext.length; i++){
            if(oldtext[i] != value){
                if(value < oldtext[i] && !found){
                    newtext = newtext + value;
                    found = true;
                }
                newtext = newtext + oldtext[i]
            }
            else{
                found = true;
            }
        }
        if(!found){
            newtext = newtext + value;
        }
        
        document.getElementById(cell_id + "note").innerText = newtext
    }
}

function erase_note(cell_id){
    oldtext = document.getElementById(cell_id + "note").innerText
    if( oldtext != ""){
        let newtext = "";
        for(let i = 0; i < oldtext.length - 1; i++){
            newtext = newtext + oldtext[i];
        }
        document.getElementById(cell_id + "note").innerText = newtext;
    }
}

function hide_notes(cell_id){
    document.getElementById(cell_id + 'note').classList.add("hide")
}

function show_notes(cell_id){
    document.getElementById(cell_id + 'note').classList.remove("hide")
}