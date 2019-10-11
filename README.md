# CotizaFacil

## [Analysis and Design documentation (*spanish*)](https://docs.google.com/document/d/1qxUKeS-ndZCyoxaTVuElVKf1onmRQU8o09NH6ktpLsc/edit?usp=sharing)
## [Software requirements specification (*spanish*)](https://github.com/PabloSzx/ERS-Cotiza-Facil)

### Dependencies

---

First you need to install the dependencies (assuming you already have [**Node.js**](https://nodejs.org) installed)

> Preferred

```shell
yarn
```

or

```shell
npm install
```

Then you need to create a **.env** file containing at least the environment variable

> **COOKIE_KEY**=some_random_string

And optionally you can add a variety of environment variables for the database connection, following it's names in **src\server\db\index.ts**.

> If you don't use **DB_URL** the database connection will point to **localhost**.

#### Development

---

After you have all the minimum dependencies you can run

```shell
yarn dev
```

or

```shell
npm run dev
```

Which will run the development servers concurrently for the client ([**Next.js**](https://nextjs.org/)) and the [**GraphQL API**](https://graphql.org/), using an extra proxy server that joins them, available at [**http://localhost:8000**](http://localhost:8000).
