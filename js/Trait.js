export default class Trait{
    constructor(name){
        this.NAME = name;
        this.tasks = [];
    }

    finalize(){
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    update(){
    }

    obstruct(){
    }

    collides(us, them){
    }

    qeue(task){
        this.tasks.push(task);
    }
}