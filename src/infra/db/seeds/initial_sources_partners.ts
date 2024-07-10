import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	await knex("parity").del();
	await knex("partner_source").del();
	await knex("source").del();
	await knex("partner").del();

	await knex("source").insert([
		{
			id: 1,
			name: "Livelo",
			url: "https://www.livelo.com.br/ganhe-pontos-compre-e-pontue",
		},
	]);

	await knex("partner").insert([
		{ id: 1, name: "Magazine Luiza" },
		{ id: 2, name: "AliExpress" },
		{ id: 3, name: "Amazon" },
		{ id: 4, name: "Avon" },
		{ id: 5, name: "Basicamente" },
		{ id: 6, name: "Booking.com" },
		{ id: 7, name: "C&A" },
		{ id: 8, name: "Casas Bahia" },
		{ id: 9, name: "Insider" },
		{ id: 10, name: "Midea" },
		{ id: 11, name: "Nike" },
	]);

	await knex("partner_source").insert([
		{
			partner_id: 1,
			source_id: 1,
			reference: JSON.stringify({
				title: "Magalu",
			}),
		},
		{
			partner_id: 2,
			source_id: 1,
			reference: JSON.stringify({
				title: "AliExpress",
			}),
		},
		{
			partner_id: 3,
			source_id: 1,
			reference: JSON.stringify({
				title: "Amazon",
			}),
		},
		{
			partner_id: 4,
			source_id: 1,
			reference: JSON.stringify({
				title: "Avon",
			}),
		},
		{
			partner_id: 5,
			source_id: 1,
			reference: JSON.stringify({
				title: "Basicamente",
			}),
		},
		{
			partner_id: 6,
			source_id: 1,
			reference: JSON.stringify({
				title: "Booking.com",
			}),
		},
		{
			partner_id: 7,
			source_id: 1,
			reference: JSON.stringify({
				title: "CEA",
			}),
		},
		{
			partner_id: 8,
			source_id: 1,
			reference: JSON.stringify({
				title: "Casas Bahia",
			}),
		},
		{
			partner_id: 9,
			source_id: 1,
			reference: JSON.stringify({
				title: "Insider Store",
			}),
		},
		{
			partner_id: 10,
			source_id: 1,
			reference: JSON.stringify({
				title: "Midea",
			}),
		},
		{
			partner_id: 11,
			source_id: 1,
			reference: JSON.stringify({
				title: "Nike",
			}),
		},
	]);
}
