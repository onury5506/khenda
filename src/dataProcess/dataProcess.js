import knex from '../db/db.js'
import { Worker } from "worker_threads"

let workerRunning = false;

export async function addDataToQueue(filename) {
    let id = await knex("videos").insert({
        name: filename,
        status: 0
    })

    runWorker()
    
    return id[0]
}

async function runWorker() {

    /*
        TO DO
    */

    if (workerRunning) {
        return;
    }

    workerRunning = true

    let next = await knex.select("id", "name")
        .from("videos")
        .where({
            status: 2
        }).first()

    if (!next) {
        workerRunning = false;
        return;
    }

    const worker = new Worker("./src/dataProcess/worker.js")


    worker.on('message', message => {
        console.log(`Received message from worker: ${message}`);
    });

    worker.on('exit', code => {
        console.log(`Worker thread exited with code ${code}`);
    });

    worker.on("error", console.error)
}