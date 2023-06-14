import { workerData } from 'worker_threads'
import fs from 'fs'
import knex from '../db/db.js'
import { v4 as uuidv4 } from 'uuid'
import { exit } from 'process'

console.log("####WORKER####")
const { id, name } = workerData
const FPS = 30
const threshold = 0.9

async function process() {
    let data = "" + fs.readFileSync(`./uploads/${name}`)
    data = JSON.parse(data)

    const steps = Object.keys(data)
    let changes = []

    for (let i = 0; i < steps.length; i++) {
        if (!Array.isArray(data[steps[i]])) {
            throw "invalid data (step is not array) " + steps[i]
        }
    }


    for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        let res = processStep(data[step], step)
        changes = changes.concat(res)
    }

    await knex('states')
        .insert(changes)

    await knex("videos").where({
        id
    }).update({
        status: 2
    })

}

function processStep(data, stepName) {
    let state = false
    let start = 0
    let changeStart = false;

    let changes = []

    for (let i = 0; i <= data.length - 3; i++) {
        let overThreshold = true
        for (let j = 0; overThreshold && j < 3 && j + i < data.length; j++) {
            let d = data[i + j]
            if (typeof d != "number" && !(d >= 0 && d <= 1)) {
                throw "invalid data - " + d
            }

            if (d < threshold) {
                overThreshold = false;
            }
        }

        if (overThreshold) {
            if (changeStart) {
                if (!state) {
                    start = parseFloat((start / FPS).toFixed(1)) // frame to second
                    let end = parseFloat((i / FPS).toFixed(1)) // frame to second

                    changes.push({
                        uuid: uuidv4(),
                        stepName,
                        startTime: start,
                        endTime: end,
                        video: id
                    })

                    start = i
                }
                state = true
            } else {
                start = i
                state = true
                changeStart = true
            }
        } else {
            state = false
        }
    }

    if (changeStart) {
        start = parseFloat((start / FPS).toFixed(1)) // frame to second
        let end = parseFloat(((data.length - 1) / FPS).toFixed(1)) // frame to second

        changes.push({
            uuid: uuidv4(),
            stepName,
            startTime: start,
            endTime: end,
            video: id
        })
    }

    return changes

}

process().then(() => {
    console.log(`Done : video#${id}`)
}).catch(async (e) => {
    await knex("videos").where({
        id
    }).update({
        status: 3
    })

    console.log(e)
    console.log(`Error : video#${id}`)

}).finally(() => {
    console.log("####WORKER####")
    exit(0)
})