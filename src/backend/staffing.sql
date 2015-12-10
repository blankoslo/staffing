DROP TABLE IF EXISTS staffings CASCADE;

CREATE TABLE staffings (
    id serial PRIMARY KEY,
    employee integer REFERENCES employees(id) NOT NULL,
    customer char(3) NOT NULL,
    project integer NOT NULL,

    from_ts timestamp NOT NULL,
    to_ts timestamp NOT NULL,

    FOREIGN KEY(customer, project) REFERENCES projects(customer, code),

    CHECK(from_ts < to_ts),

    /* This constraint prevents one employee from being staffed multiple times
     * in the same interval. Uses geometry which is pretty unintuitive, but
     * fast. */
    CONSTRAINT overlapping_times EXCLUDE USING GIST (
        employee WITH =,
        box(
            point(extract(epoch FROM from_ts), extract(epoch FROM from_ts)),
            point(extract(epoch FROM to_ts), extract(epoch FROM to_ts))
        ) WITH &&
    )
);
