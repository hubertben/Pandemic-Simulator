let c = document.getElementById("canvas");
let ctx = c.getContext("2d");


let soc = document.getElementById("social_distancing");
let mas = document.getElementById("mask_usage");
let han = document.getElementById("hand_washing");
let tim = document.getElementById("time_interval");

const width = c.width;
const height = c.height;


let day_limit = 1;
let spacing = 0;

let lx = 100;
let ly = 600;

let lx2 = 100;
let ly2 = 600;


let population = [];
let current_pop = 100;

let pop = 100;

let logs = [];

let day = 0;


let days_to_heal = 10;
let days_to_show = 3;
let mortality_rate_percent = 5;

ctx.fillStyle = "white";

const conditions = ['None', 'Mild', 'Medium', 'High', 'Everyone']

function setup() {
    lx = 100;
    ly = 600;

    lx2 = 100;
    ly2 = 600;

    day = 0;
    current_pop = 100;
    logs = [];
    population = [];
    for (let t = 0; t < pop; t++) {
        population.push(new Unit(soc.value, mas.value, han.value, t));
    }

    for (let t = 0; t < pop; t++) {
        population[t].neighbors = population[t].get_neighbors(t, 10, 10);
    }
}

function append_log_list() {
    let table = document.getElementById("log_list");
    let row = table.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    cell1.innerHTML = day_limit;
    cell2.innerHTML = logs[logs.length-1].population;
    cell3.innerHTML = logs[logs.length-1].infections;
    cell4.innerHTML = conditions[soc.value - 1];
    cell5.innerHTML = conditions[mas.value];
    cell6.innerHTML = conditions[han.value];
  }

function start() {
    setup();
    draw_text();
    advance();

}

function render() {
    
    for (let p of population) {
        p.draw();
    }
}

function advance() {
    draw_text();
    render();

    for (let p of population) {
        p.evaluate();
    }

    let dead = dead_counter();
    current_pop = dead;

    
    
    if(day === day_limit){
        append_log_list();
        draw_stats();
    }else{
        logs.push(new Log(current_pop, population_infected(), population_immune(), day));
        day++;
        
        setTimeout(advance, 10);
    }
}

function population_infected() {
    let count = 0;
    for (let index = 0; index < population.length; index++) {
        if (population[index].infected === 1){
            count++;
        }
    }
    return count;
}

function dead_counter() {
    let count = 0;
    for (let index = 0; index < population.length; index++) {
        if (population[index].dead === 1){
            count++;
        }
    }
    return 100 - count;
}

function population_immune() {
    let count = 0;
    for (let index = 0; index < population.length; index++) {
        if (population[index].immunity === 1){
            count++;
        }
    }
    return count;
}

function draw_text() {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, width, height);
    ctx.font = "15px Georgia";
    ctx.fillText("Day: " + day + " / " + day_limit, 10, 30);
    ctx.fillText("Population (Starting Size): " + pop, 10, 50);
    ctx.fillText("Population (Current Size) " + current_pop, 10, 70);
    ctx.fillText("Social Distancing: " + conditions[soc.value - 1] + " (" + (soc.value - 1) + ")", 10, 90);
    ctx.fillText("Mask Usage " + conditions[mas.value] + " (" + (mas.value) + ")", 10, 110);
    ctx.fillText("Hand Washing " + conditions[han.value] + " (" + (han.value) + ")", 10, 130);
}

function draw_stats() {

    spacing = 1000 / day_limit;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.clearRect(0, 0, width, height);
    ctx.font = "16px Georgia";

    

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";

    ctx.fillText("Infections", 450, 40);

    ctx.beginPath();
    ctx.arc(440, 35, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.fillText("Population", 300, 40);
    ctx.beginPath();
    ctx.arc(290, 35, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    

    ctx.fillText("Statistics", 20, 40);

    let height_index = 600;
    for(let i = 0; i < 11; i++){
        ctx.fillText(i * 10, 40, height_index);
        height_index -= 50;
    }

    

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 600);
    ctx.lineTo(1100, 600);
    ctx.stroke();


    ctx.fillStyle = "#444444";
    ctx.strokeStyle = "#444444";
    for(let i = 0; i < day_limit; i++){

        ctx.beginPath();
        ctx.moveTo(100 + i * spacing, 100);
        ctx.lineTo(100 + i * spacing, 600);
        ctx.stroke();

        ctx.fillText(i + 1, 95 + i * spacing, 620);

    }

   
    ctx.fillText("Time (Days)", 570, 700);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    for(let l = 0; l < logs.length; l++){

        logs[l].draw();


    }


}


function update(){
    ctx.clearRect(0, 0, width, height);
    setup();
    render();
}



soc.oninput = function () {
    let output = document.getElementById("soc");
    t = soc.value - 1;
    output.innerHTML = "Slide To Adjust Social Distancing : " + conditions[t];
    update();
}

mas.oninput = function () {
    let output = document.getElementById("mas");
    t = mas.value;
    output.innerHTML = "Slide To Adjust Mask Usage : " + conditions[t];
    update();
}

han.oninput = function () {
    let output = document.getElementById("han");
    t = han.value;
    output.innerHTML = "Slide To Adjust Hand Washing : " + conditions[t];
    update();
}

tim.oninput = function () {
    let output = document.getElementById("time");
    t = tim.value;
    s = '';
    if(t > 1){
        s = '\'s';
    }else{
        s = '';
    }
    day_limit = parseInt(tim.value);
    output.innerHTML = "Set Time Interval : " + t + " Day" + s;
}


// Normal, Infected, Imune, Mask, Mask and Infected, Dead

let disp_colors = ["#ffffff", "#e38c6f", "#228ad4", "#4bdb85", "#bef527", "#7b7182"];

class Unit {

    constructor(soc, mas, han, ID) {
        this.ID = ID;
        this.soc = soc;
        this.mas = mas;
        this.han = han;

        this.dead = 0;
        this.neighbors = [];

        this.size = 10;

        this.my_x = 0;
        this.my_y = 0;

        

        this.my_mas = Math.random() * 4;
        if (this.my_mas < mas) {
            this.my_mas = 1;
        }

        this.my_han = Math.random() * 4;
        if (this.my_han < han) {
            this.my_han = 1;
        }

        this.infected = 0;
        this.immunity = 0;

        let inf = Math.random() * population.length;
        if (inf < population.length / 33) {
            this.infected = 1;
        } else {

            let imm = Math.random() * population.length;
            if (imm < population.length / 50) {
                this.immunity = 1;
            }

        }
        this.init_xy();

        
    }

    init_xy() {

        let r = 5;
        let move_x = 590 + (5 - (this.soc) * 60);
        let move_y = 215 + (5 - (this.soc) * 37);

        this.my_x = move_x + (this.ID % 10) * ((this.soc + r) * 1.35);
        this.my_y = move_y + Math.floor(this.ID / 10) * ((this.soc + r) * 1.35);

        
    }

    calc_color() {

        if (this.dead === 1) {
            ctx.fillStyle = disp_colors[5];
        }else if (this.infected === 1 && this.my_mas === 1) {
            ctx.fillStyle = disp_colors[4];
        } else if (this.infected === 1) {
            ctx.fillStyle = disp_colors[1];
        } else if (this.immunity === 1) {
            ctx.fillStyle = disp_colors[2];
        } else if (this.my_mas === 1) {
            ctx.fillStyle = disp_colors[3];
        } else {
            ctx.fillStyle = disp_colors[0];
        }
    }

    draw() {
        this.calc_color();
        ctx.beginPath();
        ctx.arc(this.my_x, this.my_y, this.size, 0, 2 * Math.PI);
        ctx.fill();


    }

    get_neighbors(i, w, h) {

        let neighbors = [];
        let size = w * h;

        if (i - w >= 0) {
            neighbors.push(population[i - w]) 
        }
        if (i % w != 0) {
            neighbors.push(population[i - 1])
        }
        if ((i + 1) % w != 0){
            neighbors.push(population[i + 1])
        }
        if (i + w < size){
            neighbors.push(population[i + w]) 
        }

        return neighbors
    }


    evaluate() {

        if(this.infected === 1){
            let d = Math.random();
            if(d < .016){
                this.dead = 1;
            }
        }else{

            let evaluation_metric = .5;

            if(this.any_neighbors_infected()){
                
                let g = Math.random();

                let new_soc = (this.soc) * .060; 
                evaluation_metric -= new_soc;

                if(this.my_mas === 1){
                    evaluation_metric -= .083;
                } 

                if(this.my_han === 1){
                    evaluation_metric -= .067;
                } 
                
                
                console.log(evaluation_metric);

                
                if(g < evaluation_metric){
                    this.infected = 1;
                    
                }

            }
        }

    }

    any_neighbors_infected() {

        for (let index = 0; index < this.neighbors.length; index++) {
            if (this.neighbors[index].infected === 1) return true;
        }
        return false;
    }

}

class Log{

    constructor(population, infections, immunities, day){
        this.population = population;
        this.infections = infections;
        this,immunities = immunities;
        this.day = day;
    }

    draw(){

        let side_step = spacing;

        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";

        let pop = (100 - this.population) * 5
        let inf = (100 - this.infections) * 5

        ctx.beginPath();
        ctx.arc(100 + (this.day * side_step), 100 + pop, 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(100 + (this.day * side_step), 100 + pop);
        ctx.lineTo(lx, ly);
        ctx.stroke();

        lx = 100 + (this.day * side_step);
        ly = 100 + pop;

        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        

        ctx.beginPath();
        ctx.arc(100 + (this.day * side_step), 100 + inf, 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(100 + (this.day * side_step), 100 + inf);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();

        lx2 = 100 + (this.day * side_step);
        ly2 = 100 + inf;

        console.log(this);


    }




}