const { KnexTimeoutError } = require('knex');
const knex = require('../db/connection');

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readTable(table_id) {
  return knex('tables as t')
    .select('*')
    .where({ table_id })
    .first();
}

function readReservation(reservation_id) {
  return knex('reservations as r')
    .select('*')
    .where({ reservation_id })
    .first();
}

function readTableByRes(reservation_id) {
  return knex("tables")
    .where({ reservation_id })
    .whereExists(knex.select("*").from("tables").where({ reservation_id }))
    .then((result) => result[0]);
}

function list() {
  return knex('tables')
    .select('*')
    .orderBy('table_name');
}

async function updateSeatRes(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(trx);

    return knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: reservation_id }, "*")
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]),
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]);
  });
}

async function destroyTableRes(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "finished" })
      .transacting(trx);

    return knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*")
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]),
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]);
  });
}

module.exports = {
  create,
  list,
  read,
  readTable,
  readReservation,
  readTableByRes,
  updateSeatRes,
  destroyTableRes,
}