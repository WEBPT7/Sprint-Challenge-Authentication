exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries and resets ids
  return knex("users")
    .truncate()
    .then(function() {
      return knex("users").insert([
        { username: "Mark", password: "test" },
        { username: "Sam", password: "test" },
        { username: "Bud", password: "test" },
        { username: "Billy", password: "test" }
      ]);
    });
};
