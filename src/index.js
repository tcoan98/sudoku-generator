import {} from 'react-confirm-alert';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//PARENT CLASS
//CONTAINS: STATE.(board_elems*depricated*), STATE.numOfBoards

class SudokuGenerator extends React.Component{
    constructor(props){
    //on instantiation SudokuGenerator is set as the superclass of the properties variable and sets initial state
    //numberOfBoards: int number of boards to be generated
    //(board_elems*depricated*): list of <Board>s to be pushed to display
    //board_display: boolean indicting wether to display (board_elems*depricated*)
        super(props);
        this.state = {
            load:false,
            currentInput:0,
        };
        
    };
    // RENDER FUNCTION. 
    // INPUT CHANGE HANDLER
    handleInputChange(event){
        this.setState({currentInput:event.target.value,load:false});
    };

    //BUTTON PRESS HANDLER {INPUT}
    handleSubmit(props){
        console.log('SudokuGenerator:handleSubmit: button pressed. loading '+this.state.currentInput+' boards...');
        this.setState({load:true})
        /*
        if(this.state.load==true){
            // TODO REMOVING CELLS FROM PAGE
        }//else{
        */  
    };
    // RENDER
    render(props){
        if(this.state.load===true){
            return(
                <div className='app-container'>

                    <div className='boards-display'>
                        <div className='boards-container'>
                            <Boards load={this.state.load} numberOfBoards={this.state.currentInput}/>
                        </div>
                    </div>
                    <div className='UI-display'>    
                        <div className='UI-container'>
                            <h2 className='UI-header'>Sudoku Generator</h2>
                            <p className='UI-projectdesc'>This program renders and displays sudoku grids from a child element dynamically.</p>
                            <div className='input-container'>
                                <input className='UI-container-field' type = 'text' placeholder='enter an amount of sudoku puzzles to generate! Note: modifing this input will remove all boards being displayed!'onChange={this.handleInputChange.bind(this)} value={this.props.numberOfBoards} />
                                <input className='UI-container-button' type = 'submit' onClick={this.handleSubmit.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div className='app-container'>

                    <div className='boards-display'>
                        <div className='boards-container'>
                            Not loading boards.
                        </div>
                    </div>
                    <div className='UI-display'>    
                        <div className='UI-container'>
                            <h2 className='UI-header'>Sudoku Puzzle Generator</h2>
                            <p className='UI-projectdesc'>This program renders and displays sudoku grids from a child element dynamically.</p>
                            <div className='input-container'>
                                <input className='UI-container-field' type = 'text' placeholder='enter an amount of sudoku puzzles to generate! Note: modifing this input will remove all boards being displayed!'onChange={this.handleInputChange.bind(this)} value={this.props.numberOfBoards} />
                                <input className='UI-container-button' type = 'submit' onClick={this.handleSubmit.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
                
    };
};


    //GENERATING NEW BOARD

//BOARD FUNCTION COMPONENT  
//CHILD CLASS
//Should generate boards in this class, and render them in parent
class Boards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            boards:this.generateBoards(this.props.numberOfBoards,9),
            filled_cells:[],
            board_id: 0,
            cells_filled:0,
            rendered_boards:[],
            load:this.props.load,
        };
        console.log(this.props.numberOfBoards);
    };
    
    generateBoards(nBoards, cellsToBeFilled){
        console.log('entering generateBoards function...');
        const new_boards = [];
        if(this.props.load===true){
            for(var i = 0;i<nBoards;i++){
                console.log('adding to state list boards(len:) new board generateBoards function...');
                let new_board =[[null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null],
                        [null,null,null,null,null,null,null,null,null]
                        ];
                new_boards.push(this.populateBoardCells(new_board,cellsToBeFilled));        
            };
            return new_boards;
        }else{
            return [];
        }
        //for N boards, we want to generate each board, fill cells cellsToBeFilled times, and append that board to a list to be returned 
        
    };

    populateBoardCells(current_board,cellsToBeFilled){
    //input a board, return a board with cellsToBeFilled number of cells filled.
    // arr len 9 of 
    let new_board = current_board.slice();
        for(var i = 0;i<cellsToBeFilled;i++){
            new_board = this.fillCell(new_board);
        };
        return new_board;
    };

    fillCell(board){
        //take a copy of the current board and assign it to new_board
        const new_board = board.slice();
        //generate list of possibilities
        const possibilities = [1,2,3,4,5,6,7,8,9];
        //assign the x and y variables to a random coordinate
        var x= Math.floor(Math.random()*9);
        var y= Math.floor(Math.random()*9);
        //keep assigning until null cell is found
        while(new_board[x][y]!=null){
            x= Math.floor(Math.random()*9);
            y= Math.floor(Math.random()*9);
        }
        console.log('collected null cell x,y : '+x,y)
        let xclude = [];
        //exclude any column values
        for(let i = 0;i<9;i++){
            if(new_board[x][i]!=null && !xclude.includes(new_board[x][i])){
                console.log('adding value to exclude from group: '+new_board[x][i]);
                xclude.push(new_board[x][i]);
            }  
        }
        //exclude any row values
        for(let i = 0;i<9;i++){
            if(new_board[i][y]!=null && !xclude.includes(new_board[i][y])){
                console.log('adding value to exclude from row: '+new_board[i][y])
                xclude.push(new_board[i][y]);
            }
        }
        //exclude any group values
        const soln_space = [
            [0,0],[1,0],[2,0],
            [0,1],[1,1],[2,1],
            [0,2],[1,2],[2,2],
        ];
    
        //create copy of solution space to modify.
        let cur_soln_space = soln_space.slice();
        // set solution space if x is in third column.
        if(x>5){
            cur_soln_space.forEach(c =>{
                c[0] = c[0] + 6;
            });
            //y third row
            if(y > 5){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 6;
                });
            //y second row
            }else if(y>2){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 3;
                })
            //y first row
            }
        }
        // set solution space if x is in second column.
        else if(x>2){
            cur_soln_space.forEach(c =>{
                c[0] = c[0] + 3;
            });
            if(y > 5){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 6;
                });
            //y second row
            }else if(y>2){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 3;
                });
            //y first row
            }
        }
        // set solution space if x is in first column.
        else{
            if(y > 5){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 6;
                });
            //y second row
            }else if(y>2){
                cur_soln_space.forEach(c =>{
                    c[1] = c[1] + 3;
                });
            //y first row
            }
        }
        //check values,
        cur_soln_space.forEach((item)=>{
            if(new_board[item[0]][item[1]]!=null && !xclude.includes(new_board[item[0]][item[1]])){
                console.log('adding value to exclude from group: '+new_board[item[0]][item[1]])
                xclude.push(new_board[item[0]][item[1]]);
            }
        })
        //navigate new_board using solution space, checking value of any non-null cells and pushing them to xclude.
        //we now have all values to exclude and can assign the random number.

        var newPoss = possibilities.filter(item => !xclude.includes(item));
        console.log('generateBoards: newPoss assigned. '+newPoss);

        let newCellValue = newPoss[Math.floor(Math.random()*newPoss.length)];
        console.log('generateBoards: newCellValue assigned. '+newCellValue);

        new_board[x][y] = newCellValue;

        console.log('returning new_board with assigned elements. '+new_board);
        return new_board;
    };

    render(props){
        if(this.state.load===false){
            return null;
        }else{
            return (<div className='board-container'>
                {
                    this.state.boards.map( (item,index) => (
                        <Board className='board' key={index} board={this.state.boards[this.state.boards.indexOf(item)]}/>
                    ))
                }    
                </div>
            );
        };
    };

};

function Board(props){
    return(
        <div className='board-table-container' draggable={true}>
            <table>
                <tbody className='board-table'>
                    <tr className='board-table-row'>
                        <td className='board-table-cell' >{props.board[0][0] != null ? props.board[0][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][1] != null ? props.board[0][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][2] != null ? props.board[0][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][3] != null ? props.board[0][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][4] != null ? props.board[0][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][5] != null ? props.board[0][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][6] != null ? props.board[0][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][7] != null ? props.board[0][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[0][8] != null ? props.board[0][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[1][0] != null ? props.board[1][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][1] != null ? props.board[1][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][2] != null ? props.board[1][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][3] != null ? props.board[1][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][4] != null ? props.board[1][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][5] != null ? props.board[1][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][6] != null ? props.board[1][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][7] != null ? props.board[1][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[1][8] != null ? props.board[1][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[2][0] != null ? props.board[2][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][1] != null ? props.board[2][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][2] != null ? props.board[2][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][3] != null ? props.board[2][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][4] != null ? props.board[2][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][5] != null ? props.board[2][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][6] != null ? props.board[2][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][7] != null ? props.board[2][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[2][8] != null ? props.board[2][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[3][0] != null ? props.board[3][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][1] != null ? props.board[3][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][2] != null ? props.board[3][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][3] != null ? props.board[3][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][4] != null ? props.board[3][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][5] != null ? props.board[3][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][6] != null ? props.board[3][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][7] != null ? props.board[3][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[3][8] != null ? props.board[3][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[4][0] != null ? props.board[4][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][1] != null ? props.board[4][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][2] != null ? props.board[4][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][3] != null ? props.board[4][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][4] != null ? props.board[4][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][5] != null ? props.board[4][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][6] != null ? props.board[4][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][7] != null ? props.board[4][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[4][8] != null ? props.board[4][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[5][0] != null ? props.board[5][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][1] != null ? props.board[5][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][2] != null ? props.board[5][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][3] != null ? props.board[5][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][4] != null ? props.board[5][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][5] != null ? props.board[5][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][6] != null ? props.board[5][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][7] != null ? props.board[5][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[5][8] != null ? props.board[5][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[6][0] != null ? props.board[6][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][1] != null ? props.board[6][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][2] != null ? props.board[6][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][3] != null ? props.board[6][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][4] != null ? props.board[6][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][5] != null ? props.board[6][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][6] != null ? props.board[6][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][7] != null ? props.board[6][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[6][8] != null ? props.board[6][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[7][0] != null ? props.board[7][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][1] != null ? props.board[7][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][2] != null ? props.board[7][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][3] != null ? props.board[7][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][4] != null ? props.board[7][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][5] != null ? props.board[7][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][6] != null ? props.board[7][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][7] != null ? props.board[7][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[7][8] != null ? props.board[7][8] : '_'}</td>
                    </tr>
                    <tr className='board-table-row'>
                        <td className='board-table-cell'>{props.board[8][0] != null ? props.board[8][0] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][1] != null ? props.board[8][1] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][2] != null ? props.board[8][2] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][3] != null ? props.board[8][3] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][4] != null ? props.board[8][4] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][5] != null ? props.board[8][5] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][6] != null ? props.board[8][6] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][7] != null ? props.board[8][7] : '_'}</td>
                        <td className='board-table-cell'>{props.board[8][8] != null ? props.board[8][8] : '_'}</td>
                    </tr>
                </tbody>
            </table>
            <p className='board-table-container-caption'>TestBoard</p>
        </div>
    );
};

ReactDOM.render(
    <SudokuGenerator draggable={true}/>,
    document.getElementById('root')
);

  /*
    
    */