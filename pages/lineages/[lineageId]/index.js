import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Header from "../../../components/layout/Header";
import useSWR from "swr";
//import { useAuth } from "../../lib/hooks";
import Head from "next/head";
import { LINEAGE_SITES_STATUS, SITE_NAME } from "../../../lib/constants";
import Subheader from "../../../components/layout/Subheader";
import Link from "next/link";
import { getDragonDisplay, getSampleLink } from "../../../lib/helpers";
import Notification from "../../../components/Notification";
import { titleCase } from "title-case";

const ParentColumn = ({ dragon, gender }) => (
  <div className="column">
    <Subheader>{gender || "male"}</Subheader>
    {/* <img src="/images/Aeon_Wyvern_male.png" alt="" className="py-2" /> */}
    <p>
      <b>Breed:</b> {dragon.breed}
    </p>
    <p>
      <b>Name:</b> {getDragonDisplay(dragon)}
    </p>
    {dragon.code && (
      <p>
        <a
          href={`https://dragcave.net/lineage/${dragon.code}`}
          target="_blank"
          rel="noreferrer"
        >
          {`View Lineage of ${getDragonDisplay(dragon)}`}
        </a>
      </p>
    )}
  </div>
);

const Attributes = ({ lineage }) => {
  if (lineage.shiny || (lineage.holiday && lineage.holiday.length > 0))
    return (
      <div className="tags my-1">
        {lineage.shiny && <span className="tag">Shiny</span>}
        {lineage.holiday &&
          lineage.holiday.map((h) => (
            <span key={h} className="tag">
              {titleCase(h)}
            </span>
          ))}
      </div>
    );
  else return null;
};

export default function ViewLineage() {
  //const { auth } = useAuth();
  const router = useRouter();

  const { lineageId } = router.query;
  const { data: lineage, error } = useSWR(
    lineageId && `/api/lineages/${lineageId}`
  );

  const loading = !lineage && !error;

  //Tell user that things are still loading
  if (loading) {
    return <Header>Loading...</Header>;
  }
  //Or the lineage is not found
  else if (!(loading || lineage))
    return (
      <>
        <Notification status="error" title="Lineage Not Found">
          Sorry, there is no lineage with this id in the database.
        </Notification>
      </>
    );

  const maleDisplay = getDragonDisplay(lineage.male);
  const femaleDisplay = getDragonDisplay(lineage.female);
  const lineageSample = getSampleLink(lineage, true);

  return (
    <>
      <Head>
        <title>{`${SITE_NAME}: ${maleDisplay} & ${femaleDisplay}`}</title>
      </Head>
      <Header>{`${maleDisplay} & ${femaleDisplay}`}</Header>
      <div className="columns pt-3">
        <ParentColumn dragon={lineage.male} gender="male" />
        <ParentColumn dragon={lineage.female} gender="female" />
      </div>
      <div className="columns">
        <div className="column">
          <Subheader>Lineage</Subheader>
          <Attributes lineage={lineage} />
          <p>
            <b>Type:</b> {lineage.type}
          </p>
          <p>
            <b>Current Generation:</b> {lineage.generation}
          </p>
          <p>
            <b>Owner:</b>{" "}
            <Link href="/users/[username]" as={`/users/${lineage.owner}`}>
              <a>{lineage.owner}</a>
            </Link>
          </p>
          {lineageSample && (
            <p>
              <b>Sample:</b> {lineageSample}
            </p>
          )}
          {lineage.cdc && (
            <p>
              <b>
                <abbr title="Checker Database Center">CDC</abbr> Entry:
              </b>{" "}
              {LINEAGE_SITES_STATUS.find((s) => s.value === lineage.cdc).label}
            </p>
          )}
          {lineage.srogg && (
            <p>
              <b>
                <abbr title="Special Release Offspring Gifiting Group">
                  SROGG
                </abbr>{" "}
                Entry:
              </b>{" "}
              {
                LINEAGE_SITES_STATUS.find((s) => s.value === lineage.srogg)
                  .label
              }
            </p>
          )}
          {lineage.notes && (
            <p>
              <b>Notes:</b> {lineage.notes}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

ParentColumn.propTypes = {
  dragon: PropTypes.object,
  gender: PropTypes.string,
};
