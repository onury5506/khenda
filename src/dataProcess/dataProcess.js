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

    if (workerRunning) {
        return;
    }

    workerRunning = true

    let next = await knex.select("id", "name")
        .from("videos")
        .where({
            status: 0
        }).first()

    console.log("next", next)
    if (!next) {
        workerRunning = false;
        return;
    }

    await knex("videos").where({
        id: next.id
    }).update({
        status: 1
    })

    const worker = new Worker("./src/dataProcess/worker.js", {
        workerData: next
    })


    worker.on('message', message => {
        console.log(`Received message from worker: ${message}`);
    });

    worker.on('exit', code => {
        console.log(`Worker thread exited with code ${code}`);
        workerRunning = false;
        runWorker()
    });

    worker.on("error", console.error)
}