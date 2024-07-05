import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex('parity').del()
    await knex('partner_source').del()
    await knex("source").del();
    await knex('partner').del()

    await knex("source").insert([
        { id: 1, name: "Livelo", url: "https://www.livelo.com.br/ganhe-pontos-compre-e-pontue" },
        { id: 2, name: "Esfera", url: "https://www.esfera.com.vc/c/ganhe-pontos" }
    ]);

    await knex('partner').insert([
        { id: 1, name: 'Magazine Luiza' },
    ])

    await knex('partner_source').insert([
        {
            partner_id: 1,
            source_id: 1,
            reference: JSON.stringify({
                title: 'Magalu'
            })
        }
    ])
};
