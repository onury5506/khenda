export default function initVideosTable(knex){
    knex.schema.hasTable('videos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('videos', function (t) {
                t.increments('id').primary();
                t.string('name', 100);
                t.integer('status');
                /*
                    0 - in the queue
                    1 - on progress
                    2 - done
                    3 - error
                */
            });
        }
    });
}