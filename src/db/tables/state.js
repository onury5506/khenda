export default function initStatesTable(knex){
    knex.schema.hasTable('states').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('states', function (t) {
                t.increments('id').primary();
                t.string('uuid', 100);
                t.string('stepName', 100);
                t.integer('startTime');
                t.integer('endTime');
                t.integer('video').unsigned().notNullable();
                t.foreign('video').references('videos.id')
            });
        }
    });    
}