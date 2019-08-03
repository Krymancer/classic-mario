export class Vector2d{
    constructor(x,y){
        this.set(x,y);
    }

    set(x,y){
        this.x = x;
        this.y = y;
    }
}

export class Matrix{
    constructor(){
        this.grid = [];
    }

    set(x,y,value){
        if(!this.grid[x]){
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    get(x,y){
        const col = this.grid[x];
        if(col){
            return col[y];
        }

        return undefined;
    }

    forEach(callback){

        this.grid.forEach((column, x) => {
            column.forEach((value, y) => {
                callback(value,x,y);    
            });
        });    
    }
}