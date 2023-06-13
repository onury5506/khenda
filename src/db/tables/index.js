import video from "./video.js"
import state from "./state.js"

export default function initTables(knex){
    video(knex)
    state(knex)
}